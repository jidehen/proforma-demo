# Pro Forma System Prompt Tester

A user-friendly tool for testing and refining LLM system prompts for rental property pro forma calculations. No coding experience required!

---

## Step-by-Step Setup (for Mac Users)

### 1. Install Homebrew (if you don't have it)
Homebrew is a package manager for Mac that makes installing software easy.

Open the **Terminal** app (find it in Applications > Utilities), then copy and paste this command and press **Enter**:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js (needed to run the app)
In the Terminal, run:
```bash
brew install node
```

### 3. Install Ollama (local AI engine)
Go to [https://ollama.ai/download](https://ollama.ai/download) and download the Mac version.  
Open the downloaded file and follow the instructions to install.

### 4. Start Ollama
In the Terminal, run:
```bash
ollama serve
```
Leave this Terminal window open.

### 5. Download the AI Model
Open a **new Terminal window** and run:
```bash
ollama pull mistral
```
Wait for the download to finish.

### 6. Download and Set Up This Project
- Download this project folder (or clone it from GitHub if you know how).
- In the Terminal, use `cd` to go to the project folder. For example:
  ```bash
  cd ~/Downloads/proforma-demo
  ```
- Install the required packages:
  ```bash
  npm install
  ```

### 7. Start the App
In the same Terminal window, run:
```bash
npm run dev
```
You should see a message like:  
`Local: http://localhost:3000`

### 8. Open the App in Your Browser
- Open Safari or Chrome.
- Go to: [http://localhost:3000](http://localhost:3000)

---

## How to Use

1. **Edit the System Prompt** (left side): Change how the AI calculates the pro forma.
2. **Edit the Input Data** (right side): Change the property details and numbers.
3. **Click "Run Test"**: See the results as raw JSON.
4. **Download Results**: Click "Download Results" to save your test.

---

## Troubleshooting

- **Ollama not found?**  
  Make sure you installed it and ran `ollama serve` in the Terminal.
- **Model not found?**  
  Make sure you ran `ollama pull mistral` and waited for it to finish.
- **Page not loading?**  
  Make sure you ran `npm run dev` in the project folder and visit [http://localhost:3000](http://localhost:3000).
- **Still stuck?**  
  Restart your computer and repeat the steps above.

---

## License

MIT License - feel free to use this tool for your own projects!