import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <p>Blog not found</p>
      <Link href="/blog" className="btn btn-outline-primary btn-sm">
        ← Back to Blogs
      </Link>
    </div>
  );
}
