from typing import List, Set, Tuple
from datetime import datetime
from .google_sheets import *
from tools.youtube.type_definitions import *
from tools.youtube.utils import *


def research_youtube_videos_improved(search_query: str, destination_sheet: Optional[GoogleSheetID] = None, num_pages: int = 1, pagination_token: Optional[str] = None):
    """
    Search YouTube for videos on a specific topic and save detailed information to a Google Sheet.
    Creates a new spreadsheet automatically if none is provided, uses parallelization for faster performance,
    and removes duplicate entries. Includes video details, channel information with subscriber counts,
    and supports pagination for continuing searches.

    Args:
        search_query: The search term to find videos for
        destination_sheet: Optional Google Sheet to save results to (creates one if None)
        num_pages: Number of pages of results to process (default: 1)
        pagination_token: Optional token string to continue from a previous search

    Returns:
        A tuple containing (next_page_token, sheet_id)
    """
    # Create a new sheet if none provided
    if destination_sheet is None:
        # Create a name based on search query and timestamp
        sheet_name: str = f"YouTube Research - {search_query} - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        destination_sheet = google_sheets_create(sheet_name)
        print(f"Created new spreadsheet: {sheet_name}")

    # Set up the columns in the destination sheet
    setup_columns(destination_sheet)

    # Initialize pagination token
    next_token: Optional[YouTubeSearchPaginationToken] = None
    if pagination_token:
        next_token = YouTubeSearchPaginationToken(token=pagination_token)

    # Handle multiple pages sequentially, but parallelize operations within each page
    all_rows: List[dict[str, str]] = []
    total_videos: int = 0

    for page in range(num_pages):
        # Search for videos
        search_response = youtube_search(
            query=search_query, num_pages=1, next_page_token=next_token)
        videos = search_response.videos
        total_videos += len(videos)

        if not videos:
            print("No videos found for this query.")
            break

        # Define function to process a single video
        def _process_video(video):
            # Get channel details using handle
            handle: str = extract_handle(video.channel.link)
            channel_result = youtube_search(query=f"@{handle}")

            # Get subscriber count
            subscriber_count: str = "Unknown"
            if channel_result.channels:
                channel_details = channel_result.channels[0]
                if channel_details.youtube_channel_extended_details:
                    subs = channel_details.youtube_channel_extended_details.subscribers
                    subscriber_count = str(
                        subs) if subs is not None else "Unknown"

            # Prepare row data
            return {
                "Video Title": video.title,
                "Video Link": video.link,
                "Description": video.description if video.description else "",
                "View Count": str(video.views if video.views else 0),
                "Channel Name": video.channel.name,
                "Channel Link": video.channel.link,
                "Subscriber Count": subscriber_count
            }

        # Process videos in parallel
        page_rows = list(pmap(_process_video, videos))
        all_rows.extend(page_rows)

        # Print progress
        print(f"Processed {len(page_rows)} videos from page {page + 1}")

        # Update pagination token for next page
        next_token = search_response.next_page_token
        if not next_token:
            print(f"No more results available after page {page + 1}")
            break

    # Batch append all rows to the spreadsheet
    if all_rows:
        google_sheets_append_rows(destination_sheet, all_rows)
        print(f"Added {len(all_rows)} videos to the spreadsheet")

        # Deduplicate results after all videos have been added
        duplicates_removed: int = deduplicate_results(destination_sheet)
        print(
            f"Found and removed {duplicates_removed} duplicate video entries")

    # Return the pagination token for continuation and the sheet ID
    return (next_token.token if next_token else None, destination_sheet)


# Implement other required functions in a similar way
if __name__ == "__main__":
    result = research_youtube_videos_improved(
        search_query='MCP Tools, AI Agents', destination_sheet=None, num_pages=1, pagination_token=None)
    print(result)
