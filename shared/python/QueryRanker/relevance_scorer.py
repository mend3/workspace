import os
import json
from openai import OpenAI
from typing import List, Dict

class RelevanceScorer:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        self.client = OpenAI(api_key=api_key)
    
    def score_results(self, query: str, results: List[Dict]) -> List[Dict]:
        """
        Score search results based on relevance to the user query using OpenAI.
        """
        scored_results = []
        
        for result in results:
            try:
                # Get relevance score and reasoning
                score_data = self._get_relevance_score(query, result)
                
                # Add score data to result
                result['relevance_score'] = score_data.get('relevance_score', 0.0)
                result['reasoning'] = score_data.get('reasoning', '')
                result['summary'] = score_data.get('summary', '')
                
                scored_results.append(result)
                
            except Exception as e:
                print(f"Error scoring result {result.get('url', 'Unknown')}: {str(e)}")
                # Add default score for failed results
                result['relevance_score'] = 0.0
                result['reasoning'] = 'Failed to analyze relevance'
                result['summary'] = result.get('snippet', '')[:200] + "..."
                scored_results.append(result)
        
        return scored_results
    
    def _get_relevance_score(self, query: str, result: Dict) -> Dict:
        """
        Get relevance score from OpenAI for a single result.
        """
        # Prepare content for analysis
        title = result.get('title', '')
        content = result.get('content', '')
        snippet = result.get('snippet', '')
        
        # Truncate content if too long
        max_content_length = 3000
        if len(content) > max_content_length:
            content = content[:max_content_length] + "..."
        
        # Create analysis prompt
        analysis_prompt = f"""
        Analyze the relevance of this web content to the user's search query.
        
        User Query: "{query}"
        
        Content Title: {title}
        Content Snippet: {snippet}
        Full Content: {content}
        
        Please analyze and provide:
        1. A relevance score from 0.0 to 1.0 (where 1.0 is perfectly relevant)
        2. A brief explanation of why this content is or isn't relevant
        3. A concise summary of the content (2-3 sentences)
        
        Respond with JSON in this exact format:
        {{
            "relevance_score": 0.85,
            "reasoning": "This content directly addresses the user's query because...",
            "summary": "Brief summary of the content..."
        }}
        """
        
        try:
            # Using gpt-4o due to access restrictions on gpt-5
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at analyzing content relevance. "
                                 "Be accurate and objective in your scoring. "
                                 "Consider semantic similarity, topic overlap, and query intent."
                    },
                    {
                        "role": "user",
                        "content": analysis_prompt
                    }
                ],
                response_format={"type": "json_object"},
                max_completion_tokens=500,
                temperature=0.3
            )
            
            content = response.choices[0].message.content
            if content is None:
                raise ValueError("No content in OpenAI response")
            result_data = json.loads(content)
            
            # Validate and normalize the score
            relevance_score = float(result_data.get('relevance_score', 0.0))
            relevance_score = max(0.0, min(1.0, relevance_score))  # Clamp between 0 and 1
            
            return {
                'relevance_score': relevance_score,
                'reasoning': result_data.get('reasoning', 'No reasoning provided'),
                'summary': result_data.get('summary', 'No summary available')
            }
            
        except Exception as e:
            print(f"Error getting relevance score: {str(e)}")
            return {
                'relevance_score': 0.0,
                'reasoning': f'Error analyzing relevance: {str(e)}',
                'summary': snippet[:200] + "..." if snippet else "No summary available"
            }
    
    def batch_score_results(self, query: str, results: List[Dict], batch_size: int = 5) -> List[Dict]:
        """
        Score multiple results in batches to handle rate limits.
        """
        scored_results = []
        
        for i in range(0, len(results), batch_size):
            batch = results[i:i + batch_size]
            batch_scored = self.score_results(query, batch)
            scored_results.extend(batch_scored)
            
            # Small delay between batches to respect rate limits
            if i + batch_size < len(results):
                import time
                time.sleep(1)
        
        return scored_results
