import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import useSiteConfig from "@/hooks/useSiteConfig";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { navigation } = useSiteConfig();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="container-xl flex items-center justify-between py-4">
        <Link to="/" className="font-bold text-xl no-underline">
          <span className="font-mono">{navigation.logo.replace(/^Dev/, '')}</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-1">
          <div className="flex items-center space-x-1 mr-2">
            {navigation.links.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium no-underline transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 space-y-2 border-t border-border">
          {navigation.links.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium no-underline ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
