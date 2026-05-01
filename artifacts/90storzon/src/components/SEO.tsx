import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const SITE_NAME = "90StorZon";
const BASE_URL = "https://90storzon.com";
const DEFAULT_IMAGE = `${BASE_URL}/opengraph.jpg`;
const DEFAULT_DESCRIPTION = "90StorZon — your all-in-one hub for free online tools, quality products, and expert knowledge.";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  canonical,
  noIndex = false,
  structuredData,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const resolvedOgTitle = ogTitle || fullTitle;
  const resolvedOgDesc = ogDescription || description;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    if (noIndex) setMeta("robots", "noindex,nofollow");

    setMeta("og:title", resolvedOgTitle, "property");
    setMeta("og:description", resolvedOgDesc, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    if (canonical) setMeta("og:url", `${BASE_URL}${canonical}`, "property");

    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", resolvedOgTitle, "name");
    setMeta("twitter:description", resolvedOgDesc, "name");
    setMeta("twitter:image", ogImage, "name");

    if (canonical) setLink("canonical", `${BASE_URL}${canonical}`);

    if (structuredData) {
      let sd = document.getElementById("structured-data") as HTMLScriptElement | null;
      if (!sd) {
        sd = document.createElement("script");
        sd.id = "structured-data";
        sd.type = "application/ld+json";
        document.head.appendChild(sd);
      }
      sd.textContent = JSON.stringify(structuredData);
    }
  }, [fullTitle, description, keywords, resolvedOgTitle, resolvedOgDesc, ogImage, ogType, canonical, noIndex, structuredData]);

  return null;
}
