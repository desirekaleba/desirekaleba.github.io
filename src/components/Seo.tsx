import { useEffect } from 'react';
import siteConfig from '@/data/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
}: SEOProps) => {
  const seoTitle = title ? `${title} | ${siteConfig.seo.siteName}` : siteConfig.seo.title;
  const seoDescription = description || siteConfig.seo.description;
  const seoImage = image || siteConfig.seo.openGraph.image;
  const seoUrl = url || siteConfig.seo.url;

  useEffect(() => {
    // Update document title
    document.title = seoTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoDescription);
    updateMetaTag('author', author || siteConfig.seo.siteName);
    
    // Open Graph tags
    updateMetaTag('og:title', seoTitle, true);
    updateMetaTag('og:description', seoDescription, true);
    updateMetaTag('og:image', seoImage, true);
    updateMetaTag('og:url', seoUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteConfig.seo.siteName, true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', seoTitle);
    updateMetaTag('twitter:description', seoDescription);
    updateMetaTag('twitter:image', seoImage);
    updateMetaTag('twitter:site', import.meta.env.VITE_TWITTER_HANDLE || '@desirekaleba');

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      if (author) {
        updateMetaTag('article:author', author, true);
      }
      tags.forEach(tag => {
        const tagElement = document.createElement('meta');
        tagElement.setAttribute('property', 'article:tag');
        tagElement.setAttribute('content', tag);
        document.head.appendChild(tagElement);
      });
    }

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = seoUrl;

    // JSON-LD structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebSite',
      name: seoTitle,
      description: seoDescription,
      url: seoUrl,
      image: seoImage,
      ...(type === 'article' && {
        author: {
          '@type': 'Person',
          name: author || siteConfig.seo.siteName,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.seo.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.seo.url}/logo.png`,
          },
        },
        datePublished: publishedTime,
        dateModified: modifiedTime,
        keywords: tags.join(', '),
      }),
      ...(type === 'website' && {
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.seo.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }),
    };

    // Remove existing JSON-LD
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function to remove article tags when component unmounts
    return () => {
      if (type === 'article') {
        const articleTags = document.querySelectorAll('meta[property="article:tag"]');
        articleTags.forEach(tag => tag.remove());
      }
    };
  }, [seoTitle, seoDescription, seoImage, seoUrl, type, publishedTime, modifiedTime, author, tags]);

  return null;
};

export default SEO;
