from abc import ABC, abstractmethod
import os


class DirectoryScanner(ABC):
    @abstractmethod
    def scan(self, directory: str) -> list:
        pass


class OsScandirDirectoryScanner(DirectoryScanner):
    def scan(self, directory: str) -> list:
        try:
            return list(os.scandir(directory))
        except Exception as e:
            raise IOError(f"Error scanning directory {directory}: {e}")
