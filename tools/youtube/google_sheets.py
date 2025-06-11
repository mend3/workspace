from googleapiclient.discovery import build
from concurrent.futures import ThreadPoolExecutor
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os.path
import pickle

# Define scopes needed for the APIs
SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/youtube.readonly']


def get_credentials():
    """Get and save user credentials."""
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'google-installed-oauth.json', SCOPES)
            creds = flow.run_local_server(port=5679)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return creds


def google_sheets_create(name: str, parent_folder_id=None, sheet_name=None):
    """Creates a new Google Sheet."""
    creds = get_credentials()
    service = build('sheets', 'v4', credentials=creds)

    # Implement the API call to create a new spreadsheet
    spreadsheet = {
        'properties': {
            'title': name
        },
        'sheets': [
            {
                'properties': {
                    'title': sheet_name or 'Sheet1'
                }
            }
        ]
    }

    spreadsheet = service.spreadsheets().create(body=spreadsheet).execute()

    # Return the spreadsheet ID in the required format
    from tools.youtube.type_definitions import GoogleSheetID
    return GoogleSheetID(id=spreadsheet['spreadsheetId'], name=name)


def google_sheets_add_empty_columns(google_sheet_id, column_names, sheet_name=None):
    """Add empty named columns to a sheet."""
    creds = get_credentials()
    service = build('sheets', 'v4', credentials=creds)

    # Implement API call to add header row with column names
    # This is a simplified implementation
    values = [column_names]
    body = {
        'values': values
    }

    range_name = f"{sheet_name or 'Sheet1'}!A1:{chr(65 + len(column_names) - 1)}1"

    service.spreadsheets().values().update(
        spreadsheetId=google_sheet_id.id,
        range=range_name,
        valueInputOption='RAW',
        body=body
    ).execute()


def google_sheets_append_rows(google_sheet_id, rows, sheet_name=None):
    """
    Append rows to a sheet in Google Sheets.

    Args:
        google_sheet_id: GoogleSheetID object containing the spreadsheet ID
        rows: List of dictionaries mapping column names to row values
        sheet_name: Optional sheet name to append to. If not provided, uses the first sheet.
    """
    creds = get_credentials()
    service = build('sheets', 'v4', credentials=creds)

    # Get the sheet metadata to confirm sheet exists and get headers
    sheet_metadata = service.spreadsheets().get(
        spreadsheetId=google_sheet_id.id).execute()
    available_sheets = [sheet['properties']['title']
                        for sheet in sheet_metadata['sheets']]

    # Use the first sheet if no sheet name provided
    if not sheet_name:
        sheet_name = available_sheets[0]
    elif sheet_name not in available_sheets:
        raise ValueError(f"Sheet '{sheet_name}' not found in spreadsheet")

    # Get existing header row
    result = service.spreadsheets().values().get(
        spreadsheetId=google_sheet_id.id,
        range=f"{sheet_name}!1:1"
    ).execute()

    headers = result.get('values', [[]])[0]
    if not headers:
        raise ValueError(f"No headers found in sheet '{sheet_name}'")

    # Prepare the values to append
    values_to_append = []
    for row_dict in rows:
        row_values = []
        for header in headers:
            # Use the value from the dict if it exists, otherwise empty string
            row_values.append(row_dict.get(header, ""))
        values_to_append.append(row_values)

    # Append the rows
    body = {
        'values': values_to_append
    }

    result = service.spreadsheets().values().append(
        spreadsheetId=google_sheet_id.id,
        range=f"{sheet_name}!A1",
        valueInputOption='RAW',
        insertDataOption='INSERT_ROWS',
        body=body
    ).execute()

    return result


def pmap(fn, iterable):
    """
    Process items in an iterable in parallel using ThreadPoolExecutor.
    This is a local implementation to replace Lutra's built-in pmap function.

    Args:
        fn: The function to apply to each item
        iterable: The iterable containing items to process

    Returns:
        A generator yielding results in the same order as the input iterable
    """
    # Convert to list to ensure we can measure length
    items = list(iterable)

    # Use ThreadPoolExecutor for parallel processing
    # Adjust max_workers as needed based on your system
    with ThreadPoolExecutor(max_workers=min(10, len(items))) as executor:
        # Submit all tasks and yield results as they complete
        return executor.map(fn, items)


def google_sheets_row_processor(func):
    """
    A decorator that turns a function into a GoogleSheetsRowProcessor.
    This is a local implementation to replace Lutra's built-in decorator.
    """
    class RowProcessor:
        def __init__(self, func):
            self.func = func

        def __call__(self, row):
            return self.func(row)

        def run_parallel(self, google_sheet_id, limit=None, start=None, sheet_name=None):
            """
            Process rows in a sheet.

            Args:
                google_sheet_id: The ID of the Google Sheet
                limit: Maximum number of rows to process
                start: Row number to start processing from (1-indexed, header is row 1)
                sheet_name: Name of the sheet to process
            """
            creds = get_credentials()
            service = build('sheets', 'v4', credentials=creds)

            # Get the sheet data
            sheet_name = sheet_name or 'Sheet1'
            result = service.spreadsheets().values().get(
                spreadsheetId=google_sheet_id.id,
                range=f"{sheet_name}"
            ).execute()

            values = result.get('values', [])
            if not values:
                print(f"No data found in sheet: {sheet_name}")
                return

            # Extract header row and create column index mapping
            headers = values[0]
            col_indices = {header: idx for idx, header in enumerate(headers)}

            # Process each row
            # Convert to 0-indexed
            start_idx = max(1, start - 1 if start else 1)
            end_idx = min(len(values), start_idx +
                          limit if limit else len(values))

            class RowWrapper:
                def __init__(self, row_data, row_idx):
                    self.row_data = row_data
                    self.row_idx = row_idx
                    self.updates = {}

                def get_cell(self, column_name):
                    if column_name not in col_indices:
                        raise ValueError(
                            f"Column '{column_name}' not found in sheet")
                    col_idx = col_indices[column_name]
                    if col_idx >= len(self.row_data):
                        return ""
                    return self.row_data[col_idx]

                def set_cell(self, column_name, value):
                    if column_name not in col_indices:
                        raise ValueError(
                            f"Column '{column_name}' not found in sheet")
                    self.updates[column_name] = value

            # Process rows sequentially (parallel processing would require additional libraries)
            updated_rows = []
            for i in range(start_idx, end_idx):
                if i >= len(values):
                    break

                row_data = values[i]
                row_wrapper = RowWrapper(row_data, i)

                # Call the wrapped function
                try:
                    self.func(row_wrapper)

                    # If there are updates, prepare them for batch update
                    if row_wrapper.updates:
                        for col_name, new_value in row_wrapper.updates.items():
                            col_idx = col_indices[col_name]
                            # Extend row if needed
                            while len(row_data) <= col_idx:
                                row_data.append("")
                            row_data[col_idx] = new_value

                        # Add to batch update
                        updated_rows.append({
                            'range': f"{sheet_name}!A{i+1}:{chr(65+len(row_data)-1)}{i+1}",
                            'values': [row_data]
                        })
                except Exception as e:
                    print(f"Error processing row {i+1}: {str(e)}")

            # Perform batch update if there are any changes
            if updated_rows:
                body = {
                    'valueInputOption': 'RAW',
                    'data': updated_rows
                }
                service.spreadsheets().values().batchUpdate(
                    spreadsheetId=google_sheet_id.id,
                    body=body
                ).execute()
                print(f"Updated {len(updated_rows)} rows")

    # Return an instance of our processor class
    return RowProcessor(func)


def google_sheets_read_spreadsheet(google_sheet_id):
    """
    Retrieves a spreadsheet (including all worksheets) in the user's Google Drive.
    Local implementation to replace Lutra's built-in function.

    Args:
        google_sheet_id: GoogleSheetID object containing the spreadsheet ID

    Returns:
        A GoogleSpreadsheet object with metadata and sheet data
    """
    from tools.youtube.type_definitions import GoogleSheetCell, GoogleSheetMetadata, GoogleSpreadsheet

    creds = get_credentials()
    service = build('sheets', 'v4', credentials=creds)

    # Get spreadsheet metadata to get sheet names
    spreadsheet = service.spreadsheets().get(
        spreadsheetId=google_sheet_id.id).execute()
    sheet_names = [sheet['properties']['title']
                   for sheet in spreadsheet['sheets']]

    # Create metadata object
    metadata = GoogleSheetMetadata(sheet_names=sheet_names)

    # Initialize sheet_data dictionary
    sheet_data = {}

    # For each sheet, get its data
    for sheet_name in sheet_names:
        result = service.spreadsheets().values().get(
            spreadsheetId=google_sheet_id.id,
            range=sheet_name
        ).execute()

        values = result.get('values', [])

        # Convert to GoogleSheetCell objects
        cell_grid = []
        for row in values:
            cell_row = []
            for value in row:
                # Create a cell object with the value
                cell = GoogleSheetCell(value=value, _sheet_name=sheet_name)
                cell_row.append(cell)
            cell_grid.append(cell_row)

        sheet_data[sheet_name] = cell_grid

    # Create and return the GoogleSpreadsheet object
    return GoogleSpreadsheet(metadata=metadata, sheet_data=sheet_data)

# You'll also need to implement the GoogleSheetCell class in your type_definitions.py:


class GoogleSheetCell:
    """A cell in a Google Sheet."""

    def __init__(self, value, _sheet_name=""):
        self.value = value
        self._sheet_name = _sheet_name

    def as_float(self):
        """Convert the cell value to float."""
        if self.value == "":
            return 0.0
        try:
            return float(self.value)
        except (ValueError, TypeError):
            raise ValueError(f"Cannot convert '{self.value}' to float")

    def as_int(self):
        """Convert the cell value to int."""
        if self.value == "":
            return 0
        try:
            return int(float(self.value))
        except (ValueError, TypeError):
            raise ValueError(f"Cannot convert '{self.value}' to int")

    def as_str(self):
        """Convert the cell value to string."""
        return str(self.value)

    def sheet_name(self):
        """Get the name of the sheet from which the cell is taken."""
        return self._sheet_name


class GoogleSheetMetadata:
    """Metadata for a Google Spreadsheet."""

    def __init__(self, sheet_names):
        self.sheet_names = sheet_names


class GoogleSpreadsheet:
    """A Google Spreadsheet with metadata and sheet data."""

    def __init__(self, metadata, sheet_data):
        self.metadata = metadata
        self.sheet_data = sheet_data


def youtube_search(query, num_pages=1, next_page_token=None):
    """Search for YouTube videos."""
    creds = get_credentials()
    youtube = build('youtube', 'v3', credentials=creds)

    # Implement YouTube search API call
    # This is a simplified example
    search_response = youtube.search().list(
        q=query,
        part='snippet',
        maxResults=20,
        type='video',
        pageToken=next_page_token.token if next_page_token else None
    ).execute()

    # You'll need to implement a response structure matching what the original code expects
    # This is just a starting point

    # You would process the response and convert it to the expected format

    return search_response  # This needs to be transformed to match expected structure
