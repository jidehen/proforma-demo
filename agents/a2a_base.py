from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import uuid
import json
from datetime import datetime
import httpx

class AgentCard(BaseModel):
    name: str
    description: str
    url: str
    version: str
    capabilities: Dict[str, bool]
    defaultInputModes: List[str]
    defaultOutputModes: List[str]
    skills: List[Dict[str, Any]]

class TaskRequest(BaseModel):
    id: Optional[str] = None
    sessionId: Optional[str] = None
    message: Dict[str, Any]
    artifacts: Optional[List[Dict[str, Any]]] = []
    history: Optional[List[Dict[str, Any]]] = []

class TaskResponse(BaseModel):
    id: str
    sessionId: str
    status: Dict[str, Any]
    artifacts: List[Dict[str, Any]]
    history: List[Dict[str, Any]]

class A2AAgent:
    def __init__(self, name: str, description: str, port: int, skills: List[Dict[str, Any]]):
        self.app = FastAPI()
        self.name = name
        self.description = description
        self.port = port
        self.url = f"http://localhost:{port}/"
        self.skills = skills
        self.setup_routes()
    
    def setup_routes(self):
        @self.app.get("/")
        async def get_agent_card():
            return AgentCard(
                name=self.name,
                description=self.description,
                url=self.url,
                version="1.0.0",
                capabilities={
                    "streaming": False,
                    "pushNotifications": False,
                    "stateTransitionHistory": False
                },
                defaultInputModes=["text"],
                defaultOutputModes=["text"],
                skills=self.skills
            )
        
        @self.app.post("/send_task")
        async def send_task(request: TaskRequest):
            task_id = request.id or str(uuid.uuid4())
            session_id = request.sessionId or str(uuid.uuid4())
            
            try:
                result = await self.process_task(request.message, request.artifacts, request.history)
                
                return TaskResponse(
                    id=task_id,
                    sessionId=session_id,
                    status={
                        "state": "completed",
                        "message": {
                            "role": "agent",
                            "parts": [{"type": "text", "text": result}]
                        },
                        "timestamp": datetime.now().isoformat()
                    },
                    artifacts=[],
                    history=request.history + [request.message]
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    
    async def process_task(self, message: Dict[str, Any], artifacts: List[Dict[str, Any]], history: List[Dict[str, Any]]) -> str:
        # Override this method in subclasses
        raise NotImplementedError("Subclasses must implement process_task")
    
    async def call_agent(self, agent_url: str, message: str) -> str:
        """Call another A2A agent"""
        async with httpx.AsyncClient(timeout=300.0) as client:  # 5 minute timeout for LLM processing
            try:
                response = await client.post(
                    f"{agent_url}send_task",
                    json={
                        "message": {
                            "role": "user",
                            "parts": [{"type": "text", "text": message}]
                        }
                    }
                )
                if response.status_code == 200:
                    result = response.json()
                    return result["status"]["message"]["parts"][0]["text"]
                else:
                    raise Exception(f"Agent call failed: {response.status_code} - {response.text}")
            except httpx.TimeoutException:
                raise Exception("Agent call timed out after 5 minutes")
            except Exception as e:
                raise Exception(f"Agent call error: {str(e)}")
    
    def run(self):
        import uvicorn
        print(f"[A2A] Starting {self.name} on port {self.port}")
        uvicorn.run(self.app, host="0.0.0.0", port=self.port) 