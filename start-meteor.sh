echo kickme.15 | sudo -S /etc/init.d/mongodb start

export MONGO_URL='mongodb://localhost:27017/t3-open'
meteor
