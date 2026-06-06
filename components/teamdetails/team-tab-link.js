import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { prefetchTeamBundle } from "../functions/details_prefetch";

export default function TeamTabLink({ href, active, children, teamId }) {
  const router = useRouter();

  const prefetchTab = useCallback(() => {
    router.prefetch(href);
    if (teamId) prefetchTeamBundle(teamId);
  }, [href, router, teamId]);

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
