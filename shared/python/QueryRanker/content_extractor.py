import trafilatura
import requests
from typing import Optional
import time

class ContentExtractor:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def extract_content(self, url: str) -> Optional[str]:
        """
        Extract clean text content from a URL using trafilatura.
        Returns the main text content of the website.
        """
        try:
            # Fetch the content using trafilatura's fetch_url
            downloaded = trafilatura.fetch_url(url)
            
            if not downloaded:
                # Fallback to requests if trafilatura fetch fails
                response = requests.get(url, headers=self.headers, timeout=10)
                response.raise_for_status()
                downloaded = response.text
            
            # Extract text content
            text = trafilatura.extract(downloaded, include_comments=False, include_tables=True)
            
            if text and len(text.strip()) > 100:  # Ensure we have substantial content
                return text.strip()
            
            return None
            
        except Exception as e:
            print(f"Error extracting content from {url}: {str(e)}")
            return None
    
    def extract_content_with_metadata(self, url: str) -> Optional[dict]:
        """
        Extract content with metadata using trafilatura.
        """
        try:
            downloaded = trafilatura.fetch_url(url)
            
            if not downloaded:
                response = requests.get(url, headers=self.headers, timeout=10)
                response.raise_for_status()
                downloaded = response.text
            
            # Extract with metadata
            result = trafilatura.extract(
                downloaded, 
                include_comments=False, 
                include_tables=True,
                output_format='json'
            )
            
            if result:
                import json
                return json.loads(result)
            
            return None
            
        except Exception as e:
            print(f"Error extracting content with metadata from {url}: {str(e)}")
            return None
    
    def clean_content(self, content: str) -> str:
        """
        Clean and normalize extracted content.
        """
        if not content:
            return ""
        
        # Remove excessive whitespace
        lines = [line.strip() for line in content.split('\n')]
        lines = [line for line in lines if line]  # Remove empty lines
        
        # Join lines with single newlines
        cleaned_content = '\n'.join(lines)
        
        # Limit content length for processing efficiency
        max_length = 5000
        if len(cleaned_content) > max_length:
            cleaned_content = cleaned_content[:max_length] + "..."
        
        return cleaned_content
    
    def extract_and_clean(self, url: str) -> Optional[str]:
        """
        Extract and clean content from a URL.
        """
        raw_content = self.extract_content(url)
        if raw_content:
            return self.clean_content(raw_content)
        return None
