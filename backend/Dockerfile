# backend/Dockerfile

FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create and set working directory
WORKDIR /app

# Copy requirements.txt first to leverage Docker caching
COPY requirements.txt /app/

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of the code
COPY . /app/

# Expose the port Django will run on
EXPOSE 8000

# Default command to run the server
# Note: You can also run migrations here or do it in docker-compose
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
