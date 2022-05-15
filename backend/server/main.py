from typing import Union
from fastapi import FastAPI
import sqlalchemy as db
from DBConfig import db_username, db_password, db_host, db_name

app = FastAPI()

@app.get("/")
def read_root():
    """Docstring here"""

    engine = db.create_engine(f"postgresql+pg8000://{db_username}:{db_password}@{db_host}/{db_name}")
    print(f"mysql+mysqlclient://{db_username}:{db_password}@{db_host}/{db_name}")

    connection = engine.connect()
   
    metadata = db.MetaData()
    user = db.Table('user', metadata, autoload=True, autoload_with=engine)
    query = db.insert(user).values(username="pepepepepe" , avatar_url="hfhfhospp") 
    ResultProxy = connection.execute(query)



    
    query = db.select([user]) 
    
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()
    print(ResultSet)


    

    
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
