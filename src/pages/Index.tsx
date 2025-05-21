import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blogPosts";
import Layout from "@/components/Layout";
import { Download, Briefcase, User, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  // Get the most recent 3 projects
  const featuredProjects = projects.slice(0, 3);
  
  // Get the most recent 3 blog posts
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Skills data
  const skills = {
    languages: ["Rust", "Go", "TypeScript", "Python", "C/C++"],
    frameworks: ["Tokio", "Actix", "React", "Node.js", "gRPC"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "Cassandra", "ClickHouse"],
    cloud: ["AWS", "Kubernetes", "Terraform", "Docker", "GCP"],
    other: ["Distributed Systems", "Compiler Design", "Performance Tuning", "System Architecture", "Leadership"]
  };

  // Experience data
  const experience = [
    {
      company: "Tech Leader Inc.",
      title: "Staff Software Engineer",
      period: "2022 - Present",
      description: "Leading architecture design for distributed systems processing millions of transactions daily. Mentoring team members and driving adoption of Rust for performance-critical components."
    },
    {
      company: "Scale Systems",
      title: "Senior Software Engineer",
      period: "2019 - 2022",
      description: "Developed high-performance data processing pipelines and microservices architecture. Reduced system latency by 40% through optimization and redesign."
    },
    {
      company: "Innovation Labs",
      title: "Software Engineer",
      period: "2016 - 2019",
      description: "Built backend services and APIs for cloud-native applications. Contributed to open-source projects and led transition to containerized infrastructure."
    }
  ];

  return (
    <Layout>
      <Hero />
      
      {/* Resume Download Banner */}
      <div className="bg-primary/10 py-6">
        <div className="container-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-semibold text-xl">Want to see my full experience?</h3>
            <p className="text-muted-foreground">Download my resume for a comprehensive overview of my skills and experience.</p>
          </div>
          <Button asChild size="lg" className="whitespace-nowrap">
            <a href="/path/to/cv.pdf" download>
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </a>
          </Button>
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
