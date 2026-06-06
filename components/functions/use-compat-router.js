"use client";

import { useContext, useMemo } from "react";
import { usePathname, useParams } from "next/navigation";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

export default function useCompatRouter() {
  const pagesRouter = useContext(RouterContext);
  const pathname = usePathname();
  const params = useParams();

  return useMemo(() => {
    if (pagesRouter) {
      return pagesRouter;
    }

    const query = { ...(params || {}) };

    const navigate = (url) => {
      if (typeof url === "string") {
        window.location.href = url;
        return Promise.resolve();
      }

      if (url?.pathname) {
        const queryString = url.query
          ? `?${new URLSearchParams(url.query).toString()}`
          : "";
        window.location.href = `${url.pathname}${queryString}`;
      }

      return Promise.resolve();
    };

    return {
      pathname: pathname || "",
      asPath: pathname || "",
      query,
      isReady: true,
      push: navigate,
      replace: navigate,
    };
  }, [pagesRouter, pathname, params]);
}
