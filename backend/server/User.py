from pydantic import BaseModel
from typing import List

class User(BaseModel):
    """Docstring here"""
    
    username: str
    password: str
    avatar_url: str
    followers: List[str]
    followees: List[str]
