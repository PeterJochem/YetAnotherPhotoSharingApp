from typing import List
from fastapi import FastAPI, HTTPException, File, Form, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy as db
from sqlalchemy import ForeignKey, Integer, String, Float
from sqlalchemy.sql import func
from ServerConfig import IMAGE_DIR, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, SERVER_URL
import time
from Post import Post
from User import User
from PostView import PostView
from Comment import Comment
import uuid
import time
import imageio as iio
from fastapi.responses import FileResponse

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


engine = db.create_engine(f"postgresql+pg8000://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}")
metadata = db.MetaData()

def does_user_exist(username: str) -> bool:
    """ Check if a user exists with the given username
        
        Args:
            username (str) - username of user in db
        
        Returns:
            bool - True if user exits with this username. False otherwise
    """

    connection = engine.connect()
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)
    query = db.select([user.columns.username]).where(user.columns.username == username)
    return len(connection.execute(query).fetchall()) > 0


@app.post("/create_user_table", status_code=200)
def create_user_table():
    """ Create the user table """
    
    connection = engine.connect()
    metadata = db.MetaData()

    user = db.Table(
      "user", 
      metadata, 
      db.Column('username', String, primary_key=True), 
      db.Column('password', String),
      db.Column('avatar_url', String)
    )
    
    metadata.create_all(engine)


@app.post("/create_following_table", status_code=200)
def create_following_table():
    """ Create the following table """

    connection = engine.connect()
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)

    following = db.Table(
      'following', metadata,
      db.Column('id', Integer, primary_key=True, autoincrement=True),
      db.Column('follower', String, ForeignKey(user.c.username)),
      db.Column('followee', String, ForeignKey(user.c.username))
    )

    metadata.create_all(engine)

@app.post("/create_post_table", status_code=200)
def create_post_table():
    """ Create the post table """

    connection = engine.connect()
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)

    posts = db.Table(
      'post', metadata,
      db.Column('id', Integer, primary_key=True, autoincrement=True),
      db.Column('user', String, ForeignKey(user.c.username)),
      db.Column('date', Float),
      db.Column('image_url', String),
      db.Column('caption', String),
    )

    metadata.create_all(engine)


@app.post("/create_comments_table", status_code=200)
def create_comments_table():
    """ Create the comments table """

    connection = engine.connect()
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)

    comments = db.Table(
      'comments', metadata,
      db.Column('id', Integer, primary_key=True, autoincrement=True),
      db.Column('post_id', Integer, ForeignKey(post.c.id, ondelete="CASCADE")),
      
      db.Column('poster_username', String, ForeignKey(user.c.username, ondelete="CASCADE")),
      db.Column('commenter_username', String, ForeignKey(user.c.username, ondelete="CASCADE")),
      
      db.Column('date', Float),
      db.Column('comment', String)
    )

    metadata.create_all(engine)

@app.post("/create_likes_table", status_code=200)
def create_likes_table():
    """ Create the likes table """

    connection = engine.connect()
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)

    likes = db.Table(
      'likes', metadata,
      db.Column('id', Integer, primary_key=True, autoincrement=True),
      db.Column('post_id', Integer, ForeignKey(post.c.id)),
      db.Column('liker_username', String, ForeignKey(user.c.username)),
      db.Column('date', Float),
    )

    metadata.create_all(engine)

@app.post("/create_all_tables", status_code=200)
def create_all_tables():
    """ Create all the tables for the finstagram database """
    
    try:
        create_user_table()
        create_post_table()
        create_comments_table()
        create_likes_table()
        create_following_table()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server failed to create tables: {e}")


# Above are functions to define and create the database
#############################
# Below are functions to query and change the database

@app.post("/create_new_user", status_code=200)
def create_new_user(new_user: User):
    """ Create a new user
        
        Args:
            new_user (User) - New user to add 
    """
    
    connection = engine.connect()
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)

    is_unique_query = db.select([user.columns.username]).where(user.columns.username == new_user.username)
    is_username_unique = len(connection.execute(is_unique_query).fetchall()) == 0
    if not is_username_unique:
        raise HTTPException(status_code=404, detail="Username is not unique")
    
    username = new_user.username
    password = new_user.password
    avatar_url = new_user.avatar_url
    query = db.insert(user).values(username=username, password=password, avatar_url=avatar_url) 
    connection.execute(query)

# FIX Me - should this be a patch?
@app.post("/set_avatar", status_code=200)
async def upadte_users_avatar(username: str, image_file: UploadFile):
    """ Set a user's avatar
        
        Args:
            FIX ME 
    """

    if not does_user_exist(username):
        raise HTTPException(status_code=404, detail=f"User does not exist with username {username}")
    
    image_file.filename = f"{uuid.uuid4()}.jpg"
    contents = await image_file.read() # FIX ME - read more about why I need await here
    with open(f"{IMAGE_DIR}{image_file.filename}", "wb") as f:
        f.write(contents)

    # Update the database
    connection = engine.connect()
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)

    get_image_endpoint = "/get_image"
    avatar_url = f"http://{SERVER_URL}{get_image_endpoint}?image_name={image_file.filename}" 
    query = db.update(user).values(avatar_url=avatar_url).where(user.columns.username == username)
    connection.execute(query)

@app.post("/create_post", status_code=200)
async def post(image_file: UploadFile, username: str, caption: str):
    """ Add the post for the user with the given username
        
        Args:
            username (str) - user to add post for
            caption (str) - user's caption for their photo
            image_file (FastAPI.UploadFile) - image file to post
    """

    if not does_user_exist(username):
        raise HTTPException(status_code=400, detail=f"Rejecting post request because user does not exist")

    # Write the image to the filesystem
    image_file.filename = f"{uuid.uuid4()}.jpg"
    contents = await image_file.read() # FIX ME - read more about why I need await here
    with open(f"{IMAGE_DIR}{image_file.filename}", "wb") as f:
        f.write(contents)

    # Add the post to the database
    connection = engine.connect()
    metadata = db.MetaData()
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)

    get_image_endpoint = "/get_image"
    image_url = f"http://{SERVER_URL}{get_image_endpoint}?image_name={image_file.filename}"
    query = db.insert(post).values(user=username, date=time.time(), image_url=image_url, caption=caption)
    connection.execute(query)

# THIS IS FOR TESTING - DELETE THIS
@app.post("/create_post2", status_code=200)
#async def post2(image_file: bytes = File()):
    #if not does_user_exist(username):
    #    raise HTTPException(status_code=400, detail=f"Rejecting post request because user does not exist")
async def post(image_file: UploadFile, username: str, caption: str):   


    image_file.filename = f"{uuid.uuid4()}.jpg"
    contents = await image_file.read() # FIX ME - read more about why I need await here
    with open(f"{IMAGE_DIR}{image_file.filename}", "wb") as f:
        f.write(contents)

    # Add the post to the database
    connection = engine.connect()
    metadata = db.MetaData()
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)

    get_image_endpoint = "/get_image"
    image_url = f"http://{SERVER_URL}{get_image_endpoint}?image_name={image_file.filename}"
    query = db.insert(post).values(user=username, date=time.time(), image_url=image_url, caption=caption)
    connection.execute(query)


def get_username_of_from_post_id(post_id: int):
    """ """
    
    connection = engine.connect()
    metadata = db.MetaData()
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)
    




@app.post("/comment", status_code=200)
def comment(post_id: int, commenter_username: str, text: str):
    """ Docstring here """
    # FIX ME - check the inputs
    
    # Insert a comment entry into the database
    connection = engine.connect()
    metadata = db.MetaData()
    comments = db.Table('comments', metadata, autoload=True, autoload_with=engine)
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)
    
    query1 = db.select([post.c.user]).where(post.c.id == post_id)
    results = connection.execute(query1).fetchall()
    poster_username = results[0][0]
    date = time.time()
    
    connection = engine.connect()
    metadata = db.MetaData()
    query2 = db.insert(comments).values(post_id=post_id, poster_username=poster_username, commenter_username=commenter_username, date=date, comment=text)
    connection.execute(query2)

@app.post("/follow", status_code=200)
def follow(follower_username: str, followee_username: str):
    """ """
    
    connection = engine.connect()
    metadata = db.MetaData()
    following = db.Table('following', metadata, autoload=True, autoload_with=engine)
    query = db.insert(following).values(follower=follower_username, followee=followee_username)
    connection.execute(query)

@app.post("/like", status_code=200)
def like(username: str, post_id: int):
    """ ... """
        
    connection = engine.connect()
    metadata = db.MetaData()
    likes = db.Table('likes', metadata, autoload=True, autoload_with=engine)
    query = db.insert(likes).values(post_id=post_id, liker_username=username, date=time.time())
    connection.execute(query) 
   
@app.post("/unlike", status_code=200)
def unlike(username: str, post_id: int):
    """ ... """

    connection = engine.connect()
    metadata = db.MetaData()
    likes = db.Table('likes', metadata, autoload=True, autoload_with=engine)
    query = db.delete(likes).where((likes.c.post_id == post_id))
    connection.execute(query)


@app.get("/get_all_users", status_code=200)
def get_all_users() -> List[User]:
    """ Get a list of all the users in the database
        
        Returns:
            List[User] - All the users in the database
    """

    try:
        connection = engine.connect()
        metadata = db.MetaData()
        user = db.Table('user', metadata, autoload=True, autoload_with=engine)
        following = db.Table('following', metadata, autoload=True, autoload_with=engine)

        query = db.select([user])
        users = [dict(user) for user in connection.execute(query).fetchall()]
        
        for user in users:
            followers = get_following(user["username"])
            user["followers"] = followers
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Failed to get a list of all the users: {e}")
    
    return users

@app.get("/get_users_avatar_url", status_code=200)
def get_users_avatar_url(username: str) -> str:
    """ Docstring here """

    connection = engine.connect()
    metadata = db.MetaData()
    
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)
    query = db.select([user.c.avatar_url]).where((user.c.username == username))
    
    results = connection.execute(query).fetchall()
    if results is None or len(results) == 0:
        raise HTTPException(status_code=400, detail=f"User does not exist") 
    
    return results[0][0]

def does_user_like_post(username: str, post_id: int) -> bool:
    """ ... """

    connection = engine.connect()
    metadata = db.MetaData()
    likes = db.Table('likes', metadata, autoload=True, autoload_with=engine)

    query = db.select([likes]).where((likes.c.post_id == post_id) & (likes.c.liker_username == username))
    results = connection.execute(query).fetchall()
    return len(results) > 0
    

def get_comments(post_id: int) -> List[Comment]:
    """ """
    
    connection = engine.connect()
    metadata = db.MetaData()    
    comments = db.Table('comments', metadata, autoload=True, autoload_with=engine)

    query = db.select([comments.c.id, comments.c.post_id, comments.c.poster_username, comments.c.commenter_username, comments.c.date, comments.c.comment]).where((comments.c.post_id == post_id))
    results = connection.execute(query).fetchall()
     
    comments = []
    for result in results:
        id, post_id, poster_username, commenter_username, date, text = result
        commenter_avatar_url = get_users_avatar_url(commenter_username)
        comments.append({"post_id": post_id, "poster_username": poster_username, "commenter_username": commenter_username, "commenter_avatar_url": commenter_avatar_url, "date": date, "text": text})

    return comments


@app.get("/get_posts_made_by_user", status_code=200)
def get_posts_made_by_user(viewee_username: str, viewer_username: str) -> List[PostView]:
    """ Get the posts made by the user with the given username
        
        Args:
            username (str) - username of finstagram user

        Returns:
            List[Post] - all the posts made by the user
    """
    
    connection = engine.connect()
    metadata = db.MetaData()
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)
    
    query = db.select([post.c.id, post.c.user, post.c.date, post.c.image_url, post.c.caption]).where((post.c.user == viewee_username))
    results = connection.execute(query).fetchall()
    
    post_views = []
    for result in results:
        post_id, poster_username, date, image_url, caption = result
        avatar_url = get_users_avatar_url(poster_username)
        liked = does_user_like_post(viewer_username, post_id)
        
        comments = get_comments(post_id) 
        post = {"post_id": post_id, "comments": comments, 'avatar_url': avatar_url, 'username': poster_username, 'date': date, 'image_url': image_url, 'caption': caption}
        post_view = {"post": post, "liked": liked} 
        post_views.append(post_view)

    return post_views


@app.get("/get_posts_by_id", status_code=200)
def get_posts_by_id(viewer_username: str, post_id: int) -> List[PostView]:
    """ 

        Args:
            username (str) - username of finstagram user

        Returns:
            List[Post] - all the posts made by the user
    """

    print(f"{viewer_username}, {post_id}")

    connection = engine.connect()
    metadata = db.MetaData()
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)

    query = db.select([post.c.id, post.c.user, post.c.date, post.c.image_url, post.c.caption]).where(post.c.id == post_id)
    result = connection.execute(query).fetchall()

    if len(result) == 0:
        raise Exception() 

    post_id, poster_username, date, image_url, caption = result[0]
    avatar_url = get_users_avatar_url(poster_username)
    liked = does_user_like_post(viewer_username, post_id)

    comments = get_comments(post_id)
    post = {"post_id": post_id, "comments": comments, 'avatar_url': avatar_url, 'username': poster_username, 'date': date, 'image_url': image_url, 'caption': caption}
    post_view = {"post": post, "liked": liked}

    return post_view



@app.get("/following", status_code=200)
def get_following(username: str) -> List[str]:
    """ Get a list of usernames of people who follow the given user"""
    
    connection = engine.connect()
    metadata = db.MetaData()
    following = db.Table('following', metadata, autoload=True, autoload_with=engine)
    
    query = db.select([following.c.follower]).where((following.c.followee == username))
    results = connection.execute(query).fetchall()
    return [result[0] for result in results]

@app.get("/followee", status_code=200)
def get_followees(username: str) -> List[str]:
    """ Get a list of usernames of people who the given user follows"""

    connection = engine.connect()
    metadata = db.MetaData()
    following = db.Table('following', metadata, autoload=True, autoload_with=engine)

    query = db.select([following.c.followee]).where((following.c.follower == username))
    results = connection.execute(query).fetchall()
    return [result[0] for result in results]

    
@app.get("/get_followed_posts", status_code=200)
def get_followed_posts(username: str) -> List[PostView]:
    """ 
        Args:
            username (str) - username of finstagram user

        Returns:
            List[PostViews] - all the posts from the users that the use follows
    """

    connection = engine.connect()
    metadata = db.MetaData()
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)
    
    following_usernames = get_followees(username)
    query = db.select([post.c.id, post.c.user, post.c.date, post.c.image_url, post.c.caption]).where((post.c.user.in_(following_usernames)))
    results = connection.execute(query).fetchall()

    post_views = []
    for result in results:
        post_id, poster_username, date, image_url, caption = result
        avatar_url = get_users_avatar_url(poster_username)
        
        liked = does_user_like_post(username, post_id)
        comments = get_comments(post_id)
        
        post = {"post_id": post_id, "comments": comments, 'avatar_url': avatar_url, 'username': poster_username, 'date': date, 'image_url': image_url, 'caption': caption}
        post_view = {"post": post, "liked": liked}
        post_views.append(post_view)

    return sorted(post_views, key = lambda post_view: post_view['post']['date'], reverse=True)
    


@app.get("/get_user", status_code=200)
def get_user(username: str) -> User:
    """ """

    connection = engine.connect()
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)

    query = db.select([user.c.username, user.c.password, user.c.avatar_url]).where(user.c.username == username)
    results = [dict(result) for result in connection.execute(query).fetchall()]
    
    if len(results) == 0:
        raise HTTPException(status_code=500, detail=f"User does not exist")

    for result in results:
        username = result["username"]
        result["followers"] = get_following(username)
        result["followees"] = get_followees(username)
    return results[0]

    

@app.get("/get_image", status_code=200)
def get_image(image_name: str):
    
    # FIX ME - check if the file exists
    file_path = f"{IMAGE_DIR}{image_name}"
    return FileResponse(file_path)

@app.post("/delete_post")
def delete_post(post_id: int):
    """ Delete the post with the given post_id """ 

    connection = engine.connect()
    metadata = db.MetaData()
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)
    query = db.delete(post).where((post.c.id == post_id))
    connection.execute(query)
     

@app.get("/get_all_comments", status_code=200)
def get_all_comments():
    
    connection = engine.connect()
    metadata = db.MetaData()
    comments = db.Table('comments', metadata, autoload=True, autoload_with=engine)

    query = db.select([comments.c.id, comments.c.poster_username, comments.c.commenter_username, comments.c.date, comments.c.comment])
    results = connection.execute(query).fetchall()
    
    return results
    
    

    
