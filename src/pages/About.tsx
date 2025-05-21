import { Button } from "@/components/ui/button";
import SocialLinks from "@/components/SocialLinks";
import Layout from "@/components/Layout";
import { Calendar } from "lucide-react";
import useSiteConfig from "@/hooks/useSiteConfig";
import ResumeViewer from "@/components/ui/resume-viewer";

const About = () => {
  const { hero, seo } = useSiteConfig();
  
  const skills = {
    languages: ["Rust", "Go", "TypeScript", "Python", "C/C++"],
    frameworks: ["Tokio", "Actix", "React", "Node.js", "gRPC"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "Cassandra", "ClickHouse"],
    cloud: ["AWS", "Kubernetes", "Terraform", "Docker", "GCP"],
    other: ["Distributed Systems", "Compiler Design", "Performance Tuning", "System Architecture", "Leadership"]
  };

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
    <Layout 
      title="About Me"
      description="Learn more about my background, skills, and experience as a Staff Software Engineer specializing in Rust and distributed systems."
    >
      <section className="py-12 md:py-20">
        <div className="container-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="col-span-1">
              <div className="sticky top-24">
                <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                  <div className="w-32 h-32 mx-auto bg-muted rounded-full mb-6 overflow-hidden">
                    {/* Placeholder for profile image */}
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                      {seo.siteName.split(' ').map(word => word[0]).join('')}
                    </div>
                  </div>
                  
                  <h3 className="text-center mb-2">{seo.siteName}</h3>
                  <p className="text-center text-muted-foreground mb-4">{hero.jobTitle}</p>
                  
                  <div className="flex justify-center mb-6">
                    <SocialLinks />
                  </div>
                  
                  <ResumeViewer
                    resumePath={hero.resumePath}
                    buttonText="View CV"
                    fullWidth
                  />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <h1 className="mb-6">About Me</h1>
              
              <div className="prose max-w-none mb-12">
                <p className="text-lg">
                  I'm a Staff Software Engineer with over 10 years of experience building robust, scalable systems. 
                  My expertise lies in distributed systems architecture, high-performance computing, and systems programming.
                </p>
                
                <p>
                  I specialize in designing and implementing complex backend systems that handle millions of transactions 
                  daily. My focus is on creating reliable, maintainable, and efficient software that solves real business problems.
                </p>
                
                <p>
                  Throughout my career, I've led engineering teams, mentored junior developers, and contributed to 
                  architectural decisions that shaped product direction. I'm passionate about clean code, thoughtful 
                  system design, and building software that stands the test of time.
                </p>
              </div>
              
              <h2 className="mb-4">Skills & Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="bg-card rounded-lg p-6">
                    <h3 className="capitalize mb-4">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <h2 className="mb-6">Work Experience</h2>
              <div className="space-y-8 mb-8">
                {experience.map((job, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-muted pb-8">
                    <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                    <h3 className="font-bold">{job.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <span className="font-medium">{job.company}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {job.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
