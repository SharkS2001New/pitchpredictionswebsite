import { notFound } from "next/navigation";
import BlogArticleJsonLd from "../../../components/blog/blog-article-json-ld";
import BlogLargeContent from "../../../components/blog/blog-large-content";
import BlogPostHeader from "../../../components/blog/blog-post-header";
import { LARGE_BLOG_CONTENT_BYTES } from "../../../lib/blog/blog-content-config";
import {
  ensureBlogPostContentCached,
  fetchBlogPostContent,
  fetchBlogPostMeta,
} from "../../../lib/blog/fetch-blog-post";
import {
  getBlogAuthor,
  getBlogCategoryLabel,
  getBlogMetaDescription,
  getBlogMetaKeywords,
  getBlogMetaTitle,
  getFeaturedImage,
} from "../../../lib/blog/blog-utils";

export const revalidate = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meta = await fetchBlogPostMeta(slug);

  if (!meta) {
    return {
      title: "Blog not found | Pitch Predictions",
    };
  }

  const pageTitle = getBlogMetaTitle(meta);
  const title = `${pageTitle} | Pitch Predictions`;
  const description = getBlogMetaDescription(meta);
  const keywords = getBlogMetaKeywords(meta);
  const featuredImage = getFeaturedImage(meta);
  const canonicalUrl = `https://www.pitchpredictions.com/blog/${slug}`;

  return {
    title,
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: "Pitch Predictions",
      images: featuredImage ? [{ url: featuredImage }] : undefined,
      publishedTime: meta.published_at || meta.created_at || undefined,
      modifiedTime: meta.updated_at || undefined,
      authors: [getBlogAuthor(meta)],
      section: getBlogCategoryLabel(meta),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: featuredImage ? [featuredImage] : undefined,
      site: "@pitchpredictions",
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const meta = await fetchBlogPostMeta(slug);

  if (!meta) {
    notFound();
  }

  const contentInfo = await ensureBlogPostContentCached(slug);
  const isLargeArticle = contentInfo.size > LARGE_BLOG_CONTENT_BYTES;

  return (
    <div
      className="blogs-page"
      style={{
        maxWidth: "850px",
        padding: "0 1rem",
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
      }}
    >
      <BlogArticleJsonLd meta={meta} slug={slug} />
      <BlogPostHeader meta={meta} />

      {isLargeArticle ? (
        <>
          {meta.excerpt ? (
            <p
              className="blog-excerpt"
              style={{
                lineHeight: "1.8",
                fontSize: "1rem",
                color: "#444",
                marginBottom: "1.5rem",
              }}
            >
              {meta.excerpt}
            </p>
          ) : null}
          <BlogLargeContent slug={slug} contentUrl={contentInfo.publicUrl} />
        </>
      ) : (
        <BlogPostInlineContent slug={slug} />
      )}

      <br />
    </div>
  );
}

async function BlogPostInlineContent({ slug }) {
  const content = await fetchBlogPostContent(slug);

  if (!content) {
    return (
      <p style={{ color: "#666", lineHeight: 1.8 }}>
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
