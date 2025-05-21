
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost } from "@/data/blogPosts";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <Link to={`/blog/${post.slug}`} className="flex-grow no-underline">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
          <CardDescription className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default BlogCard;
