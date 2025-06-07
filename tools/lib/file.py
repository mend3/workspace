from abc import ABC, abstractmethod
import os


class FileHandler(ABC):
    @abstractmethod
    def read(self, file_path: str) -> str:
        pass

    @abstractmethod
    def write(self, context: str, filename: str) -> str:
        pass


class UTF8FileHandler(FileHandler):
    def read(self, file_path: str) -> str:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            raise IOError(f"Error reading {file_path}: {e}")

    def write(self, context: str, filename: str) -> None:
        """Save the content to a file."""
        try:
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            with open(filename, "w", encoding="utf-8") as f:
                f.write(context)
            print(f"Content saved to {filename}")
        except Exception as e:
            raise IOError(f"Error saving {filename}: {e}")
