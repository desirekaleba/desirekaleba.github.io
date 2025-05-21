import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import { useEffect } from "react";

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
  
  // Convert markdown-like content to HTML (basic implementation)
  const formatContent = (content: string) => {
    // Split by lines and process
    const lines = content.split("\n");
    let html = "";
    let inCodeBlock = false;
    let codeContent = "";
    
    lines.forEach((line) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End code block
          html += `<pre><code>${codeContent}</code></pre>`;
          inCodeBlock = false;
          codeContent = "";
        } else {
          // Start code block
          inCodeBlock = true;
        }
        return;
      }
      
      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }
      
      // Handle headers
      if (line.startsWith("# ")) {
        html += `<h1 class="text-3xl font-bold mt-8 mb-4">${line.substring(2)}</h1>`;
      } else if (line.startsWith("## ")) {
        html += `<h2 class="text-2xl font-bold mt-6 mb-3">${line.substring(3)}</h2>`;
      } else if (line.startsWith("### ")) {
        html += `<h3 class="text-xl font-bold mt-5 mb-2">${line.substring(4)}</h3>`;
      } else if (line.trim() === "") {
        // Empty line
        html += "<br/>";
      } else {
        // Regular paragraph
        html += `<p class="mb-4">${line}</p>`;
      }
    });
    
    return html;
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
          
          <div className="prose" dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
          
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
