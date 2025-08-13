---
title: "Vector Search"
description: "How to perform vector searches using GenelineX Qdrant deployment"
---

Vector search is the core functionality of Qdrant, allowing you to find similar vectors based on distance metrics. This guide covers performing effective vector searches with the GenelineX managed deployment.

## Basic Search

The simplest search finds vectors similar to a query vector:

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: 'https://your-cluster.geneline-x.net',
  apiKey: 'your-api-key-here'
});

// Basic vector search
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3, 0.4],  // Your query vector
  limit: 5  // Number of results to return
});

// Process results
results.forEach(result => {
  console.log(`ID: ${result.id}, Score: ${result.score}`);
  console.log(`Payload:`, result.payload);
});
```

**Expected output:**
```
ID: 1, Score: 0.987
Payload: { name: 'apple', category: 'fruit' }
ID: 2, Score: 0.654  
Payload: { name: 'banana', category: 'fruit' }
ID: 3, Score: 0.432
Payload: { name: 'orange', category: 'fruit' }
```

## Search Parameters

### Limit Results

Control the number of results returned:

```javascript
// Return top 10 most similar vectors
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3, 0.4],
  limit: 10
});
```

**Expected output:**
```json
[
  { "id": 1, "score": 0.987, "payload": { "name": "apple" } },
  { "id": 2, "score": 0.854, "payload": { "name": "banana" } },
  // ... up to 10 results
]
```

### Score Threshold

Only return results above a certain similarity score:

```javascript
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3, 0.4],
  limit: 10,
  score_threshold: 0.7  // Only return scores >= 0.7
});
```

**Expected output:**
```json
[
  { "id": 1, "score": 0.987, "payload": { "name": "apple" } },
  { "id": 3, "score": 0.823, "payload": { "name": "orange" } }
]
```

## Search with Payload Filters

### Basic Filter

Search with conditions on payload data:

```javascript
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3, 0.4],
  filter: {
    must: [
      { key: 'category', match: { value: 'fruit' } }
    ]
  },
  limit: 5
});
```

**Expected output:**
```json
[
  { "id": 1, "score": 0.987, "payload": { "name": "apple", "category": "fruit" } },
  { "id": 2, "score": 0.754, "payload": { "name": "banana", "category": "fruit" } }
]
```

### Multiple Conditions

Use multiple filter conditions:

```javascript
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3, 0.4],
  filter: {
    must: [
      { key: 'category', match: { value: 'fruit' } },
      { key: 'color', match: { value: 'red' } }
    ]
  },
  limit: 5
});
```

**Expected output:**
```json
[
  { "id": 1, "score": 0.987, "payload": { "name": "apple", "category": "fruit", "color": "red" } },
  { "id": 5, "score": 0.643, "payload": { "name": "strawberry", "category": "fruit", "color": "red" } }
]
```

## Range Queries

Search for numeric ranges:

```javascript
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3, 0.4],
  filter: {
    must: [
      { 
        key: 'price',
        range: { gte: 10, lte: 50 }  // Between $10 and $50
      }
    ]
  },
  limit: 5
});
```

**Expected output:**
```json
[
  { "id": 12, "score": 0.876, "payload": { "product": "item1", "price": 25.99 } },
  { "id": 34, "score": 0.745, "payload": { "product": "item2", "price": 15.50 } }
]
```

## Search with Payload Return

### Select Specific Fields

Return only specific payload fields:

```javascript
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3, 0.4],
  with_payload: ['name', 'category'],  // Only return these fields
  limit: 3
});
```

**Expected output:**
```json
[
  { "id": 1, "score": 0.987, "payload": { "name": "apple", "category": "fruit" } },
  { "id": 2, "score": 0.754, "payload": { "name": "banana", "category": "fruit" } }
]
```

### Include Vectors

Return vectors along with results:

```javascript
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3, 0.4],
  with_payload: true,
  with_vectors: true,
  limit: 2
});
```

**Expected output:**
```json
[
  {
    "id": 1,
    "score": 0.987,
    "payload": { "name": "apple", "category": "fruit" },
    "vector": [0.9, 0.1, 0.1, 0.5]
  },
  {
    "id": 2,
    "score": 0.754,
    "payload": { "name": "banana", "category": "fruit" },
    "vector": [0.1, 0.9, 0.1, 0.5]
  }
]
```

## Recommendation Search

Find items similar to existing points:

```javascript
// Find items similar to point with ID 5
const results = await client.recommend('my_collection', {
  positive: [5],      // Points to find similar items to
  limit: 5
});
```

**Expected output:**
```json
[
  { "id": 12, "score": 0.923, "payload": { "name": "similar_item1" } },
  { "id": 7, "score": 0.876, "payload": { "name": "similar_item2" } }
]
```

### Multiple Positive Examples

Use multiple points as positive examples:

```javascript
const results = await client.recommend('my_collection', {
  positive: [1, 3, 5],  // Find items similar to these
  negative: [2],        // But not similar to this
  limit: 5
});
```

**Expected output:**
```json
[
  { "id": 15, "score": 0.934, "payload": { "name": "recommended_item1" } },
  { "id": 23, "score": 0.887, "payload": { "name": "recommended_item2" } }
]
```

## Search Best Practices

### Use Score Thresholds

Set minimum similarity scores:

```javascript
const results = await client.search('my_collection', {
  vector: queryVector,
  limit: 100,
  score_threshold: 0.8  // Only high-quality matches
});
```

### Combine Filters Efficiently

Structure filters for better performance:

```javascript
const results = await client.search('my_collection', {
  vector: queryVector,
  filter: {
    must: [
      { key: 'status', match: { value: 'active' } },  // Filter first
      { key: 'category', match: { value: 'electronics' } }
    ]
  },
  limit: 10
});
```

### Use Appropriate Limits

Balance performance and results:

```javascript
// For UI display - small limit
const quickResults = await client.search('my_collection', {
  vector: queryVector,
  limit: 10
});

// For analysis - larger limit  
const detailedResults = await client.search('my_collection', {
  vector: queryVector,
  limit: 100
});
```
