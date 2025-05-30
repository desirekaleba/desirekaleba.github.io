import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blogPosts";
import Layout from "@/components/Layout";
import { Briefcase, User, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ResumeViewer from "@/components/ui/resume-viewer";
import useSiteConfig from "@/hooks/useSiteConfig";

const Index = () => {
  // Get the most recent 3 projects
  const featuredProjects = projects.slice(0, 3);
  
  // Get the most recent 3 blog posts (already sorted by date in blogPosts.ts)
  const recentPosts = blogPosts.slice(0, 3);

  // Skills data
  const skills = {
    languages: ["TypeScript", "JavaScript (ES6+)", "Python", "Go", "Rust", "Java"],
    frameworks: ["React.js", "Next.js", "Node.js", "NestJS", "Express", "Django"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    cloud: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins"],
    other: ["Microservices", "Monorepo", "TDD", "BDD", "Agile", "DevOps"]
  };

  // Experience data
  const experience = [
    {
      company: "StartupBlink",
      title: "Lead Software Engineer",
      period: "Oct 2023 - Present",
      description: "Leading architecture and development of a modular monorepo using TypeScript, Turborepo, Prisma, Redis, and MySQL. Migrated legacy JS scripts to modern, scalable TypeScript packages, improving performance and team collaboration."
    },
    {
      company: "StartupBlink",
      title: "Software Developer",
      period: "Oct 2022 - Sep 2023",
      description: "Delivered web apps using React.js, Next.js, Node.js, and TailwindCSS. Boosted delivery speed by 30% by streamlining CI/CD pipelines and introducing code standards."
    },
    {
      company: "Entendre Finance",
      title: "Full-Stack Developer",
      period: "Sep 2022 - May 2023",
      description: "Built backend infrastructure using Node.js, AWS Lambda, and MongoDB in a monorepo architecture. Integrated blockchain ecosystems (Solana, Arbitrum, Optimism)."
    }
  ];

  const { hero } = useSiteConfig();
  
  return (
    <Layout>
      <Hero />
      
      {/* Resume Download Banner */}
      <div className="bg-primary/10 py-6">
        <div className="container-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-semibold text-xl">Want to see my full experience?</h3>
            <p className="text-muted-foreground">View my resume for a comprehensive overview of my skills and experience.</p>
          </div>
          <ResumeViewer 
            resumePath={hero.resumePath}
            buttonText="View Resume"
            buttonSize="lg"
            className="whitespace-nowrap"
          />
        </div>
      </div>
      
      {/* Experience Section */}
      <section className="section">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2>Professional Experience</h2>
              </div>
              <p className="text-muted-foreground">Over 8 years of industry experience building robust systems</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/about">View Full Experience</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {experience.map((job, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-xl mb-1">{job.title}</h3>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <span className="font-medium">{job.company}</span>
                    <span className="mx-2">•</span>
                    <span>{job.period}</span>
                  </div>
                  <p className="text-muted-foreground">{job.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="section bg-secondary/50">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-primary" />
                <h2>Skills & Expertise</h2>
              </div>
              <p className="text-muted-foreground">Specialized in high-performance distributed systems</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/about">View All Skills</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).slice(0, 3).map(([category, items]) => (
              <Card key={category} className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <h3 className="capitalize font-semibold mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="section">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2>Featured Projects</h2>
              </div>
              <p className="text-muted-foreground">Showcasing my best technical work</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section className="section bg-secondary/50">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <h2>Latest Articles</h2>
              </div>
              <p className="text-muted-foreground">Thoughts and insights on software engineering</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/blog">View All Articles</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
