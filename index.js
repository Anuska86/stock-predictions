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

  if (tickersArr.length === 0) {
    tickersDiv.innerHTML =
      '<span class="placeholder-text">Your tickers will appear here...</span>';
    generateReportBtn.disabled = true;
    return;
  }

  tickersArr.forEach((ticker, index) => {
    const newTickerSpan = document.createElement("span");
    newTickerSpan.textContent = ticker;
    newTickerSpan.classList.add("ticker");

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;"; // The 'x' symbol
    removeBtn.classList.add("remove-ticker-btn");
    removeBtn.setAttribute("aria-label", `Remove ${ticker}`);

    removeBtn.onclick = () => {
      tickersArr.splice(index, 1); // Remove from array
      renderTickers();

      // If no tickers left, disable the generate button
      if (tickersArr.length === 0) {
        generateReportBtn.disabled = true;
      }
    };

    newTickerSpan.appendChild(removeBtn);
    tickersDiv.appendChild(newTickerSpan);
  });
}

const loadingArea = document.querySelector(".loading-panel");
const apiMessage = document.getElementById("api-message");

//Fetch the stock data

async function fetchStockData() {
  document.querySelector(".action-panel").style.display = "none";
  loadingArea.style.display = "flex";
  apiMessage.innerText = "The cat is sniffing the charts...";

  const oldRetry = loadingArea.querySelector(".reset-btn");
  if (oldRetry) oldRetry.remove();

  try {
    const response = await fetch("/api/get-purrdiction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickers: tickersArr }),
    });

    const result = await response.json();
    console.log("Full AI Result:", result);

    if (!response.ok) {
      throw new Error(result.error || "The server-cat is napping.");
    }

    const reportText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (response.ok && result.report) {
      renderReport(result.report);
    } else {
      console.error("Unexpected API structure:", result);
      throw new Error("The cat is confused by the data format!");
    }
  } catch (err) {
    apiMessage.innerText = `The cat got a hairball: ${err.message}`;
    console.error("Fetch Error:", err);

    if (!loadingArea.querySelector("button")) {
      const retryBtn = document.createElement("button");
      retryBtn.innerText = "Try Again";
      retryBtn.className = "reset-btn";
      retryBtn.onclick = resetUI;
      loadingArea.appendChild(retryBtn);
    }
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

  //reset
  tickersArr.length = 0;
  renderTickers();
  generateReportBtn.disabled = true;
}

//Market Status

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function updateMarketStatus() {
  try {
    const response = await fetch("/api/get-prices");
    if (!response.ok) throw new Error("Network response was not ok");
    const dataArray = await response.json();

    const ids = ["btc", "eth", "spy", "gold"];

    dataArray.forEach((data, index) => {
      if (data.results && data.results[0]) {
        const item = data.results[0];
        const closePrice = item.c;
        const priceFormatted = closePrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const tickerId = ids[index];
        const elements = document.querySelectorAll(
          `[id^="${tickerId}-status"]`,
        );

        elements.forEach((el) => {
          el.innerText = `${tickerId.toUpperCase()}: $${priceFormatted} ${
            closePrice > item.o ? "🚀" : "📉"
          }`;
        });
      }
    });
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

/*Reset UI*/

function resetUI() {
  // Hide the output and loading panels
  document.querySelector(".output-panel").style.display = "none";
  document.querySelector(".loading-panel").style.display = "none";

  // Show the input panel
  document.querySelector(".action-panel").style.display = "block";

  // Clear any old text f
  const reportP = document.querySelector(".output-panel p");
  if (reportP) reportP.textContent = "";

  tickersArr.length = 0;
  renderTickers();

  label.style.color = "white";
  label.textContent =
    "Input stock tickers to receive a Purrdicted™ market analysis.";
}

document.getElementById("reset-ui-btn").addEventListener("click", resetUI);
