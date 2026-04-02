// pages/api/submit-hoa-form.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    console.log("API received body:", body);

    const payload = {
      ...body,
      timestamp: new Date().toISOString(), // keep timestamp
      // DO NOT override sheetName
    };

    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbyXn-fvW8WUdqRfSZ6MDbx05-TdtijJVLsBKlQXw2WbEh1ksHN9gAztYA1zQAs6Xgjw/exec";

    const r = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await r.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { result: "error", message: "Invalid JSON from Apps Script" };
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("HOA form error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
}
