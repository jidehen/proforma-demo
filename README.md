# Pro Forma System Prompt Tester

A user-friendly tool for testing and refining LLM system prompts for rental property pro forma calculations using the A2A (Agent-to-Agent) Protocol. No coding experience required!

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

### 3. Install Python (needed for A2A agents)
In the Terminal, run:
```bash
brew install python
```

### 4. Install Ollama (local AI engine)
Go to [https://ollama.ai/download](https://ollama.ai/download) and download the Mac version.  
Open the downloaded file and follow the instructions to install.

### 5. Start Ollama
In the Terminal, run:
```bash
ollama serve
```
Leave this Terminal window open.

### 6. Download the AI Models
Open a **new Terminal window** and run:
```bash
ollama pull mistral
ollama pull qwen2.5:3b
```
Wait for both downloads to finish.

### 7. Download and Set Up This Project
- Download this project folder (or clone it from GitHub if you know how).
- In the Terminal, use `cd` to go to the project folder. For example:
  ```bash
  cd ~/Downloads/proforma-demo
  ```
- Install the required Node.js packages:
  ```bash
  npm install
  ```
- Install the required Python packages:
  ```bash
  pip install -r agents/requirements.txt
  ```

### 8. Start the A2A Agents
In the Terminal (make sure you're in the project folder), run:
```bash
npm run start-agents
```
**What you should see:**
- "Starting A2A Agents..."
- "Both agents started!"
- "ProForma Agent: http://localhost:10001"
- "Visualization Agent: http://localhost:10002"

**Keep this Terminal window open** - don't close it or the agents will stop working.

### 9. Start the Web App
Open a **new Terminal window** (keep the first one open), go to the project folder again:
```bash
cd ~/Downloads/proforma-demo
```
Then start the web app:
```bash
npm run dev
```
**What you should see:**
- "Next.js 14.1.0"
- "Local: http://localhost:3000"
- "Ready in [some number]ms"

**Keep this Terminal window open too** - you now have 2 Terminal windows running.

### 10. Use the App
- Open Safari or Chrome
- Go to: **http://localhost:3000**
- You should see the Pro Forma System Prompt Tester interface

**That's it! The app is now running.**

---

## How it Works

The app uses **two separate A2A (Agent-to-Agent) Protocol agents**:

1. **ProForma Agent** (Port 10001): 
   - Uses the Mistral model
   - Generates pro forma calculations from your system prompt and input data
   - Communicates with the Visualization Agent via A2A Protocol

2. **Visualization Agent** (Port 10002):
   - Uses the Qwen2.5:3b model  
   - Generates HTML table visualizations from the pro forma JSON
   - Receives requests from the ProForma Agent via A2A Protocol

**Communication Flow:**
```
Frontend → ProForma Agent → Visualization Agent → ProForma Agent → Frontend
```

---

## How to Use

1. **Edit the System Prompt** (left side): Change how the AI calculates the pro forma.
2. **Edit the Input Data** (right side): Change the property details and numbers.
3. **Click "Run Test"**: The ProForma Agent will calculate the pro forma and automatically request a visualization from the Visualization Agent.
4. **View Results**: See both the raw JSON and the HTML table visualization.
5. **Download Results**: Click "Download Results" to save your test.

---

## Important Notes

**You need 3 things running at the same time:**
1. **Ollama** (Terminal window 1): `ollama serve`
2. **A2A Agents** (Terminal window 2): `npm run start-agents` 
3. **Web App** (Terminal window 3): `npm run dev`

**To stop everything:**
- Press `Ctrl+C` in each Terminal window
- Or just close all Terminal windows

**To start again later:**
1. Open Terminal, run: `ollama serve`
2. Open new Terminal, go to project folder, run: `npm run start-agents`
3. Open new Terminal, go to project folder, run: `npm run dev`
4. Open browser to: http://localhost:3000

## Quick Troubleshooting

- **"Address already in use" error?** Something is already running. Close all Terminal windows and start fresh.
- **Page shows error?** Make sure all 3 commands above are running in separate Terminal windows.
- **Takes a long time to load?** This is normal - the AI models need time to think (30+ seconds is normal).
- **Still not working?** Restart your computer and follow the steps again.

---

## Advanced: A2A Protocol

This project demonstrates the A2A (Agent-to-Agent) Protocol, where:
- Each agent runs as an independent service with its own model and capabilities
- Agents communicate via standardized HTTP endpoints (`/send_task`)
- The ProForma Agent orchestrates the workflow by calling the Visualization Agent
- Both agents can be discovered, tested, and used independently

You can test the agents directly:
- ProForma Agent: `http://localhost:10001`
- Visualization Agent: `http://localhost:10002`

---

## License

MIT License - feel free to use this tool for your own projects!