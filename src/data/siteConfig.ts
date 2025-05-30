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
    title: "Desire Kaleba | Staff Software Engineer",
    description: "Staff Software Engineer specializing in Rust, distributed systems, and high-performance computing. Building scalable infrastructure that handles millions of requests daily.",
    siteName: "Desire Kaleba",
    url: "https://desirekaleba.github.io/rust_staff_engineer_personal_site",
    openGraph: {
      image: "/images/og-image.jpg",
    },
  },
  hero: {
    jobTitle: "Staff Software Engineer",
    greeting: "Hello, I'm",
    name: "Desire Kaleba",
    tagline: "Building Robust Distributed Systems with Rust",
    description: "I specialize in high-performance systems programming with Rust and Go, designing scalable architectures that handle millions of transactions daily. With over 8 years of experience, I've led teams building mission-critical infrastructure, from distributed caches to blockchain protocols.",
    resumePath: "/assets/resume.pdf",
    stats: {
      yearsOfExperience: 8,
      projectsCompleted: 25,
      leadershipPositions: 6,
      technicalPublications: 15,
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
    linkedin: "https://linkedin.com/in/desirekaleba",
    twitter: "https://twitter.com/desirekaleba",
  },
};

export default siteConfig;
