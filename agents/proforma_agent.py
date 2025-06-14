#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from a2a_base import A2AAgent
import httpx
import json
from typing import Dict, List, Any

class ProFormaAgent(A2AAgent):
    def __init__(self):
        skills = [{
            "id": "proforma-calculation",
            "name": "Pro Forma Calculator",
            "description": "Calculates rental property pro forma and generates visualization",
            "tags": ["finance", "real-estate", "calculation"],
            "examples": ["Calculate pro forma for a 10-unit property"],
            "inputModes": ["text"],
            "outputModes": ["text"]
        }]
        
        super().__init__(
            name="ProForma Agent",
            description="Calculates rental property pro forma and coordinates with visualization agent",
            port=10001,
            skills=skills
        )
        self.visualization_agent_url = "http://localhost:10002/"
    
    async def process_task(self, message: Dict[str, Any], artifacts: List[Dict[str, Any]], history: List[Dict[str, Any]]) -> str:
        print(f"[PROFORMA_AGENT] Processing task: {message}")
        
        try:
            # Extract the input from the message
            user_input = message["parts"][0]["text"]
            
            # Parse the JSON input (system prompt + input data)
            input_data = json.loads(user_input)
            system_prompt = input_data.get("systemPrompt", "")
            property_input = input_data.get("input", {})
            
            print(f"[PROFORMA_AGENT] Calling Ollama for pro forma calculation...")
            
            # Call Ollama for pro forma calculation
            proforma_result = await self.call_ollama_proforma(system_prompt, property_input)
            
            print(f"[PROFORMA_AGENT] Pro forma result: {proforma_result}")
            
            # Call the visualization agent via A2A protocol
            print(f"[PROFORMA_AGENT] Calling visualization agent...")
            try:
                visualization_html = await self.call_agent(
                    self.visualization_agent_url,
                    json.dumps(proforma_result)
                )
                print(f"[PROFORMA_AGENT] Received visualization: {len(visualization_html)} characters")
            except Exception as viz_error:
                print(f"[PROFORMA_AGENT] Visualization error: {viz_error}")
                visualization_html = f"<p>Visualization generation failed: {str(viz_error)}</p>"
            
            # Return combined result
            return json.dumps({
                "proforma": proforma_result,
                "visualization": visualization_html
            })
            
        except Exception as e:
            print(f"[PROFORMA_AGENT] Error: {e}")
            return json.dumps({"error": str(e)})
    
    async def call_ollama_proforma(self, system_prompt: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Call Ollama for pro forma calculation"""
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "mistral",
                    "prompt": f"{system_prompt}\n\nInput: {json.dumps(input_data)}\n\nOutput:",
                    "stream": False,
                    "format": "json",
                    "options": {
                        "temperature": 0,
                        "top_p": 1,
                        "seed": 42
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return json.loads(result["response"])
            else:
                raise Exception(f"Ollama API error: {response.status_code}")

if __name__ == "__main__":
    agent = ProFormaAgent()
    agent.run() 