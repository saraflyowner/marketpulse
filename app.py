import os
import time
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="MarketPulseCore", version="1.0.0")

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "MarketPulseCore",
        "timestamp": int(time.time())
    }

@app.get("/health")
def health():
    return JSONResponse(
        content={"health": "green"},
        status_code=200
    )

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8080))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
