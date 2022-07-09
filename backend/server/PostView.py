from pydantic import BaseModel
from Post import Post

class PostView(BaseModel):
	""" Represents how a user will view a post"""
    
	post: Post
	liked: bool
