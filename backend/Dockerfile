FROM python:3.10-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Pip upgrade
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# 1. Pehle requirements copy karein
COPY requirements.txt .

# 2. Torch install karein (CPU version)
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# 3. Baaki requirements install karein
RUN pip install --no-cache-dir -r requirements.txt

# 4. Ab poora code copy karein (Ye caching ke liye best hai)
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]