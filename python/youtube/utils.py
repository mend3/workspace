from typing import List, Set
from .google_sheets import *
from .type_definitions import *


def setup_columns(sheet_id: GoogleSheetID):
    """Set up the required columns in the Google Sheet"""
    column_names: List[str] = [
        "Video Title",
        "Video Link",
        "Description",
        "View Count",
        "Channel Name",
        "Channel Link",
        "Subscriber Count",
    ]
    google_sheets_add_empty_columns(sheet_id, column_names)


def extract_handle(channel_link: str):
    """Extract the channel handle from a YouTube channel link"""
    if "@" in channel_link:
        # Get handle after @ symbol
        return channel_link.split("@")[1].split("/")[0]
    # Get the last part of the URL for legacy channels
    return channel_link.split("/")[-1]


def deduplicate_results(sheet_id: GoogleSheetID):
    """Remove duplicate video entries based on video links
    Returns the number of duplicates removed"""
    # Track unique video links
    seen_links: Set[str] = set()

    @google_sheets_row_processor
    def process_row(row: GoogleSheetsRow):
        try:
            # Get the video link from current row
            video_link: str = row.get_cell("Video Link")
            if not video_link:
                return

            # If this is a duplicate, mark it for deletion by clearing all cells
            if video_link in seen_links:
                for column in [
                    "Video Title",
                    "Video Link",
                    "Description",
                    "View Count",
                    "Channel Name",
                    "Channel Link",
                    "Subscriber Count",
                ]:
                    row.set_cell(column, "")
            else:
                seen_links.add(video_link)
        except Exception as e:
            print(f"Error processing row: {str(e)}")

    # Process all rows
    process_row.run_parallel(sheet_id)

    # Calculate duplicates by reading sheet data
    sheet_data = google_sheets_read_spreadsheet(sheet_id)
    first_sheet_name = list(sheet_data.sheet_data.keys())[0]
    rows = sheet_data.sheet_data[first_sheet_name]

    # Skip header row, count non-empty rows
    total_non_empty_rows = 0
    for row_idx in range(1, len(rows)):
        if (
            row_idx < len(rows)
            and len(rows[row_idx]) > 1
            and rows[row_idx][1].as_str().strip()
        ):
            total_non_empty_rows += 1

    # Calculate duplicates as difference between total and unique
    duplicates = total_non_empty_rows - len(seen_links)
    return max(0, duplicates)  # Ensure we don't return negative numbers
