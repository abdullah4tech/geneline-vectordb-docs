---
title: "Filtering"
description: "Advanced filtering capabilities with GenelineX Qdrant deployment"
---

Qdrant's powerful filtering system allows you to combine vector similarity search with traditional database-style conditions. This guide covers all filtering capabilities using the GenelineX managed deployment.

## Basic Filtering Concepts

Filters in Qdrant work on **payload data** (metadata) and can be combined with vector search to find similar vectors that also meet specific criteria.

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: 'https://your-cluster.geneline-x.net',
  apiKey: 'your-api-key-here'
});

// Basic filtered search
const results = await client.search('documents', {
  vector: [0.1, 0.2, 0.3, 0.4],
  filter: {
    must: [
      {
        key: 'category',
        match: { value: 'technology' }
      }
    ]
  },
  limit: 10
});
```

**Expected output:**
```json
[
  {
    "id": 1,
    "score": 0.987,
    "payload": {
      "category": "technology",
      "title": "AI Revolution",
      "author": "John Doe"
    }
  },
  {
    "id": 3,
    "score": 0.854,
    "payload": {
      "category": "technology", 
      "title": "Machine Learning Basics",
      "author": "Jane Smith"
    }
  }
]
```
## Filter Structure

Filters use a logical structure with three main operators:

- **must**: All conditions must be true (AND logic)
- **should**: At least one condition must be true (OR logic)  
- **must_not**: None of the conditions should be true (NOT logic)

```javascript
const complexFilter = {
  must: [
    { key: 'category', match: { value: 'tech' } }
  ],
  should: [
    { key: 'tags', match: { any: ['ai', 'ml'] } },
    { key: 'rating', range: { gte: 4.5 } }
  ],
  must_not: [
    { key: 'status', match: { value: 'archived' } }
  ]
};
```

**Expected output:** (when used in search)
```json
[
  {
    "id": 5,
    "score": 0.923,
    "payload": {
      "category": "tech",
      "tags": ["ai", "neural-networks"],
      "rating": 4.8,
      "status": "published"
    }
  },
  {
    "id": 12,
    "score": 0.876,
    "payload": {
      "category": "tech", 
      "tags": ["ml", "algorithms"],
      "rating": 4.6,
      "status": "active"
    }
  }
]
```

## Match Conditions

### Exact Match

```javascript
// Match exact value
const filter = {
  must: [
    {
      key: 'category',
      match: { value: 'technology' }
    }
  ]
};
```

**Expected output:** (when used in search)
```json
[
  {
    "id": 2,
    "score": 0.945,
    "payload": {
      "category": "technology",
      "title": "Tech News Today"
    }
  }
]
```

```javascript
// Match any of multiple values
const multiFilter = {
  must: [
    {
      key: 'status',
      match: { any: ['active', 'featured'] }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 1,
    "score": 0.923,
    "payload": {
      "status": "active",
      "title": "Active Article"
    }
  },
  {
    "id": 4,
    "score": 0.887,
    "payload": {
      "status": "featured",
      "title": "Featured Content"
    }
  }
]
```

```javascript
// Match all values (for arrays)
const allFilter = {
  must: [
    {
      key: 'tags',
      match: { all: ['javascript', 'tutorial'] }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 7,
    "score": 0.892,
    "payload": {
      "tags": ["javascript", "tutorial", "beginner"],
      "title": "JavaScript Tutorial for Beginners"
    }
  }
]
```

```javascript
// Exclude specific values
const excludeFilter = {
  must: [
    {
      key: 'category',
      match: { except: ['spam', 'deleted'] }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 9,
    "score": 0.876,
    "payload": {
      "category": "technology",
      "title": "Valid Content"
    }
  },
  {
    "id": 11,
    "score": 0.834,
    "payload": {
      "category": "science",
      "title": "Research Article"
    }
  }
]
```

## Range Conditions

### Numeric Ranges

```javascript
// Basic range conditions
const rangeFilter = {
  must: [
    {
      key: 'price',
      range: {
        gte: 10.0,  // Greater than or equal
        lte: 100.0  // Less than or equal
      }
    }
  ]
};
```

**Expected output:** (when used in search)
```json
[
  {
    "id": 15,
    "score": 0.912,
    "payload": {
      "price": 25.99,
      "product": "Wireless Mouse",
      "category": "electronics"
    }
  },
  {
    "id": 23,
    "score": 0.887,
    "payload": {
      "price": 89.50,
      "product": "Bluetooth Headphones", 
      "category": "audio"
    }
  }
]
```

```javascript
// Single-sided ranges
const minPriceFilter = {
  must: [
    { key: 'price', range: { gte: 50.0 } }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 18,
    "score": 0.934,
    "payload": {
      "price": 129.99,
      "product": "Gaming Keyboard"
    }
  }
]
```

const maxPriceFilter = {
  must: [
    { key: 'price', range: { lt: 200.0 } }  // Less than (exclusive)
  ]
};

### Date/Time Ranges

```javascript
// Date range filtering
const dateFilter = {
  must: [
    {
      key: 'published_date',
      range: {
        gte: '2024-01-01T00:00:00Z',
        lte: '2024-12-31T23:59:59Z'
      }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 25,
    "score": 0.923,
    "payload": {
      "published_date": "2024-03-15T10:30:00Z",
      "title": "Spring 2024 Update",
      "author": "Tech Team"
    }
  },
  {
    "id": 31,
    "score": 0.889,
    "payload": {
      "published_date": "2024-07-22T14:45:00Z",
      "title": "Summer Release Notes"
    }
  }
]
```

```javascript
// Recent content (last 30 days)
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
const recentFilter = {
  must: [
    {
      key: 'created_at',
      range: { gte: thirtyDaysAgo }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 42,
    "score": 0.956,
    "payload": {
      "created_at": "2025-07-20T09:15:00Z",
      "title": "Latest News Article"
    }
  },
  {
    "id": 47,
    "score": 0.912,
    "payload": {
      "created_at": "2025-08-01T16:30:00Z",
      "title": "Recent Blog Post"
    }
  }
]
```
```

## Geographical Filtering

### Geo Radius

```javascript
// Find points within radius
const geoFilter = {
  must: [
    {
      key: 'location',
      geo_radius: {
        center: {
          lon: -74.0060,  // New York longitude
          lat: 40.7128    // New York latitude
        },
        radius: 1000  // 1000 meters
      }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 52,
    "score": 0.945,
    "payload": {
      "location": { "lon": -74.0050, "lat": 40.7130 },
      "name": "Central Park Cafe",
      "type": "restaurant"
    }
  },
  {
    "id": 67,
    "score": 0.898,
    "payload": {
      "location": { "lon": -74.0070, "lat": 40.7120 },
      "name": "NYC Library Branch"
    }
  }
]
```

```javascript
// Find points within bounding box
const boundingBoxFilter = {
  must: [
    {
      key: 'location',
      geo_bounding_box: {
        top_left: {
          lon: -74.1,
          lat: 40.8
        },
        bottom_right: {
          lon: -73.9,
          lat: 40.6
        }
      }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 73,
    "score": 0.923,
    "payload": {
      "location": { "lon": -74.0, "lat": 40.7 },
      "name": "Manhattan Store"
    }
  }
]
```

## Text Filtering

### Full-Text Search

```javascript
// Text contains search
const textFilter = {
  must: [
    {
      key: 'content',
      match: {
        text: 'machine learning'
      }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 84,
    "score": 0.967,
    "payload": {
      "content": "This article covers machine learning fundamentals and practical applications.",
      "title": "ML Basics Guide"
    }
  },
  {
    "id": 92,
    "score": 0.889,
    "payload": {
      "content": "Advanced machine learning techniques for data scientists.",
      "title": "Advanced ML"
    }
  }
]
```

```javascript
// Text search with tokenization
const tokenizedFilter = {
  must: [
    {
      key: 'description',
      match: {
        text: 'artificial intelligence',
        tokenize: true
      }
    }
  ]
};
```

**Expected output:**
```json
[
  {
    "id": 96,
    "score": 0.934,
    "payload": {
      "description": "Exploring artificial intelligence in modern applications",
      "category": "ai"
    }
  }
]
```

## Nested Object Filtering

### Filtering on Nested Fields

```typescript
// Filter on nested object properties
const nestedFilter = {
  must: [
    {
      key: 'metadata.author.name',
      match: { value: 'John Doe' }
    },
    {
      key: 'specifications.cpu',
      match: { value: 'Intel i7' }
    }
  ]
};
```

### Array of Objects

```typescript
// Filter on array elements
const arrayFilter = {
  must: [
    {
      key: 'reviews[].rating',
      range: { gte: 4.0 }
    },
    {
      key: 'reviews[].verified',
      match: { value: true }
    }
  ]
};
```

## Complex Filter Examples

### E-commerce Product Search

```typescript
async function searchProducts(
  query: number[], 
  filters: {
    category?: string;
    priceRange?: [number, number];
    rating?: number;
    inStock?: boolean;
    brands?: string[];
  }
) {
  const filterConditions: any = { must: [] };

  // Category filter
  if (filters.category) {
    filterConditions.must.push({
      key: 'category',
      match: { value: filters.category }
    });
  }

  // Price range
  if (filters.priceRange) {
    filterConditions.must.push({
      key: 'price',
      range: {
        gte: filters.priceRange[0],
        lte: filters.priceRange[1]
      }
    });
  }

  // Minimum rating
  if (filters.rating) {
    filterConditions.must.push({
      key: 'rating',
      range: { gte: filters.rating }
    });
  }

  // In stock only
  if (filters.inStock) {
    filterConditions.must.push({
      key: 'in_stock',
      match: { value: true }
    });
  }

  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    filterConditions.must.push({
      key: 'brand',
      match: { any: filters.brands }
    });
  }

  return await client.search('products', {
    vector: query,
    filter: filterConditions.must.length > 0 ? filterConditions : undefined,
    limit: 20,
    with_payload: true
  });
}

// Usage
const results = await searchProducts(queryVector, {
  category: 'electronics',
  priceRange: [100, 500],
  rating: 4.0,
  inStock: true,
  brands: ['Apple', 'Samsung', 'Google']
});
```

### Content Management System

```typescript
async function searchContent(
  query: number[],
  options: {
    contentType?: string;
    author?: string;
    publishedAfter?: Date;
    tags?: string[];
    status?: 'draft' | 'published' | 'archived';
  }
) {
  const filter: any = { must: [] };

  if (options.contentType) {
    filter.must.push({
      key: 'content_type',
      match: { value: options.contentType }
    });
  }

  if (options.author) {
    filter.must.push({
      key: 'author.name',
      match: { value: options.author }
    });
  }

  if (options.publishedAfter) {
    filter.must.push({
      key: 'published_at',
      range: { gte: options.publishedAfter.toISOString() }
    });
  }

  if (options.tags && options.tags.length > 0) {
    filter.must.push({
      key: 'tags',
      match: { any: options.tags }
    });
  }

  if (options.status) {
    filter.must.push({
      key: 'status',
      match: { value: options.status }
    });
  }

  return await client.search('content', {
    vector: query,
    filter: filter.must.length > 0 ? filter : undefined,
    limit: 15,
    with_payload: ['title', 'author', 'published_at', 'tags']
  });
}
```

## Filter Performance Optimization

### Payload Indexing

Create indices for frequently filtered fields:

```javascript
// Create indices for better filter performance
await client.createPayloadIndex('products', {
  field_name: 'category',
  field_schema: 'keyword'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 15
  },
  "status": "ok",
  "time": 0.045
}
```

```javascript
await client.createPayloadIndex('products', {
  field_name: 'price',
  field_schema: 'float'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 16
  },
  "status": "ok", 
  "time": 0.032
}
```

```javascript
await client.createPayloadIndex('products', {
  field_name: 'rating',
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
  "time": 0.028
}
```

```javascript
await client.createPayloadIndex('products', {
  field_name: 'in_stock',
  field_schema: 'bool'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 18
  },
  "status": "ok",
  "time": 0.021
}
```

```javascript
await client.createPayloadIndex('products', {
  field_name: 'location',
  field_schema: 'geo'
});
```

**Expected output:**
```json
{
  "result": {
    "operation_id": 19
  },
  "status": "ok",
  "time": 0.056
}
```
```

### Query Optimization Tips

1. **Most Selective First**: Put the most selective filters in `must` conditions
2. **Use Ranges Efficiently**: Prefer range queries over multiple exact matches
3. **Index Key Fields**: Always index fields used in filters
4. **Avoid Deep Nesting**: Keep payload structure relatively flat
5. **Use Appropriate Data Types**: Choose the right schema type for each field

## Combining with Recommendations

### Recommendation with Filters

```typescript
// Get recommendations with filtering
const recommendations = await client.recommend('products', {
  positive: [1, 5, 10],  // Liked product IDs
  negative: [3, 7],      // Disliked product IDs
  filter: {
    must: [
      {
        key: 'category',
        match: { value: 'electronics' }
      },
      {
        key: 'price',
        range: { lte: 1000 }
      }
    ],
    must_not: [
      {
        key: 'purchased_by',
        match: { any: ['user123'] }  // Exclude already purchased
      }
    ]
  },
  limit: 10
});
```

## Filter Debugging

### Understanding Filter Results

```typescript
// Debug filter effectiveness
async function debugFilter(collectionName: string, filter: any) {
  // Count total points
  const totalCount = await client.count(collectionName);
  
  // Count points matching filter
  const filteredCount = await client.count(collectionName, {
    filter: filter
  });
  
  console.log(`Total points: ${totalCount.count}`);
  console.log(`Matching filter: ${filteredCount.count}`);
  console.log(`Filter selectivity: ${(filteredCount.count / totalCount.count * 100).toFixed(2)}%`);
  
  return {
    total: totalCount.count,
    filtered: filteredCount.count,
    selectivity: filteredCount.count / totalCount.count
  };
}

// Usage
await debugFilter('products', {
  must: [
    { key: 'category', match: { value: 'electronics' } },
    { key: 'price', range: { lte: 500 } }
  ]
});
```

## REST API Examples

### Using Filters with REST API

```bash
# Basic filtered search
curl -X POST 'https://your-cluster.geneline-x.net/collections/products/points/search' \
  -H 'Content-Type: application/json' \
  -H 'api-key: your-api-key' \
  --data-raw '{
    "vector": [0.1, 0.2, 0.3, 0.4],
    "filter": {
      "must": [
        {
          "key": "category",
          "match": { "value": "electronics" }
        }
      ]
    },
    "limit": 10
  }'

# Complex filter with multiple conditions
curl -X POST 'https://your-cluster.geneline-x.net/collections/products/points/search' \
  -H 'Content-Type: application/json' \
  -H 'api-key: your-api-key' \
  --data-raw '{
    "vector": [0.1, 0.2, 0.3, 0.4],
    "filter": {
      "must": [
        {
          "key": "category",
          "match": { "value": "electronics" }
        },
        {
          "key": "price", 
          "range": { "gte": 100, "lte": 500 }
        }
      ],
      "should": [
        {
          "key": "brand",
          "match": { "any": ["Apple", "Samsung"] }
        }
      ]
    },
    "limit": 20,
    "with_payload": true
  }'
```

## Best Practices

### Filter Design

1. **Index First**: Create payload indices before using filters in production
2. **Test Selectivity**: Ensure filters are selective enough to improve performance
3. **Combine Wisely**: Use `must` for required conditions, `should` for preferences
4. **Avoid Over-filtering**: Don't make filters too restrictive if you need results

### Performance Guidelines

1. **Simple Conditions First**: Put simple exact matches before complex ranges
2. **Limit Nested Access**: Avoid deep nested field access when possible
3. **Use Appropriate Types**: Choose correct schema types for optimal performance
4. **Monitor Usage**: Track filter performance in production

### Common Patterns

1. **Categorical + Range**: Combine category filters with price/rating ranges
2. **Time-based**: Filter by date ranges for recent content
3. **User-specific**: Filter out items users have already seen/purchased
4. **Geographic**: Combine location-based filtering with other criteria

## Next Steps

- **[Vector Search](/search/vector-search)** - Learn about similarity search
- **[Recommendations](/search/recommendations)** - Explore recommendation APIs
- **[Collections](/collections/creating)** - Optimize collection structure for filtering
- **[JavaScript Client](/clients/javascript)** - Complete SDK reference
