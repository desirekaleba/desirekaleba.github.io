import { Button } from "@/components/ui/button";
import SocialLinks from "@/components/SocialLinks";
import Layout from "@/components/Layout";
import { Calendar } from "lucide-react";
import useSiteConfig from "@/hooks/useSiteConfig";
import ResumeViewer from "@/components/ui/resume-viewer";

const About = () => {
  const { hero, seo } = useSiteConfig();
  
  const skills = {
    languages: ["TypeScript", "JavaScript (ES6+)", "Python", "Go", "Rust", "Java"],
    frameworks: ["React.js", "Next.js", "Node.js", "NestJS", "Express", "Django"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    cloud: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins"],
    other: ["Microservices", "Monorepo", "TDD", "BDD", "Agile", "DevOps"]
  };

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
    },
    {
      company: "SideHustle",
      title: "Node.js Mentor & Technical Curriculum Developer",
      period: "Feb 2022 - Dec 2022",
      description: "Mentored over 1,800 junior developers on backend architecture, resilience, and real-world problem solving. Designed and recorded a Node.js curriculum, quizzes, and advanced capstone challenges."
    },
    {
      company: "ManakNight Digital",
      title: "Senior Software Developer",
      period: "May 2021 - July 2022",
      description: "Developed secure APIs with OAuth2, AWS, and MongoDB. Increased client product sales by 70% by reducing bugs and improving feature velocity."
    },
    {
      company: "Fasto Services",
      title: "Software Developer",
      period: "Oct 2019 - May 2021",
      description: "Designed scalable cloud solutions using Docker, AWS, Terraform, and Ansible. Led multiple deployments and performance-tuning efforts in production systems."
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
                  I'm a Lead Full-Stack Engineer with 7+ years of experience building scalable applications and 
                  leading distributed engineering teams. My expertise lies in TypeScript, Node.js, and cloud-native 
                  architecture, with a strong foundation in both backend and frontend development.
                </p>
                
                <p>
                  I specialize in designing and implementing complex backend systems, microservices architectures, 
                  and modern monorepo solutions. My recent work includes leading the architecture and development 
                  of modular systems using TypeScript, Turborepo, Prisma, and various cloud technologies. I'm 
                  passionate about solving complex challenges through clean code and engineering best practices.
                </p>
                
                <p>
                  Throughout my career, I've mentored over 1,800 junior developers, led cross-functional teams, 
                  and contributed to architectural decisions that shaped product direction. I have extensive 
                  experience with blockchain ecosystems, having integrated solutions with Solana, Arbitrum, 
                  and Optimism. I believe in continuous learning, knowledge sharing, and building software 
                  that makes a real impact.
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
