---
title: "Creating Collections"
description: "Learn how to create and configure Qdrant collections with JavaScript"
---

Collections are containers that store your vectors in Qdrant. This guide shows you how to create and configure collections using JavaScript.

## Basic Collection Creation

The simplest way to create a collection:

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({ host: 'localhost', port: 6333 });

await client.createCollection('my_collection', {
  vectors: {
    size: 128,         // Vector dimension
    distance: 'Cosine' // Distance metric
  }
});
```

**Expected output:**
```json
{ "result": true, "status": "ok" }
```

## Distance Metrics

Choose the right distance metric for your data:

### Cosine Distance

Best for text embeddings and semantic similarity:

```javascript
await client.createCollection('documents', {
  vectors: {
    size: 384,
    distance: 'Cosine'
  }
});
```

**Expected output:**
```json
{ "result": true, "status": "ok" }
```

**Good for:** Text search, document similarity, semantic search

### Euclidean Distance

Good for geometric data:

```javascript
await client.createCollection('images', {
  vectors: {
    size: 512,
    distance: 'Euclid'
  }
});
```

**Expected output:**
```json
{ "result": true, "status": "ok" }
```

**Good for:** Image embeddings, spatial data, feature vectors

### Dot Product

Fast computation for normalized vectors:

```javascript
await client.createCollection('products', {
  vectors: {
    size: 256,
    distance: 'Dot'
  }
});
```

**Expected output:**
```json
{ "result": true, "status": "ok" }
```

**Good for:** Recommendation systems, collaborative filtering

## Vector Dimensions

Common dimensions for different embedding models:

```javascript
// For OpenAI embeddings (1536 dimensions)
await client.createCollection('openai_docs', {
  vectors: { size: 1536, distance: 'Cosine' }
});

// For Sentence Transformers (384 dimensions)
await client.createCollection('sentence_docs', {
  vectors: { size: 384, distance: 'Cosine' }
});

// For custom embeddings (any size)
await client.createCollection('custom_data', {
  vectors: { size: 768, distance: 'Cosine' }
});
```

**Expected output:** (for each collection creation)
```json
{ "result": true, "status": "ok" }
```

## Collection Management

### Check if Collection Exists

```javascript
try {
  const info = await client.getCollection('my_collection');
  console.log('Collection exists:', info);
} catch (error) {
  console.log('Collection does not exist');
}
```

**Expected output:** (if collection exists)
```json
Collection exists: {
  result: {
    status: "green",
    vectors_count: 0,
    indexed_vectors_count: 0,
    points_count: 0,
    segments_count: 1,
    config: {
      params: {
        vectors: {
          size: 128,
          distance: "Cosine"
        }
      }
    }
  }
}
```

**Expected output:** (if collection doesn't exist)
```
Collection does not exist
```

### List All Collections

```javascript
const collections = await client.getCollections();
console.log('Available collections:', collections.collections);
```

**Expected output:**
```json
Available collections: [
  {
    name: "my_collection"
  },
  {
    name: "documents"  
  },
  {
    name: "images"
  }
]
```

### Delete a Collection

```javascript
await client.deleteCollection('old_collection');
console.log('Collection deleted');

**Expected output:**
```
Collection deleted
```
```

## Common Examples

### Text Search Collection

```javascript
await client.createCollection('articles', {
  vectors: {
    size: 384,        // Sentence transformer size
    distance: 'Cosine'
  }
});
```

### Product Recommendation Collection

```javascript
await client.createCollection('products', {
  vectors: {
    size: 128,
    distance: 'Dot'   // Good for recommendations
  }
});
```

### Image Search Collection

```javascript
await client.createCollection('images', {
  vectors: {
    size: 512,        // CNN output size
    distance: 'Euclid'
  }
});
```

## Best Practices

### Choose the Right Distance Metric
- **Cosine**: Best for text and semantic similarity
- **Euclidean**: Good for geometric data  
- **Dot Product**: Fast, good for normalized vectors

### Use Appropriate Dimensions
- Match your embedding model's output size
- Higher dimensions = more memory usage
- Common sizes: 128, 384, 512, 768, 1536

### Collection Naming
Use descriptive names:

```javascript
// Good examples
await client.createCollection('product_embeddings', config);
await client.createCollection('user_preferences', config);
await client.createCollection('document_vectors', config);

// Avoid generic names
await client.createCollection('data', config);
await client.createCollection('vectors', config);
```

## Next Steps

Now that you know how to create collections:

- **[Inserting Points](/points/inserting/)** - Add data to your collection
- **[Vector Search](/search/vector-search/)** - Search your vectors
