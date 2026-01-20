export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { tickers } = request.body;
  const geminiKey = process.env.GEMINI_API_KEY;
  const polygonKey = process.env.POLYGON_API_KEY;

  try {
    // Fetch data from Polygon
    const stockResults = await Promise.all(
      tickers.map(async (ticker) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${polygonKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Polygon error for ${ticker}`);
        return res.json();
      }),
    );

    // Call Gemini

    const aiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiKey}`;
    const aiResponse = await fetch(aiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Purrdict, a stock market expert cat. Use cat puns. Professional but feline. Keep to 3 sentences. Analyze this stock data: ${JSON.stringify(stockResults)}`,
              },
            ],
          },
        ],
      }),
    });

    const result = await aiResponse.json();
    response.status(200).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "The server-cat got a hairball." });
  }
}
