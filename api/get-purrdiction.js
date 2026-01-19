export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { tickerData } = JSON.parse(request.body);
  const geminiKey = process.env.GEMINI_API_KEY;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiKey}`;

  try {
    const aiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Purrdict, a stock market expert cat. Use cat puns. Professional but feline. Keep to 3 sentences. Analyze this: ${tickerData}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await aiResponse.json();
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: "The server-cat got a hairball." });
  }
}
