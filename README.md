# Staff Engineer Personal Site

A professional website built with React, TypeScript, Vite, and Tailwind CSS.

## Configuration System

This site uses a centralized configuration system that allows you to update content without modifying components directly. This acts like a simple CMS.

### Site Configuration

All site content is stored in `src/data/siteConfig.ts`. This includes:

- SEO metadata
- Hero section content
- Navigation links
- Logo text
- Resume path

To update any content on the site, simply modify the `siteConfig` object in this file.

### Using the Configuration in Components

The configuration is accessed through a custom hook:

```tsx
import useSiteConfig from '@/hooks/useSiteConfig';

const MyComponent = () => {
  const { seo, hero, navigation } = useSiteConfig();
  
  return (
    <div>
      <h1>{seo.siteName}</h1>
      <p>{hero.description}</p>
    </div>
  );
};
```

### SEO Component

The site includes a `Seo` component that dynamically updates document metadata based on the site configuration:

```tsx
// In page components:
<Layout 
  title="Custom Page Title" 
  description="Custom page description"
  image="/custom-image.jpg"
>
  {/* Page content */}
</Layout>
```

If no custom metadata is provided, the default values from `siteConfig` will be used.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```