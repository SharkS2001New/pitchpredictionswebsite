import Link from "next/link";

export default function LeagueTabLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className="tabs__tab"
      id={active ? "activeElement1" : undefined}
    >
      {children}
    </Link>
  );
}
