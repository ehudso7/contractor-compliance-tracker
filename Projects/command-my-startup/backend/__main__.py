from fastapi import FastAPI
from routes import stripe

app = FastAPI()
app.include_router(stripe.router, prefix="/api")

