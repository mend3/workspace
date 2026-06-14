import re
import urllib.parse
from typing import List, Dict, Optional
import hashlib

def clean_url(url: str) -> str:
    """
    Clean and normalize URLs.
    """
    if not url:
        return ""
    
    # Add protocol if missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Parse and clean the URL
    parsed = urllib.parse.urlparse(url)
    
    # Remove fragment and clean query
    clean_parsed = parsed._replace(fragment='')
    
    return urllib.parse.urlunparse(clean_parsed)

def is_valid_url(url: str) -> bool:
    """
    Check if a URL is valid and accessible.
    """
    try:
        result = urllib.parse.urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False

def extract_domain(url: str) -> str:
    """
    Extract domain from URL.
    """
    try:
        parsed = urllib.parse.urlparse(url)
        return parsed.netloc.lower()
    except Exception:
        return ""

def deduplicate_results(results: List[Dict]) -> List[Dict]:
    """
    Remove duplicate results based on URL and title similarity.
    """
    seen_urls = set()
    seen_titles = set()
    unique_results = []
    
    for result in results:
        url = result.get('url', '')
        title = result.get('title', '')
        
        # Create a normalized version for comparison
        normalized_url = clean_url(url).lower()
        normalized_title = normalize_text(title)
        
        # Check for duplicates
        url_hash = hashlib.md5(normalized_url.encode()).hexdigest()
        title_hash = hashlib.md5(normalized_title.encode()).hexdigest()
        
        if url_hash not in seen_urls and title_hash not in seen_titles:
            seen_urls.add(url_hash)
            seen_titles.add(title_hash)
            unique_results.append(result)
    
    return unique_results

def normalize_text(text: str) -> str:
    """
    Normalize text for comparison.
    """
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters for comparison
    text = re.sub(r'[^\w\s]', '', text)
    
    return text.strip()

def truncate_text(text: str, max_length: int = 200, suffix: str = "...") -> str:
    """
    Truncate text to a maximum length.
    """
    if not text or len(text) <= max_length:
        return text
    
    return text[:max_length].rstrip() + suffix

def format_relevance_score(score: float) -> str:
    """
    Format relevance score for display.
    """
    if score >= 0.9:
        return f"🟢 Excellent ({score:.2f})"
    elif score >= 0.7:
        return f"🟡 Good ({score:.2f})"
    elif score >= 0.5:
        return f"🟠 Fair ({score:.2f})"
    else:
        return f"🔴 Poor ({score:.2f})"

def validate_search_query(query: str) -> Optional[str]:
    """
    Validate and clean search query.
    Returns None if query is invalid, cleaned query otherwise.
    """
    if not query or not query.strip():
        return None
    
    # Clean the query
    query = query.strip()
    
    # Remove excessive whitespace
    query = re.sub(r'\s+', ' ', query)
    
    # Check minimum length
    if len(query) < 3:
        return None
    
    # Check maximum length
    if len(query) > 500:
        query = query[:500]
    
    return query

def filter_results_by_content_length(results: List[Dict], min_length: int = 100) -> List[Dict]:
    """
    Filter results by content length to ensure substantial content.
    """
    filtered_results = []
    
    for result in results:
        content = result.get('content', '')
        if content and len(content.strip()) >= min_length:
            filtered_results.append(result)
    
    return filtered_results
