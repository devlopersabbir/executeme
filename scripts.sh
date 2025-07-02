## delete all containers including its volumes use
docker rm -vf $(docker ps -aq)

## delete all the images
docker rmi -f $(docker images -aq)

## create container with new force command
docker compose up --force-recreate