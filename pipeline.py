from agents import (
    build_search_agent,
    build_reader_agent,
    writer_chain,
    critic_chain
)


def run_research_pipeline(topic: str) -> dict:

    state = {}

    # =========================
    # STEP 1 - SEARCH AGENT
    # =========================

    print("\n" + "=" * 50)
    print("STEP 1 - Search Agent Working...")
    print("=" * 50)

    search_agent = build_search_agent()

    search_result = search_agent.invoke({
        "messages": [
            (
                "user",
                f"Find recent, reliable and detailed information about: {topic}"
            )
        ]
    })

    # =========================
    # CLEAN SEARCH RESULTS
    # =========================

    raw_content = search_result["messages"][-1].content

    if isinstance(raw_content, list):

        cleaned_text = ""

        for item in raw_content:

            if isinstance(item, dict):

                if item.get("type") == "text":

                    cleaned_text += (
                        item.get("text", "") + "\n"
                    )

    else:

        cleaned_text = str(raw_content)

    state["search_results"] = cleaned_text

    print("\nSearch Results:\n")
    print(state["search_results"])

    # =========================
    # STEP 2 - READER AGENT
    # =========================

    print("\n" + "=" * 50)
    print("STEP 2 - Reader Agent Working...")
    print("=" * 50)

    reader_agent = build_reader_agent()

    reader_result = reader_agent.invoke({
        "messages": [
            (
                "user",
                f"""
                Based on the following search results,
                pick the best URL and scrape it.

                Search Results:
                {state["search_results"]}
                """
            )
        ]
    })

    raw_scrape = reader_result["messages"][-1].content

    if isinstance(raw_scrape, list):

        cleaned_scrape = ""

        for item in raw_scrape:

            if isinstance(item, dict):

                if item.get("type") == "text":

                    cleaned_scrape += (
                        item.get("text", "") + "\n"
                    )

    else:

        cleaned_scrape = str(raw_scrape)

    state["scraped_content"] = cleaned_scrape

    print("\nScraped Content:\n")
    print(state["scraped_content"])

    # =========================
    # STEP 3 - WRITER AGENT
    # =========================

    print("\n" + "=" * 50)
    print("STEP 3 - Writer Agent Working...")
    print("=" * 50)

    combined_research = f"""

SEARCH RESULTS:
{state["search_results"]}

SCRAPED CONTENT:
{state["scraped_content"]}

"""

    state["report"] = writer_chain.invoke({
        "topic": topic,
        "research": combined_research
    })

    print("\nFinal Report:\n")
    print(state["report"])

    # =========================
    # STEP 4 - CRITIC AGENT
    # =========================

    print("\n" + "=" * 50)
    print("STEP 4 - Critic Agent Working...")
    print("=" * 50)

    state["feedback"] = critic_chain.invoke({
        "report": state["report"]
    })

    print("\nCritic Feedback:\n")
    print(state["feedback"])

    # =========================
    # RETURN FINAL STATE
    # =========================

    return {
        "search_results": str(state["search_results"]),
        "scraped_content": str(state["scraped_content"]),
        "report": str(state["report"]),
        "feedback": str(state["feedback"])
    }


# =========================
# LOCAL TESTING
# =========================

if __name__ == "__main__":

    topic = input("\nEnter a research topic: ")

    result = run_research_pipeline(topic)

    print("\n")
    print("=" * 50)
    print("PIPELINE FINISHED")
    print("=" * 50)

    print("\nFINAL OUTPUT:\n")

    print(result)