/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_SITE_NAME: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_GA_TRACKING_ID?: string;
  readonly VITE_HOTJAR_ID?: string;
  readonly VITE_TWITTER_HANDLE: string;
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_LINKEDIN_URL: string;
  readonly VITE_BLOG_POSTS_PER_PAGE: string;
  readonly VITE_PROJECTS_PER_PAGE: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_CONTACT_FORM: string;
  readonly VITE_ENABLE_BLOG: string;
  readonly VITE_CSP_NONCE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 