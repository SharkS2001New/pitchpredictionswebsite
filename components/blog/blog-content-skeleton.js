"use client";

export default function BlogContentSkeleton() {
  return (
    <div aria-hidden="true" className="blog-content-skeleton">
      {[0.95, 1, 0.88, 1, 0.72, 1, 0.9, 0.65].map((width, index) => (
        <div
          key={index}
          style={{
            height: index % 3 === 0 ? "1.25rem" : "0.85rem",
            width: `${width * 100}%`,
            marginBottom: "0.75rem",
            borderRadius: "4px",
            background:
              "linear-gradient(90deg, #e8e8e8 0%, #f5f5f5 50%, #e8e8e8 100%)",
            backgroundSize: "200% 100%",
            animation: "blog-skeleton-shimmer 1.4s ease-in-out infinite",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes blog-skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
