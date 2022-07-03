from pydantic import BaseModel

class User(BaseModel):
    """Docstring here"""
    
    username: str
    password: str
    avatar_url: str
