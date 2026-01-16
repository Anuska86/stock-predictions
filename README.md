# stock-predictions

# 🐾 Purrdict AI Stock Analyst

Purrdict is an AI-powered stock market analysis tool that uses a feline twist. It fetches real-time market data via the **Massive (Polygon.io) API** and generates "purr-dictions" using **OpenAI's GPT-4o**.

## 🚀 Quick Start

To start the project again after turning on your PC:

1. **Open your terminal** (Command Prompt, Terminal, or VS Code Terminal).
2. **Navigate to the project folder**:
   ```bash
   cd path/to/your/project-folder
   ```
3. Run the development server:

Bash
npm run dev

4. Open your browser to the local URL provided in the terminal (usually http://localhost:5173).

It's a smart move to write this down now! A README.md file is like a manual for your future self (or other developers) so you don't have to remember every command.

Since you are using Vite, here is a clean, professional README.md you can save in your project's root folder.

Markdown

# 🐾 Purrdict AI Stock Analyst

Purrdict is an AI-powered stock market analysis tool that uses a feline twist. It fetches real-time market data via the **Massive (Polygon.io) API** and generates "purr-dictions" using **OpenAI's GPT-4o**.

## 🚀 Quick Start

To start the project again after turning on your PC:

1. **Open your terminal** (Command Prompt, Terminal, or VS Code Terminal).
2. **Navigate to the project folder**:
   ```bash
   cd path/to/your/project-folder
   Run the development server:
   ```

Bash
npm run dev
Open your browser to the local URL provided in the terminal (usually http://localhost:5173).

🛠️ Installation & Setup
If you are setting this up on a new machine, follow these steps:

1. Install Dependencies:

Bash
npm install

It's a smart move to write this down now! A README.md file is like a manual for your future self (or other developers) so you don't have to remember every command.

Since you are using Vite, here is a clean, professional README.md you can save in your project's root folder.

Markdown

# 🐾 Purrdict AI Stock Analyst

Purrdict is an AI-powered stock market analysis tool that uses a feline twist. It fetches real-time market data via the **Massive (Polygon.io) API** and generates "purr-dictions" using **OpenAI's GPT-4o**.

## 🚀 Quick Start

To start the project again after turning on your PC:

1. **Open your terminal** (Command Prompt, Terminal, or VS Code Terminal).
2. **Navigate to the project folder**:
   ```bash
   cd path/to/your/project-folder
   Run the development server:
   ```

Bash
npm run dev
Open your browser to the local URL provided in the terminal (usually http://localhost:5173).

🛠️ Installation & Setup
If you are setting this up on a new machine, follow these steps:

Install Dependencies:

Bash
npm install

2.Configure Environment Variables: Create a file named .env in the root directory and add your API keys:

Code snippet
VITE_MASSIVE_API_KEY=your_polygon_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here

📁 Project Structure

index.html - The main UI structure.

index.js - App logic (fetching data and AI integration).

index.css - Custom Purrdict "Gold & Dark Blue" styling.

/utils/dates.js - Helper for calculating stock date ranges.

/images - Contains purrdict.png and icons.

⚠️ Important Note

Never share or commit your .env file to GitHub. It contains your private API keys which could lead to unexpected costs if leaked.

---

### One last thing to check!

For `npm run dev` to work, make sure your `package.json` file has this section inside of it:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
},
```
