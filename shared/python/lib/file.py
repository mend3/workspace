from abc import ABC, abstractmethod
import os
from typing import Callable, Optional


class FileHandler(ABC):
    @abstractmethod
    def read(
        self, file_path: str, callback: Optional[Callable[[str, int], None]] = None
    ):
        pass

    @abstractmethod
    def write(self, context: str, filename: str):
        pass


class UTF8FileHandler(FileHandler):
    def read(
        self, file_path: str, callback: Optional[Callable[[str, int], None]] = None
    ):
        """
        Read the entire file content if no callback is provided.
        If a callback is given, call it for each line (line content, line number).
        """
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                if callback is None:
                    return f.read()
                else:
                    for index, line in enumerate(f):
                        callback(line.rstrip("\n"), index)
        except Exception as e:
            raise IOError(f"Error reading {file_path}: {e}")

    def write(self, context: str, filename: str):
        """Save the content to a file."""
        try:
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            with open(filename, "w", encoding="utf-8") as f:
                f.write(context)
            print(f"Content saved to {filename}")
        except Exception as e:
            raise IOError(f"Error saving {filename}: {e}")
