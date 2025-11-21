import json
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(base_url="http://host.docker.internal:11434",model="gpt-oss:120b-cloud")
import os

base_dir = os.path.dirname(os.path.dirname(__file__))  # backend root
prompt_path = os.path.join(base_dir, "prompts", "context_splitter_prompt.txt")

def build_context_splitter_tool():
    """
    Tool 4: Context Splitter
    Purpose: Separate background context from the actual question
    """

    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_text = f.read()

    prompt = ChatPromptTemplate.from_template(prompt_text)

    chain = prompt | llm | StrOutputParser()

    @tool
    def context_splitter(user_input: str):
        """
        Splits input into background context and actual question.
        Returns JSON with keys: background_context, actual_question
        """
        print("---------------------------ContextSplitter received input :", user_input)
        result = chain.invoke({"input": user_input})
        try:
            parsed = json.loads(result)
        except json.JSONDecodeError:
            parsed = {"background_context": "", "actual_question": ""}
        
        return json.dumps({
            "action": "ContextSplitter",
            "action_input": parsed
        })

    context_splitter.name = "ContextSplitter"
    context_splitter.description = "Separates the user input into two parts: background context and the actual question. Use this tool whenever the input contains extra information or explanation, so the agent can reason over the context and answer the question accurately."

    return context_splitter


