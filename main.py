from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pipeline import run_research_pipeline

app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.post("/research")
def research(data: ResearchRequest):

    try:

        result = run_research_pipeline(data.topic)

        return {
            "search_results": str(result["search_results"]),
            "scraped_content": str(result["scraped_content"]),
            "report": str(result["report"]),
            "feedback": str(result["feedback"])
        }

    except Exception as e:

        return {
            "error": str(e)
        }