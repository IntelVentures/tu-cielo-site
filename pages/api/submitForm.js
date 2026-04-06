// pages/api/submitForm.js
// Writes insights/newsletter signups to Supabase.
import { createAdminClient } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email, privacy } = req.body;

    const supabase = createAdminClient();

    const { error } = await supabase.from("insights_signups").insert({
      name: name || "",
      email: email || "",
      privacy: privacy ?? false,
    });

    if (error) {
      console.error("Insights signup insert failed:", error.message);
      return res.status(500).json({ result: "error", message: "Submission failed" });
    }

    return res.status(200).json({ result: "success" });
  } catch (error) {
    return res.status(500).json({ result: "error", message: "Internal server error" });
  }
}
