import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { blogPosts, getAllTags, getBlogPostsByTag } from "@/data/blogPosts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Extract all unique tags from blog posts
  const allTags = getAllTags();
  
  // Filter blog posts by selected tag
  const filteredPosts = selectedTag
    ? getBlogPostsByTag(selectedTag)
    : blogPosts;
  
  // Posts are already sorted by date in blogPosts.ts
  const sortedPosts = filteredPosts;

  return (
    <Layout>
      <section className="section">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="mb-4">Technical Writing</h1>
            <p className="text-lg text-muted-foreground">
              Deep dives into systems design, performance optimization, 
              and engineering leadership.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              onClick={() => setSelectedTag(null)}
              className="mb-2"
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
                className="mb-2"
              >
                {tag}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          {sortedPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No posts found for the selected tag.
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedTag(null)}
                className="mt-4"
              >
                View all posts
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
