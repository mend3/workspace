import requests
from bs4 import BeautifulSoup, Tag
import urllib.parse
import time
import random
from typing import List, Dict, Optional, Union

class SearchEngine:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.search_engines = [
            {
                'name': 'DuckDuckGo',
                'url': 'https://html.duckduckgo.com/html/?q=',
                'parser': self._parse_duckduckgo
            },
            {
                'name': 'Bing',
                'url': 'https://www.bing.com/search?q=',
                'parser': self._parse_bing
            },
            {
                'name': 'Yahoo',
                'url': 'https://search.yahoo.com/search?p=',
                'parser': self._parse_yahoo
            }
        ]
    
    def search_multiple_sources(self, query: str, max_results_per_source: int = 5, num_sources: int = 3) -> List[Dict]:
        """Search across multiple search engines and aggregate results."""
        all_results = []
        seen_urls = set()
        
        # Use up to num_sources search engines
        engines_to_use = self.search_engines[:num_sources]
        
        for engine in engines_to_use:
            try:
                results = self._search_engine(query, engine, max_results_per_source)
                
                # Filter out duplicate URLs
                for result in results:
                    if result['url'] not in seen_urls:
                        seen_urls.add(result['url'])
                        all_results.append(result)
                
                # Add delay to be respectful
                time.sleep(random.uniform(1, 2))
                
            except Exception as e:
                print(f"Error searching {engine['name']}: {str(e)}")
                continue
        
        return all_results
    
    def _search_engine(self, query: str, engine: Dict, max_results: int) -> List[Dict]:
        """Search a specific search engine."""
        encoded_query = urllib.parse.quote_plus(query)
        search_url = engine['url'] + encoded_query
        
        try:
            response = requests.get(search_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            results = engine['parser'](soup, max_results)
            
            # Add source information
            for result in results:
                result['source'] = engine['name']
            
            return results
            
        except Exception as e:
            print(f"Error fetching from {engine['name']}: {str(e)}")
            return []
    
    def _parse_duckduckgo(self, soup: BeautifulSoup, max_results: int) -> List[Dict]:
        """Parse DuckDuckGo search results."""
        results = []
        
        # Look for result containers
        result_containers = soup.find_all('div', class_='result')
        
        for container in result_containers[:max_results]:
            if not isinstance(container, Tag):
                continue
            try:
                # Extract title and URL
                title_elem = container.find('a', class_='result__a')
                if not title_elem or not isinstance(title_elem, Tag):
                    continue
                
                title = title_elem.get_text(strip=True)
                url = str(title_elem.get('href', ''))
                
                # Extract snippet
                snippet_elem = container.find('a', class_='result__snippet')
                snippet = snippet_elem.get_text(strip=True) if snippet_elem and isinstance(snippet_elem, Tag) else ""
                
                if title and url:
                    results.append({
                        'title': title,
                        'url': url,
                        'snippet': snippet
                    })
            
            except Exception as e:
                continue
        
        return results
    
    def _parse_bing(self, soup: BeautifulSoup, max_results: int) -> List[Dict]:
        """Parse Bing search results."""
        results = []
        
        # Look for result containers
        result_containers = soup.find_all('li', class_='b_algo')
        
        for container in result_containers[:max_results]:
            if not isinstance(container, Tag):
                continue
            try:
                # Extract title and URL
                title_elem = container.find('h2')
                if not title_elem or not isinstance(title_elem, Tag):
                    continue
                
                link_elem = title_elem.find('a')
                if not link_elem or not isinstance(link_elem, Tag):
                    continue
                
                title = link_elem.get_text(strip=True)
                url = str(link_elem.get('href', ''))
                
                # Extract snippet
                snippet_elem = container.find('p')
                snippet = snippet_elem.get_text(strip=True) if snippet_elem and isinstance(snippet_elem, Tag) else ""
                
                if title and url:
                    results.append({
                        'title': title,
                        'url': url,
                        'snippet': snippet
                    })
            
            except Exception as e:
                continue
        
        return results
    
    def _parse_yahoo(self, soup: BeautifulSoup, max_results: int) -> List[Dict]:
        """Parse Yahoo search results."""
        results = []
        
        # Look for result containers
        result_containers = soup.find_all('div', class_='dd algo')
        
        for container in result_containers[:max_results]:
            if not isinstance(container, Tag):
                continue
            try:
                # Extract title and URL
                title_elem = container.find('h3')
                if not title_elem or not isinstance(title_elem, Tag):
                    continue
                
                link_elem = title_elem.find('a')
                if not link_elem or not isinstance(link_elem, Tag):
                    continue
                
                title = link_elem.get_text(strip=True)
                url = str(link_elem.get('href', ''))
                
                # Extract snippet
                snippet_elem = container.find('p')
                snippet = snippet_elem.get_text(strip=True) if snippet_elem and isinstance(snippet_elem, Tag) else ""
                
                if title and url:
                    results.append({
                        'title': title,
                        'url': url,
                        'snippet': snippet
                    })
            
            except Exception as e:
                continue
        
        return results
