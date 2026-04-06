// pages/api/submitContactForm.js
// Writes contact form submissions to Supabase.
import { createAdminClient } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!body.name || !body.email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      community: body.community || null,
      city: body.city || null,
      role: body.role || null,
      budget: body.budget ? Number(body.budget) : null,
      agreed_to_privacy: body.agreedToPrivacy ?? false,
    });

    if (error) {
      console.error("Contact form insert failed:", error.message);
      return res.status(500).json({ error: "Submission failed" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact form API error:", err?.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
