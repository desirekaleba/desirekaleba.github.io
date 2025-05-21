import React, { useRef } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
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
                <span>contact@desirekaleba.com</span>
                <span className="hidden sm:inline">•</span>
                <span>desirekaleba.com</span>
                <span className="hidden sm:inline">•</span>
                <span>San Francisco, CA</span>
              </div>
            </div>
            
            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Professional Summary</h2>
              <p className="text-muted-foreground">
                Staff Software Engineer with over 8 years of experience building robust, scalable systems. 
                Expertise in distributed systems architecture, high-performance computing, and systems programming
                with Rust and Go. Proven track record leading engineering teams and driving adoption of performance-critical
                technologies.
              </p>
            </div>
            
            {/* Experience */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Professional Experience</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Staff Software Engineer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">Tech Leader Inc.</span>
                      <span className="mx-2">•</span>
                      <span>2022 - Present</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Led architecture design for distributed systems processing millions of transactions daily</li>
                    <li>Mentored team members and drove adoption of Rust for performance-critical components</li>
                    <li>Implemented performance optimizations that reduced system latency by 35%</li>
                    <li>Designed and implemented a custom scheduler for high-throughput task processing</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Senior Software Engineer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">Scale Systems</span>
                      <span className="mx-2">•</span>
                      <span>2019 - 2022</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Developed high-performance data processing pipelines and microservices architecture</li>
                    <li>Reduced system latency by 40% through optimization and redesign</li>
                    <li>Led migration from monolithic architecture to microservices</li>
                    <li>Implemented real-time analytics system with Cassandra and Kafka</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-bold text-base sm:text-lg">Software Engineer</h3>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">Innovation Labs</span>
                      <span className="mx-2">•</span>
                      <span>2016 - 2019</span>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                    <li>Built backend services and APIs for cloud-native applications</li>
                    <li>Contributed to open-source projects and led transition to containerized infrastructure</li>
                    <li>Implemented CI/CD pipelines and automated testing frameworks</li>
                    <li>Developed RESTful and gRPC APIs for cloud services</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Skills & Expertise</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Programming Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Rust</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Go</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">TypeScript</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Python</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">C/C++</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Tokio</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Actix</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">React</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Node.js</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">gRPC</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Databases</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">PostgreSQL</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">MongoDB</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Redis</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Cassandra</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">ClickHouse</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Cloud & DevOps</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">AWS</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Kubernetes</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Terraform</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">Docker</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm">GCP</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Education */}
            <div className="mb-0">
              <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 mb-4">Education</h2>
              
              <div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">Master of Science in Computer Science</h3>
                    <p className="text-muted-foreground">Stanford University</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2014 - 2016</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">Bachelor of Science in Computer Engineering</h3>
                    <p className="text-muted-foreground">MIT</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2010 - 2014</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeViewer;