---
title: "Inserting Points"
description: "Learn how to add vectors and metadata to your GenelineX Qdrant collections"
---

Points are individual records in Qdrant collections that contain vectors and optional metadata. This guide shows you how to insert points using the GenelineX managed deployment.

## Basic Point Structure

A point consists of:

- **ID**: Unique identifier (number or string)
- **Vector**: Array of numbers (your embedding)
- **Payload**: Optional metadata (JSON object)

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: 'https://vecstore.geneline-x.net',
  apiKey: 'aiforAfrica@6282Geneline'
});

// Basic point insertion
await client.upsert('my_collection', {
  points: [
    {
      id: 1,
      vector: [0.1, 0.2, 0.3, 0.4],
      payload: {
        title: 'Document 1',
        category: 'technology'
      }
    }
  ]
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 1,
    "status": "completed"
  },
  "status": "ok",
  "time": 0.002
}
```

## Insert Single Point

```javascript
const point = {
  id: 'doc-123',
  vector: [0.1, 0.2, 0.3, 0.4],
  payload: {
    title: 'My Document',
    content: 'Document content here...',
    category: 'articles'
  }
};

await client.upsert('my_collection', {
  points: [point]
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 2,
    "status": "completed"
  },
  "status": "ok",
  "time": 0.001
}
```

## Insert Multiple Points

```javascript
const points = [
  {
    id: 1,
    vector: [0.9, 0.1, 0.1, 0.5],
    payload: { name: 'apple', category: 'fruit' }
  },
  {
    id: 2,
    vector: [0.1, 0.9, 0.1, 0.5],
    payload: { name: 'banana', category: 'fruit' }
  },
  {
    id: 3,
    vector: [0.1, 0.1, 0.9, 0.5],
    payload: { name: 'carrot', category: 'vegetable' }
  }
];

await client.upsert('my_collection', {
  wait: true,
  points: points
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 3,
    "status": "completed"
  },
  "status": "ok",
  "time": 0.005
}
```

## Different ID Types

### Numeric IDs

```javascript
await client.upsert('my_collection', {
  points: [
    {
      id: 1,
      vector: [0.1, 0.2, 0.3, 0.4],
      payload: { name: 'Item 1' }
    }
  ]
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 4,
    "status": "completed"
  },
  "status": "ok",
  "time": 0.001
}
``` 

### String IDs

```javascript
await client.upsert('my_collection', {
  points: [
    {
      id: 'user-123',
      vector: [0.1, 0.2, 0.3, 0.4],
      payload: { username: 'john_doe' }
    }
  ]
});
```

## Payload Examples

### Text Documents

```javascript
await client.upsert('documents', {
  points: [
    {
      id: 1,
      vector: textEmbedding,
      payload: {
        title: 'Getting Started with Qdrant',
        content: 'Qdrant is a vector database...',
        author: 'John Smith',
        published: '2024-01-15',
        tags: ['database', 'vectors', 'search']
      }
    }
  ]
});
```

### Product Catalog

```javascript
await client.upsert('products', {
  points: [
    {
      id: 'prod-001',
      vector: productEmbedding,
      payload: {
        name: 'Wireless Headphones',
        price: 199.99,
        category: 'electronics',
        brand: 'TechCorp',
        in_stock: true,
        rating: 4.5
      }
    }
  ]
});
```

### User Preferences

```javascript
await client.upsert('users', {
  points: [
    {
      id: 'user-456',
      vector: userPreferenceVector,
      payload: {
        age: 25,
        location: 'New York',
        interests: ['technology', 'music', 'sports'],
        premium: false
      }
    }
  ]
});
```

## Batch Operations

For better performance with many points:

```javascript
// Insert points in batches
const batchSize = 100;
const allPoints = [...]; // Your array of points

for (let i = 0; i < allPoints.length; i += batchSize) {
  const batch = allPoints.slice(i, i + batchSize);
  
  await client.upsert('my_collection', {
    wait: true,
    points: batch
  });
  
  console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}`);
}
```

## Best Practices

### Use Meaningful IDs
```javascript
// Good
id: 'doc-2024-01-15-article-123'
id: 'user-profile-456'

// Avoid
id: 1
id: 'abc123'
```

### Structure Your Payload
```javascript
// Organize related data
payload: {
  content: {
    title: 'Article Title',
    body: 'Article content...'
  },
  metadata: {
    author: 'John Doe',
    published: '2024-01-15',
    category: 'tech'
  },
  stats: {
    views: 1250,
    likes: 45
  }
}
```

### Wait for Completion
```javascript
// For important operations, wait for completion
await client.upsert('my_collection', {
  wait: true,  // Wait for the operation to complete
  points: points
});
```

## Next Steps

Now that you know how to insert points:

- **[Vector Search](/search/vector-search/)** - Search your inserted data
- **[Filtering](/search/filtering/)** - Filter results by payload data
