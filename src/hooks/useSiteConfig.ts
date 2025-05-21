import siteConfig from "@/data/siteConfig";

/**
 * Hook to access the site configuration
 * @returns The site configuration object
 */
export const useSiteConfig = () => {
  return siteConfig;
};

export default useSiteConfig;
