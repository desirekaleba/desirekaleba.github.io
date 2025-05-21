import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

const SocialLinks = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      <Button variant="outline" size="icon" asChild>
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a
          href="mailto:your.email@example.com"
          aria-label="Email"
        >
          <Mail className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
};

export default SocialLinks;
