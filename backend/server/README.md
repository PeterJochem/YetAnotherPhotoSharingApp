# How to Start the Server 
```
source venv/bin/activate
uvicorn main:app --reload
```

# Dependencies
## Install Python3.9
```
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.9
sudo apt install python3.9-venv
```

## Create virtual environment
```
python3.9 -m venv ./venv
```

## Install Python dependencies into virtual environment
```
python3.9 -m pip install -r requirements.txt
```

## Configure Uvicorn to use the venv
```
flit install --deps develop --symlink
```
