import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Copy, Check } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  
  useEffect(() => {
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (!post) {
    return (
      <Layout>
        <div className="container-md py-20 text-center">
          <h1 className="mb-6">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Format date
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Copy code button component
  const CodeBlock = ({ className, children, language }: { className?: string, children: string, language: string }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };
    
    return (
      <div className="relative group">
        <div className="absolute right-2 top-2 z-10">
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center p-2 rounded-md bg-muted/80 hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label={copied ? "Copied!" : "Copy code to clipboard"}
            title={copied ? "Copied!" : "Copy code to clipboard"}
          >
            {copied ? (
              <div className="flex items-center gap-1">
                <Check size={14} />
                <span className="text-xs">Copied!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Copy size={14} />
                <span className="text-xs">Copy</span>
              </div>
            )}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={true}
          wrapLines={true}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <Layout>
      <article className="section">
        <div className="container-md">
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/blog" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          <h1 className="mb-4">{post.title}</h1>
          
          <div className="flex items-center text-muted-foreground mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm no-underline hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <div className="prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                code(props) {
                  const { className, children } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  
                  return match ? (
                    <CodeBlock 
                      language={match[1]}
                      className={className}
                    >
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  ) : (
                    <code className={className}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          
          <div className="border-t border-border mt-12 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-lg font-bold">
                  DN
                </div>
                <div>
                  <p className="font-medium">Developer Name</p>
                  <p className="text-sm text-muted-foreground">Staff Software Engineer</p>
                </div>
              </div>
              <SocialLinks />
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
