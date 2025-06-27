docker build -t executor-python -f Dockerfile.python .
docker build -t executor-nodejs -f Dockerfile.nodejs .
# Add more for other languages (e.g., executor-java, executor-go)