// pages/api/submitForm.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email, privacy } = req.body;

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyXn-fvW8WUdqRfSZ6MDbx05-TdtijJVLsBKlQXw2WbEh1ksHN9gAztYA1zQAs6Xgjw/exec",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          privacy,
          timestamp: new Date().toISOString(),
          sheetName: "Insights", // 👈 target this tab
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ result: "error", message: error.message });
  }
}
