export default async function handler(request, response) {
  const { tickerData } = JSON.parse(request.body);
  const geminiKey = process.env.VITE_GEMINI_API_KEY;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiKey}`;

  try {
    const aiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze this: ${tickerData}` }] }],
      }),
    });

    const data = await aiResponse.json();
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: "Feline failure at the server level" });
  }
}
