"use client";

import { usePathname } from "next/navigation";
import Navbar from "../includes/navbar";
import Scrollnav from "../includes/scrollnav";
import Footer from "../includes/footer";
import SideNavBar from "../includes/sidenav";
import PersistentSidebar from "./persistent-sidebar";
import { Adsense } from "@/components/shared/client-adsense";

export default function AppSiteShell({ children }) {
  const pathname = usePathname() || "/";
  const isAuthPage = pathname.includes("auth");

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: isAuthPage ? "white" : "#212830" }}>
        <div
          className={`container-mob ${
            isAuthPage ? "desktop-container-resize-auth" : "desktop-container-resize"
          }`}
        >
          <div className="d-flex" id="wrapper">
            {!isAuthPage && <SideNavBar />}
            <div id="page-content-wrapper">
              <div className="row">
                <div
                  className={`${
                    isAuthPage ? "col-lg-12 col-12" : "col-lg-9 col-12"
                  }`}
                >
                  <div style={{ marginTop: "6px", marginBottom: "3px" }}>
                    <Scrollnav />
                  </div>

                  <div style={{ marginTop: "0px" }}>{children}</div>
                </div>

                {!isAuthPage && (
                  <div className="col-lg-3 d-none d-lg-block">
                    <PersistentSidebar>
                      <Adsense
                        client="ca-pub-5665711413000284"
                        slot="4434810353"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                      />
                    </PersistentSidebar>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
