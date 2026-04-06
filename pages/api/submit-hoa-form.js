// pages/api/submit-hoa-form.js
// Handles PreQual and HOA Loan App submissions.
// Writes directly to the Portal's Supabase database.
// Email notifications are handled by the Portal/Supabase side, not here.
import { createAdminClient } from "../../lib/supabase-admin";

// Convert empty/whitespace-only strings to null.
// Databases treat "" and null differently — check constraints
// only skip NULL, not empty strings. This prevents constraint violations.
const emptyToNull = (val) => {
  if (val === undefined || val === null) return null;
  const trimmed = String(val).trim();
  return trimmed === "" ? null : trimmed;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { sheetName, ...formData } = body;

    // ── Honeypot check ────────────────────────────────────────────────────────
    if (formData._hp) {
      return res.status(200).json({ result: "success" });
    }

    const supabase = createAdminClient();

    if (sheetName === "Prequalifications") {
      return await handlePreQual(supabase, formData, res);
    }

    if (sheetName === "HOALoanApps") {
      // Full loan application — for now store in a dedicated table
      // TODO: Phase 3 follow-up — handle file uploads via Supabase Storage
      return await handleLoanApp(supabase, formData, res);
    }

    return res.status(400).json({ error: "Unknown form type" });
  } catch (err) {
    console.error("HOA form error:", err?.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handlePreQual(supabase, data, res) {
  // ── Resolve coupon → contractor ───────────────────────────────────────────
  let contractorId = null;
  let contractorLastName = null;

  if (data.coupon_code) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("contractor_id, contractors(first_name, last_name)")
      .eq("code", data.coupon_code.toUpperCase())
      .maybeSingle();

    if (coupon) {
      contractorId = coupon.contractor_id;
      const c = coupon.contractors;
      if (c) contractorLastName = c.last_name;
    }
  }

  // ── Generate project code ─────────────────────────────────────────────────
  const now = new Date();
  const year = now.getFullYear();
  const { count: yearCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .gte("created_at", `${year}-01-01`)
    .lt("created_at", `${year + 1}-01-01`);

  const seq = String((yearCount ?? 0) + 1).padStart(3, "0");
  const contractorSlug = contractorLastName
    ? contractorLastName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)
    : "DIRECT";
  const hoaSlug = (data.hoa_name || "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)[0]
    .slice(0, 8);
  const yy = String(year).slice(-2);
  const projectCode = `${contractorSlug}-${hoaSlug}-${yy}-${seq}`;

  // ── HOA profile matching ────────────────────────────────────────────────────
  let hoaProfileId = null;
  let needsHoaReview = false;

  if (data.hoa_name) {
    const { data: matches } = await supabase.rpc("find_similar_hoa", {
      search_name: data.hoa_name,
      threshold: 0.3,
    });

    if (matches && matches.length > 0) {
      const best = matches[0];
      if (best.similarity_score > 0.85) {
        // High confidence — auto-link
        hoaProfileId = best.id;
      } else {
        // Moderate confidence — flag for admin review
        needsHoaReview = true;
      }
    } else {
      // No match — create new HOA profile
      const { data: normalized } = await supabase.rpc("normalize_hoa_name", {
        raw_name: data.hoa_name,
      });

      const { data: newProfile } = await supabase
        .from("hoa_profiles")
        .insert({
          canonical_name: normalized || data.hoa_name.toLowerCase().trim(),
          display_name: data.hoa_name,
          legal_name: data.association_name || null,
          email: emptyToNull(data.hoa_email),
          phone: emptyToNull(data.contact_phone),
          property_address: emptyToNull(data.property_address),
          city: emptyToNull(data.city),
          state: emptyToNull(data.state?.toUpperCase()),
          zip: emptyToNull(data.zip),
          units_count: parseInt(data.units_count, 10) || null,
          annual_budget: parseFloat(data.annual_budget) || null,
          professionally_managed: data.professionally_managed || null,
        })
        .select("id")
        .single();

      if (newProfile) {
        hoaProfileId = newProfile.id;
      }
    }
  }

  // ── Insert project ────────────────────────────────────────────────────────
  const { error: insertError } = await supabase.from("projects").insert({
    project_code: projectCode,
    coupon_code: data.coupon_code?.toUpperCase() || null,
    contractor_id: contractorId,
    hoa_profile_id: hoaProfileId,
    needs_hoa_review: needsHoaReview,
    hoa_name: data.hoa_name,
    hoa_email: data.hoa_email,
    association_name: data.association_name || null,
    contact_first_name: data.contact_first_name,
    contact_last_name: data.contact_last_name,
    contact_title: data.contact_title,
    contact_phone: data.contact_phone,
    property_address: emptyToNull(data.property_address),
    city: emptyToNull(data.city),
    state: emptyToNull(data.state?.toUpperCase()),
    zip: emptyToNull(data.zip),
    estimated_amount: parseFloat(data.estimated_amount) || null,
    units_count: parseInt(data.units_count, 10) || null,
    delinquency_rate: emptyToNull(data.delinquency_rate),
    disputes: data.disputes,
    annual_budget: parseFloat(data.annual_budget) || null,
    outstanding_loans: data.outstanding_loans ? parseFloat(data.outstanding_loans) : null,
    professionally_managed: data.professionally_managed,
    project_description: data.project_description,
    sirs_report: data.sirs_report,
    stage: "prequal_submitted",
  });

  if (insertError) {
    console.error("[submit-hoa-form] PreQual insert failed:", insertError.message);
    return res.status(500).json({ result: "error", message: "Submission failed" });
  }

  // Email notifications are handled by the Portal/Supabase ecosystem
  return res.status(200).json({ result: "success" });
}

async function handleLoanApp(supabase, data, res) {
  // Strip file data for now — base64 files in JSON are too large for DB columns.
  // TODO: Upload to Supabase Storage and store URLs.
  const { reserveStudy, annualBudgetFile, ...fields } = data;

  const { error } = await supabase.from("contact_submissions").insert({
    name: `${fields.contactName || ""} (HOA Loan App)`,
    email: fields.email || "",
    phone: fields.phone || "",
    community: fields.hoaName || "",
    city: "",
    role: fields.position || "",
    budget: parseFloat(fields.projectCost) || 0,
    agreed_to_privacy: true,
  });

  if (error) {
    console.error("[submit-hoa-form] Loan app insert failed:", error.message);
    return res.status(500).json({ result: "error", message: "Submission failed" });
  }

  return res.status(200).json({ result: "success" });
}
