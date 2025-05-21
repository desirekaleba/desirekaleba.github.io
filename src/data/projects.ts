export interface Project {
    id: number;
    title: string;
    shortDescription: string;
    problem: string;
    solution?: string;
    techStack: string[];
    githubUrl?: string;
    demoUrl?: string;
    impact?: string;
  }
  
  export const projects: Project[] = [
    {
      id: 1,
      title: "Distributed Cache System",
      shortDescription: "High-performance distributed caching layer for microservices",
      problem: "Our microservices architecture suffered from redundant data fetching, creating performance bottlenecks and increasing database load.",
      solution: "Designed and implemented a Rust-based distributed cache with consistent hashing, optimized for low-latency and high-throughput workloads.",
      techStack: ["Rust", "Redis", "gRPC", "Prometheus", "Kubernetes"],
      githubUrl: "https://github.com/username/distributed-cache",
      impact: "Reduced database load by 70% and improved API response times by 150ms on average."
    },
    {
      id: 2,
      title: "Compiler for Domain-Specific Language",
      shortDescription: "Custom language compiler for configuration management",
      problem: "Complex infrastructure configuration required specialized validation and transformation logic that was error-prone with existing tools.",
      solution: "Built a complete compiler for a domain-specific language with strong static typing and validation capabilities.",
      techStack: ["Rust", "LLVM", "WebAssembly"],
      githubUrl: "https://github.com/username/config-compiler",
      demoUrl: "https://config-compiler-demo.example.com",
      impact: "Eliminated an entire class of configuration errors and reduced deployment failures by 90%."
    },
    {
      id: 3,
      title: "Blockchain Consensus Protocol",
      shortDescription: "Novel consensus algorithm for distributed ledgers",
      problem: "Existing blockchain consensus protocols faced limitations in transaction throughput and energy efficiency.",
      solution: "Developed a hybrid consensus protocol combining proof-of-stake with verifiable delay functions.",
      techStack: ["Rust", "Go", "Cryptography", "Distributed Systems"],
      githubUrl: "https://github.com/username/consensus-protocol",
      impact: "Achieved 5000 transactions per second while maintaining decentralization properties."
    },
    {
      id: 4,
      title: "Real-time Analytics Pipeline",
      shortDescription: "Streaming data processing system for analytics",
      problem: "Traditional batch processing created significant delays in generating business insights from user activity data.",
      solution: "Built a real-time stream processing pipeline with exactly-once semantics and low latency guarantees.",
      techStack: ["Rust", "Kafka", "ClickHouse", "Kubernetes"],
      githubUrl: "https://github.com/username/analytics-pipeline",
      impact: "Reduced analytics latency from hours to seconds, enabling real-time decision making."
    },
    {
      id: 5,
      title: "Container Runtime Security Monitor",
      shortDescription: "Low-overhead security monitoring for containerized apps",
      problem: "Existing container security solutions added significant performance overhead and lacked integration with our deployment pipeline.",
      solution: "Created a lightweight eBPF-based security monitor with deep runtime introspection capabilities.",
      techStack: ["Rust", "eBPF", "Linux Kernel", "Kubernetes"],
      githubUrl: "https://github.com/username/container-security",
      impact: "Detected sophisticated attack patterns with less than 1% performance overhead."
    }
  ];
  