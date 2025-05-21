import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, ExternalLink } from "lucide-react";
import { Project } from "@/data/projects";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm font-medium mb-2">Problem:</p>
        <p className="text-sm text-muted-foreground mb-4">{project.problem}</p>
        
        <p className="text-sm font-medium mb-2">Tech Stack:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {project.githubUrl && (
          <Button asChild variant="outline" size="sm">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Github className="h-4 w-4 mr-2" />
              Code
            </a>
          </Button>
        )}
        {project.demoUrl && (
          <Button asChild variant="outline" size="sm">
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
