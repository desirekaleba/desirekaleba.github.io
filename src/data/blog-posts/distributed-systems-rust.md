---
title: "Building Distributed Systems with Rust: Lessons from Production"
slug: "distributed-systems-rust"
date: "2024-02-20"
excerpt: "Deep insights into architecting and implementing large-scale distributed systems with Rust, covering consensus, networking, and fault tolerance."
tags: ["Rust", "Distributed Systems", "Architecture", "Consensus", "Networking"]
featured: true
---

# Building Distributed Systems with Rust: Lessons from Production

Building distributed systems is one of the most challenging aspects of software engineering. Over the past few years, I've architected and implemented several large-scale distributed systems in Rust, handling everything from financial trading platforms to IoT networks. Here's what I've learned about leveraging Rust's unique strengths for distributed computing.

## Why Rust for Distributed Systems?

Rust brings several critical advantages to distributed systems development:

1. **Memory Safety**: Eliminates entire classes of bugs that are catastrophic in distributed environments
2. **Performance**: Zero-cost abstractions enable building systems that compete with C/C++
3. **Concurrency**: Built-in async/await and ownership model make concurrent programming safer
4. **Reliability**: The type system catches many distributed system edge cases at compile time

## Fundamental Patterns and Abstractions

### Actor Model Implementation

The actor model is particularly powerful for distributed systems. Here's a production-ready actor implementation I've used:

```rust
use tokio::sync::{mpsc, oneshot};
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActorId(String);

pub trait Message: Send + 'static {}

pub trait Actor: Send + 'static {
    type Message: Message;
    
    async fn handle(&mut self, msg: Self::Message) -> Result<(), ActorError>;
    
    fn actor_id(&self) -> ActorId;
}

pub struct ActorSystem {
    actors: HashMap<ActorId, mpsc::UnboundedSender<Box<dyn Message>>>,
    shutdown_tx: broadcast::Sender<()>,
}

impl ActorSystem {
    pub fn new() -> Self {
        let (shutdown_tx, _) = broadcast::channel(1);
        Self {
            actors: HashMap::new(),
            shutdown_tx,
        }
    }
    
    pub async fn spawn<A>(&mut self, mut actor: A) -> ActorRef<A::Message>
    where
        A: Actor,
        A::Message: Message,
    {
        let (tx, mut rx) = mpsc::unbounded_channel();
        let actor_id = actor.actor_id();
        let mut shutdown_rx = self.shutdown_tx.subscribe();
        
        tokio::spawn(async move {
            loop {
                tokio::select! {
                    msg = rx.recv() => {
                        match msg {
                            Some(msg) => {
                                if let Err(e) = actor.handle(*msg.downcast().unwrap()).await {
                                    tracing::error!("Actor {} error: {}", actor_id.0, e);
                                }
                            }
                            None => break, // Channel closed
                        }
                    }
                    _ = shutdown_rx.recv() => {
                        tracing::info!("Shutting down actor {}", actor_id.0);
                        break;
                    }
                }
            }
        });
        
        self.actors.insert(actor_id.clone(), tx.clone());
        ActorRef::new(actor_id, tx)
    }
}
```

### Distributed Consensus with Raft

Implementing consensus algorithms is crucial for distributed systems. Here's a simplified Raft implementation:

```rust
use std::time::Duration;
use tokio::time::{interval, timeout};

#[derive(Debug, Clone)]
pub struct RaftNode {
    id: NodeId,
    state: NodeState,
    current_term: u64,
    voted_for: Option<NodeId>,
    log: Vec<LogEntry>,
    commit_index: usize,
    peers: Vec<NodeId>,
}

#[derive(Debug, Clone)]
enum NodeState {
    Follower,
    Candidate,
    Leader { next_index: HashMap<NodeId, usize> },
}

impl RaftNode {
    pub async fn run(&mut self) -> Result<(), RaftError> {
        let mut election_timer = interval(Duration::from_millis(150 + rand::random::<u64>() % 150));
        let mut heartbeat_timer = interval(Duration::from_millis(50));
        
        loop {
            match &self.state {
                NodeState::Follower => {
                    tokio::select! {
                        _ = election_timer.tick() => {
                            self.start_election().await?;
                        }
                        msg = self.receive_message() => {
                            self.handle_message(msg?).await?;
                        }
                    }
                }
                NodeState::Candidate => {
                    tokio::select! {
                        _ = election_timer.tick() => {
                            self.start_election().await?;
                        }
                        msg = self.receive_message() => {
                            self.handle_message(msg?).await?;
                        }
                    }
                }
                NodeState::Leader { .. } => {
                    tokio::select! {
                        _ = heartbeat_timer.tick() => {
                            self.send_heartbeats().await?;
                        }
                        msg = self.receive_message() => {
                            self.handle_message(msg?).await?;
                        }
                    }
                }
            }
        }
    }
    
    async fn start_election(&mut self) -> Result<(), RaftError> {
        self.current_term += 1;
        self.voted_for = Some(self.id);
        self.state = NodeState::Candidate;
        
        tracing::info!("Node {} starting election for term {}", self.id, self.current_term);
        
        let mut votes = 1; // Vote for ourselves
        let needed_votes = (self.peers.len() + 1) / 2 + 1;
        
        for peer in &self.peers {
            let request = RequestVoteRequest {
                term: self.current_term,
                candidate_id: self.id,
                last_log_index: self.log.len(),
                last_log_term: self.log.last().map(|e| e.term).unwrap_or(0),
            };
            
            if let Ok(response) = self.send_request_vote(*peer, request).await {
                if response.vote_granted {
                    votes += 1;
                }
                
                if response.term > self.current_term {
                    self.current_term = response.term;
                    self.voted_for = None;
                    self.state = NodeState::Follower;
                    return Ok(());
                }
            }
        }
        
        if votes >= needed_votes {
            self.become_leader();
        }
        
        Ok(())
    }
}
```

## Network Programming and Communication

### High-Performance RPC Framework

For service-to-service communication, I've built custom RPC frameworks optimized for specific use cases:

```rust
use tarpc::{client, context, server};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct QueryRequest {
    pub query: String,
    pub timeout_ms: u64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct QueryResponse {
    pub results: Vec<String>,
    pub execution_time_ms: u64,
}

#[tarpc::service]
pub trait QueryService {
    async fn execute_query(request: QueryRequest) -> Result<QueryResponse, String>;
    async fn health_check() -> Result<String, String>;
}

pub struct QueryServiceImpl {
    db_pool: Arc<DatabasePool>,
    metrics: Arc<Metrics>,
}

#[tarpc::server]
impl QueryService for QueryServiceImpl {
    async fn execute_query(
        self,
        _: context::Context,
        request: QueryRequest,
    ) -> Result<QueryResponse, String> {
        let start = std::time::Instant::now();
        
        let timeout = Duration::from_millis(request.timeout_ms);
        let query_future = self.execute_query_internal(request.query);
        
        match timeout(timeout, query_future).await {
            Ok(Ok(results)) => {
                let execution_time = start.elapsed().as_millis() as u64;
                self.metrics.record_query_success(execution_time);
                
                Ok(QueryResponse {
                    results,
                    execution_time_ms: execution_time,
                })
            }
            Ok(Err(e)) => {
                self.metrics.record_query_error();
                Err(format!("Query execution failed: {}", e))
            }
            Err(_) => {
                self.metrics.record_query_timeout();
                Err("Query timed out".to_string())
            }
        }
    }
    
    async fn health_check(self, _: context::Context) -> Result<String, String> {
        if self.db_pool.is_healthy().await {
            Ok("healthy".to_string())
        } else {
            Err("database unhealthy".to_string())
        }
    }
}
```

### Connection Management and Pooling

Efficient connection management is critical for distributed systems:

```rust
use deadpool::managed::{Manager, Pool, PoolError};
use std::sync::atomic::{AtomicUsize, Ordering};

pub struct ConnectionManager {
    endpoints: Vec<String>,
    current: AtomicUsize,
}

impl ConnectionManager {
    pub fn new(endpoints: Vec<String>) -> Self {
        Self {
            endpoints,
            current: AtomicUsize::new(0),
        }
    }
    
    fn next_endpoint(&self) -> &str {
        let index = self.current.fetch_add(1, Ordering::Relaxed) % self.endpoints.len();
        &self.endpoints[index]
    }
}

#[async_trait::async_trait]
impl Manager for ConnectionManager {
    type Type = TcpStream;
    type Error = io::Error;
    
    async fn create(&self) -> Result<TcpStream, Self::Error> {
        let endpoint = self.next_endpoint();
        let stream = TcpStream::connect(endpoint).await?;
        
        // Configure TCP options for distributed systems
        stream.set_nodelay(true)?;
        stream.set_keepalive(Some(Duration::from_secs(30)))?;
        
        Ok(stream)
    }
    
    async fn recycle(&self, conn: &mut TcpStream) -> Result<(), Self::Error> {
        // Check if connection is still healthy
        if conn.peer_addr().is_ok() {
            Ok(())
        } else {
            Err(io::Error::new(io::ErrorKind::BrokenPipe, "Connection lost"))
        }
    }
}

pub type ConnectionPool = Pool<ConnectionManager>;
```

## Fault Tolerance and Resilience

### Circuit Breaker Pattern

Implementing circuit breakers prevents cascade failures:

```rust
use std::sync::atomic::{AtomicU64, AtomicU8, Ordering};
use std::time::{Duration, Instant};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum CircuitState {
    Closed = 0,
    Open = 1,
    HalfOpen = 2,
}

pub struct CircuitBreaker {
    state: AtomicU8,
    failure_count: AtomicU64,
    success_count: AtomicU64,
    last_failure_time: AtomicU64,
    failure_threshold: u64,
    timeout: Duration,
    success_threshold: u64,
}

impl CircuitBreaker {
    pub fn new(failure_threshold: u64, timeout: Duration, success_threshold: u64) -> Self {
        Self {
            state: AtomicU8::new(CircuitState::Closed as u8),
            failure_count: AtomicU64::new(0),
            success_count: AtomicU64::new(0),
            last_failure_time: AtomicU64::new(0),
            failure_threshold,
            timeout,
            success_threshold,
        }
    }
    
    pub async fn call<F, T, E>(&self, f: F) -> Result<T, CircuitBreakerError<E>>
    where
        F: Future<Output = Result<T, E>>,
    {
        match self.state() {
            CircuitState::Open => {
                if self.should_attempt_reset() {
                    self.set_state(CircuitState::HalfOpen);
                } else {
                    return Err(CircuitBreakerError::CircuitOpen);
                }
            }
            CircuitState::HalfOpen => {
                // Allow limited requests through
            }
            CircuitState::Closed => {
                // Normal operation
            }
        }
        
        match f.await {
            Ok(result) => {
                self.on_success();
                Ok(result)
            }
            Err(e) => {
                self.on_failure();
                Err(CircuitBreakerError::ServiceError(e))
            }
        }
    }
    
    fn on_success(&self) {
        self.failure_count.store(0, Ordering::Relaxed);
        
        match self.state() {
            CircuitState::HalfOpen => {
                let success_count = self.success_count.fetch_add(1, Ordering::Relaxed) + 1;
                if success_count >= self.success_threshold {
                    self.set_state(CircuitState::Closed);
                    self.success_count.store(0, Ordering::Relaxed);
                }
            }
            _ => {}
        }
    }
    
    fn on_failure(&self) {
        let failure_count = self.failure_count.fetch_add(1, Ordering::Relaxed) + 1;
        self.last_failure_time.store(
            Instant::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
            Ordering::Relaxed
        );
        
        if failure_count >= self.failure_threshold {
            self.set_state(CircuitState::Open);
        }
    }
}
```

### Distributed Tracing and Observability

Proper observability is crucial for debugging distributed systems:

```rust
use tracing::{instrument, info, error, Span};
use tracing_opentelemetry::OpenTelemetrySpanExt;
use opentelemetry::trace::{TraceId, SpanId};

#[derive(Clone)]
pub struct DistributedContext {
    trace_id: TraceId,
    span_id: SpanId,
    baggage: HashMap<String, String>,
}

impl DistributedContext {
    pub fn new() -> Self {
        let span = Span::current();
        let context = span.context();
        
        Self {
            trace_id: context.span().span_context().trace_id(),
            span_id: context.span().span_context().span_id(),
            baggage: HashMap::new(),
        }
    }
    
    pub fn inject_headers(&self, headers: &mut HeaderMap) {
        let trace_parent = format!(
            "00-{:032x}-{:016x}-01",
            self.trace_id.to_u128(),
            self.span_id.to_u64()
        );
        headers.insert("traceparent", trace_parent.parse().unwrap());
        
        for (key, value) in &self.baggage {
            headers.insert(
                format!("baggage-{}", key).parse().unwrap(),
                value.parse().unwrap()
            );
        }
    }
}

#[instrument(skip(request))]
pub async fn process_distributed_request(
    request: DistributedRequest,
    ctx: DistributedContext,
) -> Result<Response, ProcessingError> {
    let span = Span::current();
    span.set_attribute("request.id", request.id.clone());
    span.set_attribute("request.size", request.payload.len() as i64);
    
    info!("Processing distributed request: {}", request.id);
    
    // Forward context to downstream services
    let mut downstream_headers = HeaderMap::new();
    ctx.inject_headers(&mut downstream_headers);
    
    let downstream_response = call_downstream_service(
        request.downstream_request(),
        downstream_headers
    ).await?;
    
    let response = Response::from_downstream(downstream_response);
    
    info!(
        response_size = response.payload.len(),
        "Request processed successfully"
    );
    
    Ok(response)
}
```

## Performance Optimization and Monitoring

### Custom Metrics and Monitoring

```rust
use prometheus::{Counter, Histogram, Gauge, Registry};
use std::sync::Arc;

#[derive(Clone)]
pub struct DistributedMetrics {
    request_count: Counter,
    request_duration: Histogram,
    active_connections: Gauge,
    error_count: Counter,
    registry: Arc<Registry>,
}

impl DistributedMetrics {
    pub fn new() -> Result<Self, prometheus::Error> {
        let registry = Arc::new(Registry::new());
        
        let request_count = Counter::new(
            "distributed_requests_total",
            "Total number of requests processed"
        )?;
        registry.register(Box::new(request_count.clone()))?;
        
        let request_duration = Histogram::with_opts(
            prometheus::HistogramOpts::new(
                "distributed_request_duration_seconds",
                "Request duration in seconds"
            ).buckets(vec![0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0, 5.0])
        )?;
        registry.register(Box::new(request_duration.clone()))?;
        
        let active_connections = Gauge::new(
            "distributed_active_connections",
            "Number of active connections"
        )?;
        registry.register(Box::new(active_connections.clone()))?;
        
        let error_count = Counter::new(
            "distributed_errors_total",
            "Total number of errors"
        )?;
        registry.register(Box::new(error_count.clone()))?;
        
        Ok(Self {
            request_count,
            request_duration,
            active_connections,
            error_count,
            registry,
        })
    }
    
    pub fn record_request(&self, duration: Duration) {
        self.request_count.inc();
        self.request_duration.observe(duration.as_secs_f64());
    }
    
    pub fn record_error(&self) {
        self.error_count.inc();
    }
    
    pub fn set_active_connections(&self, count: usize) {
        self.active_connections.set(count as f64);
    }
}
```

## Production Lessons Learned

After running distributed Rust systems in production, here are my key insights:

### 1. Embrace Rust's Type System for Distributed State

Use the type system to model distributed system states:

```rust
#[derive(Debug, Clone)]
pub struct Uninitialized;
#[derive(Debug, Clone)]
pub struct Connected { peer_count: usize }
#[derive(Debug, Clone)]
pub struct Disconnected { reason: String }

pub struct Node<State> {
    id: NodeId,
    state: State,
}

impl Node<Uninitialized> {
    pub async fn connect(self, peers: Vec<Peer>) -> Result<Node<Connected>, ConnectionError> {
        // Connection logic here
        Ok(Node {
            id: self.id,
            state: Connected { peer_count: peers.len() },
        })
    }
}

impl Node<Connected> {
    pub async fn send_message(&self, msg: Message) -> Result<(), SendError> {
        // Can only send messages when connected
    }
}
```

### 2. Design for Partial Failures

Every network call can fail. Design your APIs accordingly:

```rust
#[derive(Debug)]
pub enum PartialResult<T> {
    Complete(T),
    Partial {
        data: T,
        failed_nodes: Vec<NodeId>,
        errors: Vec<String>,
    },
    Failed {
        successful_nodes: Vec<NodeId>,
        errors: HashMap<NodeId, String>,
    },
}
```

### 3. Implement Proper Backoff and Retry Logic

```rust
pub struct ExponentialBackoff {
    base_delay: Duration,
    max_delay: Duration,
    max_retries: usize,
    jitter: bool,
}

impl ExponentialBackoff {
    pub async fn retry<F, T, E>(&self, mut f: F) -> Result<T, E>
    where
        F: FnMut() -> Pin<Box<dyn Future<Output = Result<T, E>> + Send>>,
        E: std::fmt::Display,
    {
        let mut last_error = None;
        
        for attempt in 0..=self.max_retries {
            match f().await {
                Ok(result) => return Ok(result),
                Err(e) => {
                    last_error = Some(e);
                    
                    if attempt < self.max_retries {
                        let delay = self.calculate_delay(attempt);
                        tokio::time::sleep(delay).await;
                    }
                }
            }
        }
        
        Err(last_error.unwrap())
    }
}
```

## Conclusion

Building distributed systems with Rust has been incredibly rewarding. The language's emphasis on safety and performance aligns perfectly with the requirements of distributed computing. The type system helps catch distributed system edge cases early, while the performance characteristics enable building systems that scale to massive workloads.

Key takeaways for your own distributed systems:

1. **Leverage Rust's ownership model** for safe concurrent programming
2. **Use the type system** to model distributed state transitions
3. **Design for failures** from the ground up
4. **Implement comprehensive observability** early in development
5. **Test under realistic network conditions** including partitions and delays

The investment in learning these patterns pays off massively when building production distributed systems that need to be both fast and reliable.

---

*Interested in more systems programming content? Check out my articles on [async Rust patterns](./mastering-rust-async) and [performance optimization techniques](./rust-performance-optimization).* 