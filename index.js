import { dates } from "/utils/dates.js";

const massiveKey = import.meta.env.VITE_MASSIVE_API_KEY;
const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
//const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

const tickersArr = [];

const generateReportBtn = document.querySelector(".generate-report-btn");
const tickerInput = document.getElementById("ticker-input");
const label = document.querySelector("label");

generateReportBtn.addEventListener("click", fetchStockData);

//Ticker form

document.getElementById("ticker-input-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const value = tickerInput.value.trim().toUpperCase();

  if (value.length >= 2 && tickersArr.length < 3) {
    label.style.color = "white";
    label.textContent =
      "Input stock tickers for a Purrdicted™ market analysis.";

    tickersArr.push(value);
    tickerInput.value = "";
    generateReportBtn.disabled = false;
    renderTickers();
  } else if (tickersArr.length >= 3) {
    label.textContent = "Max 3 tickers allowed.";
    label.style.color = "#e94560";
  } else {
    label.style.color = "#e94560";
    label.textContent = "Please enter a valid ticker (e.g., AAPL).";
  }
});

//Render the tickers

function renderTickers() {
  const tickersDiv = document.querySelector(".ticker-choice-display");
  tickersDiv.innerHTML = "";
  tickersArr.forEach((ticker) => {
    const newTickerSpan = document.createElement("span");
    newTickerSpan.textContent = ticker;
    newTickerSpan.classList.add("ticker");
    tickersDiv.appendChild(newTickerSpan);
  });
}

const loadingArea = document.querySelector(".loading-panel");
const apiMessage = document.getElementById("api-message");

//Fetch the stock data

async function fetchStockData() {
  document.querySelector(".action-panel").style.display = "none";
  loadingArea.style.display = "flex";

  try {
    const stockData = await Promise.all(
      tickersArr.map(async (ticker) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${massiveKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("API Error");

        const data = await response.text();
        apiMessage.innerText = "The cat is thinking...";
        return data;
      })
    );
    fetchReport(stockData.join(""));
  } catch (err) {
    apiMessage.innerText = "The cat is distracted. Try again!";
    console.error("error: ", err);
  }
}

//fetchReport

async function fetchReport(data) {
  try {
    apiMessage.innerText = "The cat is consulting the stars...";

    const aiReport = await fetchGeminiReport(data);

    renderReport(aiReport);
  } catch (err) {
    apiMessage.innerText = "The cat got a hairball. Check your API keys!";
    console.error("AI Error:", err);
  }
}

//Google Gemini

async function fetchGeminiReport(data) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are Purrdict, a stock market expert cat. Use cat puns. Professional but feline. Keep to 3 sentences. Analyze this: ${data}`,
            },
          ],
        },
      ],
    }),
  });

  const result = await response.json();
  return result.candidates[0].content.parts[0].text;
}

/*
PAID OPTION: OpenAI
 
async function fetchOpenAIReport(data) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Purrdict, a stock market expert cat. Use cat puns. Professional but feline. Keep to 3 sentences.",
        },
        { role: "user", content: `Analyze this stock data: ${data}` },
      ],
    }),
  });

  const result = await response.json();
  return result.choices[0].message.content;
}

*/

// Render the report

function renderReport(output) {
  loadingArea.style.display = "none";
  const outputArea = document.querySelector(".output-panel");
  outputArea.style.display = "block";

  // Check if paragraph already exists, otherwise create it
  let reportP = outputArea.querySelector("p") || document.createElement("p");
  if (!outputArea.querySelector("p")) outputArea.appendChild(reportP);

  // Typewriter effect
  reportP.textContent = "";
  let i = 0;
  const speed = 30;

  function typeWriter() {
    if (i < output.length) {
      reportP.textContent += output.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();

  tickersArr.length = 0;
  generateReportBtn.disabled = true;
}
