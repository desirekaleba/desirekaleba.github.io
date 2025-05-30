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
    featured?: boolean;
    year: string;
    status: 'completed' | 'in-progress' | 'open-source';
    teamSize?: number;
    metrics?: {
      label: string;
      value: string;
    }[];
  }
  
  export const projects: Project[] = [
    {
      id: 1,
      title: "RustStream: High-Throughput Message Broker",
      shortDescription: "Zero-copy message broker built with Rust, handling 10M+ messages/second",
      problem: "Our fintech platform needed ultra-low latency message processing for real-time trading systems. Existing solutions like Kafka had too much overhead for our microsecond-sensitive workloads.",
      solution: "Architected a custom message broker leveraging Rust's zero-cost abstractions, lockless data structures, and DPDK for kernel bypass networking. Implemented custom memory allocators and SIMD optimizations.",
      techStack: ["Rust", "DPDK", "io_uring", "RDMA", "Protocol Buffers", "Kubernetes", "Prometheus"],
      githubUrl: "https://github.com/desirekaleba/ruststream",
      impact: "Achieved 99.9th percentile latency under 50 microseconds while processing 10M+ messages/second. Reduced infrastructure costs by 60% compared to previous Kafka-based solution.",
      featured: true,
      year: "2024",
      status: "completed",
      teamSize: 4,
      metrics: [
        { label: "Throughput", value: "10M+ msg/sec" },
        { label: "P99.9 Latency", value: "<50μs" },
        { label: "Cost Reduction", value: "60%" }
      ]
    },
    {
      id: 2,
      title: "ZeroQL: Graph Database Query Engine",
      shortDescription: "Custom query engine for distributed graph databases with automatic optimization",
      problem: "Complex graph queries across our distributed social network data were taking minutes to execute, causing poor user experience and high infrastructure costs.",
      solution: "Built a custom query engine with advanced query planning, distributed execution, and caching. Implemented novel graph algorithms and leveraged Rust's performance for hot paths.",
      techStack: ["Rust", "Apache Arrow", "gRPC", "RocksDB", "Kubernetes", "GraphQL", "WASM"],
      githubUrl: "https://github.com/desirekaleba/zeroql",
      demoUrl: "https://zeroql-demo.vercel.app",
      impact: "Reduced complex query times from minutes to milliseconds. Improved user engagement by 40% due to faster recommendations and social features.",
      featured: true,
      year: "2023",
      status: "open-source",
      teamSize: 6,
      metrics: [
        { label: "Query Speed", value: "1000x faster" },
        { label: "User Engagement", value: "+40%" },
        { label: "Infrastructure Savings", value: "$2M/year" }
      ]
    },
    {
      id: 3,
      title: "Nexus: Container Orchestration Platform",
      shortDescription: "Next-generation container orchestrator with built-in security and efficiency",
      problem: "Kubernetes overhead was significant for our edge computing use case. We needed lighter orchestration with enhanced security for IoT deployments.",
      solution: "Developed a custom orchestrator using Rust with eBPF-based security monitoring, custom scheduler algorithms, and optimized resource management for edge devices.",
      techStack: ["Rust", "eBPF", "containerd", "etcd", "WebAssembly", "gRPC", "Envoy"],
      githubUrl: "https://github.com/desirekaleba/nexus-orchestrator",
      impact: "Reduced resource consumption by 70% compared to Kubernetes while maintaining security guarantees. Deployed across 50,000+ edge devices.",
      featured: false,
      year: "2023",
      status: "completed",
      teamSize: 8,
      metrics: [
        { label: "Resource Reduction", value: "70%" },
        { label: "Deployment Scale", value: "50K+ devices" },
        { label: "Security Incidents", value: "Zero" }
      ]
    },
    {
      id: 4,
      title: "CryptoDB: Encrypted Database Engine",
      shortDescription: "Zero-knowledge database supporting queries on encrypted data",
      problem: "Healthcare clients needed to run analytics on sensitive patient data while maintaining strict privacy compliance and zero-trust security.",
      solution: "Implemented homomorphic encryption and secure multi-party computation in Rust, enabling computations on encrypted data without decryption.",
      techStack: ["Rust", "Homomorphic Encryption", "SEAL", "Arrow", "PostgreSQL", "Docker"],
      githubUrl: "https://github.com/desirekaleba/cryptodb",
      impact: "Enabled privacy-preserving analytics for 5+ major healthcare providers. Achieved HIPAA compliance with end-to-end encryption.",
      featured: true,
      year: "2024",
      status: "in-progress",
      teamSize: 3,
      metrics: [
        { label: "Healthcare Clients", value: "5+ major providers" },
        { label: "Data Protection", value: "End-to-end encrypted" },
        { label: "Compliance", value: "HIPAA certified" }
      ]
    },
    {
      id: 5,
      title: "Quantum Circuit Simulator",
      shortDescription: "High-performance quantum computing simulator with GPU acceleration",
      problem: "Researchers needed faster quantum circuit simulation for algorithm development, but existing simulators were too slow for large qubit counts.",
      solution: "Built a state-vector simulator in Rust with CUDA integration, optimized tensor operations, and distributed computing support for large quantum circuits.",
      techStack: ["Rust", "CUDA", "cuQuantum", "MPI", "Python bindings", "Jupyter"],
      githubUrl: "https://github.com/desirekaleba/quantum-sim",
      demoUrl: "https://quantum-sim.herokuapp.com",
      impact: "Achieved 100x speedup over baseline simulators. Used by 500+ researchers worldwide for quantum algorithm development.",
      featured: false,
      year: "2022",
      status: "open-source",
      teamSize: 2,
      metrics: [
        { label: "Performance Gain", value: "100x speedup" },
        { label: "User Base", value: "500+ researchers" },
        { label: "Max Qubits", value: "40+ qubits" }
      ]
    },
    {
      id: 6,
      title: "Distributed Compiler Infrastructure",
      shortDescription: "Scalable compilation service for large codebases with intelligent caching",
      problem: "Our monorepo builds were taking hours, slowing down development velocity and CI/CD pipelines across 200+ engineers.",
      solution: "Created a distributed compilation system with content-addressed caching, incremental builds, and dynamic resource allocation across cloud instances.",
      techStack: ["Rust", "Bazel", "Redis", "Kubernetes", "Docker", "gRPC", "Prometheus"],
      githubUrl: "https://github.com/desirekaleba/distcc-rs",
      impact: "Reduced build times from 3 hours to 8 minutes. Improved developer productivity by 400% and saved $50K/month in CI costs.",
      featured: false,
      year: "2023",
      status: "completed",
      teamSize: 5,
      metrics: [
        { label: "Build Time", value: "3h → 8min" },
        { label: "Productivity Gain", value: "400%" },
        { label: "Cost Savings", value: "$50K/month" }
      ]
    },
    {
      id: 7,
      title: "BlockchainDB: Immutable Time-Series Database",
      shortDescription: "Blockchain-backed database for financial audit trails and compliance",
      problem: "Financial institutions needed immutable audit trails with cryptographic proof of data integrity for regulatory compliance.",
      solution: "Designed a hybrid system combining traditional database performance with blockchain immutability, using Merkle trees and consensus algorithms.",
      techStack: ["Rust", "Substrate", "RocksDB", "Merkle Trees", "RAFT", "PostgreSQL"],
      githubUrl: "https://github.com/desirekaleba/blockchain-db",
      impact: "Deployed at 3 major banks for regulatory compliance. Reduced audit costs by 80% through automated verification.",
      featured: false,
      year: "2022",
      status: "completed",
      teamSize: 4,
      metrics: [
        { label: "Bank Deployments", value: "3 major banks" },
        { label: "Audit Cost Reduction", value: "80%" },
        { label: "Data Integrity", value: "Cryptographically proven" }
      ]
    },
    {
      id: 8,
      title: "Neural Network Inference Engine",
      shortDescription: "Ultra-fast ML inference engine optimized for edge deployment",
      problem: "ML models needed to run inference on edge devices with strict latency and power constraints for autonomous vehicle applications.",
      solution: "Built a custom inference engine with quantization, model optimization, and SIMD acceleration specifically tuned for automotive hardware.",
      techStack: ["Rust", "ONNX", "SIMD", "ARM NEON", "TensorRT", "WebAssembly"],
      githubUrl: "https://github.com/desirekaleba/neural-engine",
      impact: "Achieved sub-millisecond inference times while using 90% less power than GPU solutions. Deployed in autonomous vehicle fleet.",
      featured: true,
      year: "2024",
      status: "in-progress",
      teamSize: 6,
      metrics: [
        { label: "Inference Time", value: "<1ms" },
        { label: "Power Efficiency", value: "90% reduction" },
        { label: "Deployment", value: "Autonomous vehicles" }
      ]
    }
  ];
  