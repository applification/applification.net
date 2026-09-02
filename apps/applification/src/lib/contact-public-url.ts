export function getContactPublicBaseUrl() {
  return (
    process.env.CONTACT_PUBLIC_BASE_URL ??
    process.env.PORTLESS_TAILSCALE_URL ??
    process.env.PORTLESS_URL
  );
}
