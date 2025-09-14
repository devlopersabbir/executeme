## delete all containers including its volumes use
docker stop $(docker ps -a -q) # stop all container

docker rm -vf $(docker ps -aq) # rm all container

## delete all the images
docker rmi -f $(docker images -aq) 

## create container with new force command
docker compose --profile prod up --force-recreate