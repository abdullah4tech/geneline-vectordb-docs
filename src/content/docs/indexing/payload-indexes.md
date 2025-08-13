---
title: "Payload Indexes"
description: "How to create and manage payload indexes with GenelineX Qdrant deployment"
---

Payload indexes in Qdrant dramatically improve filtering performance by creating efficient data structures for specific payload fields. This guide covers creating, managing, and optimizing payload indexes using the GenelineX managed deployment.

## What are Payload Indexes?

Payload indexes are data structures that accelerate filtering operations on payload fields. Without indexes, Qdrant must scan all points to apply filters. With indexes, filtering becomes much faster.

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: 'https://vecstore.geneline-x.net',
  apiKey: 'aiforAfrica@6282Geneline'
});

// Create a basic payload index
await client.createPayloadIndex('my_collection', {
  field_name: 'category',
  field_schema: 'keyword'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 1
  },
  "status": "ok",
  "time": 0.045
}
```

## Index Types and Schemas

### Keyword Index

For exact string matching and categorical data:

```javascript
// Category field index
await client.createPayloadIndex('products', {
  field_name: 'category', 
  field_schema: 'keyword'
});

// Status field index
await client.createPayloadIndex('products', {
  field_name: 'status',
  field_schema: 'keyword'
});
```

**Expected output:** (for each operation)
```json
{
  "result": {
    "operation_id": 2
  },
  "status": "ok",
  "time": 0.032
}
```

### Integer Index

For whole number filtering:

```javascript
// User ID index
await client.createPayloadIndex('documents', {
  field_name: 'user_id',
  field_schema: 'integer'
});

// Year published index
await client.createPayloadIndex('documents', {
  field_name: 'year',
  field_schema: 'integer'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 3
  },
  "status": "ok",
  "time": 0.028
}
```

### Float Index

For decimal number ranges:

```javascript
// Price range index
await client.createPayloadIndex('products', {
  field_name: 'price',
  field_schema: 'float'
});

// Rating index
await client.createPayloadIndex('products', {
  field_name: 'rating',
  field_schema: 'float'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 4
  },
  "status": "ok",
  "time": 0.031
}
```

### Boolean Index

For true/false filtering:

```javascript
// In stock flag
await client.createPayloadIndex('products', {
  field_name: 'in_stock',
  field_schema: 'bool'
});

// Featured flag
await client.createPayloadIndex('products', {
  field_name: 'is_featured',
  field_schema: 'bool'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 5
  },
  "status": "ok",
  "time": 0.019
}
```

### Geo Index

For geographic coordinate filtering:

```javascript
// Location coordinates
await client.createPayloadIndex('stores', {
  field_name: 'location',
  field_schema: 'geo'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 6
  },
  "status": "ok",
  "time": 0.052
}
```

### Text Index

For text search and tokenization:

```javascript
// Full-text search on content
await client.createPayloadIndex('articles', {
  field_name: 'content',
  field_schema: 'text'
});

// Text search on titles
await client.createPayloadIndex('articles', {
  field_name: 'title', 
  field_schema: 'text'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 7
  },
  "status": "ok",
  "time": 0.067
}
```

## Index Management

### List Collection Indexes

View all indexes for a collection:

```javascript
const collectionInfo = await client.getCollection('products');
console.log('Payload indexes:', collectionInfo.result.config.params.payload_indices);
```

**Expected output:**
```json
Payload indexes: {
  "category": {
    "data_type": "Keyword"
  },
  "price": {
    "data_type": "Float"
  },
  "rating": {
    "data_type": "Float" 
  },
  "in_stock": {
    "data_type": "Bool"
  }
}
```

### Delete an Index

Remove an index when no longer needed:

```javascript
await client.deletePayloadIndex('products', 'old_field');
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 8
  },
  "status": "ok",
  "time": 0.024
}
```

## Performance Impact

### Before vs After Indexing

```javascript
// Test filter performance
const filter = {
  must: [
    { key: 'category', match: { value: 'electronics' } },
    { key: 'price', range: { lte: 100 } }
  ]
};

// Search with timing
const startTime = Date.now();
const results = await client.search('products', {
  vector: [0.1, 0.2, 0.3, 0.4],
  filter: filter,
  limit: 10
});
const searchTime = Date.now() - startTime;

console.log(`Search took ${searchTime}ms`);
console.log(`Found ${results.length} results`);
```

**Expected output:** (with indexes)
```
Search took 15ms
Found 10 results
```

**Expected output:** (without indexes)
```
Search took 245ms
Found 10 results
```

## Best Practices

### Index Strategy

```javascript
// Create indexes for frequently filtered fields
const commonFilters = [
  { field: 'category', schema: 'keyword' },
  { field: 'status', schema: 'keyword' },
  { field: 'price', schema: 'float' },
  { field: 'created_at', schema: 'integer' }, // Unix timestamp
  { field: 'is_active', schema: 'bool' }
];

// Batch create indexes
for (const index of commonFilters) {
  await client.createPayloadIndex('products', {
    field_name: index.field,
    field_schema: index.schema
  });
}
```

**Expected output:** (for each index creation)
```json
{
  "result": {
    "operation_id": 9
  },
  "status": "ok",
  "time": 0.035
}
```

### Monitor Index Usage

```javascript
// Check collection statistics
const stats = await client.getCollection('products');
console.log('Collection status:', stats.result.status);
console.log('Points count:', stats.result.points_count);
console.log('Vectors count:', stats.result.vectors_count);
```

**Expected output:**
```json
Collection status: green
Points count: 50000
Vectors count: 50000
```

## Common Use Cases

### E-commerce Product Filtering

```javascript
// Complete e-commerce indexing setup
const ecommerceIndexes = [
  { field: 'category', schema: 'keyword' },      // "electronics", "clothing"
  { field: 'brand', schema: 'keyword' },         // "apple", "nike" 
  { field: 'price', schema: 'float' },           // 29.99, 199.99
  { field: 'rating', schema: 'float' },          // 4.5, 3.2
  { field: 'in_stock', schema: 'bool' },         // true, false
  { field: 'discount_percent', schema: 'float' }, // 0.15, 0.25
  { field: 'release_year', schema: 'integer' }    // 2024, 2023
];

for (const index of ecommerceIndexes) {
  await client.createPayloadIndex('products', {
    field_name: index.field,
    field_schema: index.schema
  });
  
  console.log(`Created index for ${index.field}`);
}
```

**Expected output:**
```
Created index for category
Created index for brand  
Created index for price
Created index for rating
Created index for in_stock
Created index for discount_percent
Created index for release_year
```

### Content Management System

```javascript
// CMS indexing setup
const cmsIndexes = [
  { field: 'content_type', schema: 'keyword' },  // "article", "video"
  { field: 'author_id', schema: 'integer' },     // 123, 456
  { field: 'published', schema: 'bool' },        // true, false
  { field: 'publish_date', schema: 'integer' },  // Unix timestamp
  { field: 'view_count', schema: 'integer' },    // 1500, 2300
  { field: 'tags', schema: 'keyword' }           // ["tech", "ai"]
];

for (const index of cmsIndexes) {
  await client.createPayloadIndex('content', {
    field_name: index.field,
    field_schema: index.schema
  });
}
```

**Expected output:** (for each index)
```json
{
  "result": {
    "operation_id": 15
  },
  "status": "ok",
  "time": 0.041
}
```

### Geographic Applications

```javascript
// Location-based indexing
await client.createPayloadIndex('locations', {
  field_name: 'coordinates',
  field_schema: 'geo'
});

await client.createPayloadIndex('locations', {
  field_name: 'city',
  field_schema: 'keyword'
});

await client.createPayloadIndex('locations', {
  field_name: 'country',
  field_schema: 'keyword'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 16
  },
  "status": "ok",
  "time": 0.048
}
```

## Index Maintenance

### Rebuilding Indexes

```javascript
// Delete and recreate an index (for schema changes)
await client.deletePayloadIndex('products', 'price');
await client.createPayloadIndex('products', {
  field_name: 'price',
  field_schema: 'float'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 17
  },
  "status": "ok",
  "time": 0.156
}
```

### Bulk Index Operations

```javascript
// Function to setup indexes for a new collection
async function setupCollectionIndexes(collectionName, indexDefinitions) {
  const results = [];
  
  for (const indexDef of indexDefinitions) {
    try {
      const result = await client.createPayloadIndex(collectionName, {
        field_name: indexDef.field,
        field_schema: indexDef.schema
      });
      
      results.push({
        field: indexDef.field,
        success: true,
        operation_id: result.result.operation_id
      });
    } catch (error) {
      results.push({
        field: indexDef.field,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Usage
const indexes = [
  { field: 'category', schema: 'keyword' },
  { field: 'price', schema: 'float' },
  { field: 'rating', schema: 'float' }
];

const indexResults = await setupCollectionIndexes('products', indexes);
console.log('Index creation results:', indexResults);
```

**Expected output:**
```json
Index creation results: [
  {
    "field": "category",
    "success": true,
    "operation_id": 18
  },
  {
    "field": "price", 
    "success": true,
    "operation_id": 19
  },
  {
    "field": "rating",
    "success": true,
    "operation_id": 20
  }
]
```

## Performance Guidelines

### When to Index

- **Always index**: Fields used in `must` filters
- **Consider indexing**: Fields used in `should` filters
- **Rarely index**: Fields only used occasionally
- **Never index**: Fields with high cardinality and no filtering

### Memory Considerations

```javascript
// Monitor collection memory usage
const collectionInfo = await client.getCollection('products');
console.log('Memory usage:', {
  points: collectionInfo.result.points_count,
  vectors: collectionInfo.result.vectors_count,
  indexed_vectors: collectionInfo.result.indexed_vectors_count
});
```

**Expected output:**
```json
Memory usage: {
  "points": 100000,
  "vectors": 100000,
  "indexed_vectors": 100000
}
```

## Troubleshooting

### Common Issues

```javascript
// Check if index exists before creating
try {
  const info = await client.getCollection('products');
  const existingIndexes = info.result.config.params.payload_indices || {};
  
  if (!existingIndexes.category) {
    await client.createPayloadIndex('products', {
      field_name: 'category',
      field_schema: 'keyword'
    });
    console.log('Category index created');
  } else {
    console.log('Category index already exists');
  }
} catch (error) {
  console.error('Error managing index:', error);
}
```

**Expected output:** (if index doesn't exist)
```
Category index created
```

**Expected output:** (if index exists)
```
Category index already exists
```
