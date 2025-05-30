import React, { useRef } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Eye, Printer, X } from "lucide-react";
import useSiteConfig from "@/hooks/useSiteConfig";
import { cn } from "@/lib/utils";

interface ResumeViewerProps {
  resumePath: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  iconOnly?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const ResumeViewer = ({
  resumePath,
  buttonText = "View CV",
  buttonVariant = "default",
  buttonSize = "default",
  iconOnly = false,
  fullWidth = false,
  className = "",
}: ResumeViewerProps) => {
  const { hero, seo } = useSiteConfig();
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    const content = resumeRef.current;
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Resume - ${seo.siteName}</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                  line-height: 1.5;
                  color: #333;
                  background-color: white;
                  padding: 20px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                h1, h2, h3 {
                  margin-top: 0;
                }
                h1 { 
                  font-size: 24px;
                  text-align: center;
                }
                h2 {
                  font-size: 18px;
                  border-bottom: 1px solid #ddd;
                  padding-bottom: 8px;
                  margin-bottom: 16px;
                }
                h3 {
                  font-size: 16px;
                  margin-bottom: 4px;
                }
                p, ul {
                  margin-top: 0;
                  margin-bottom: 16px;
                }
                ul {
                  padding-left: 20px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 24px;
                }
                .section {
                  margin-bottom: 24px;
                }
                .skill-tag {
                  display: inline-block;
                  padding: 4px 10px;
                  background-color: #f5f5f5;
                  border-radius: 20px;
                  margin-right: 8px;
                  margin-bottom: 8px;
                  font-size: 13px;
                }
                .job-header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                }
                .job-date, .edu-date {
                  color: #666;
                  font-size: 14px;
                }
                .job-company, .edu-institution {
                  color: #666;
                  font-size: 14px;
                }
                .edu-header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                }
                .contact-info {
                  text-align: center;
                  font-size: 14px;
                  color: #666;
                  margin-bottom: 8px;
                }
                .skills-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 16px;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                }
              </style>
            </head>
            <body>
              ${content.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={`${fullWidth ? "w-full" : ""} ${className}`}
        >
          {iconOnly ? (
            <Eye className="h-4 w-4" />
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden sm:rounded-lg">
        {/* Hidden accessibility components */}
        <DialogTitle className="sr-only">Resume - {seo.siteName}</DialogTitle>
        <DialogDescription className="sr-only">
          Professional resume and CV for {seo.siteName}, {hero.jobTitle}. View, print, or download the resume.
        </DialogDescription>
        
        {/* Custom header with actions and proper spacing */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="flex justify-between items-center w-full sm:w-auto">
            <h3 className="font-semibold text-xl sm:text-2xl">Resume</h3>
            {/* Mobile close button, visible only on small screens */}
            <DialogClose className="sm:hidden rounded-sm opacity-70 ring-offset-background hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-start">
            <Button onClick={handlePrint} size="sm" variant="outline">
              <Printer className="mr-1 h-4 w-4" />
              <span className="text-xs sm:text-sm">Print</span>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={resumePath} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" />
                <span className="text-xs sm:text-sm">Open</span>
              </a>
            </Button>
            <Button asChild size="sm">
              <a href={resumePath} download>
                <Download className="mr-1 h-4 w-4" />
                <span className="text-xs sm:text-sm">Download</span>
              </a>
            </Button>
          </div>
          
          {/* Desktop close button, hidden on small screens */}
          <DialogClose className="hidden sm:flex absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        
        {/* Resume content */}
        <div className="flex-1 overflow-auto p-4">
          <div 
            ref={resumeRef}
            className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-lg shadow-sm border border-border"
          >
            {/* Header */}
            <div className="mb-6 sm:mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{seo.siteName}</h1>
              <p className="text-base sm:text-lg font-medium text-muted-foreground mb-2">{hero.jobTitle}</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <span>desirekaleba@gmail.com</span>
                <span className="hidden sm:inline">•</span>
                <span>LinkedIn</span>
                <span className="hidden sm:inline">•</span>
                <span>GitHub</span>
              </div>
            </div>
            
            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Professional Summary</h2>
              <p className="text-muted-foreground">
                Lead Full-Stack Engineer with 7+ years of experience building scalable applications and leading distributed engineering teams. 
                Proven expertise in TypeScript, Node.js, and cloud-native architecture, with a strong foundation in both backend and frontend development. 
                Passionate about solving complex challenges through clean code, mentoring developers, and continuously improving engineering practices. 
                Recently led a full migration to a monorepo architecture and built robust microservices used by thousands.
              </p>
            </div>
            
            {/* Experience */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Professional Experience</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Lead Software Engineer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">StartupBlink</span>
                      <span className="mx-2">•</span>
                      <span>Oct 2023 - Present</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Leading architecture and development of a modular monorepo using TypeScript, Turborepo, Prisma, Redis, and MySQL</li>
                    <li>Migrated legacy JS scripts to modern, scalable TypeScript packages, improving performance and team collaboration</li>
                    <li>Drive technical design decisions and mentor a cross-functional team on best practices and clean code</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Software Developer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">StartupBlink</span>
                      <span className="mx-2">•</span>
                      <span>Oct 2022 - Sep 2023</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Delivered web apps using React.js, Next.js, Node.js, and TailwindCSS</li>
                    <li>Boosted delivery speed by 30% by streamlining CI/CD pipelines and introducing code standards</li>
                    <li>Actively involved in stakeholder communication, ensuring tech alignment with business goals</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Full-Stack Developer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">Entendre Finance</span>
                      <span className="mx-2">•</span>
                      <span>Sep 2022 - May 2023</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Built backend infrastructure using Node.js, AWS Lambda, and MongoDB in a monorepo architecture</li>
                    <li>Integrated blockchain ecosystems (Solana, Arbitrum, Optimism)</li>
                    <li>Created performant lambda functions and built modern frontends with Gatsby and Next.js</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Node.js Mentor & Technical Curriculum Developer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">SideHustle</span>
                      <span className="mx-2">•</span>
                      <span>Feb 2022 - Dec 2022</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Mentored over 1,800 junior developers on backend architecture, resilience, and real-world problem solving</li>
                    <li>Designed and recorded a Node.js curriculum, quizzes, and advanced capstone challenges</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Senior Software Developer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">ManakNight Digital</span>
                      <span className="mx-2">•</span>
                      <span>May 2021 - July 2022</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Developed secure APIs with OAuth2, AWS, and MongoDB</li>
                    <li>Increased client product sales by 70% by reducing bugs and improving feature velocity</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Software Developer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">Fasto Services</span>
                      <span className="mx-2">•</span>
                      <span>Oct 2019 - May 2021</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Designed scalable cloud solutions using Docker, AWS, Terraform, and Ansible</li>
                    <li>Led multiple deployments and performance-tuning efforts in production systems</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Technical Skills</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Programming Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">TypeScript</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">JavaScript (ES6+)</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Python</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Go</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Rust</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Java</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Frontend & Backend</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">React.js</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Next.js</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Node.js</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">NestJS</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Express</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Django</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Cloud & DevOps</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">AWS</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Docker</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Kubernetes</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Terraform</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">CI/CD</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Jenkins</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Databases & Architecture</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">PostgreSQL</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">MySQL</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">MongoDB</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Redis</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Microservices</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Monorepo</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Certifications */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Certifications</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">AWS Certified Cloud Practitioner</span>
                  <span className="text-sm text-muted-foreground">2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Google Cloud Fundamentals</span>
                  <span className="text-sm text-muted-foreground">2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Advanced React – Triplebyte Certified</span>
                  <span className="text-sm text-muted-foreground">2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">NodeJS E-Commerce API</span>
                  <span className="text-sm text-muted-foreground">2021</span>
                </div>
              </div>
            </div>
            
            {/* Education */}
            <div className="mb-0">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Education</h2>
              
              <div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">Bachelor's Degree in Computer Science</h3>
                    <p className="text-muted-foreground">International University of East Africa</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2016 - 2019</p>
                </div>
                <p className="text-sm text-muted-foreground">Kampala, Uganda</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeViewer;