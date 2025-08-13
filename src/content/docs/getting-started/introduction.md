---
title: "Introduction to Qdrant"
description: "Learn about Qdrant vector database and its core concepts"
---

Qdrant is a vector database designed for storing, indexing, and searching high-dimensional vectors. It's perfect for building applications that need semantic search, recommendations, or similarity matching.

## What is a Vector Database?

A vector database stores numerical representations (vectors) of data like text, images, or audio. These vectors capture the semantic meaning of your data, allowing you to find similar items based on meaning rather than exact matches.

## Core Concepts

### Collections
Collections are containers that store your vectors. Each collection has a specific configuration for vector size and distance metric.

### Points
Points are individual records in a collection. Each point contains:
- **ID**: Unique identifier
- **Vector**: Numerical representation of your data
- **Payload**: Optional metadata (JSON object)

### Distance Metrics
Qdrant supports different ways to measure similarity:
- **Cosine**: Best for text embeddings (0 to 2, where 0 is most similar)
- **Euclidean**: Good for geometric data
- **Dot Product**: Fast, good for normalized vectors

## Basic Workflow

1. **Create a collection** with vector size and distance metric
2. **Insert points** with vectors and metadata
3. **Search** for similar vectors
4. **Filter** results based on metadata

## Example Use Cases

### Semantic Search
```javascript
// Find documents similar in meaning
const results = await client.search('documents', {
  vector: queryEmbedding,
  limit: 5
});
```

### Product Recommendations
```javascript
// Find similar products
const recommendations = await client.search('products', {
  vector: productEmbedding,
  limit: 10,
  filter: { must: [{ key: 'category', match: { value: 'electronics' } }] }
});
```

### Image Search
```javascript
// Find similar images
const similarImages = await client.search('images', {
  vector: imageEmbedding,
  limit: 20
});
```

## Why Use Qdrant?

- **Fast**: Optimized for high-performance vector search
- **Scalable**: Handle millions of vectors efficiently
- **Flexible**: Support for metadata filtering and complex queries
- **Easy**: Simple API and client libraries
- **Open Source**: Transparent and community-driven

## Next Steps

Ready to get started? Continue with:

- **[Installation](/getting-started/installation/)** - Set up Qdrant
- **[Quick Start](/getting-started/quick-start/)** - Your first vector operations
- **[Creating Collections](/collections/creating/)** - Learn about collections

## What is Vector Search?

Vector search, also known as similarity search, allows you to find items that are similar to a given query based on their vector representations. This is particularly useful for:

- **Semantic Search**: Finding documents with similar meaning
- **Recommendation Systems**: Suggesting similar products or content
- **Image Recognition**: Finding visually similar images
- **Anomaly Detection**: Identifying unusual patterns in data

## Key Concepts

### Vectors

Vectors are numerical representations of data points in high-dimensional space. For example:

- Text can be converted to vectors using models like BERT or OpenAI embeddings
- Images can be vectorized using CNN models
- Audio can be represented as spectrograms and then vectorized

### Collections

Collections in Qdrant are containers for vectors and their associated metadata (payload). Each collection has:

- **Vector configuration**: Dimension, distance metric
- **Payload schema**: Structure for associated metadata
- **Index settings**: Performance optimization parameters

### Points

Points are individual records in a collection, consisting of:

- **ID**: Unique identifier (integer or UUID)
- **Vector**: High-dimensional array of numbers
- **Payload**: Associated metadata as key-value pairs

## Why Choose Qdrant?

### Performance

- Written in Rust for maximum performance
- Advanced indexing with HNSW (Hierarchical Navigable Small World) graphs
- Memory-mapped files for efficient data access
- Query-time filtering without performance degradation

### Scalability

- Horizontal scaling with clustering
- Automatic sharding and replication
- Load balancing across nodes
- Online configuration changes

### Flexibility

- Multiple distance metrics (Cosine, Euclidean, Dot Product)
- Rich filtering with complex conditions
- Multiple vector configurations per collection
- Custom quantization options

### Developer Experience

- Simple REST API
- Official client libraries for Python, JavaScript, Rust
- Comprehensive documentation and examples
- Active community support

## Use Cases

### E-commerce

- Product recommendations based on user behavior
- Visual search for similar products
- Personalized content delivery

### Content Management

- Duplicate content detection
- Content categorization and tagging
- Similar article recommendations

### Computer Vision

- Face recognition and verification
- Object detection and classification
- Medical image analysis

### Natural Language Processing

- Semantic search in documents
- Question-answering systems
- Text classification and clustering

## Next Steps

Ready to get started? Continue with:

1. [Installation Guide](/getting-started/installation) - Set up Qdrant on your system
2. [Quick Start](/getting-started/quick-start) - Your first vector operations
3. [Creating Collections](/collections/creating) - Learn about data organization

## Community and Support

- **GitHub**: [qdrant/qdrant](https://github.com/qdrant/qdrant)
- **Discord**: Join the Qdrant community
- **Documentation**: Official Qdrant docs
- **Examples**: Community-contributed examples and tutorials
