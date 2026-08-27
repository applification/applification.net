import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/products", label: "Products" },
  { href: "/client-work", label: "Client work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Applification home">
        <Image
          className="brand-mark brand-mark-light"
          src="/brand/applification-mark-light.svg"
          alt=""
          width={73}
          height={34}
          priority
        />
        <Image
          className="brand-mark brand-mark-dark"
          src="/brand/applification-mark-dark.svg"
          alt=""
          width={73}
          height={34}
          priority
        />
        <span>Applification</span>
      </Link>

      <nav className="site-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
        <Link className="nav-action" href="/about">
          Discuss a contract
        </Link>
      </nav>
    </header>
  );
}
