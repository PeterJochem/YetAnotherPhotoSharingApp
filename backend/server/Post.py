from pydantic import BaseModel

class Post(BaseModel):
    """Docstring here"""
    
    image: bytes
    caption: str
    date: str
    avatar_image: bytes
    username: str

