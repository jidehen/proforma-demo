#!/usr/bin/env python3

import subprocess
import sys
import time
import os

def start_agents():
    """Start both A2A agents"""
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("Starting A2A Agents...")
    print("Make sure Ollama is running with both 'mistral' and 'qwen2.5:3b' models")
    print("Run: ollama pull mistral && ollama pull qwen2.5:3b")
    print()
    
    # Start ProForma Agent
    print("Starting ProForma Agent on port 10001...")
    proforma_process = subprocess.Popen([
        sys.executable, 
        os.path.join(script_dir, "proforma_agent.py")
    ])
    
    # Wait a moment
    time.sleep(2)
    
    # Start Visualization Agent
    print("Starting Visualization Agent on port 10002...")
    viz_process = subprocess.Popen([
        sys.executable, 
        os.path.join(script_dir, "visualization_agent.py")
    ])
    
    print()
    print("Both agents started!")
    print("ProForma Agent: http://localhost:10001")
    print("Visualization Agent: http://localhost:10002")
    print()
    print("Press Ctrl+C to stop both agents")
    
    try:
        # Wait for both processes
        proforma_process.wait()
        viz_process.wait()
    except KeyboardInterrupt:
        print("\nStopping agents...")
        proforma_process.terminate()
        viz_process.terminate()
        proforma_process.wait()
        viz_process.wait()
        print("Agents stopped.")

if __name__ == "__main__":
    start_agents() 