FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY ./src ./src
# COPY ./utils ./utils

# Set working directory to src where main.py is located
WORKDIR /app/src

# Expose port
EXPOSE 8000

# Use exec form and add reload for development
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]