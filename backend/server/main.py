from typing import List
from fastapi import FastAPI, HTTPException, File, Form, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy as db
from sqlalchemy import ForeignKey, Integer, String, Time
from sqlalchemy.sql import func
from ServerConfig import IMAGE_DIR, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, SERVER_URL
import time
from Post import Post
from User import User
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
      db.Column('id', String, primary_key=True),
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
      db.Column('date', Time),
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

    comments = db.Table(
      'comments', metadata,
      db.Column('id', String, primary_key=True),
      db.Column('poster_username', String, ForeignKey(user.c.username)),
      db.Column('commenter_username', String, ForeignKey(user.c.username)),
      db.Column('date', Time),
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
      db.Column('id', String, primary_key=True),
      db.Column('post_id', Integer, ForeignKey(post.c.id)),
      db.Column('liker_username', String, ForeignKey(user.c.username)),
      db.Column('date', Time),
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
async def post(username: str, caption: str, image_file: UploadFile):
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
    query = db.insert(post).values(user=username, date=func.now(), image_url=image_url, caption=caption)
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
        query = db.select([user])
        users = connection.execute(query).fetchall()
    except Exception as e:
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

     

@app.get("/get_posts_made_by_user", status_code=200)
def get_posts_made_by_user(username: str) -> List[Post]:
    """ Get the posts made by the user with the given username
        
        Args:
            username (str) - username of finstagram user

        Returns:
            List[Post] - all the posts made by the user
    """
    
    connection = engine.connect()
    metadata = db.MetaData()
    post = db.Table('post', metadata, autoload=True, autoload_with=engine)
    
    query = db.select([post.c.user, post.c.date, post.c.image_url, post.c.caption]).where((post.c.user == username))
    results = connection.execute(query).fetchall()
    
    posts = []
    for result in results:
        poster_username, date, image_url, caption = result
        avatar_url = get_users_avatar_url(poster_username)
        
        post_content = {'avatar_url': avatar_url, 'username': poster_username, 'date': date, 'image_url': image_url, 'caption': caption}
        posts.append(post_content)

    return posts


@app.get("/get_image", status_code=200)
def get_image(image_name: str):
    
    # FIX ME - check if the file exists
    file_path = f"{IMAGE_DIR}{image_name}"
    return FileResponse(file_path)


     
    
    

    
