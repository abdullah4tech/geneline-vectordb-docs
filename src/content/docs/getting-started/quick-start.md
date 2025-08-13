---
title: "Quick Start"
description: "Get started with Qdrant in just a few minutes - create collections, add vectors, and perform searches"
---

This guide will walk you through your first Qdrant operations in just a few minutes. We'll create a collection, add some points, and perform a search.

## Prerequisites

- Qdrant running locally (see [Installation](/getting-started/installation/))
- JavaScript/Node.js environment

## Step 1: Install the Client

```bash
npm install @qdrant/js-client-rest
```

## Step 2: Connect to Qdrant

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  host: 'localhost',
  port: 6333
});

// Test the connection
const collections = await client.getCollections();
console.log('Connected! Current collections:', collections);
```

**Expected output:**
```
Connected! Current collections: { collections: [] }
```

## Step 3: Create a Collection

```javascript
const collectionName = 'my_first_collection';

await client.createCollection(collectionName, {
  vectors: {
    size: 4, // Simple 4-dimensional vectors for this example
    distance: 'Cosine'
  }
});

console.log(`Collection "${collectionName}" created!`);
```

**Expected output:**
```
Collection "my_first_collection" created!
```

## Step 4: Insert Points

```javascript
// Insert some sample points
await client.upsert(collectionName, {
  wait: true,
  points: [
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
  ]
});

console.log('Points inserted successfully!');
```

**Expected output:**
```
Points inserted successfully!
```

## Step 5: Search for Similar Vectors

```javascript
// Search for vectors similar to our query
const searchResults = await client.search(collectionName, {
  vector: [0.8, 0.2, 0.1, 0.4], // Query vector similar to apple
  limit: 2,
  with_payload: true
});

console.log('Search results:');
searchResults.forEach((result, index) => {
  console.log(`${index + 1}. ${result.payload.name} (score: ${result.score.toFixed(3)})`);
});
```

**Expected output:**
```
Search results:
1. apple (score: 0.987)
2. banana (score: 0.654)
```

## Complete Example

Here's the complete working example:

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

async function quickStart() {
  // Connect to Qdrant
  const client = new QdrantClient({
    host: 'localhost',
    port: 6333
  });

  const collectionName = 'quick_start_demo';

  try {
    // Create collection
    await client.createCollection(collectionName, {
      vectors: { size: 4, distance: 'Cosine' }
    });

    // Insert sample data
    await client.upsert(collectionName, {
      wait: true,
      points: [
        { 
          id: 1, 
          vector: [0.9, 0.1, 0.1, 0.5], 
          payload: { name: "apple", category: "fruit" } 
        },
        { 
          id: 2, 
          vector: [0.1, 0.9, 0.1, 0.5], 
          payload: { name: "banana", category: "fruit" } 
        },
        { 
          id: 3, 
          vector: [0.1, 0.1, 0.9, 0.5], 
          payload: { name: "carrot", category: "vegetable" } 
        },
      ]
    });

    // Search for similar items
    const results = await client.search(collectionName, {
      vector: [0.8, 0.2, 0.1, 0.4], // Query vector similar to apple
      limit: 2,
      with_payload: true
    });

    console.log('Most similar items:', results);

  } catch (error) {
    console.error('Error:', error);
  }
}

quickStart();
```

**Expected output:**
```
Most similar items: [
  {
    id: 1,
    version: 0,
    score: 0.987,
    payload: { name: "apple", category: "fruit" }
  },
  {
    id: 2, 
    version: 0,
    score: 0.654,
    payload: { name: "banana", category: "fruit" }
  }
]
```

## What You Learned

🎯 **Collections**: Containers for your vectors with specific configuration

🔢 **Vectors**: Numerical representations of your data (embeddings)  

🏷️ **Payload**: Metadata associated with each vector

🔍 **Search**: Finding vectors similar to a query vector

📊 **Similarity Score**: How close vectors are (higher score = more similar for Cosine)

]

## Next Steps

Congratulations! You've successfully:
- Connected to Qdrant
- Created a collection
- Inserted vector points
- Performed similarity search

Now you can explore more advanced features like [creating collections](/collections/creating) with different configurations or [advanced search](/search/vector-search) techniques.
