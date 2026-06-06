"use client";

import React from "react";
import MyCalendar from "../includes/Calendar";
import FixtureOfTheDay from "../shared/Fixtureoftheday";

function PersistentSidebar({ children }) {
  return (
    <div className="persistent-sidebar" style={{ marginTop: "6px" }}>
      <MyCalendar />
      <br />
      <FixtureOfTheDay />
      {children ? (
        <>
          <br />
          {children}
        </>
      ) : null}
    </div>
  );
}

export default React.memo(PersistentSidebar);
