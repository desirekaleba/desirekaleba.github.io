import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

const SocialLinks = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      <Button variant="outline" size="icon" asChild>
        <a
          href="https://github.com/desirekaleba"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a
          href="https://www.linkedin.com/in/desire-kaleba-a0a122197"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a
          href="mailto:desirekaleba@gmail.com"
          aria-label="Email"
        >
          <Mail className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
};

export default SocialLinks;
