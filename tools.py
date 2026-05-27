from langchain.tools import tool

import requests

from bs4 import BeautifulSoup

from tavily import TavilyClient

import os

from dotenv import load_dotenv

from rich import print


# =========================
# LOAD ENV VARIABLES
# =========================

load_dotenv()

# =========================
# TAVILY CLIENT
# =========================

tavily = TavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
)

# =========================
# WEB SEARCH TOOL
# =========================

@tool
def web_search(query: str) -> str:
    """
    Search the web for recent and reliable information.

    Returns:
    - Titles
    - URLs
    - Snippets
    """

    try:

        results = tavily.search(
            query=query,
            max_results=5
        )

        out = []

        for r in results["results"]:

            out.append(

                f"""
Title: {r['title']}

URL: {r['url']}

Snippet:
{r['content'][:300]}
"""

            )

        return "\n-------------------\n".join(out)

    except Exception as e:

        return f"Web search failed: {str(e)}"


# =========================
# SCRAPER TOOL
# =========================

@tool
def scrape_url(url: str) -> str:
    """
    Scrape and return clean readable text
    from a webpage.
    """

    try:

        response = requests.get(

            url,

            timeout=3,

            headers={
                "User-Agent": "Mozilla/5.0"
            }

        )

        # Raise error for bad status codes
        response.raise_for_status()

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        # Remove unnecessary tags
        for tag in soup([
            "script",
            "style",
            "nav",
            "footer",
            "header",
            "aside"
        ]):

            tag.decompose()

        text = soup.get_text(
            separator=" ",
            strip=True
        )

        # Clean large spaces
        cleaned_text = " ".join(
            text.split()
        )

        return cleaned_text[:3000]

    except Exception as e:

        return f"Could not scrape URL: {str(e)}"