// pages/api/affiliate-registration.js
// Writes affiliate registration submissions to Supabase.
import { createAdminClient } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const supabase = createAdminClient();

    const { error } = await supabase.from("affiliate_registrations").insert({
      first_name: body.firstName || "",
      last_name: body.lastName || "",
      email: body.email || "",
      phone: body.phone || null,
      company: body.company || "",
      website: body.website || null,
      referral_source: body.referralSource || null,
      interest: body.interest || null,
    });

    if (error) {
      console.error("Affiliate registration insert failed:", error.message);
      return res.status(500).json({ error: "Submission failed" });
    }

    return res.status(200).json({ result: "success" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
