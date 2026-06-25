import BlogLargeContent from "./blog-large-content";
import { fetchBlogPostContent } from "../../lib/blog/fetch-blog-post";
import { stripLeadingExcerptFromHtml } from "../../lib/blog/blog-utils";

export default async function BlogPostBody({
  slug,
  excerpt,
  isLargeArticle,
  contentUrl,
}) {
  return (
    <section className="blog-article-body" aria-label="Article content">
      {isLargeArticle ? (
        <BlogLargeContent
          slug={slug}
          contentUrl={contentUrl}
          excerpt={excerpt}
        />
      ) : (
        <BlogPostInlineContent slug={slug} excerpt={excerpt} />
      )}
    </section>
  );
}

async function BlogPostInlineContent({ slug, excerpt }) {
  const content = await fetchBlogPostContent(slug);

  if (!content) {
    return (
      <p className="blog-article-empty" style={{ color: "#666", lineHeight: 1.8 }}>
        This article has no content yet.
      </p>
    );
  }

  const html = stripLeadingExcerptFromHtml(content, excerpt);

  return (
    <div
      className="blog-html-content"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
