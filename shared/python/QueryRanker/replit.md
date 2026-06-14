# Automation Aggregating Search System

## Overview

This is a Streamlit-based web application that provides an intelligent search aggregation system. The application searches across multiple search engines (DuckDuckGo, Bing, Yahoo), extracts content from web pages, and uses OpenAI's API to score and rank results based on relevance to user queries. The system provides AI-powered summaries and reasoning for each search result, creating a comprehensive search experience that goes beyond traditional search engine results.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Streamlit for rapid web application development
- **UI Components**: Simple form-based interface with search input, parameter controls, and results display
- **State Management**: Streamlit session state for maintaining search results and query history
- **Caching**: `@st.cache_resource` decorator for component initialization to improve performance

### Backend Architecture
- **Modular Design**: Separation of concerns with distinct modules for search, content extraction, and relevance scoring
- **Search Engine**: Multi-source search capability across DuckDuckGo, Bing, and Yahoo
- **Content Extraction**: Web scraping and content parsing using trafilatura and BeautifulSoup
- **AI Scoring**: OpenAI API integration for intelligent relevance scoring and summarization
- **Error Handling**: Graceful degradation with fallback mechanisms for failed requests

### Core Components
1. **SearchEngine Class**: Handles web scraping from multiple search engines with custom parsers for each platform
2. **ContentExtractor Class**: Extracts clean text content from web pages using trafilatura with requests fallback
3. **RelevanceScorer Class**: Integrates with OpenAI API to score results and provide AI-generated summaries
4. **Utility Functions**: URL validation, cleaning, deduplication, and domain extraction

### Data Flow
1. User submits search query through Streamlit interface
2. SearchEngine aggregates results from multiple search engines
3. ContentExtractor retrieves full content from result URLs
4. RelevanceScorer uses OpenAI to analyze and rank results
5. Results are displayed with relevance scores and AI-generated summaries

### Design Patterns
- **Factory Pattern**: Component initialization through cached factory function
- **Strategy Pattern**: Multiple search engine implementations with unified interface
- **Pipeline Pattern**: Sequential processing of search → extract → score → display

## External Dependencies

### AI Services
- **OpenAI API**: GPT model integration for relevance scoring and content summarization
- **API Key Management**: Environment variable-based configuration for secure key storage

### Web Scraping Libraries
- **trafilatura**: Primary library for content extraction and web page parsing
- **BeautifulSoup**: HTML parsing for search engine result extraction
- **requests**: HTTP client for web requests with custom headers and error handling

### UI Framework
- **Streamlit**: Complete web application framework with built-in components and state management
- **pandas**: Data manipulation for handling search results (imported but usage context not visible in provided files)

### Standard Libraries
- **urllib.parse**: URL manipulation and validation
- **time**: Request throttling and delay management
- **random**: Randomized delays for respectful web scraping
- **hashlib**: Content hashing for deduplication (imported in utils)
- **re**: Regular expression support for text processing
- **os**: Environment variable access
- **json**: Data serialization for API communication

### Search Engines
- **DuckDuckGo**: Privacy-focused search engine with HTML interface
- **Bing**: Microsoft's search engine
- **Yahoo**: Yahoo Search platform
- **Rate Limiting**: Built-in delays and respectful scraping practices