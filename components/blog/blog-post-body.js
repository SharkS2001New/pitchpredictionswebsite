import BlogLargeContent from "./blog-large-content";
import { fetchBlogPostContent } from "../../lib/blog/fetch-blog-post";

export default async function BlogPostBody({
  slug,
  isLargeArticle,
  contentUrl,
}) {
  return (
    <section className="blog-article-body" aria-label="Article content">
      {isLargeArticle ? (
        <BlogLargeContent slug={slug} contentUrl={contentUrl} />
      ) : (
        <BlogPostInlineContent slug={slug} />
      )}
    </section>
  );
}

async function BlogPostInlineContent({ slug }) {
  const content = await fetchBlogPostContent(slug);

  if (!content) {
    return (
      <p className="blog-article-empty" style={{ color: "#666", lineHeight: 1.8 }}>
        This article has no content yet.
      </p>
    );
  }

  return (
    <div
      className="blog-html-content"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
