# Install dependencies for the backend

#sudo apt update
#sudo apt install -y npm
#sudo npm -g install create-react-app

#sudo apt install -y docker
#sudo apt install -y docker-compose
#sudo apt install -y postgresql postgresql-contrib
#sudo systemctl start postgresql.service

#sudo apt install -y software-properties-common
#sudo add-apt-repository ppa:deadsnakes/ppa
#sudo apt install -y python3.9
#sudo apt install -y python3.9-venv

path_to_server=../backend/server

python3.9 -m venv ${path_to_server}/venv
source ${path_to_server}/venv/bin/activate
python3.9 -m pip install -r ${path_to_server}/requirements.txt


