# Quantum AI Assistant

This project is a LangChain-based autonomous AI agent that:
- Checks if user input has sufficient context.
- Performs web searches using Tavily for missing information.
- Summarizes and outputs concise, structured responses.

## Features
- REACT agent reasoning with `ContextPresenceJudge` and `web_search_tool`.
- Scrapes top N search results for additional context.
- Fully autonomous tool selection.
- Optional persistent memory with `CHAT_CONVERSATIONAL_REACT_DESCRIPTION`.

## Installation
```bash
git clone https://github.com/medoEisa/cellula_week6_chatbot_LangChain-based-autonomous.git
cd cellula_week6_chatbot_LangChain-based-autonomous
pip install -r requirements.txt