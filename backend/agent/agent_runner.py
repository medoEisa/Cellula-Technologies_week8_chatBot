import asyncio
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agent.agent_runner_sync import agent,memory
import logging

# Logging setup 
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_agent(query: str, chat_history=None) -> str:
    """
    Run the synchronous REACT agent asynchronously.
    
    :param query: User question
    :param chat_history: Optional previous chat history
    :return: Agent response
    """
    chat_history = chat_history or []
    
    logger.info(f"Running agent for query: {query}")
    
    # Run synchronous agent in a separate thread
    result = await asyncio.to_thread(agent.run, {"input": query, "chat_history": chat_history})
    
    logger.info("Agent finished processing.")
    return result