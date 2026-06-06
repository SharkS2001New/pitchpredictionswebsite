import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { prefetchMatchBundle } from "../functions/details_prefetch";

export default function MatchTabLink({ href, active, children, fixtureId }) {
  const router = useRouter();

  const prefetchTab = useCallback(() => {
    router.prefetch(href);
    if (fixtureId) prefetchMatchBundle(fixtureId);
  }, [href, router, fixtureId]);

  return (
    <Link
      href={href}
      prefetch
      scroll={false}
      className="tabs__tab"
      id={active ? "activeElement1" : undefined}
      onMouseEnter={prefetchTab}
      onFocus={prefetchTab}
      onTouchStart={prefetchTab}
    >
      {children}
    </Link>
  );
}
