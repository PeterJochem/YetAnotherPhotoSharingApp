from pydantic import BaseModel
from Comment import Comment
from typing import List

class Post(BaseModel):
    """Docstring here"""
    
    post_id = int
    image_url: str
    caption: str
    date: str
    avatar_url: str
    username: str
    comments: List[Comment]
