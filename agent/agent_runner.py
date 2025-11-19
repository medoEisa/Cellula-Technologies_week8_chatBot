import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langchain_ollama import ChatOllama
from langchain_classic.agents import initialize_agent, AgentType
from tools.context_judge import build_context_presence_tool
from tools.web_search_tool import build_web_search_tool

context_judge_tool = build_context_presence_tool()
web_search_tool = build_web_search_tool(top_n=3)


tools = [context_judge_tool, web_search_tool]

# Initialize REACT Agent
agent = initialize_agent(
    tools,
    llm=ChatOllama(model="gpt-oss:120b-cloud"),  
    agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    verbose=True
)

# if __name__ == "__main__":
#     test_query = "Tell me about the latest breakthroughs in quantum computing 2024."

#     print("=== Running autonomous REACT agent ===\n")
#     result = agent.run({"input":test_query, "chat_history":[]})

#     # The output might include reasoning and final result
#     print("\n=== Agent Final Output ===")
#     print(result)