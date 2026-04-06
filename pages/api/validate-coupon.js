// pages/api/validate-coupon.js
// Validates a coupon code against the Portal's Supabase coupons table.
import { createAdminClient } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.query;
  if (!code || !code.trim()) {
    return res.status(400).json({ valid: false, error: "No code provided" });
  }

  try {
    const supabase = createAdminClient();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("code, contractors(first_name, last_name)")
      .eq("code", code.trim().toUpperCase())
      .maybeSingle();

    if (error || !coupon) {
      return res.status(404).json({ valid: false, error: "Invalid referral code" });
    }

    const contractor = coupon.contractors;
    const name = contractor
      ? `${contractor.first_name} ${contractor.last_name}`
      : "";

    return res.status(200).json({
      valid: true,
      contractor_name: name,
    });
  } catch {
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}
