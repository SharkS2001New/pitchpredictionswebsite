import { notFound } from "next/navigation";
import BlogArticleJsonLd from "../../../components/blog/blog-article-json-ld";
import BlogPostBody from "../../../components/blog/blog-post-body";
import BlogPostHeader from "../../../components/blog/blog-post-header";
import { LARGE_BLOG_CONTENT_BYTES } from "../../../lib/blog/blog-content-config";
import {
  ensureBlogPostContentCached,
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

      <BlogPostBody
        slug={slug}
        isLargeArticle={isLargeArticle}
        contentUrl={contentInfo.publicUrl}
      />

      <br />
    </div>
  );
}
