import { dates } from "/utils/dates.js";

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
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`;
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

async function fetchReport(data) {
  /** AI goes here **/
}

// Render the report

function renderReport(output) {
  loadingArea.style.display = "none";
  const outputArea = document.querySelector(".output-panel");
  outputArea.style.display = "block";

  // Check if paragraph already exists, otherwise create it
  let reportP = outputArea.querySelector("p");
  if (!reportP) {
    reportP = document.createElement("p");
    outputArea.appendChild(reportP);
  }
  reportP.textContent = output;
}
