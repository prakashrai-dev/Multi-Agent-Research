# Multi-Agent AI Research System

An AI-powered multi-agent research application built using LangChain, FastAPI, React, and Mistral AI.

The system performs:
- Web research
- Content scraping
- AI-generated report writing
- Research criticism and feedback

The application uses multiple AI agents working together in a pipeline-based workflow.

---

# Live Demo

Frontend:
https://multi-agent-research-one.vercel.app

Backend:
(https://multi-agent-research-backend.onrender.com/docs)

---

# Features

- Multi-agent workflow
- Web search using Tavily API
- URL scraping with BeautifulSoup
- AI report generation
- Critic/reviewer agent
- Dark / Light mode
- Persistent research history
- Markdown rendering
- FastAPI backend
- Responsive React frontend

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios

## Backend
- FastAPI
- LangChain
- LangGraph
- Mistral AI
- Tavily API
- BeautifulSoup

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

# Architecture

User Input
↓
Search Agent
↓
Reader Agent
↓
Writer Agent
↓
Critic Agent
↓
Final Research Report

---

# Installation

## Clone Repository

```bash
git clone https://github.com/prakashrai-dev/Multi-Agent-Research.git
cd Multi-Agent-Research
```

---

# Backend Setup

## Create Virtual Environment

```bash
python -m venv .venv
```

## Activate Environment

### Windows

```bash
.venv\Scripts\activate
```

### Mac/Linux

```bash
source .venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Add Environment Variables

Create `.env`

```env
TAVILY_API_KEY=your_key
MISTRAL_API_KEY=your_key
```

## Start Backend

```bash
uvicorn main:app --reload
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Future Improvements

- Authentication system
- Research export options
- Database integration
- Streaming responses
- Multi-model support
- Research bookmarking

---

# Author

Prakash Rai
