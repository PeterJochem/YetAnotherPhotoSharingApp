from pydantic import BaseModel

class Post(BaseModel):
    """Docstring here"""
    
    image_url: bytes
    caption: str
    date: str
    avatar_url: bytes
    username: str

