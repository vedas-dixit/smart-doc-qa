MAX_CONTEXT_CHARS = 12000

chat_history = []

def add_to_history(user_msg: str, assistant_msg: str):
    """
    Add user and assistant messages, then trim history to fit max context size.
    """
    global chat_history
    chat_history.append({"role": "user", "content": user_msg})
    chat_history.append({"role": "assistant", "content": assistant_msg})
    _trim_history()


def _trim_history():
    """
    Trim old messages until the full context string fits in MAX_CONTEXT_CHARS.
    """
    global chat_history
    while len(get_context()) > MAX_CONTEXT_CHARS and len(chat_history) > 2:
        chat_history = chat_history[2:]  # remove oldest user+assistant pair


def get_context() -> str:
    """
    Return formatted string from current chat history.
    """
    return "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in chat_history])


def reset_history():
    """
    Reset the in-memory chat history.
    """
    global chat_history
    chat_history = []
