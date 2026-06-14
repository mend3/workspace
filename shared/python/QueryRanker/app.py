import streamlit as st
import pandas as pd
from search_engine import SearchEngine
from content_extractor import ContentExtractor
from relevance_scorer import RelevanceScorer
import time

# Initialize components
@st.cache_resource
def get_components():
    search_engine = SearchEngine()
    content_extractor = ContentExtractor()
    relevance_scorer = RelevanceScorer()
    return search_engine, content_extractor, relevance_scorer

def main():
    st.title("🔍 Automation Aggregating Search System")
    st.markdown("Search across multiple sources and get AI-ranked results based on relevance")
    
    # Initialize session state
    if 'search_results' not in st.session_state:
        st.session_state.search_results = []
    if 'last_query' not in st.session_state:
        st.session_state.last_query = ""
    
    # Get components
    search_engine, content_extractor, relevance_scorer = get_components()
    
    # Search interface
    col1, col2 = st.columns([4, 1])
    
    with col1:
        query = st.text_input(
            "Enter your search query:",
            value=st.session_state.last_query,
            placeholder="e.g., latest developments in artificial intelligence"
        )
    
    with col2:
        st.write("")  # Empty space for alignment
        search_button = st.button("🔍 Search", type="primary")
    
    # Search parameters
    with st.expander("Search Settings"):
        col1, col2 = st.columns(2)
        with col1:
            max_results = st.slider("Maximum results per source", 3, 10, 5)
        with col2:
            sources_count = st.slider("Number of search sources", 1, 5, 3)
    
    # Perform search
    if search_button and query.strip():
        st.session_state.last_query = query
        
        with st.spinner("🔍 Searching across multiple sources..."):
            # Get search results from multiple sources
            search_results = search_engine.search_multiple_sources(query, max_results, sources_count)
        
        if search_results:
            with st.spinner("📄 Extracting content from sources..."):
                # Extract content from each URL
                extracted_results = []
                progress_bar = st.progress(0)
                
                for i, result in enumerate(search_results):
                    try:
                        content = content_extractor.extract_content(result['url'])
                        if content:
                            result['content'] = content
                            extracted_results.append(result)
                    except Exception as e:
                        st.warning(f"Failed to extract content from {result['url']}: {str(e)}")
                    
                    progress_bar.progress((i + 1) / len(search_results))
                
                progress_bar.empty()
            
            if extracted_results:
                with st.spinner("🤖 AI-powered relevance scoring..."):
                    # Score relevance using OpenAI
                    scored_results = relevance_scorer.score_results(query, extracted_results)
                    
                    # Sort by relevance score (descending)
                    scored_results.sort(key=lambda x: x['relevance_score'], reverse=True)
                    
                    st.session_state.search_results = scored_results
            else:
                st.error("No content could be extracted from the search results.")
        else:
            st.error("No search results found for your query.")
    
    # Display results
    if st.session_state.search_results:
        st.markdown("---")
        st.subheader(f"📊 Results for: '{st.session_state.last_query}'")
        st.markdown(f"Found **{len(st.session_state.search_results)}** relevant results")
        
        for i, result in enumerate(st.session_state.search_results, 1):
            with st.container():
                # Result header with relevance score
                col1, col2 = st.columns([3, 1])
                
                with col1:
                    st.markdown(f"### {i}. [{result['title']}]({result['url']})")
                
                with col2:
                    relevance_score = result['relevance_score']
                    if relevance_score >= 0.8:
                        score_color = "🟢"
                    elif relevance_score >= 0.6:
                        score_color = "🟡"
                    else:
                        score_color = "🔴"
                    
                    st.markdown(f"{score_color} **Relevance: {relevance_score:.2f}**")
                
                # Content summary
                st.markdown(f"**Source:** {result['source']}")
                
                if 'summary' in result:
                    st.markdown("**Summary:**")
                    st.markdown(result['summary'])
                
                # Show relevance reasoning
                if 'reasoning' in result:
                    with st.expander("Why this result is relevant"):
                        st.markdown(result['reasoning'])
                
                # Content preview
                with st.expander("Content Preview"):
                    content_preview = result['content'][:500] + "..." if len(result['content']) > 500 else result['content']
                    st.text(content_preview)
                
                st.markdown("---")
    
    # Footer
    st.markdown("---")
    st.markdown("*Powered by AI-driven relevance scoring and multi-source web scraping*")

if __name__ == "__main__":
    main()
