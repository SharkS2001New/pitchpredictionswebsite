import React from "react";

function PreLoader() {
  const rows = [...Array(20)]; // Example: 5 skeleton rows

  return (
    <div className="skeleton-page">
      {/* Header skeleton */}
      <div className="skeleton-header"></div>

      {/* Table rows skeleton */}
      {rows.map((_, index) => (
        <div key={index} className="skeleton-row">
          {/* Flag Section */}
          <div className="skeleton-cell skeleton-flag"></div>

          {/* League Section */}
          <div className="skeleton-cell skeleton-team"></div>

          {/* Odds Section */}
          <div className="skeleton-cell skeleton-odds"></div>
          <div className="skeleton-cell skeleton-odds"></div>
          <div className="skeleton-cell skeleton-odds"></div>

          {/* Avg Section */}
          <div className="skeleton-cell skeleton-avg"></div>

          {/* Time Section */}
          <div className="skeleton-cell skeleton-time"></div>
        </div>
      ))}
    </div>
  );
}

export default PreLoader;
