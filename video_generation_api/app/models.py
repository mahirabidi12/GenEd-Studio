from pydantic import BaseModel

class GenerationRequest(BaseModel):
    prompt: str
    negative_prompt: str
