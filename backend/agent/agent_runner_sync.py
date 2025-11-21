import os
import sys
import logging

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langchain_ollama import ChatOllama
from langchain_classic.agents import initialize_agent, AgentType
from langchain_classic.memory import ConversationBufferMemory

from tools.context_judge import build_context_presence_tool
from tools.web_search_tool import build_web_search_tool
from tools.context_relevance_tool import build_context_relevance_tool
from tools.context_splitter import build_context_splitter_tool
from langchain_core.prompts import ChatPromptTemplate


System_prompt = """"
Your name is Cellula chatbot 
Your task is to **design four specific tools** for an AI agent workflow that processes user questions with context awareness. 

Follow these instructions **strictly**:

---

### Tools to Build

1. **Context Presence Judge**
   - Function: `context_presence_judge(query: str)`
   - Purpose: Determine if the user input contains sufficient context for answering the question.
   - Behavior: First tool to invoke. If context is missing, the workflow should call the Web Search Tool next.
   - Input: raw user query (string)
   - Output: JSON with keys `action` and `action_input` (values: `context_provided` or `context_missing`)

2. **Web Search Tool**
   - Function: `web_search(query: str)`
   - Purpose: Perform a web search using an API (e.g., Tavily), scrape the resulting pages, remove boilerplate, deduplicate text, and return high-quality context.
   - Input: user query (string)
   - Output: JSON array of search results with `title`, `url`, `summary`, `scraped_title`, `scraped_text`, and metadata.
   - Note: Always follow up with Context Relevance Tool after using this tool.

3. **Context Relevance Checker**
   - Function: `context_relevance_checker(input_json: str)`
   - Purpose: Evaluate whether the context retrieved (or provided) is relevant to the user question.
   - Input: JSON string containing `"question"` and `"context"`
   - Output: JSON with `action_input` either `"relevant"` or `"irrelevant"`.

4. **Context Splitter**
   - Function: `context_splitter(user_input: str)`
   - Purpose: Separate background context from the actual question in complex user inputs.
   - Input: full user input string
   - Output: JSON with keys `background_context` and `actual_question`.

---

### Instructions for Code Generation

1. Use **LangChain Core tools** (`@tool`) and **ChatOllama** for all NLP tasks.
2. Use `ChatPromptTemplate` for prompts loaded from `.txt` files (paths like `prompts/context_judge_prompt.txt`).
3. Use `StrOutputParser()` to parse model outputs.
4. Use **JSON** consistently for all tool outputs in the format:
   ```json
   {
       "action": "ToolName",
       "action_input": "..."
   }

"""


# Logging setup 
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#  Build tools 
context_judge_tool = build_context_presence_tool()
web_search_tool = build_web_search_tool(max_results=3)
context_relevance_checker_tool = build_context_relevance_tool()
context_splitter_tool = build_context_splitter_tool()

tools = [
    context_judge_tool,
    web_search_tool,
    context_relevance_checker_tool,
    context_splitter_tool,
]

llm = ChatOllama(
    base_url="http://host.docker.internal:11434",
    model="gpt-oss:120b-cloud",
    system_prompt=System_prompt
)


memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
prompt = ChatPromptTemplate.from_template(System_prompt)
# Initialize REACT Agent 
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

logger.info("Agent initialized with tools and memory.")
