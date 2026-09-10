import { permanentRedirect } from "next/navigation";

export default function DocsRedirect() {
  permanentRedirect("/developers");
}
