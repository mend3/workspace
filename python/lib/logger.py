import logging
import sys

logger = logging.getLogger("ai-context")
logger.setLevel(logging.INFO)
formatter = logging.Formatter(
    "[%(asctime)s] %(levelname)s - %(name)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
)

# Console handler (stdout)
ch = logging.StreamHandler(sys.stdout)
ch.setFormatter(formatter)
logger.addHandler(ch)

# Avoid duplicate logs
logger.propagate = False
