import { ReactNode } from "react";
import NavBar from "./NavBar";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import SocialLinks from "./SocialLinks";
import useSiteConfig from "@/hooks/useSiteConfig";
import Seo from "./Seo";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

const Layout = ({ children, title, description, image }: LayoutProps) => {
  const currentYear = new Date().getFullYear();
  const { seo, hero, navigation } = useSiteConfig();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Seo 
        title={title}
        description={description}
        path={location.pathname}
        image={image}
      />
      <NavBar />
      <main className="flex-1">{children}</main>
      <footer className="py-8 border-t border-border mt-16">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{seo.siteName}</h3>
              <p className="text-muted-foreground mb-4">
                {seo.description}
              </p>
              <SocialLinks className="justify-start" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={hero.resumePath} download className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" /> Resume
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Let's Work Together</h3>
              <p className="text-muted-foreground mb-4">
                Looking for a technical consultant or staff engineer for your project? I'm available for select consulting and advisory roles.
              </p>
              <div className="space-y-4">
                <Button asChild size="sm">
                  <Link to="/contact">Hire Me</Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Currently available for new opportunities and technical advisory roles.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              &copy; {currentYear} {seo.siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
