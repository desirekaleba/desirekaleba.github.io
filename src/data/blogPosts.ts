// Manual imports for authentic blog posts
import masteringRustAsyncMd from './blog-posts/mastering-rust-async.md?raw';
import distributedSystemsRustMd from './blog-posts/distributed-systems-rust.md?raw';
import rustPerformanceOptimizationMd from './blog-posts/rust-performance-optimization.md?raw';
import rustVsGoPerformanceAnalysisMd from './blog-posts/rust-vs-go-performance-analysis.md?raw';
import buildingDistributedCacheRustMd from './blog-posts/building-distributed-cache-rust.md?raw';
import zeroCopySerializationRustMd from './blog-posts/zero-copy-serialization-rust.md?raw';
import consensusAlgorithmsRustMd from './blog-posts/consensus-algorithms-rust.md?raw';
import memoryEfficientDataStructuresRustMd from './blog-posts/memory-efficient-data-structures-rust.md?raw';
import monorepoArchitectureTypescriptMd from './blog-posts/monorepo-architecture-typescript.md?raw';
import nodejsMentoringLessonsMd from './blog-posts/nodejs-mentoring-lessons.md?raw';

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    tags: string[];
    featured?: boolean;
    readTime?: number;
    content?: string; // Add content field for the markdown content
}

// Simple frontmatter parser
interface FrontmatterData {
  title?: string;
  slug?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  featured?: boolean;
  readTime?: number;
}

function parseFrontmatter(content: string): { data: FrontmatterData; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  const [, frontmatterStr, markdownContent] = match;
  
  // Simple YAML parser for our specific use case
  const data: Record<string, unknown> = {};
  
  frontmatterStr.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();
    
    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Handle arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      data[key] = arrayContent.split(',').map(item => 
        item.trim().replace(/^["']|["']$/g, '')
      ).filter(item => item.length > 0);
    }
    // Handle booleans
    else if (value === 'true') {
      data[key] = true;
    } else if (value === 'false') {
      data[key] = false;
    }
    // Handle numbers
    else if (/^\d+$/.test(value)) {
      data[key] = parseInt(value, 10);
    }
    // Handle strings
    else {
      data[key] = value;
    }
  });
  
  return { data: data as FrontmatterData, content: markdownContent };
}

// Manual file mapping with authentic articles
const blogPostFiles = [
  { name: 'mastering-rust-async', content: masteringRustAsyncMd },
  { name: 'distributed-systems-rust', content: distributedSystemsRustMd },
  { name: 'rust-performance-optimization', content: rustPerformanceOptimizationMd },
  { name: 'rust-vs-go-performance-analysis', content: rustVsGoPerformanceAnalysisMd },
  { name: 'building-distributed-cache-rust', content: buildingDistributedCacheRustMd },
  { name: 'zero-copy-serialization-rust', content: zeroCopySerializationRustMd },
  { name: 'consensus-algorithms-rust', content: consensusAlgorithmsRustMd },
  { name: 'memory-efficient-data-structures-rust', content: memoryEfficientDataStructuresRustMd },
  { name: 'monorepo-architecture-typescript', content: monorepoArchitectureTypescriptMd },
  { name: 'nodejs-mentoring-lessons', content: nodejsMentoringLessonsMd },
];

// Helper function to estimate read time based on content
function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to extract slug from filename
function extractSlugFromPath(path: string): string {
  return path.split('/').pop()?.replace('.md', '') || '';
}

// Parse all markdown files and create blog posts
export const blogPosts: BlogPost[] = blogPostFiles
  .map((file, index) => {
    try {
      const { data: frontmatter, content: markdownContent } = parseFrontmatter(file.content);
      
      const slug = frontmatter.slug || file.name;
      
      const post = {
        id: index + 1,
        title: frontmatter.title || 'Untitled',
        slug,
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        excerpt: frontmatter.excerpt || '',
        tags: frontmatter.tags || [],
        featured: frontmatter.featured || false,
        readTime: frontmatter.readTime || estimateReadTime(markdownContent),
        content: markdownContent,
      } as BlogPost;
      
      return post;
    } catch (error) {
      console.error(`Error parsing blog post ${file.name}:`, error);
      return null;
    }
  })
  .filter((post): post is BlogPost => post !== null)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Helper function to get a single blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Helper function to get featured blog posts
export function getFeaturedBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

// Helper function to get blog posts by tag
export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}

// Helper function to get all unique tags
export function getAllTags(): string[] {
  const allTags = blogPosts.flatMap(post => post.tags);
  return Array.from(new Set(allTags)).sort();
}
  