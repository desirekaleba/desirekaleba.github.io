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
  contact: {
    email: string;
    github: string;
    linkedin: string;
    twitter?: string;
  };
}

const siteConfig: SiteConfig = {
  seo: {
    title: "Desire Kaleba | Lead Software Engineer & Distributed Systems Specialist",
    description: "Lead Full-Stack Engineer with 7+ years building scalable applications and distributed systems. Expertise in TypeScript, Node.js, Go, Rust, and cloud-native architecture.",
    siteName: "Desire Kaleba",
    url: "https://desirekaleba.github.io/rust_staff_engineer_personal_site",
    openGraph: {
      image: "/images/og-image.jpg",
    },
  },
  hero: {
    jobTitle: "Lead Software Engineer & Distributed Systems Specialist",
    greeting: "Hello, I'm",
    name: "Desire Kaleba",
    tagline: "Building Scalable Applications & Distributed Systems",
    description: "Lead Full-Stack Engineer with 7+ years of experience building scalable applications and leading distributed engineering teams. Proven expertise in TypeScript, Node.js, Go, and Rust, with deep knowledge of cloud-native architecture, microservices, and distributed systems. Currently leading architecture and development of modular monorepo solutions used by thousands.",
    resumePath: "/assets/resume.pdf",
    stats: {
      yearsOfExperience: 7,
      projectsCompleted: 30,
      leadershipPositions: 3,
      technicalPublications: 8,
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
  contact: {
    email: "desirekaleba@gmail.com",
    github: "https://github.com/desirekaleba",
    linkedin: "https://www.linkedin.com/in/desire-kaleba-a0a122197/",
    twitter: "https://twitter.com/desirekaleba",
  },
};

export default siteConfig;
