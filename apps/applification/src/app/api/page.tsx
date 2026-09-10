import { permanentRedirect } from "next/navigation";

// /api itself is a predictable documentation URL; versioned routes live below it.
export default function ApiRedirect() {
  permanentRedirect("/developers");
}
