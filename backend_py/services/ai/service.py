"""
Base AI service implementation using Perplexity API.
"""
from typing import Dict, Any, List, Optional
import httpx
from datetime import datetime
from fastapi import HTTPException

from config import settings

class AIService:
    def __init__(self):
        self.api_key = settings.PERPLEXITY_API_KEY
        self.base_url = "https://api.perplexity.ai"
        self.default_model = settings.PERPLEXITY_MODEL
        self.enabled = settings.ENABLE_AI_FEATURES
    
    def _check_enabled(self):
        """Check if AI features are enabled."""
        if not self.enabled:
            raise HTTPException(
                status_code=503,
                detail="AI features are not available. Please configure PERPLEXITY_API_KEY in the environment variables."
            )
        
    async def _make_request(
        self,
        messages: List[Dict[str, str]],
        *,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        top_p: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Make a request to Perplexity API.
        Args:
            messages: List of message dictionaries
            model: Model to use
            temperature: Temperature for response generation
            max_tokens: Maximum tokens in response
            top_p: Top p sampling parameter
        Returns:
            Dict[str, Any]: API response
        """
        self._check_enabled()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": model or self.default_model,
            "messages": messages,
            "temperature": temperature or 0.7,  # Default temperature
            "max_tokens": max_tokens or 1024,   # Default max tokens
            "top_p": top_p or 0.9              # Default top p
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=data
            )
            response.raise_for_status()
            return response.json()

    def _format_system_prompt(self, role: str) -> str:
        """Format system prompt for different AI roles."""
        prompts = {
            "analyzer": (
                "You are an expert business analyst. Analyze the following information "
                "and provide insights, key points, and recommendations. Be concise and "
                "focus on actionable insights."
            ),
            "emailwriter": (
                "You are a professional email writer. Write clear, concise, and "
                "effective emails that maintain a professional tone while being "
                "engaging and appropriate for business communication."
            ),
            "prioritizer": (
                "You are a task management expert. Analyze and prioritize tasks based "
                "on urgency, importance, and business impact. Provide clear reasoning "
                "for prioritization decisions."
            )
        }
        return prompts.get(role, "You are a helpful assistant.")

    async def analyze_contact_note(
        self,
        note_data: Dict[str, Any],
        *,
        mode: str = "insights"
    ) -> Dict[str, Any]:
        """
        Analyze a contact note and extract insights.
        Args:
            note_data: Note data with context
            mode: Analysis mode (insights, sentiment, or action-items)
        Returns:
            Dict[str, Any]: Analysis results
        """
        # Format context for the AI
        context_str = (
            f"Contact: {note_data['context'].get('contact', {}).get('name', 'Unknown')}\n"
            f"Company: {note_data['context'].get('contact', {}).get('company', 'Unknown')}\n"
            f"Note Content: {note_data['content']}\n"
            f"Note Type: {note_data['type']}\n"
            f"Date: {note_data['created_at']}"
        )
        
        messages = [
            {"role": "system", "content": self._format_system_prompt("analyzer")},
            {"role": "user", "content": f"Analyze this contact note:\n\n{context_str}\n\nProvide analysis focusing on: {mode}"}
        ]
        
        response = await self._make_request(messages, temperature=0.5)
        
        return {
            "note_id": note_data["note_id"],
            "analysis": response["choices"][0]["message"]["content"],
            "mode": mode,
            "analyzed_at": datetime.utcnow().isoformat()
        }

    async def prioritize_tasks(
        self,
        tasks: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze and prioritize a list of tasks.
        Args:
            tasks: List of task dictionaries with details
        Returns:
            Dict[str, Any]: Prioritized tasks with reasoning
        """
        # Format tasks for the AI
        tasks_str = "\n".join(
            f"Task {i+1}:\n"
            f"Title: {task['title']}\n"
            f"Due Date: {task['due_date']}\n"
            f"Current Priority: {task['priority']}\n"
            f"Status: {task['status']}\n"
            f"Description: {task['description']}\n"
            for i, task in enumerate(tasks)
        )
        
        messages = [
            {"role": "system", "content": self._format_system_prompt("prioritizer")},
            {"role": "user", "content": f"Analyze and prioritize these tasks:\n\n{tasks_str}"}
        ]
        
        response = await self._make_request(messages, temperature=0.3)
        
        return {
            "analysis": response["choices"][0]["message"]["content"],
            "analyzed_at": datetime.utcnow().isoformat(),
            "task_count": len(tasks)
        }

    async def generate_email(
        self,
        context: Dict[str, Any],
        *,
        template: str = "default",
        tone: str = "professional"
    ) -> Dict[str, Any]:
        """
        Generate an email based on context and template.
        Args:
            context: Email context (recipient, purpose, etc.)
            template: Email template type
            tone: Desired tone of the email
        Returns:
            Dict[str, Any]: Generated email with subject and body
        """
        # Format context for the AI
        context_str = (
            f"Recipient: {context.get('recipient_name', 'Unknown')}\n"
            f"Company: {context.get('recipient_company', 'Unknown')}\n"
            f"Purpose: {context.get('purpose', 'Not specified')}\n"
            f"Key Points: {', '.join(context.get('key_points', []))}\n"
            f"Previous Interaction: {context.get('previous_interaction', 'None')}"
        )
        
        messages = [
            {"role": "system", "content": self._format_system_prompt("emailwriter")},
            {"role": "user", "content": (
                f"Generate a {tone} email using the {template} template "
                f"with this context:\n\n{context_str}"
            )}
        ]
        
        response = await self._make_request(messages, temperature=0.6)
        
        return {
            "generated_content": response["choices"][0]["message"]["content"],
            "template": template,
            "tone": tone,
            "generated_at": datetime.utcnow().isoformat()
        }

    async def summarize_entity(
        self,
        entity_type: str,
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate a summary for a contact or deal.
        Args:
            entity_type: Type of entity (contact/deal)
            data: Entity data with history
        Returns:
            Dict[str, Any]: Generated summary
        """
        # Format entity data for the AI
        data_str = f"Entity Type: {entity_type}\n"
        if entity_type == "contact":
            data_str += (
                f"Name: {data.get('name', 'Unknown')}\n"
                f"Company: {data.get('company', 'Unknown')}\n"
                f"Type: {data.get('type', 'Unknown')}\n"
                f"Notes: {len(data.get('notes', []))} entries\n"
                f"Deals: {len(data.get('deals', []))} associated\n"
                f"Last Interaction: {data.get('last_interaction', 'None')}"
            )
        else:  # deal
            data_str += (
                f"Name: {data.get('name', 'Unknown')}\n"
                f"Stage: {data.get('stage', 'Unknown')}\n"
                f"Value: {data.get('value', 0)}\n"
                f"Contact: {data.get('contact_name', 'Unknown')}\n"
                f"Notes: {len(data.get('notes', []))} entries\n"
                f"Last Updated: {data.get('updated_at', 'Unknown')}"
            )
        
        messages = [
            {"role": "system", "content": self._format_system_prompt("analyzer")},
            {"role": "user", "content": f"Generate a summary for this {entity_type}:\n\n{data_str}"}
        ]
        
        response = await self._make_request(messages, temperature=0.4)
        
        return {
            "entity_type": entity_type,
            "entity_id": data.get("id"),
            "summary": response["choices"][0]["message"]["content"],
            "generated_at": datetime.utcnow().isoformat()
        }

ai_service = AIService()