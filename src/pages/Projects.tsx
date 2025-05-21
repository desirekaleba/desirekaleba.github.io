import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const Projects = () => {
  return (
    <Layout>
      <section className="section">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="mb-4">Projects & Case Studies</h1>
            <p className="text-lg text-muted-foreground">
              A showcase of my technical work, focusing on distributed systems, 
              performance optimization, and systems programming.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
