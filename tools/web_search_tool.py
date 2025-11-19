import os
from tavily import TavilyClient
from langchain_core.tools import tool
import json
import dotenv
from bs4 import BeautifulSoup
import requests
dotenv.load_dotenv()

def scrape_url(url, max_chars=2500):
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")
        paragraphs = soup.find_all("p")
        text = " ".join(p.get_text() for p in paragraphs)
        return text[:max_chars] if text else "No content found"
    except Exception as e:
        return f"Error scraping {url}: {e}"

def build_web_search_tool(top_n: int = 5):
    """
    Tavily search + scrape tool. Retrieves top N search results,
    scrapes the pages, optionally summarizes with LLM.
    """
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise ValueError("TAVILY_API_KEY is not set in environment")

    client = TavilyClient(api_key=api_key)

    @tool
    def web_search(query: str):
        """" Search Tavily, scrape top N URLs for full content"""
        response = client.search(query, include_raw_content=True)
        results = response.get("results", [])
        if not results:
            return "No results found."

        top_results = results[:top_n]
        aggregated_text = ""

        for i, r in enumerate(top_results):
            title = r.get("title", "No title")
            url = r.get("url", "")
            content_snippet = r.get("content", "")  
            scraped_content = scrape_url(url)  
            aggregated_text += (
                f"Result {i+1}:\nTitle: {title}\n"
                f"Tavily snippet: {content_snippet}\nScraped content: {scraped_content}\n\n"
            )

        return json.dumps({
        "action": "webSearchScrapeTool",
        "action_input": aggregated_text
        })

    web_search.name = "web_search"
    web_search.description = "Searches the web to retrieve missing context , to retrieve relevant information"
    

    return web_search



# if __name__ == "__main__":
#     search_tool = build_web_search_tool(top_n=5)
#     query = "Latest advancements in AI technology"
#     result = search_tool.invoke(query)
#     print(result)
