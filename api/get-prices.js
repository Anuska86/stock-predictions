export default async function handler(request, response) {
  const polygonKey = process.env.POLYGON_API_KEY;
  const tickers = ["X:BTCUSD", "X:ETHUSD", "SPY", "C:XAUUSD"];

  try {
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${polygonKey}`;
        const res = await fetch(url);
        return res.json();
      }),
    );
    response.status(200).json(results);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch market status" });
  }
}
