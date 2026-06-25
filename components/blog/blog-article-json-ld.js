import {
  getBlogAuthor,
  getBlogMetaDescription,
  getBlogMetaTitle,
} from "../../lib/blog/blog-utils";

export default function BlogArticleJsonLd({ meta, slug }) {
  if (!meta?.title) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    name: getBlogMetaTitle(meta),
    description: getBlogMetaDescription(meta),
    datePublished: meta.published_at || meta.created_at || undefined,
    dateModified: meta.updated_at || meta.published_at || meta.created_at || undefined,
    author: {
      "@type": "Person",
      name: getBlogAuthor(meta),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.pitchpredictions.com/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
