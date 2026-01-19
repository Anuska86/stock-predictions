import { dates } from "/utils/dates.js";

const massiveKey = import.meta.env.VITE_MASSIVE_API_KEY;
const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
//const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

const tickersArr = [];

const generateReportBtn = document.querySelector(".generate-report-btn");
const tickerInput = document.getElementById("ticker-input");
const label = document.querySelector("label");

const modal = document.getElementById("history-modal");
const historyList = document.getElementById("history-list");

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

// Suggestions
document.querySelectorAll(".suggestion-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const ticker = btn.getAttribute("data-ticker");

    // Check if we already have 3 tickers or if it's already in the list
    if (tickersArr.length < 3 && !tickersArr.includes(ticker)) {
      tickersArr.push(ticker);
      renderTickers();
      generateReportBtn.disabled = false;

      // Visual feedback
      label.style.color = "#4CAF50";
      label.textContent = `Added ${ticker}!`;
      setTimeout(() => {
        label.style.color = "white";
        label.textContent =
          "Input stock tickers for a Purrdicted™ market analysis.";
      }, 1000);
    } else if (tickersArr.length >= 3) {
      label.textContent = "Max 3 tickers allowed.";
      label.style.color = "#e94560";
    }
  });
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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiKey}`;

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
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
    }),
  });

  const result = await response.json();

  if (result.error) {
    throw new Error(`Gemini API Error: ${result.error.message}`);
  }

  if (result.candidates && result.candidates[0]) {
    return result.candidates[0].content.parts[0].text;
  } else {
    throw new Error("The cat is speechless! (No candidates returned)");
  }
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
  saveToHistory(output);

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

//Market Status

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function updateMarketStatus() {
  const tickers = [
    { id: "btc", poly: "X:BTCUSD" },
    { id: "eth", poly: "X:ETHUSD" },
    { id: "spy", poly: "SPY" },
    { id: "gold", poly: "C:XAUUSD" },
  ];

  try {
    for (const item of tickers) {
      const url = `https://api.polygon.io/v2/aggs/ticker/${item.poly}/prev?adjusted=true&apiKey=${massiveKey}`;
      const response = await fetch(url);

      // If we hit the limit, stop and wait
      if (response.status === 429) {
        console.warn("Rate limit hit, pausing ticker updates...");
        break;
      }

      const data = await response.json();

      if (data.results && data.results[0]) {
        const closePrice = data.results[0].c;
        const priceFormatted = closePrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const elements = document.querySelectorAll(`[id^="${item.id}-status"]`);
        elements.forEach((el) => {
          el.innerText = `${item.id.toUpperCase()}: $${priceFormatted} ${
            closePrice > data.results[0].o ? "🚀" : "📉"
          }`;
        });
      }
      await delay(12000);
    }
  } catch (err) {
    console.error("Market Status Error:", err);
  }
}

updateMarketStatus();
setInterval(updateMarketStatus, 300000);

//History
function saveToHistory(text) {
  let history = JSON.parse(localStorage.getItem("purrdictHistory")) || [];
  history.unshift({ date: new Date().toLocaleDateString(), text: text });
  if (history.length > 5) history.pop();
  localStorage.setItem("purrdictHistory", JSON.stringify(history));
}

// 2. Open Modal Logic
document
  .querySelector('a[href="#"]:first-of-type')
  .addEventListener("click", (e) => {
    e.preventDefault();
    const history = JSON.parse(localStorage.getItem("purrdictHistory")) || [];
    historyList.innerHTML = history.length
      ? history
          .map((h) => `<div><strong>${h.date}:</strong> ${h.text}</div>`)
          .join("")
      : "<p>No history yet. Start trading!</p>";
    modal.style.display = "block";
  });

// 3. Close Modal Logic
document.querySelector(".close-modal").onclick = () =>
  (modal.style.display = "none");
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

// Clear History Logic
document.getElementById("clear-history").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your 9 lives of history?")) {
    localStorage.removeItem("purrdictHistory");
    historyList.innerHTML = "<p>No history yet. Start trading!</p>";
  }
});
