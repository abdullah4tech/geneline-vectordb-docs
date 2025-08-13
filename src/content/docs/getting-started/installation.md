---
title: "Installation"
description: "How to install and run Qdrant locally"
---

This guide covers how to install and run Qdrant for development and testing.

## Quick Start with Docker

The fastest way to get Qdrant running:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

This starts Qdrant and makes it available at `http://localhost:6333`.

## Docker Compose

For persistent storage, create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    ports:
      - "6333:6333"
    volumes:
      - ./qdrant_storage:/qdrant/storage
```

Run with:

```bash
docker-compose up -d
```

## Install JavaScript Client

Install the official Qdrant JavaScript client:

```bash
npm install @qdrant/js-client-rest
```

## Test Your Installation

Check if Qdrant is running:

### Using curl
```bash
curl http://localhost:6333/collections
```

### Using JavaScript
```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({ host: 'localhost', port: 6333 });

try {
  const collections = await client.getCollections();
  console.log('✅ Qdrant is running!');
} catch (error) {
  console.error('❌ Connection failed:', error);
}
```

### Web UI
Open [http://localhost:6333/dashboard](http://localhost:6333/dashboard) in your browser.

## Next Steps

Now that Qdrant is installed:

- **[Quick Start Guide](/getting-started/quick-start/)** - Your first operations
- **[Creating Collections](/collections/creating/)** - Set up your data structure

## Native Installation

### Using Pre-built Binaries

Download the latest release from the [GitHub releases page](https://github.com/qdrant/qdrant/releases):

```bash
# Linux
wget https://github.com/qdrant/qdrant/releases/latest/download/qdrant-x86_64-unknown-linux-gnu.tar.gz
tar -xzf qdrant-x86_64-unknown-linux-gnu.tar.gz
./qdrant

# macOS
wget https://github.com/qdrant/qdrant/releases/latest/download/qdrant-x86_64-apple-darwin.tar.gz
tar -xzf qdrant-x86_64-apple-darwin.tar.gz
./qdrant
```

### Build from Source

Requirements:
- Rust 1.65+
- Git

```bash
git clone https://github.com/qdrant/qdrant.git
cd qdrant
cargo build --release
./target/release/qdrant
```

## Cloud Deployment

### Qdrant Cloud

The easiest way to use Qdrant in production:

1. Visit [cloud.qdrant.io](https://cloud.qdrant.io)
2. Create a free account
3. Launch a cluster
4. Get your API key and endpoint

### AWS/GCP/Azure

Deploy using container services:

- **AWS**: ECS, EKS, or EC2
- **GCP**: Cloud Run, GKE, or Compute Engine  
- **Azure**: Container Instances, AKS, or Virtual Machines

## Kubernetes

Deploy using Helm chart:

```bash
helm repo add qdrant https://qdrant.github.io/qdrant-helm
helm install qdrant qdrant/qdrant
```

Or use the Kubernetes manifests:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qdrant
spec:
  replicas: 1
  selector:
    matchLabels:
      app: qdrant
  template:
    metadata:
      labels:
        app: qdrant
    spec:
      containers:
      - name: qdrant
        image: qdrant/qdrant:latest
        ports:
        - containerPort: 6333
        - containerPort: 6334
        volumeMounts:
        - name: storage
          mountPath: /qdrant/storage
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: qdrant-storage
---
apiVersion: v1
kind: Service
metadata:
  name: qdrant
spec:
  selector:
    app: qdrant
  ports:
  - name: http
    port: 6333
    targetPort: 6333
  - name: grpc
    port: 6334
    targetPort: 6334
  type: LoadBalancer
```

## Configuration

### Environment Variables

Common configuration options:

```bash
# Service configuration
QDRANT__SERVICE__HTTP_PORT=6333
QDRANT__SERVICE__GRPC_PORT=6334
QDRANT__SERVICE__ENABLE_CORS=true

# Storage configuration
QDRANT__STORAGE__STORAGE_PATH=/qdrant/storage
QDRANT__STORAGE__SNAPSHOTS_PATH=/qdrant/snapshots

# Performance tuning
QDRANT__SERVICE__MAX_REQUEST_SIZE_MB=32
QDRANT__SERVICE__MAX_WORKERS=0
```

### Configuration File

Create a `config/production.yaml` file:

```yaml
service:
  http_port: 6333
  grpc_port: 6334
  enable_cors: true
  max_request_size_mb: 32

storage:
  storage_path: ./storage
  snapshots_path: ./snapshots
  on_disk_payload: true

cluster:
  enabled: false
  
hnsw_config:
  m: 16
  ef_construct: 128
  max_indexing_threads: 4
```

Run with configuration:

```bash
./qdrant --config-path config/production.yaml
```

## Client Libraries

Install client libraries for your programming language:

### Python

```bash
pip install qdrant-client
```

### JavaScript/Node.js

```bash
npm install @qdrant/js-client-rest
```

### Rust

Add to `Cargo.toml`:

```toml
[dependencies]
qdrant-client = "1.0"
```

### Go

```bash
go get github.com/qdrant/go-client
```

## Verification

Test your installation by accessing the web UI or API:

### Web UI

Open [http://localhost:6333/dashboard](http://localhost:6333/dashboard) in your browser.

### REST API

```bash
curl http://localhost:6333/collections
```

### Python Client

```python
from qdrant_client import QdrantClient

client = QdrantClient(host="localhost", port=6333)
print(client.get_collections())
```

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Check what's using port 6333
lsof -i :6333
# Kill the process or use a different port
```

**Permission denied**:
```bash
# Make sure the binary is executable
chmod +x qdrant
```

**Storage permissions**:
```bash
# Ensure write permissions for storage directory
sudo chown -R $(whoami) ./qdrant_storage
```

### Performance Tuning

For better performance:

1. **Use SSD storage** for faster I/O
2. **Increase memory** for larger datasets
3. **Adjust HNSW parameters** based on your use case
4. **Enable payload on disk** for memory optimization

### Monitoring

Check health endpoints:

```bash
# Health check
curl http://localhost:6333/health

# Metrics (Prometheus format)
curl http://localhost:6333/metrics

# Cluster status
curl http://localhost:6333/cluster
```

## Next Steps

Now that Qdrant is installed, continue with:

- [Quick Start Guide](/getting-started/quick-start) - Your first operations
- [Creating Collections](/collections/creating) - Set up your data structure
- [Python Client Examples](/clients/python) - Start coding with Python
