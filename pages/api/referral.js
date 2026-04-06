// pages/api/referral.js
// Writes referral submissions to Supabase.
import { createAdminClient } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const supabase = createAdminClient();

    // Validate referral code if provided
    if (body.referralCode) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("code")
        .eq("code", body.referralCode.trim().toUpperCase())
        .maybeSingle();

      if (!coupon) {
        return res.status(400).json({ error: "Invalid referral code" });
      }
    }

    const { error } = await supabase.from("referral_submissions").insert({
      first_name: body.firstName || "",
      last_name: body.lastName || "",
      company: body.company || null,
      title: body.title || null,
      phone: body.phone || null,
      email: body.email || "",
      referral_code: body.referralCode?.trim().toUpperCase() || null,
      issue: body.issue || null,
    });

    if (error) {
      console.error("Referral submission insert failed:", error.message);
      return res.status(500).json({ error: "Submission failed" });
    }

    return res.status(200).json({ result: "success" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
