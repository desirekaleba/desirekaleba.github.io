# Staff Engineer Personal Site

A production-ready professional website built with React, TypeScript, Vite, and Tailwind CSS. Optimized for performance, SEO, and scalability. **Updated to use Node.js 22 LTS** for the latest performance and security improvements.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Latest LTS**: Node.js 22 LTS (current), pnpm 9+, ES2022 target
- **Production Ready**: Docker containerization, Nginx optimization, security headers
- **SEO Optimized**: Meta tags, structured data, sitemap, robots.txt
- **Performance**: Code splitting, lazy loading, optimized bundles
- **Analytics**: Google Analytics and Hotjar integration
- **Error Handling**: Comprehensive error boundaries and logging
- **Responsive Design**: Mobile-first approach with modern UI components
- **Type Safety**: Full TypeScript coverage with strict configuration
- **CI/CD Ready**: GitHub Actions workflow included

## 🛠️ Development

### Prerequisites

- Node.js 22+ (Current LTS)
- pnpm 9+

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd rust_staff_engineer_personal_site

# Install dependencies
pnpm install

# Copy environment variables
cp env.example .env.local

# Start development server
pnpm run dev
```

### Available Scripts

```bash
# Development
pnpm run dev              # Start development server
pnpm run type-check       # Run TypeScript type checking

# Building
pnpm run build            # Production build
pnpm run build:dev        # Development build
pnpm run build:analyze    # Build with bundle analysis

# Code Quality
pnpm run lint             # Run ESLint
pnpm run lint:fix         # Fix ESLint issues

# Preview
pnpm run preview          # Preview production build
pnpm run preview:prod     # Preview on port 3000
```

## 🆕 Latest Updates

### Node.js 22 LTS Migration
- **Upgraded to Node.js 22 LTS** (Current LTS - Codename "Jod") for best performance and long-term support
- **ES2022 target** for modern JavaScript features
- **pnpm 9+** for improved package management
- **Updated dependencies** to latest stable versions
- **Enhanced Docker configuration** with health checks and security

### Performance Improvements
- Modern JavaScript features (ES2022)
- Better tree-shaking and code splitting
- Optimized bundle sizes
- Enhanced build performance

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build and run production container
pnpm run docker:build
pnpm run docker:run

# Or use Docker Compose
pnpm run docker:prod
```

### Development with Docker

```bash
# Run development environment
pnpm run docker:dev
```

### Manual Docker Commands

```bash
# Build production image (uses Node 22 LTS)
docker build -t staff-engineer-site .

# Run production container
docker run -p 80:80 staff-engineer-site

# Run with environment variables
docker run -p 80:80 \
  -e VITE_GA_TRACKING_ID=your-ga-id \
  -e VITE_ENABLE_ANALYTICS=true \
  staff-engineer-site
```

## 🌐 Production Deployment

### Environment Variables

Create a `.env.production` file with:

```bash
VITE_SITE_URL=https://yourdomain.com
VITE_SITE_NAME=Your Name
VITE_CONTACT_EMAIL=your@email.com
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=1234567
VITE_TWITTER_HANDLE=@yourhandle
VITE_GITHUB_USERNAME=yourusername
VITE_LINKEDIN_URL=https://linkedin.com/in/yourprofile
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CONTACT_FORM=true
VITE_ENABLE_BLOG=true
```

### Deployment Platforms

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build command: pnpm run build
# Publish directory: dist
# Node version: 22
```

#### AWS/DigitalOcean/VPS
```bash
# Use the Docker setup
docker-compose --profile prod up -d
```

#### GitHub Actions
The project includes a GitHub Actions workflow that:
- Uses Node.js 22 LTS (Current LTS)
- Runs tests, linting, and type checking
- Builds and tests Docker images
- Ready for deployment to any platform

## 📊 Performance Optimizations

- **Code Splitting**: Automatic vendor and route-based splitting
- **Bundle Analysis**: Use `pnpm run build:analyze` to analyze bundle size
- **Modern JavaScript**: ES2022 features for better performance
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Aggressive caching for static assets
- **Compression**: Gzip compression enabled
- **Lazy Loading**: Components and routes loaded on demand

## 🔒 Security Features

- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Content Security Policy**: Strict CSP with allowlisted domains
- **Input Sanitization**: All user inputs sanitized
- **Error Boundaries**: Graceful error handling
- **Environment Variables**: Sensitive data in environment variables
- **Docker Security**: Non-root user, minimal attack surface

## 📈 Analytics & Monitoring

- **Google Analytics**: Page views, events, conversions
- **Hotjar**: User behavior analysis
- **Error Tracking**: Production error logging
- **Performance Monitoring**: Core Web Vitals tracking
- **Health Checks**: Docker and application health monitoring

## 🎨 Customization

### Site Configuration

All site content is managed through `src/data/siteConfig.ts`:

```typescript
const siteConfig = {
  seo: {
    title: "Your Name | Staff Software Engineer",
    description: "Your description",
    siteName: "Your Name",
    url: "https://yourdomain.com",
  },
  hero: {
    jobTitle: "Staff Software Engineer",
    name: "Your Name",
    tagline: "Your tagline",
    description: "Your description",
    // ... more configuration
  },
  // ... navigation and other settings
};
```

### Adding Content

- **Blog Posts**: Add markdown files to `src/data/blog-posts/`
- **Projects**: Update `src/data/projects.ts`
- **About Page**: Modify `src/pages/About.tsx`

## 🧪 Testing

```bash
# Type checking
pnpm run type-check

# Linting
pnpm run lint

# Build verification
pnpm run build
```

## 📝 SEO Checklist

- ✅ Meta tags and Open Graph
- ✅ Structured data (JSON-LD)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Performance optimization
- ✅ Mobile responsiveness
- ✅ Accessibility features

## 🚀 Deployment Checklist

- [ ] Update environment variables
- [ ] Configure analytics tracking IDs
- [ ] Update site URLs in configuration
- [ ] Test production build locally
- [ ] Verify all external links
- [ ] Check mobile responsiveness
- [ ] Test contact form functionality
- [ ] Verify SEO meta tags
- [ ] Set up monitoring and alerts
- [ ] Verify Node.js 22 LTS compatibility

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub or contact [your-email@domain.com](mailto:your-email@domain.com).