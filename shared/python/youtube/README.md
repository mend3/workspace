# YouTube Research Video Tool

This Python script allows you to search for YouTube videos on a specific topic and save detailed information to a Google Sheet.

## Features

- Searches YouTube for videos based on a query
- Creates a Google Sheet with detailed information about each video
- Gets channel subscriber counts
- Removes duplicate entries
- Supports pagination for continuing searches

## Requirements

To run this locally, you'll need:

1. Google API credentials (for Sheets API)
2. YouTube Data API key
3. Python libraries:
   - google-api-python-client
   - google-auth-httplib2
   - google-auth-oauthlib

## Setup

1. Create a Google Cloud project
2. Enable the Google Sheets API and YouTube Data API
3. Create credentials (OAuth client ID)
4. Save credentials to credentials.json in the same directory

## Adaptation Required

This code was originally run in Lutra AI which provides built-in functions for Google Sheets and YouTube.
You'll need to adapt the code to use the Google API client libraries directly.

## Usage Example

```python
from youtube_research import research_youtube_videos_improved

result = research_youtube_videos_improved(
    search_query="AI agents",
    destination_sheet=None,  # Will create a new sheet
    num_pages=1
)
next_token, sheet_id = result
```
