from __future__ import annotations

import json
from typing import Any, Callable, Dict, Iterator, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

SITE_URL = "https://www.applification.net"
API_VERSION = "v1"
OPENAPI_URL = f"{SITE_URL}/api/openapi.json"
MCP_ENDPOINT = f"{SITE_URL}/api/mcp"
DOCS_URL = f"{SITE_URL}/developers"

MCP_CLIENT_CONFIG: Dict[str, Any] = {
    "mcpServers": {
        "applification": {"type": "streamable-http", "url": MCP_ENDPOINT},
    }
}

_USER_AGENT = "applification-python/0.1.0"

Opener = Callable[[Request, float], Any]


class ApplificationError(Exception):
    """Raised for any non-2xx response. The API always answers errors as JSON."""

    def __init__(
        self,
        message: str,
        *,
        status: int,
        code: str,
        url: str,
        retry_after: Optional[int] = None,
    ) -> None:
        super().__init__(message)
        self.status = status
        self.code = code
        self.url = url
        self.retry_after = retry_after


class Applification:
    """Read the public catalog, search published content and read sections."""

    def __init__(
        self,
        base_url: str = SITE_URL,
        *,
        timeout: float = 15.0,
        user_agent: str = _USER_AGENT,
        opener: Optional[Opener] = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.user_agent = user_agent
        self._opener: Opener = opener or (lambda request, timeout: urlopen(request, timeout=timeout))

    # Public operations -------------------------------------------------

    def catalog(self, section: str = "all") -> Dict[str, Any]:
        """Profile, products and pricing. ``section`` is all, profile, products or pricing."""
        return self._get(f"/api/{API_VERSION}/catalog", {"section": section})

    def search(
        self,
        query: Optional[str] = None,
        *,
        type: Optional[str] = None,
        topic: Optional[str] = None,
        status: Optional[str] = None,
        after: Optional[str] = None,
        before: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Search or list published client work, writing and products (one page)."""
        return self._get(
            f"/api/{API_VERSION}/search",
            {
                "query": query,
                "type": type,
                "topic": topic,
                "status": status,
                "after": after,
                "before": before,
                "limit": limit,
                "offset": offset,
            },
        )

    def search_all(self, query: Optional[str] = None, **filters: Any) -> Iterator[Dict[str, Any]]:
        """Iterate through every page of a search."""
        offset = filters.pop("offset", 0) or 0
        while True:
            page = self.search(query, offset=offset, **filters)
            for result in page["results"]:
                yield result
            if page.get("nextOffset") is None:
                return
            offset = page["nextOffset"]

    def read(self, type: str, slug: str, section: Optional[int] = None) -> Dict[str, Any]:
        """Read one Markdown section (at most 4,000 characters)."""
        return self._get(
            f"/api/{API_VERSION}/content",
            {"type": type, "slug": slug, "section": section},
        )

    def read_all(self, type: str, slug: str) -> str:
        """Read every section and return the joined Markdown."""
        parts = []
        section: Optional[int] = 0
        while section is not None:
            page = self.read(type, slug, section)
            parts.append(page["content"])
            section = page.get("nextSection")
        return "\n\n".join(parts)

    # Transport ----------------------------------------------------------

    def _get(self, path: str, params: Dict[str, Any]) -> Dict[str, Any]:
        query = {key: value for key, value in params.items() if value not in (None, "")}
        url = f"{self.base_url}{path}"
        if query:
            url = f"{url}?{urlencode(query)}"
        request = Request(
            url,
            headers={"Accept": "application/json", "User-Agent": self.user_agent},
            method="GET",
        )
        try:
            with self._opener(request, self.timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            raise self._error(url, error) from None
        except URLError as error:
            raise ApplificationError(
                f"Request to {url} failed: {error.reason}", status=0, code="UNAVAILABLE", url=url
            ) from None

    @staticmethod
    def _error(url: str, error: HTTPError) -> ApplificationError:
        code = "UNAVAILABLE"
        message = f"Request failed with status {error.code}"
        try:
            body = json.loads(error.read().decode("utf-8"))
            detail = body.get("error") if isinstance(body, dict) else None
            if isinstance(detail, dict):
                if detail.get("code") in ("INVALID_QUERY", "NOT_FOUND"):
                    code = detail["code"]
                if detail.get("message"):
                    message = detail["message"]
        except (ValueError, AttributeError):
            pass
        retry_after_header = error.headers.get("Retry-After") if error.headers else None
        retry_after = int(retry_after_header) if retry_after_header and retry_after_header.isdigit() else None
        return ApplificationError(message, status=error.code, code=code, url=url, retry_after=retry_after)
