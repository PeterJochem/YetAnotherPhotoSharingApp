from pydantic import BaseModel

class Comment(BaseModel):
    """Docstring here"""
    
    post_id = int
    date: int
    avatar_url: str
    poster_username: str
    commenter_username: str
    commenter_avatar_url: str
    text: str
