import logging
import logging.handlers
from pythonjsonlogger import jsonlogger

logger = logging.getLogger("ai-context")
logger.setLevel(logging.INFO)

tcp_handler = logging.handlers.SocketHandler(
    'logstash', 5000)  # Hostname and port of Logstash

# Use JSON formatting
formatter = jsonlogger.JsonFormatter(
    '%(asctime) %(levelname) %(name) %(message)')
tcp_handler.setFormatter(formatter)

logger.addHandler(tcp_handler)
logger.propagate = False
