#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from a2a_base import A2AAgent
import httpx
import json
from typing import Dict, List, Any

class VisualizationAgent(A2AAgent):
    def __init__(self):
        skills = [{
            "id": "html-visualization",
            "name": "HTML Visualizer",
            "description": "Generates HTML table visualizations from JSON data",
            "tags": ["visualization", "html", "table"],
            "examples": ["Generate HTML table from financial data"],
            "inputModes": ["text"],
            "outputModes": ["text"]
        }]
        
        super().__init__(
            name="Visualization Agent",
            description="Generates HTML visualizations from structured data",
            port=10002,
            skills=skills
        )
    
    async def process_task(self, message: Dict[str, Any], artifacts: List[Dict[str, Any]], history: List[Dict[str, Any]]) -> str:
        print(f"[VISUALIZATION_AGENT] Processing task: {message}")
        
        try:
            # Extract the JSON data from the message
            user_input = message["parts"][0]["text"]
            json_data = json.loads(user_input)
            
            print(f"[VISUALIZATION_AGENT] Calling Ollama for HTML generation...")
            
            # Call Ollama for HTML visualization generation
            html_result = await self.call_ollama_visualization(json_data)
            
            print(f"[VISUALIZATION_AGENT] Generated HTML: {len(html_result)} characters")
            
            return html_result
            
        except Exception as e:
            print(f"[VISUALIZATION_AGENT] Error: {e}")
            return f"<div style='color:red'>Visualization error: {str(e)}</div>"
    
    async def call_ollama_visualization(self, json_data: Dict[str, Any]) -> str:
        """Call Ollama for HTML visualization generation"""
        prompt = f"""You are a visualization agent. Given the following JSON data, generate a modern, readable HTML table that represents the data as a spreadsheet. 

Requirements:
- Use proper HTML table structure with <table>, <thead>, <tbody>, <tr>, <th>, <td> tags
- Add inline CSS styling for a modern look (borders, padding, alternating row colors)
- Format numbers with commas where appropriate
- Use clear, readable headers
- Make it responsive and professional looking
- Return ONLY the HTML table, no explanations or markdown

JSON Data:
{json.dumps(json_data, indent=2)}

Generate the HTML table:"""

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "qwen2.5:3b",  # Using a different model for visualization
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "top_p": 0.9,
                        "seed": 123
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                html_content = result["response"].strip()
                
                # Clean up the response to extract just the HTML
                if "```html" in html_content:
                    html_content = html_content.split("```html")[1].split("```")[0].strip()
                elif "```" in html_content:
                    html_content = html_content.split("```")[1].strip()
                
                return html_content
            else:
                raise Exception(f"Ollama API error: {response.status_code}")

if __name__ == "__main__":
    agent = VisualizationAgent()
    agent.run() 