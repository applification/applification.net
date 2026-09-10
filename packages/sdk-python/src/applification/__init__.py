"""Official Python client for the Applification public information API.

Every call is a plain GET to https://www.applification.net. The API is free,
read-only and needs no API key, account or cookie. Nothing here can send an
enquiry or change data.

Documentation: https://www.applification.net/developers
OpenAPI:       https://www.applification.net/api/openapi.json
MCP server:    https://www.applification.net/api/mcp
"""

from .client import (
    API_VERSION,
    DOCS_URL,
    MCP_CLIENT_CONFIG,
    MCP_ENDPOINT,
    OPENAPI_URL,
    SITE_URL,
    Applification,
    ApplificationError,
)

__all__ = [
    "API_VERSION",
    "DOCS_URL",
    "MCP_CLIENT_CONFIG",
    "MCP_ENDPOINT",
    "OPENAPI_URL",
    "SITE_URL",
    "Applification",
    "ApplificationError",
]
__version__ = "0.1.0"
