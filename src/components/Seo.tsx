import { useEffect } from 'react';
import useSiteConfig from '@/hooks/useSiteConfig';

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

/**
 * SEO component to dynamically update document head metadata
 */
const Seo = ({ title, description, path = '', image }: SeoProps) => {
  const { seo } = useSiteConfig();
  
  useEffect(() => {
    // Set document title
    document.title = title ? `${title} | ${seo.siteName}` : seo.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || seo.description);
    }
    
    // Update meta author
    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) {
      metaAuthor.setAttribute('content', seo.siteName);
    }
    
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | ${seo.siteName}` : seo.title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description || seo.description);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `${seo.url}${path}`);
    } else {
      const newOgUrl = document.createElement('meta');
      newOgUrl.setAttribute('property', 'og:url');
      newOgUrl.setAttribute('content', `${seo.url}${path}`);
      document.head.appendChild(newOgUrl);
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', image || seo.openGraph.image);
    }
    
    // Update Twitter tags
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', image || seo.openGraph.image);
    }
    
  }, [title, description, path, image, seo]);
  
  // This component doesn't render anything
  return null;
};

export default Seo;
