from dataclasses import dataclass
from typing import Callable, Optional, Protocol


@dataclass
class GoogleSheetID:
    id: str
    name: str = ""
    mime_type: str = "application/vnd.google-apps.spreadsheet"


@dataclass
class YouTubeSearchPaginationToken:
    token: Optional[str] = None


class GoogleSheetsRow(Protocol):
    def get_cell(self, column_name: str):
        """Return the value in the cell."""
        pass

    def set_cell(self, column_name: str, value: str):
        """Set the value in the cell."""
        pass


class GoogleSheetsRowProcessor(Protocol):
    __call__: Callable[[GoogleSheetsRow], None]

    def run_parallel(
        self,
        google_sheet_id: GoogleSheetID,
        limit: Optional[int] = None,
        start: Optional[int] = None,
        sheet_name: Optional[str] = None,
    ):
        """Process rows in a sheet in parallel."""
        pass
