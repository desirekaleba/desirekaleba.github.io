interface SiteConfig {
  seo: {
    title: string;
    description: string;
    siteName: string;
    url: string;
    openGraph: {
      image: string;
    };
  };
  hero: {
    jobTitle: string;
    greeting: string;
    name: string;
    tagline: string;
    description: string;
    resumePath: string;
    stats: {
      yearsOfExperience: number;
      projectsCompleted: number;
      leadershipPositions: number;
      technicalPublications: number;
    };
  };
  navigation: {
    logo: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
}

const siteConfig: SiteConfig = {
  seo: {
    title: "Desire Kaleba | Staff Software Engineer",
    description: "Staff Software Engineer specializing in Rust and distributed systems",
    siteName: "Desire Kaleba",
    url: "https://desirekaleba.com",
    openGraph: {
      image: "/images/og-image.jpg",
    },
  },
  hero: {
    jobTitle: "Staff Software Engineer",
    greeting: "Hello, I'm",
    name: "Desire Kaleba",
    tagline: "Building Robust Distributed Systems",
    description: "I specialize in high-performance systems programming with Rust and Go, designing scalable architectures that handle millions of transactions daily. With over 8 years of experience, I've led teams and built software that powers critical infrastructure.",
    resumePath: "/assets/resume.pdf",
    stats: {
      yearsOfExperience: 8,
      projectsCompleted: 20,
      leadershipPositions: 5,
      technicalPublications: 12,
    },
  },
  navigation: {
    logo: "Desire Kaleba",
    links: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "About",
        href: "/about",
      },
      {
        label: "Projects",
        href: "/projects",
      },
      {
        label: "Blog",
        href: "/blog",
      },
      {
        label: "Contact",
        href: "/contact",
      },
    ],
  },
};

export default siteConfig;
