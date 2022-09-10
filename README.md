# Yet Another Photo Sharing App
This is a fun imitation of Instagram. It uses a Dockerized database, a set of FastAPI endpoints, and a React Frontend. 

# Results
[![Browsing the Site](https://img.youtube.com/vi/_cUX_eYc3fk/0.jpg)](https://www.youtube.com/watch?v=_cUX_eYc3fk)


# Running the App
## Start the Backend
```cd backend/database && docker-compose up && cd ../server/source && venv/bin/activate && uvicorn main:app --reload```

## Start the Frontend
```cd frontend/finstagram && npm start```
