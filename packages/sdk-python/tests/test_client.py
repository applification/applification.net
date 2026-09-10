import io
import json
import unittest
from email.message import Message
from urllib.error import HTTPError
from urllib.parse import parse_qs, urlparse

from applification import MCP_CLIENT_CONFIG, MCP_ENDPOINT, SITE_URL, Applification, ApplificationError


class FakeResponse(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.close()
        return False


def make_client(handler):
    calls = []

    def opener(request, timeout):
        url = urlparse(request.full_url)
        calls.append(url)
        status, body, headers = handler(url)
        payload = json.dumps(body).encode("utf-8")
        if status >= 400:
            message = Message()
            for key, value in (headers or {}).items():
                message[key] = value
            raise HTTPError(request.full_url, status, "error", message, io.BytesIO(payload))
        return FakeResponse(payload)

    return Applification(opener=opener), calls


class ClientTests(unittest.TestCase):
    def test_defaults_to_production_without_credentials(self):
        client, calls = make_client(lambda url: (200, {"section": "pricing", "data": {}}, None))
        self.assertEqual(client.catalog("pricing")["section"], "pricing")
        self.assertEqual(calls[0].netloc, "www.applification.net")
        self.assertEqual(calls[0].path, "/api/v1/catalog")
        self.assertEqual(parse_qs(calls[0].query), {"section": ["pricing"]})
        self.assertEqual(MCP_ENDPOINT, f"{SITE_URL}/api/mcp")
        self.assertEqual(MCP_CLIENT_CONFIG["mcpServers"]["applification"]["url"], MCP_ENDPOINT)

    def test_search_omits_empty_parameters(self):
        client, calls = make_client(lambda url: (200, {"results": [], "total": 0, "nextOffset": None}, None))
        client.search("production AI", type="client-work", limit=3)
        self.assertEqual(
            parse_qs(calls[0].query), {"query": ["production AI"], "type": ["client-work"], "limit": ["3"]}
        )

    def test_pagination_helpers_follow_next_markers(self):
        def handler(url):
            params = parse_qs(url.query)
            if url.path.endswith("/search"):
                offset = int(params.get("offset", ["0"])[0])
                return 200, {"results": [{"slug": f"post-{offset}"}], "total": 2, "nextOffset": 1 if offset == 0 else None}, None
            section = int(params.get("section", ["0"])[0])
            return 200, {"content": f"part {section}", "nextSection": 1 if section == 0 else None}, None

        client, _ = make_client(handler)
        self.assertEqual([r["slug"] for r in client.search_all(type="writing")], ["post-0", "post-1"])
        self.assertEqual(client.read_all("writing", "post-0"), "part 0\n\npart 1")

    def test_errors_carry_api_code_and_retry_after(self):
        def handler(url):
            if url.path.endswith("/content"):
                return 404, {"error": {"code": "NOT_FOUND", "message": "Not found."}}, None
            return 429, {"error": "throttled"}, {"Retry-After": "7"}

        client, _ = make_client(handler)
        with self.assertRaises(ApplificationError) as missing:
            client.read("writing", "nope")
        self.assertEqual((missing.exception.status, missing.exception.code), (404, "NOT_FOUND"))
        with self.assertRaises(ApplificationError) as throttled:
            client.search()
        self.assertEqual(throttled.exception.code, "UNAVAILABLE")
        self.assertEqual(throttled.exception.retry_after, 7)


if __name__ == "__main__":
    unittest.main()
