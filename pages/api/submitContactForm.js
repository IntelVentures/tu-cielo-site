export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!body.name || !body.email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    // ✅ Correct Web App URL
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyXn-fvW8WUdqRfSZ6MDbx05-TdtijJVLsBKlQXw2WbEh1ksHN9gAztYA1zQAs6Xgjw/exec";

    const r = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, sheetName: "Contact" }),
    });

    const text = await r.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch (err) {
      console.error("Apps Script response parse error:", err, text);
      return res.status(502).json({ error: "Invalid JSON from Apps Script", raw: text });
    }

    if (result.result === "success") {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json(result);
    }
  } catch (err) {
    console.error("Contact form API error:", err);
    return res.status(500).json({ error: "Internal server error", message: err.message });
  }
}
