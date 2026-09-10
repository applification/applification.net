import { permanentRedirect } from "next/navigation";

export default function DevelopersRedirect() {
  permanentRedirect("/agents");
}
