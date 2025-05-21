import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useSiteConfig from "@/hooks/useSiteConfig";
import ResumeViewer from "@/components/ui/resume-viewer";

const Hero = () => {
  const { hero } = useSiteConfig();
  
  return (
    <section className="py-20 md:py-28">
      <div className="container-lg text-center md:text-left">
        <div className="animate-fade-in">
          <div className="inline-block px-3 py-1 mb-6 text-sm font-semibold rounded-full bg-primary/10 text-primary">
            {hero.jobTitle}
          </div>
          
          <h1 className="mb-4">
            <span className="block text-xl font-semibold mb-3 text-primary">
              {hero.greeting}
            </span>
            {hero.name}
            <span className="block text-2xl md:text-3xl font-mono font-semibold mt-3">
              {hero.tagline}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 mb-8">
            {hero.description}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-12">
            <Button asChild size="lg">
              <Link to="/contact" className="gap-2">
                Get in Touch <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <ResumeViewer 
              resumePath={hero.resumePath}
              buttonText="View Resume"
              buttonVariant="outline"
              buttonSize="lg"
              className="gap-2"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-border">
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-primary">{hero.stats.yearsOfExperience}+</p>
              <p className="text-muted-foreground">Years of Experience</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-primary">{hero.stats.projectsCompleted}+</p>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-primary">{hero.stats.leadershipPositions}+</p>
              <p className="text-muted-foreground">Leadership Positions</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-primary">{hero.stats.technicalPublications}+</p>
              <p className="text-muted-foreground">Technical Publications</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
