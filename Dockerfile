
  FROM python:3.12-alpine
  WORKDIR /app
  COPY main.py .
  RUN chmod -x main.py
  CMD ["python", "main.py"]
  