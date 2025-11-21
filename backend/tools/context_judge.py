from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

import json
llm = ChatOllama(base_url="http://host.docker.internal:11434",model="gpt-oss:120b-cloud")

import os


base_dir = os.path.dirname(os.path.dirname(__file__))  # backend root
prompt_path = os.path.join(base_dir, "prompts", "context_judge_prompt.txt")


def build_context_presence_tool():
    """
    Checks if context is present in user input
    Flow: First tool invoked by agent for every query.  If 'no', calls web_search_tool.
    """
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_text = f.read()

    prompt = ChatPromptTemplate.from_template(prompt_text)

    # Build the chain
    chain = prompt | llm | StrOutputParser()
    
    @tool
    def context_presence_judge(query: str):
        """
        Checks if context is present in user input
        """
        print("Building Context Presence Judge Tool.......................")

        result = chain.invoke({"input": query})
        return json.dumps({
        "action": "ContextPresenceJudge",
        "action_input": result
            })

    context_presence_judge.name = "ContextPresenceJudge"
    context_presence_judge.description = "Checks if context is present in user input. context_provided context_missing Only if 'context_missing', call web_search_tool."

    return context_presence_judge