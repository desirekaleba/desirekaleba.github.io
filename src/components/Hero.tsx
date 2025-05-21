import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container-lg text-center md:text-left">
        <div className="animate-fade-in">
          <div className="inline-block px-3 py-1 mb-6 text-sm font-semibold rounded-full bg-primary/10 text-primary">
            Staff Software Engineer
          </div>
          
          <h1 className="mb-4">
            <span className="block text-xl font-semibold mb-3 text-primary">
              Hello, I'm
            </span>
            Developer Name
            <span className="block text-2xl md:text-3xl font-mono font-semibold mt-3">
              Building Robust Distributed Systems
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 mb-8">
            I specialize in high-performance systems programming with Rust and Go, designing 
            scalable architectures that handle millions of transactions daily. With over 8 years of 
            experience, I've led teams and built software that powers critical infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-12">
            <Button asChild size="lg">
              <Link to="/contact" className="gap-2">
                Get in Touch <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="/path/to/cv.pdf" download>
                <Download className="h-4 w-4" /> Download Resume
              </a>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-border">
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-primary">8+</p>
              <p className="text-muted-foreground">Years of Experience</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-primary">20+</p>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-primary">5+</p>
              <p className="text-muted-foreground">Leadership Positions</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-primary">12+</p>
              <p className="text-muted-foreground">Technical Publications</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
