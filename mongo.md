# MongoDB

## Table of Contents

- [MongoDB Basics](#mongodb-basics)
- [Data Structure](#data-structure)
- [MongoDB Ecosystem](#mongodb-ecosystem)
- [CRUD Operations](#document--crud-basics)
- [Projection](#projection)
- [Embedded Documents & Arrays](#embedded-documents--arrays)
- [Data Schemas and Relations](#data-schemas-and-data-modelling)
- [Joining with $lookup](#joining-with-lookup)
- [Schema Validation](#schema-validation)
- [Exploring The Shell & Server](#exploring-the-shell--the-server)
- [Create Operations Deep Dive](#create-operations-deep-dive)
- [Write Concern](#write-concern)
- [Atomicity](#atomicity)
- [Importing Data with mongoimport](#importing-data-with-mongoimport)
- [Read Operations Deep Dive](#read-operations-deep-dive)
- [Query Selectors](#query-selectors)
- [Working with Cursors](#working-with-cursors)
- [Sorting Results](#sorting-results)
- [Pagination: Skip & Limit](#pagination-skip--limit)
- [Projection Operators](#projection-operators)

---

## MongoDB Basics

### Data Structure Hierarchy

MongoDB organizes data in a three-tier hierarchy:

```
Database
  └── Collections
        └── Documents
```

**Explanation:**

- **Database**: The top-level container that holds multiple collections (similar to a database in SQL)
- **Collections**: Groups of documents (similar to tables in SQL, but without a fixed schema)
- **Documents**: Individual records stored in JSON-like format (similar to rows in SQL)

**Key Characteristics:**

- A single database can hold multiple collections
- A single collection can hold multiple documents
- Databases and collections are created **lazily**, meaning they're automatically created when you insert the first document

---

## JSON(BSON) Data Format

**BSON** = **B**inary **S**ON (Binary-encoded JSON)

**Explanation:**

- MongoDB stores data in BSON format internally, which is a binary representation of JSON
- **Why BSON?** It's more efficient for storage and faster to traverse than plain JSON
- MongoDB drivers automatically convert JSON to BSON when you insert data
- BSON supports additional data types not available in JSON (e.g., Date, ObjectId, Binary data)

---

## The Key MongoDB Characteristics

MongoDB is fundamentally different from traditional relational databases:

1. **BSON Data Structure**: Uses binary JSON format for efficient storage and retrieval
2. **No Schema**: Documents in the same collection can have different fields (schema-less)
3. **No/Few Relations**: Designed to minimize relationships between collections; prefers embedding data

**Advantages:**

- Flexible data modeling
- Faster queries (less joins needed)
- Easy to scale horizontally
- Simpler to evolve your data model over time

---

## MongoDB Ecosystem

MongoDB offers a comprehensive ecosystem of tools and services:

### MongoDB Database Options

1. **Self-Managed/Enterprise**

   - Install and manage on your own servers
   - **CloudManager/OpsManager**: Tools for monitoring and automating database operations

2. **Atlas (Cloud)**

   - Fully managed cloud database service (DBaaS - Database as a Service)
   - Available on AWS, Azure, and Google Cloud
   - Automatic backups, scaling, and monitoring

3. **Mobile**
   - MongoDB Realm for mobile and edge computing
   - Offline-first database for mobile applications

### Additional Tools

- **GUI Compass**: Official graphical interface for MongoDB
- **BI Connectors**: Connect MongoDB to Business Intelligence tools
- **MongoDB Charts**: Create visualizations and dashboards from your data

### Stitch (Realm)

Serverless platform for building applications:

- **Serverless Query API**: Query your database via HTTPS
- **Serverless Functions**: Run backend code without managing servers
- **Database Triggers**: Execute functions automatically when data changes
- **Real-Time Sync**: Synchronize data across devices in real-time

---

## Shell vs Drivers

**MongoDB Shell:**

- Interactive JavaScript interface for MongoDB
- Used for administration, testing, and learning
- Execute commands directly against the database

**MongoDB Drivers:**

- Libraries for programming languages (Node.js, Python, Java, C#, etc.)
- Allow applications to interact with MongoDB
- Provide native language APIs for database operations

---

## MongoDB Server Architecture

MongoDB uses a storage engine to manage how data is stored and accessed:

```
MongoDB Server
  ├── Storage Engine → Memory (Fast Read/Write)
  └── Storage Engine → Database Files (Persistent Storage)
```

**Explanation:**

1. **Memory Storage**

   - Data is read into RAM for fast access
   - Write operations first go to memory
   - Extremely fast but volatile (lost on restart)

2. **Disk Storage**
   - Data is persisted to files on disk
   - Slower than memory but permanent
   - WiredTiger is the default storage engine (handles compression and encryption)

**How it works together:**

- Frequently accessed data is kept in memory for performance
- Changes are written to memory first, then periodically flushed to disk
- This hybrid approach balances speed with data durability

---

## Document & CRUD Basics

CRUD stands for **Create**, **Read**, **Update**, and **Delete** - the four basic operations for managing data.

### Create Operations

Use these methods to insert new documents into a collection:

#### `insertOne(data, options)`

Inserts a single document into a collection.

```js

.users.insertOne({ name: "John", age: 30 });
```

#### `insertMany(data, options)`

Inserts multiple documents at once.

```js

.users.insertMany([
  { name: "Alice", age: 25 },
  { name: "Bob", age: 28 },
]);
```

---

### Read Operations

Retrieve documents from a collection using these methods:

#### `find(filter, options)`

Returns all documents that match the filter criteria.

**Important:** Returns a **cursor object**, not an array!

- To get all documents: use `.toArray()` or `.forEach()`
- Cursors are efficient for large datasets (they load data in batches)

#### `findOne(filter, options)`

Returns the first document that matches the filter.

---

#### Query Examples

**Comparison Operators:**

```js
// Find flights with distance greater than 10000

.flightData.find({ distance: { $gt: 10000 } });

// Find flights with distance less than 10000

.flightData.find({ distance: { $lt: 10000 } });

// Find first flight with distance > 900

.flightData.findOne({ distance: { $gt: 900 } });
```

**Accessing Embedded Fields:**

```js
// Get hobbies of a specific person

.passengers.findOne({ name: "Albert Twostone" }).hobbies;

// Find passengers with a specific hobby

.passengers.findOne({ hobbies: "Sports" });

// Search in nested objects using dot notation

.flightData.find({ "status.description": "on-time" });

.flightData.find({ "status.details.responsible": "Prashant" });
```

**Common Query Operators:**

- `$gt`: Greater than
- `$lt`: Less than
- `$gte`: Greater than or equal
- `$lte`: Less than or equal
- `$eq`: Equal to
- `$ne`: Not equal to

---

### Update Operations

Modify existing documents in a collection:

#### `updateOne(filter, data, options)`

Updates the first document that matches the filter.

#### `updateMany(filter, data, options)`

Updates all documents that match the filter.

#### `replaceOne(filter, data, options)`

Replaces an entire document with new data.

#### `update(filter, data, options)` _(Legacy - Avoid)_

Older method that overrides complete data; use `updateOne` or `updateMany` instead.

---

#### Update Examples

**Update Operators:**

```js
// Add a marker field to one document

.flightData.updateOne({ distance: 980 }, { $set: { marker: "delete" } });

// Add marker to all documents

.flightData.updateMany(
  {}, // empty filter = match all
  { $set: { marker: "delete" } },
);

// Update an array field

.passengers.updateOne(
  { name: "Albert Twostone" },
  { $set: { hobbies: ["Sports", "Cooking"] } },
);
```

**Common Update Operators:**

- `$set`: Set field value
- `$unset`: Remove a field
- `$inc`: Increment a number
- `$push`: Add item to array
- `$pull`: Remove item from array

---

### Delete Operations

Remove documents from a collection:

#### `deleteOne(filter, options)`

Deletes the first document that matches the filter.

```js

.users.deleteOne({ name: "John" });
```

#### `deleteMany(filter, options)`

Deletes all documents that match the filter.

```js
// Delete all users over 65

.users.deleteMany({ age: { $gt: 65 } });

// Delete all documents in collection

.users.deleteMany({});
```

**⚠️ Warning:** Be careful with `deleteMany({})` - it deletes everything!

---

## Projection

**Projection** allows you to retrieve only specific fields from documents, reducing network bandwidth and improving performance.

**Syntax:**

```js

.collection.find(filter, projection);
```

### How Projection Works

Use `1` to include a field and `0` to exclude it:

```js
// Only return name and age, exclude _id

.passengers.find({}, { name: 1, age: 1, _id: 0 })[
  // Result:
  ({ name: "John", age: 30 }, { name: "Alice", age: 25 })
];
```

**Key Points:**

- By default, `_id` is **always included** unless explicitly excluded with `_id: 0`
- You cannot mix inclusion and exclusion (except for `_id`)
- Projection reduces the amount of data transferred over the network
- Useful when documents have many fields but you only need a few

### Examples

```js
// Include only specific fields

.users.find({}, { name: 1, email: 1 }); // _id is included by default

// Exclude specific fields

.users.find({}, { password: 0, secret: 0 }); // Everything except password and secret

// Include fields and exclude _id

.products.find({}, { title: 1, price: 1, _id: 0 });
```

---

## Embedded Documents & Arrays

MongoDB allows you to store complex, hierarchical data structures within a single document.

### Embedded Documents

You can nest documents inside other documents:

```js
{
  name: "John Doe",
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001"
  }
}
```

### Arrays

Arrays can contain any data type - numbers, strings, objects, or even other arrays:

```js
{
  name: "Alice",
  hobbies: ["Reading", "Cooking", "Travel"],
  tags: [
    { category: "premium" },
    { category: "active" }
  ]
}
```

### Hard Limits

MongoDB imposes some constraints on document structure:

- **Nesting Depth**: Up to **100 levels** of nested documents
- **Document Size**: Maximum **16 MB** per document
- **Arrays**: Can hold any type of data (mixed types are allowed)

**Best Practices:**

- Keep documents under 16 MB
- Limit nesting depth for better query performance
- Consider references instead of deep nesting for complex relationships
- Use arrays for lists of related data that you typically access together

### Querying Embedded Documents

```js
// Dot notation for nested fields

.users.find({ "address.city": "New York" });

// Query array elements

.users.find({ hobbies: "Reading" }); // Matches if array contains "Reading"

// Query nested objects in arrays

.users.find({ "tags.category": "premium" });
```

---

## Data Schemas and Data Modelling

MongoDB is schema-less, but you should still design your data structure carefully.

### Example Document with Various Data Types

```js

.companies.insertOne({
  name: "Fresh Apple Inc",
  isStartUp: true,
  employees: 33,
  funding: 1233456565,
  details: {
    ceo: "Mark Super",
  },
  tags: [{ title: "super" }, { title: "perfect" }],
  foundingDate: new Date(),
  insertedAt: new Timestamp(),
});
```

**Data Types Used:**

- `String`: name, ceo
- `Boolean`: isStartUp
- `Number`: employees, funding
- `Object`: details
- `Array`: tags
- `Date`: foundingDate
- `Timestamp`: insertedAt

---

## Relations-Options

MongoDB offers two main approaches to model relationships between data:

```js
{
  userName: 'Max',
  age: 29,
  address: {
    street: "Second Street",
    city: "New York",
  }
}
```

---

## Relations-Options

MongoDB offers two main approaches to model relationships between data:

### 1. Nested/Embedded Documents

**Approach:** Store related data directly within the parent document.

**Example:**

```js
{
  userName: 'Max',
  age: 29,
  address: {
    street: "Second Street",
    city: "New York"
  }
}
```

**When to Use:**

- Data that belongs together and is accessed together
- One-to-one relationships
- One-to-few relationships
- When data size won't exceed document limits

**Advantages:**

- Faster reads (one query gets everything)
- Atomic updates (update entire structure in one operation)
- No need for joins

**Disadvantages:**

- Can lead to data duplication
- 16 MB document size limit
- Harder to query nested data independently

---

### 2. References

**Approach:** Store references (IDs) to documents in other collections.

**Example:**

```js
// Users Collection
{
  userName: 'max',
  favBooks: ['id1', 'id2']  // References to book IDs
}

// Books Collection
[
  {
    _id: 'id1',
    title: "Ring of Fire"
  },
  {
    _id: 'id2',
    title: "XYZ"
  }
]
```

**When to Use:**

- Many-to-many relationships
- Large or frequently changing related data
- When you need to query related data independently
- When related data exceeds document size limits

**Advantages:**

- No data duplication
- Smaller document sizes
- Can update referenced data independently
- No document size limitations

**Disadvantages:**

- Requires multiple queries (or $lookup aggregation)
- Slower read performance
- No atomic updates across documents

---

## Relationship Patterns

### One-to-One Relations - Embedded

**Use Case:** User profile with address (always accessed together)

```js
{
  userName: 'max',
  favBooks: [
    {
      _id: 'id1',
      title: "Ring of Fire"
    },
    {
      _id: 'id2',
      title: "XYZ"
    }
  ]
}
```

**Explanation:**

- Each user has exactly one set of favorite books
- Books are embedded directly in the user document
- Perfect when you always need books when fetching user data

---

### One-to-One Relation - Referenced

**Use Case:** Person owns one car; car belongs to one person

**Example:**

```js
// Persons Collection
carData>
.persons.insertOne({name: "Max", age: 29, salary: 3000})
{
  acknowledged: true,
  insertedId: ObjectId('6994872e0aed413665b6c1d8')
}

carData>
.persons.findOne()
{
  _id: ObjectId('6994872e0aed413665b6c1d8'),
  name: 'Max',
  age: 29,
  salary: 3000
}

// Cars Collection (references the person via ObjectId)
carData>
.cars.insertOne({
  model: "BMW",
  price: 40000,
  owner: ObjectId('6994872e0aed413665b6c1d8')  // Reference to person
})
{
  acknowledged: true,
  insertedId: ObjectId('699487560aed413665b6c1d9')
}

carData>
.cars.findOne()
{
  _id: ObjectId('699487560aed413665b6c1d9'),
  model: 'BMW',
  price: 40000,
  owner: ObjectId('6994872e0aed413665b6c1d8')  // Foreign key
}
```

**Explanation:**

- `persons` and `cars` are separate collections
- The car document stores the person's `_id` as a reference
- To get full data, you need two queries (or use `$lookup` aggregation)
- Use this when car data is large or queried independently

---

### One-to-Many Embedded

**Use Case:** One question thread has many answers; each answer belongs to only that thread.

```js
support>
.questionThreads.insertOne({
  creator: "Max",
  question: "How does that all work?",
  answers: [
    { "text": "Like That" },
    { "text": "Thanks" }
  ]
})
{
  acknowledged: true,
  insertedId: ObjectId('699489d30aed413665b6c1db')
}

support>
.questionThreads.find()
[
  {
    _id: ObjectId('699489d30aed413665b6c1db'),
    creator: 'Max',
    question: 'How does that all work?',
    answers: [
      { text: 'Like That' },
      { text: 'Thanks' }
    ]  // One question → Many answers (embedded)
  }
]
```

**Explanation:**

- Answers are embedded directly in the question document
- All answers are always loaded with the question
- Perfect for data that's always accessed together
- Limited by 16 MB document size

**When to Use Embedded One-to-Many:**

- Limited number of related items
- Related items are always accessed with parent
- Related items don't need to be queried independently

---

### One-to-Many Referenced

**Use Case:** One city has many citizens; each citizen belongs to one city.

```js
// Cities Collection
cityData>
.cities.insertOne({
  name: "New York City",
  coordinates: { lat: 21, lng: 55 }
})
{
  acknowledged: true,
  insertedId: ObjectId('69948ab20aed413665b6c1dc')
}

cityData>
.cities.find()
[
  {
    _id: ObjectId('69948ab20aed413665b6c1dc'),
    name: 'New York City',
    coordinates: { lat: 21, lng: 55 }
  }
]

// Citizens Collection (each citizen references their city)
cityData>
.citizens.insertMany([
  {
    name: "Prashant",
    cityId: ObjectId('69948ab20aed413665b6c1dc')  // Reference
  },
  {
    name: "XYZ",
    cityId: ObjectId('69948ab20aed413665b6c1dc')  // Reference
  }
])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('69948b6a0aed413665b6c1dd'),
    '1': ObjectId('69948b6a0aed413665b6c1de')
  }
}

cityData>
.citizens.find()
[
  {
    _id: ObjectId('69948b6a0aed413665b6c1dd'),
    name: 'Prashant',
    cityId: ObjectId('69948ab20aed413665b6c1dc')
  },
  {
    _id: ObjectId('69948b6a0aed413665b6c1de'),
    name: 'XYZ',
    cityId: ObjectId('69948ab20aed413665b6c1dc')
  }
]
```

**Explanation:**

- Citizens and cities are in separate collections
- Each citizen document stores a reference to their city's `_id`
- To find all citizens of a city: `
.citizens.find({ cityId: cityId })`
- To get city details for a citizen: look up the city using the `cityId`

**When to Use Referenced One-to-Many:**

- Many related items (could be thousands or millions)
- Related items are frequently queried independently
- Related items would exceed document size limit if embedded

---

### Many-to-Many Embedded

**Use Case:** Customers can order multiple products; products can be ordered by multiple customers.

```js
// Products Collection
shop>
.products.insertOne({ title: "A Book", price: 12.99 })
{
  acknowledged: true,
  insertedId: ObjectId('69948c880aed413665b6c1df')
}

// Customers Collection (orders embedded in customer)
shop>
.customers.insertOne({name: "Prashant", age: 29})
{
  acknowledged: true,
  insertedId: ObjectId('69948ca50aed413665b6c1e0')
}

shop>
.customers.updateOne(
  {},
  {
    $set: {
      orders: [
        {
          title: "A Book",
          price: 12.99,
          quantity: 2
        }
      ]
    }
  }
)
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}

shop>
.customers.find()
[
  {
    _id: ObjectId('69948ca50aed413665b6c1e0'),
    name: 'Prashant',
    age: 29,
    orders: [
      {
        title: 'A Book',
        price: 12.99,
        quantity: 2
      }
    ]
  }
]
```

**Explanation:**

- Product data is duplicated (embedded) in customer orders
- Each customer stores their complete order history
- Product details are **snapshot** at time of order (price might change later)
- No need to query products collection to see order history

**When to Use Embedded Many-to-Many:**

- Need historical snapshot of data (e.g., order price at time of purchase)
- Related data is read-heavy, rarely updated
- Don't need real-time sync with source data

**Tradeoff:**

- **Pro**: Fast reads, all data in one place
- **Con**: Data duplication, stale data if source changes

---

### Many-to-Many Referenced

**Use Case:** Students can enroll in multiple courses; courses can have multiple students.

```js
// Students Collection
[
  {
    _id: ObjectId("student1"),
    name: "Alice",
    courseIds: [ObjectId("course1"), ObjectId("course2")],
  },
  {
    _id: ObjectId("student2"),
    name: "Bob",
    courseIds: [ObjectId("course1"), ObjectId("course3")],
  },
][
  // Courses Collection
  ({
    _id: ObjectId("course1"),
    title: "MongoDB Basics",
    studentIds: [ObjectId("student1"), ObjectId("student2")],
  },
  {
    _id: ObjectId("course2"),
    title: "Advanced Queries",
  })
];
```

**Explanation:**

- Both collections store arrays of references to the other
- Can query from either direction
- No data duplication
- Changes in one collection don't require updating embedded data

**When to Use Referenced Many-to-Many:**

- Need current/live data (not snapshots)
- Related data is frequently updated
- Need to query relationships from both directions
- Want to avoid data duplication

---

## Choosing Between Embedded vs Referenced

| Factor               | Embedded                 | Referenced                |
| -------------------- | ------------------------ | ------------------------- |
| **Data Access**      | Always accessed together | Often accessed separately |
| **Data Size**        | Small, bounded           | Large or unbounded        |
| **Update Frequency** | Rarely updated           | Frequently updated        |
| **Data Duplication** | Acceptable               | Should avoid              |
| **Read Performance** | Faster (1 query)         | Slower (multiple queries) |
| **Consistency**      | May have stale data      | Always current            |
| **Atomicity**        | Atomic updates           | No atomicity across docs  |

**General Rule:**

- **Embed** when you have "contains" relationships (car has engine)
- **Reference** when you have "references" relationships (author references books)

---

## Joining with $lookup

The `$lookup` aggregation stage performs a **left outer join** between collections, allowing you to combine referenced data into a single result document.

### How $lookup Works

**Syntax:**

```js

.collection.aggregate([
  {
    $lookup: {
      from: "foreignCollection", // Collection to join
      localField: "fieldInLocal", // Field in current collection
      foreignField: "fieldInForeign", // Field in foreign collection
      as: "outputArrayName", // Name of new array field
    },
  },
]);
```

**Explanation:**

- `from`: The collection to join with
- `localField`: The field in the current collection to match
- `foreignField`: The field in the foreign collection to match against
- `as`: The name of the new array field that will contain the joined documents

---

### $lookup Example: Citizens and Cities

**Scenario:** Join citizen documents with their city information.

```js
cityData >

  .citizens.aggregate([
    {
      $lookup: {
        from: "cities", // Join with cities collection
        localField: "cityId", // Match cityId in citizens
        foreignField: "_id", // With _id in cities
        as: "cityDetails", // Store result in cityDetails array
      },
    },
  ])[
    // Result:
    ({
      _id: ObjectId("69948b6a0aed413665b6c1dd"),
      name: "Prashant",
      cityId: ObjectId("69948ab20aed413665b6c1dc"),
      cityDetails: [
        // Joined city data
        {
          _id: ObjectId("69948ab20aed413665b6c1dc"),
          name: "New York City",
          coordinates: { lat: 21, lng: 55 },
        },
      ],
    },
    {
      _id: ObjectId("69948b6a0aed413665b6c1de"),
      name: "XYZ",
      cityId: ObjectId("69948ab20aed413665b6c1dc"),
      cityDetails: [
        // Joined city data
        {
          _id: ObjectId("69948ab20aed413665b6c1dc"),
          name: "New York City",
          coordinates: { lat: 21, lng: 55 },
        },
      ],
    })
  ];
```

**Key Points:**

- `$lookup` returns an **array** (even if only one match exists)
- Performs a left join - documents without matches still appear (with empty array)
- Useful for "denormalizing" referenced data at query time
- Can be combined with other aggregation stages like `$unwind`, `$match`, `$project`

---

### Advanced $lookup Usage

**Flatten the Result with $unwind:**

```js

.citizens.aggregate([
  {
    $lookup: {
      from: "cities",
      localField: "cityId",
      foreignField: "_id",
      as: "cityDetails"
    }
  },
  {
    $unwind: "$cityDetails"  // Convert array to object
  }
])

// Result: cityDetails is now an object, not an array
{
  _id: ObjectId("69948b6a0aed413665b6c1dd"),
  name: "Prashant",
  cityId: ObjectId("69948ab20aed413665b6c1dc"),
  cityDetails: {
    _id: ObjectId("69948ab20aed413665b6c1dc"),
    name: "New York City",
    coordinates: { lat: 21, lng: 55 }
  }
}
```

**Project Specific Fields:**

```js

.citizens.aggregate([
  {
    $lookup: {
      from: "cities",
      localField: "cityId",
      foreignField: "_id",
      as: "cityDetails"
    }
  },
  {
    $unwind: "$cityDetails"
  },
  {
    $project: {
      name: 1,
      cityName: "$cityDetails.name",
      coordinates: "$cityDetails.coordinates"
    }
  }
])

// Result: Cleaner output
{
  _id: ObjectId("69948b6a0aed413665b6c1dd"),
  name: "Prashant",
  cityName: "New York City",
  coordinates: { lat: 21, lng: 55 }
}
```

**When to Use $lookup:**

- Need to join data from multiple collections
- Prefer references for data modeling but need combined results
- Creating reports that need data from related collections
- Temporary denormalization for specific queries

**Performance Considerations:**

- Can be slower than embedded documents
- Index the `foreignField` for better performance
- Consider embedding if you always need joined data

---

## Schema Validation

MongoDB allows you to enforce **data validation rules** on collections to ensure documents meet specific requirements.

### Validation Levels

Controls **which documents** get validated:

| Level          | Description                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| **`strict`**   | Validate **all** inserts and updates (default)                                 |
| **`moderate`** | Validate inserts and updates **only to documents that already meet the rules** |

**Use Cases:**

- **Strict**: New collections or when all data must be valid
- **Moderate**: Adding validation to existing collections with potentially invalid data

---

### Validation Actions

Controls **what happens** when validation fails:

| Action      | Description                                       |
| ----------- | ------------------------------------------------- |
| **`error`** | Reject the operation and throw an error (default) |
| **`warn`**  | Log a warning but allow the operation to proceed  |

**Use Cases:**

- **Error**: Enforce strict data quality
- **Warn**: Monitor validation issues without blocking operations

---

### Creating a Collection with Validation

```js

.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "text", "creator", "comments"], // Required fields
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        text: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        creator: {
          bsonType: "objectId",
          description: "must be an objectId and is required",
        },
        comments: {
          bsonType: "array",
          description: "must be an array and is required",
          items: {
            // Validate array items
            bsonType: "object",
            required: ["text", "author"],
            properties: {
              text: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              author: {
                bsonType: "objectId",
                description: "must be an objectId and is required",
              },
            },
          },
        },
      },
    },
  },
});
```

**Schema Components:**

- **`bsonType`**: Specifies the data type (string, number, objectId, array, object, etc.)
- **`required`**: Array of field names that must be present
- **`properties`**: Defines validation rules for each field
- **`items`**: Validates elements within arrays
- **`description`**: Error message shown when validation fails

---

### Failed Validation Example

**Attempting to insert invalid data:**

```js
blog>
.posts.insertOne({
  title: "My First Post",
  text: "This is my post, I hope you like it!",
  tags: ["new", "tech"],
  creator: ObjectId('699496d80aed413665b6c1e2'),
  comments: [
    {
      text: "I like this post",
      author: 12345567  // ❌ ERROR: Number instead of ObjectId
    }
  ]
})

// Error Response:
Uncaught:
MongoServerError: Document failed validation
Additional information: {
  failingDocumentId: ObjectId('69949e8cd781863a9f36ade4'),
  details: {
    operatorName: '$jsonSchema',
    schemaRulesNotSatisfied: [
      {
        operatorName: 'properties',
        propertiesNotSatisfied: [
          {
            propertyName: 'comments',
            description: 'must be an array and is required',
            details: [
              {
                operatorName: 'items',
                reason: 'At least one item did not match the sub-schema',
                itemIndex: 0,
                details: [
                  {
                    operatorName: 'properties',
                    propertiesNotSatisfied: [
                      {
                        propertyName: 'author',
                        description: 'must be an objectId and is required',
                        details: [
                          {
                            operatorName: 'bsonType',
                            specifiedAs: { bsonType: 'objectId' },
                            reason: 'type did not match',
                            consideredValue: 12345567,
                            consideredType: 'int'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**Explanation:**

- The `author` field expected an `ObjectId` but received an `int` (12345567)
- MongoDB provides detailed information about which field failed validation
- The document is **rejected** and not inserted

---

### Modifying Validation on Existing Collections

Use `
.runCommand()` with `collMod` to update validation rules:

```js

.runCommand({
  collMod: "posts", // Collection to modify
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "text", "creator", "comments"],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        text: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        creator: {
          bsonType: "objectId",
          description: "must be an objectId and is required",
        },
        comments: {
          bsonType: "array",
          description: "must be an array and is required",
          items: {
            bsonType: "object",
            required: ["text", "author"],
            properties: {
              text: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              author: {
                bsonType: "objectId",
                description: "must be an objectId and is required",
              },
            },
          },
        },
      },
    },
  },
  validationAction: "warn", // Change to warning mode
});
```

---

### Validation with Warning Action

**When validation is set to `warn`:**

```js
// Same invalid data, but with validationAction: 'warn'
blog>
.posts.insertOne({
  title: "My First Post",
  text: "This is my post, I hope you like it!",
  tags: ["new", "tech"],
  creator: ObjectId('699496d80aed413665b6c1e2'),
  comments: [
    {
      text: "I like this post",
      author: 1234567890  // Invalid: Number instead of ObjectId
    }
  ]
})

// Result: Operation succeeds!
{
  acknowledged: true,
  insertedId: ObjectId('69949ec7d781863a9f36ade6')
}

// Document is inserted despite validation failure
blog>
.posts.find()
[
  {
    _id: ObjectId('69949e6fd781863a9f36ade3'),
    title: 'My First Post',
    text: 'This is my post, I hope you like it!',
    tags: [ 'new', 'tech' ],
    creator: ObjectId('699496d80aed413665b6c1e2'),
    comments: [
      {
        text: 'I like this post',
        author: ObjectId('699496d80aed413665b6c1e1')  // Valid document
      }
    ]
  },
  {
    _id: ObjectId('69949ec7d781863a9f36ade6'),
    title: 'My First Post',
    text: 'This is my post, I hope you like it!',
    tags: [ 'new', 'tech' ],
    creator: ObjectId('699496d80aed413665b6c1e2'),
    comments: [
      {
        text: 'I like this post',
        author: 1234567890  // Invalid data, but inserted with warning
      }
    ]
  }
]
```

**Explanation:**

- With `validationAction: 'warn'`, invalid documents are **allowed**
- MongoDB logs a warning to the database logs
- Useful for monitoring data quality without blocking operations
- Good for testing validation rules before enforcing them

---

### Common BSON Types for Validation

| BSON Type  | Description       | Example               |
| ---------- | ----------------- | --------------------- |
| `string`   | Text data         | `"Hello World"`       |
| `int`      | 32-bit integer    | `42`                  |
| `long`     | 64-bit integer    | `9223372036854775807` |
| `double`   | Floating point    | `3.14159`             |
| `bool`     | Boolean           | `true`, `false`       |
| `date`     | Date/time         | `new Date()`          |
| `objectId` | MongoDB ObjectId  | `ObjectId('...')`     |
| `array`    | Array             | `[1, 2, 3]`           |
| `object`   | Embedded document | `{ name: "John" }`    |
| `null`     | Null value        | `null`                |

---

### Best Practices for Schema Validation

**1. Start with Warnings**

```js
validationAction: "warn"; // Monitor issues first
```

- Test validation rules without blocking operations
- Identify existing invalid data
- Switch to `error` once data is clean

**2. Use Descriptive Messages**

```js
description: "must be a string between 3 and 100 characters";
```

- Helps developers understand validation failures
- Makes debugging easier

**3. Validate Required Core Fields**

```js
required: ["userId", "email", "createdAt"];
```

- Focus on critical business fields
- Don't over-validate - allow flexibility where needed

**4. Combine with Indexes**

```js

.users.createIndex({ email: 1 }, { unique: true });
```

- Validation ensures type correctness
- Indexes ensure uniqueness and improve performance

**5. Version Your Schemas**

- Add validation incrementally
- Use `moderate` validation level when adding rules to existing collections
- Document schema changes for your team

---

### When to Use Schema Validation

**Use Validation When:**

- ✅ Data quality is critical for your application
- ✅ Multiple applications/teams access the same database
- ✅ You need to enforce business rules at the database level
- ✅ Preventing bad data is more important than flexibility

**Skip Validation When:**

- ❌ You need maximum flexibility in document structure
- ❌ Schema changes frequently during development
- ❌ Application-level validation is sufficient
- ❌ Performance is critical (validation adds overhead)

**Remember:** MongoDB's strength is flexibility - use validation to enforce critical rules while maintaining the agility of a schema-less database.

---

## Exploring The Shell & The Server

MongoDB provides powerful command-line tools for server administration and database interaction.

### MongoDB Server (mongod)

The `mongod` process is the core database server that handles data requests, manages data access, and performs background operations.

#### Getting Help

```bash
mongod --help
```

Lists all available server options and configurations.

---

#### Essential Server Options

**1. Database and Log Paths**

```bash
mongod --dbpath <path-to-data> --logpath <path-to-log-file>
```

**Example:**

```bash
mongod --dbpath /data/
 --logpath /var/log/mongodb/mongod.log
```

**Explanation:**

- `--dbpath`: Specifies where MongoDB stores data files
- `--logpath`: Specifies where MongoDB writes log files
- Both paths must exist before starting the server

---

**2. Fork Mode (Background Process)**

```bash
mongod --fork --logpath <path-to-log-file>
```

**Example:**

```bash
mongod --fork --logpath /var/log/mongodb/mongod.log
```

**Explanation:**

- `--fork`: Runs MongoDB as a background daemon process
- Requires `--logpath` (mandatory when forking)
- Returns control to the terminal immediately
- Useful for production deployments

---

**3. Configuration Files**

Instead of passing many command-line options, use a configuration file:

```bash
# Using --config
mongod --config /etc/mongod.cfg

# Using -f (shorthand)
mongod -f /etc/mongod.cfg
```

**Example mongod.cfg:**

```yaml
systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true
storage:
  dbPath: /data/

  journal:
    enabled: true
net:
  bindIp: 127.0.0.1
  port: 27017
```

**Benefits:**

- Cleaner and more maintainable than long command lines
- Easy to version control
- Standard practice for production environments

---

### MongoDB Shell Options

The MongoDB shell (`mongosh` or legacy `mongo`) connects to MongoDB servers and allows interactive queries.

#### Common Shell Options

**1. No Database Connection (`--nodb`)**

```bash
mongosh --nodb
```

**Explanation:**

- Starts shell without connecting to any database
- Useful for scripting or testing JavaScript code
- Can manually connect later with `
= connect("localhost:27017/mydb")`

---

**2. Quiet Mode (`--quiet`)**

```bash
mongosh --quiet
```

**Explanation:**

- Suppresses startup messages and warnings
- Shows only command output
- Useful for scripts or cleaner output

---

**3. Specify Port (`--port`)**

```bash
mongosh --port 27018
```

**Explanation:**

- Connect to MongoDB running on a non-default port
- Default port is 27017
- Useful when running multiple MongoDB instances

---

**4. Specify Host (`--host`)**

```bash
mongosh --host mongodb.example.com

# With port
mongosh --host mongodb.example.com:27017

# Connection string format
mongosh "mongodb://mongodb.example.com:27017/mydb"
```

**Explanation:**

- Connect to remote MongoDB server
- Can be hostname, IP address, or connection string
- Combine with `--port` or include port in host string

---

**5. Combined Example**

```bash
mongosh --host localhost --port 27018 --quiet
```

Connects to MongoDB on localhost:27018 in quiet mode.

---

## Create Operations (Deep Dive)

MongoDB provides multiple methods for inserting documents into collections.

### Creating Documents - Methods Overview

#### 1. `insertOne(document, options)`

Inserts a single document into a collection.

**Syntax:**

```js

.collectionName.insertOne({ field: "value" });
```

**Example:**

```js

.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 30
})

// Result:
{
  acknowledged: true,
  insertedId: ObjectId('...')
}
```

**When to Use:**

- Inserting a single document
- When you need immediate confirmation of the insert
- When you want to handle the inserted ID

---

#### 2. `insertMany(documents, options)`

Inserts multiple documents in a single operation.

**Syntax:**

```js

.collectionName.insertMany([{ field: "value1" }, { field: "value2" }]);
```

**Example:**

```js

.users.insertMany([
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 },
  { name: "Diana", age: 28 }
])

// Result:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('...'),
    '1': ObjectId('...'),
    '2': ObjectId('...')
  }
}
```

**When to Use:**

- Bulk insert operations
- Better performance than multiple `insertOne()` calls
- Importing data from external sources

**Performance:**

- More efficient than calling `insertOne()` multiple times
- Sends all documents in a single request
- Reduces network round trips

---

#### 3. `insert()` _(Deprecated - Avoid)_

**Legacy method** that works for both single and multiple documents.

```js
// Don't use this anymore!

.collectionName.insert({ field: "value" })  // Single

.collectionName.insert([{...}, {...}])      // Multiple
```

**Why Avoid:**

- Less clear intent (single vs. multiple)
- Deprecated in newer MongoDB versions
- Use `insertOne()` or `insertMany()` instead

---

#### 4. `mongoimport` Command-Line Tool

Import data from JSON, CSV, or TSV files into MongoDB.

**Syntax:**

```bash
mongoimport -d <database> -c <collection> [options] <file>
```

**Example:**

```bash
mongoimport -d cars -c carsList --drop --jsonArray cars.json
```

**Common Options:**

- `-d` or `--
`: Database name
- `-c` or `--collection`: Collection name
- `--drop`: Drop collection before importing
- `--jsonArray`: File contains a JSON array
- `--file`: Input file path
- `--type`: File type (json, csv, tsv)

**CSV Import Example:**

```bash
mongoimport -d sales -c products --type csv --headerline --file products.csv
```

**When to Use:**

- Initial data loading
- Migrating data from other systems
- Restoring backups
- Bulk importing from files

---

### Ordered vs Unordered Inserts

When using `insertMany()`, you can control what happens when an error occurs during bulk insert.

#### Default Behavior: Ordered Inserts

By default, `insertMany()` is **ordered** - it inserts documents sequentially and stops at the first error.

**Initial Setup:**

```js
hobbies>
.hobbies.insertMany([
  {_id: "sports", name: "Sports"},
  {_id: "cooking", name: "Cooking"},
  {_id: "cars", name: "Cars"}
])

// Result:
{
  acknowledged: true,
  insertedIds: { '0': 'sports', '1': 'cooking', '2': 'cars' }
}
```

**Ordered Insert with Error:**

```js
hobbies>
.hobbies.insertMany([
  {_id: "yoga", name: "Yoga"},      // ✅ Inserted (index 0)
  {_id: "sports", name: "Sports"},  // ❌ ERROR - duplicate (index 1)
  {_id: "hiking", name: "Hiking"}   // ⏭️ SKIPPED - never attempted
])

// Error Response:
MongoBulkWriteError: E11000 duplicate key error
Result: BulkWriteResult {
  insertedCount: 1,  // Only "yoga" was inserted
  ...
  insertedIds: { '0': 'yoga' }
}
Write Errors: [
  WriteError {
    err: {
      index: 1,  // Error at second document
      code: 11000,
      errmsg: 'E11000 duplicate key error... { _id: "sports" }'
    }
  }
]
```

**Result in Database:**

```js
hobbies >

  .hobbies.find()[
    ({ _id: "sports", name: "Sports" }, // Original
    { _id: "cooking", name: "Cooking" }, // Original
    { _id: "cars", name: "Cars" }, // Original
    { _id: "yoga", name: "Yoga" }) // ✅ Newly inserted
    // 'hiking' was never inserted because insert stopped at error
  ];
```

**Key Points:**

- Processes documents in array order
- **Stops at first error**
- Documents after the error are **not inserted**
- Default behavior (`ordered: true`)

---

#### Unordered Inserts

Set `ordered: false` to continue inserting even after errors.

**Unordered Insert with Errors:**

```js
hobbies>
.hobbies.insertMany([
  {_id: "sports", name: "Sports"},   // ❌ ERROR - duplicate (index 0)
  {_id: "hiking", name: "Hiking"},   // ✅ INSERTED (index 1)
  {_id: "yoga", name: "Yoga"}        // ❌ ERROR - duplicate (index 2)
], { ordered: false })  // 🔑 Key difference!

// Error Response:
MongoBulkWriteError: E11000 duplicate key error
Result: BulkWriteResult {
  insertedCount: 1,  // "hiking" was inserted
  ...
  insertedIds: { '1': 'hiking' }  // Only valid document
}
Write Errors: [
  WriteError {  // First error
    err: {
      index: 0,
      code: 11000,
      errmsg: '... { _id: "sports" }'
    }
  },
  WriteError {  // Second error
    err: {
      index: 2,
      code: 11000,
      errmsg: '... { _id: "yoga" }'
    }
  }
]
```

**Result in Database:**

```js
hobbies >

  .hobbies.find()[
    ({ _id: "sports", name: "Sports" }, // Original
    { _id: "cooking", name: "Cooking" }, // Original
    { _id: "cars", name: "Cars" }, // Original
    { _id: "yoga", name: "Yoga" }, // From first insert
    { _id: "hiking", name: "Hiking" }) // ✅ Inserted despite errors
  ];
```

**Key Points:**

- Attempts to insert **all documents**
- Continues processing after errors
- Reports **all errors** at the end
- Useful for bulk imports where partial success is acceptable

---

#### Comparison Table

| Aspect              | Ordered (`true`)    | Unordered (`false`)   |
| ------------------- | ------------------- | --------------------- |
| **Default**         | Yes                 | No                    |
| **Processing**      | Sequential          | All attempted         |
| **Error Handling**  | Stop at first error | Continue after errors |
| **Error Reporting** | First error only    | All errors            |
| **Performance**     | Slower (sequential) | Faster (parallel)     |
| **Use Case**        | Order matters       | Maximum inserts       |

---

#### When to Use Each

**Use Ordered Inserts When:**

- Document order is important
- Later documents depend on earlier ones
- You want to stop immediately on error
- Data integrity is critical

**Use Unordered Inserts When:**

- Documents are independent
- You want maximum throughput
- Partial success is acceptable
- Importing large datasets where some failures are expected

**Example: Import with Error Handling**

```js
try {
  const result =
  .products.insertMany(productArray, { ordered: false });
  print(`Inserted ${result.insertedCount} documents`);
} catch (error) {
  print(`Inserted ${error.result.insertedCount} documents`);
  print(`Failed ${error.writeErrors.length} documents`);
  error.writeErrors.forEach((err) => {
    print(`Error at index ${err.index}: ${err.errmsg}`);
  });
}
```

---

### Write Concern

**Write Concern** controls the level of acknowledgment requested from MongoDB for write operations. It determines how "confident" you can be that data is safely stored.

#### How MongoDB Writes Data

```
Client (Shell/Driver)
  ↓
  insertOne()
  ↓
MongoDB Server (mongod)
  ↓
Storage Engine
  ↓
Memory (RAM) ← Fast but volatile
  ↓
Journal (Write-Ahead Log) ← Durable log on disk
  ↓
Data Files (Disk) ← Permanent storage
```

**Write Path:**

1. **Memory**: Data written to RAM first (fast)
2. **Journal**: Changes logged to journal file (crash recovery)
3. **Data Files**: Eventually flushed to main data files (periodic)

---

#### Write Concern Options

**Syntax:**

```js

.collection.insertOne(
  { document },
  { writeConcern: { w: <value>, j: <boolean>, wtimeout: <ms> } }
)
```

**Parameters:**

| Parameter  | Description                    | Values                           |
| ---------- | ------------------------------ | -------------------------------- |
| `w`        | **Write acknowledgment level** | `0`, `1`, `majority`, `<number>` |
| `j`        | **Journal acknowledgment**     | `true`, `false`, `undefined`     |
| `wtimeout` | **Timeout for write concern**  | milliseconds                     |

---

#### The `w` Option (Write Acknowledgment)

**`w: 0` - No Acknowledgment (Fire and Forget)**

```js

.persons.insertOne(
  {name: "Chrissy", age: 41},
  {writeConcern: { w: 0 }}
)

// Result:
{
  acknowledged: false,  // ⚠️ No confirmation!
  insertedId: ObjectId('699aec4c0a691d1c107c848f')
}
```

**Characteristics:**

- **Fastest** - doesn't wait for any confirmation
- Client doesn't know if write succeeded
- No error reporting
- Use only for non-critical data (logs, metrics)

---

**`w: 1` - Acknowledge from Primary (Default)**

```js

.persons.insertOne(
  {name: "Alex", age: 41},
  {writeConcern: { w: 1 }}
)

// Result:
{
  acknowledged: true,  // ✅ Primary confirmed
  insertedId: ObjectId('699aec860a691d1c107c8490')
}
```

**Characteristics:**

- **Default behavior**
- Waits for primary to acknowledge write to memory
- Does NOT guarantee durability (data might be lost on crash)
- Good balance of performance and reliability

---

**`w: "majority"` - Majority of Replica Set**

```js

.persons.insertOne(
  { name: "Sara", age: 35 },
  { writeConcern: { w: "majority" } },
);
```

**Characteristics:**

- Waits for majority of replica set members to acknowledge
- Highest durability (data replicated to multiple servers)
- Slower than `w: 1`
- Recommended for critical data

---

#### The `j` Option (Journal Acknowledgment)

**`j: false` or `undefined` - Memory Only**

```js

.persons.insertOne(
  {name: "Michael", age: 41},
  {writeConcern: { w: 1, j: false }}
)

// Result:
{
  acknowledged: true,
  insertedId: ObjectId('699aecad0a691d1c107c8491')
}
```

**Characteristics:**

- Data written to **memory only**
- Fast but not durable
- Data could be lost if server crashes before journal flush

---

**`j: true` - Journal Confirmed**

```js

.persons.insertOne(
  {name: "Michaela", age: 41},
  {writeConcern: { w: 1, j: true }}
)

// Result:
{
  acknowledged: true,  // ✅ Written to journal on disk
  insertedId: ObjectId('699aecb70a691d1c107c8492')
}
```

**Characteristics:**

- Data written to **journal file on disk**
- Durable - survives crashes
- Slower than memory-only writes
- Recommended for important data

---

#### The `wtimeout` Option

Sets a time limit for write concern acknowledgment.

```js

.persons.insertOne(
  {name: "Aliya", age: 21},
  {writeConcern: { w: 1, j: true, wtimeout: 200 }}
)

// Result:
{
  acknowledged: true,
  insertedId: ObjectId('699aece00a691d1c107c8493')
}
```

**Characteristics:**

- Prevents indefinite blocking
- Throws error if acknowledgment takes longer than timeout
- Value in milliseconds
- Only applies when `w > 1` or `w: "majority"`

**Timeout Error Example:**

```js
// If replication is slow

.persons.insertOne(
  { name: "Test" },
  { writeConcern: { w: "majority", wtimeout: 100 } },
);
// Error: waiting for replication timed out
```

---

#### Write Concern Levels Comparison

| Configuration                | Speed   | Durability | Use Case                      |
| ---------------------------- | ------- | ---------- | ----------------------------- |
| `{ w: 0 }`                   | Fastest | Lowest     | Non-critical logs, analytics  |
| `{ w: 1 }`                   | Fast    | Medium     | General purpose (default)     |
| `{ w: 1, j: true }`          | Medium  | High       | Important data, single server |
| `{ w: "majority" }`          | Slow    | Highest    | Critical data, replica sets   |
| `{ w: "majority", j: true }` | Slowest | Maximum    | Financial transactions        |

---

#### Choosing the Right Write Concern

**Use `{ w: 0 }` for:**

- Logging
- Metrics/analytics
- Cacheable data
- Data that can be regenerated

**Use `{ w: 1 }` for:**

- General application data
- Good balance of speed and safety
- Single server deployments

**Use `{ w: 1, j: true }` for:**

- Important user data
- Single server with durability needs
- E-commerce orders

**Use `{ w: "majority" }` for:**

- Critical business data
- Replica set deployments
- Data that must survive server failures

**Use `{ w: "majority", j: true }` for:**

- Financial transactions
- Legal documents
- Audit logs
- Maximum durability required

---

#### Performance vs Durability Trade-off

```
Performance ←→ Durability

{ w: 0 }  ■□□□□□□□□□  No guarantee
{ w: 1 }  □□□■□□□□□□  Memory confirm
{ w: 1, j: true }  □□□□□■□□□□  Disk confirm
{ w: "majority" }  □□□□□□□□■□  Replicated
{ w: "majority", j: true }  □□□□□□□□□■  Maximum safety

■ = Recommended for most use cases
```

**Best Practice:**

- Start with defaults (`w: 1`)
- Increase durability for critical data
- Use `wtimeout` to prevent indefinite blocking
- Test impact on your application's performance

---

### Atomicity

**Atomicity** ensures that database operations are "all-or-nothing" - they either complete entirely or have no effect at all.

#### What is Atomicity?

```
Transaction States:

 Success Path:
 Operation → Execute → Success → ✅ Saved Completely

 Failure Path:
 Operation → Execute → Error → ❌ Rolled Back (Nothing Saved)
```

**Key Principle:**

> A transaction is either completely successful or completely failed. There is no partial state.

---

#### MongoDB's Atomicity Guarantee

**MongoDB CRUD operations are atomic at the DOCUMENT level** (including embedded documents).

**What This Means:**

✅ **Atomic (Single Document)**

```js
// This entire operation is atomic

.users.updateOne(
  { _id: 1 },
  {
    $set: { name: "John Doe" },
    $inc: { loginCount: 1 },
    $push: { loginHistory: new Date() },
  },
);
```

- **All changes succeed together** or **all fail together**
- No way to have partial updates (e.g., name changed but loginCount not incremented)
- Other clients see either old state or new state, never an intermediate state

---

❌ **Not Atomic (Multiple Documents without Transactions)**

```js
// These are separate atomic operations

.accounts.updateOne({ _id: "A" }, { $inc: { balance: -100 } }); // Operation 1

.accounts.updateOne({ _id: "B" }, { $inc: { balance: +100 } }); // Operation 2
```

- If Operation 1 succeeds but Operation 2 fails:
  - Account A loses $100
  - Account B doesn't gain $100
  - Money "disappears" from the system!
- Each operation is atomic, but **together they are not**

---

#### Document-Level Atomicity Examples

**Example 1: Insert with Embedded Documents**

```js

.orders.insertOne({
  orderId: 12345,
  customer: "Alice",
  items: [
    { product: "Laptop", price: 999 },
    { product: "Mouse", price: 25 },
  ],
  total: 1024,
  status: "pending",
});
```

**Atomicity Guarantee:**

- Either the **entire document is inserted** (with all items and fields)
- Or **nothing is inserted** (if validation fails, disk full, etc.)
- Never a partial insert (e.g., order without items)

---

**Example 2: Update with Multiple Changes**

```js

.users.updateOne(
  { email: "alice@example.com" },
  {
    $set: {
      status: "verified",
      verifiedAt: new Date(),
    },
    $push: {
      statusHistory: {
        status: "verified",
        date: new Date(),
      },
    },
    $inc: { version: 1 },
  },
);
```

**Atomicity Guarantee:**

- All changes ($set, $push, $inc) happen together
- Other clients never see intermediate states
- If any part fails, entire update is rolled back

---

**Example 3: Embedded Document Update**

```js

.blogs.updateOne(
  { _id: "post123", "comments._id": "comment456" },
  {
    $set: {
      "comments.$.text": "Updated comment",
      "comments.$.editedAt": new Date(),
    },
    $inc: { "comments.$.editCount": 1 },
  },
);
```

**Atomicity Guarantee:**

- Comment text, editedAt, and editCount update atomically
- The entire embedded comment is updated as one unit

---

#### Multi-Document Transactions (MongoDB 4.0+)

For operations spanning **multiple documents**, use transactions:

```js
const session =
.getMongo().startSession();
session.startTransaction();

try {
  // All operations within transaction
  session
    .getDatabase("bank")
    .accounts.updateOne({ _id: "A" }, { $inc: { balance: -100 } }, { session });

  session
    .getDatabase("bank")
    .accounts.updateOne({ _id: "B" }, { $inc: { balance: 100 } }, { session });

  // Commit if all succeed
  session.commitTransaction();
  print("Transfer successful");
} catch (error) {
  // Rollback if any fails
  session.abortTransaction();
  print("Transfer failed, rolled back");
} finally {
  session.endSession();
}
```

**Transaction Features:**

- **ACID compliant** across multiple documents/collections
- All operations succeed or all fail
- Available in MongoDB 4.0+ for replica sets
- Available in MongoDB 4.2+ for sharded clusters

---

#### Atomicity Best Practices

**1. Design for Single-Document Atomicity**

```js
// Good: Embed related data

.orders.insertOne({
  orderId: 123,
  items: [...],
  total: 100,
  payment: { method: "card", status: "completed" }
})
// All fields update atomically
```

**2. Use Transactions for Multi-Document Operations**

```js
// When you need to update multiple documents atomically
session.startTransaction();
// ... multiple operations
session.commitTransaction();
```

**3. Leverage Atomic Update Operators**

```js
// Use atomic operators for concurrent updates

.products.updateOne(
  { _id: "product123" },
  { $inc: { quantity: -1 } }, // Atomic decrement
);
```

**4. Handle Failures Gracefully**

```js
try {

  .collection.insertOne({ ... });
} catch (error) {
  // Operation is already rolled back
  console.error("Insert failed:", error);
}
```

---

#### Atomicity Summary

| Scope                  | Atomicity                            | Example                                     |
| ---------------------- | ------------------------------------ | ------------------------------------------- |
| **Single Document**    | ✅ Always Atomic                     | `insertOne()`, `updateOne()`, `deleteOne()` |
| **Embedded Documents** | ✅ Always Atomic                     | Updates to nested fields                    |
| **Multiple Documents** | ❌ Not Atomic (without transactions) | Multiple `updateOne()` calls                |
| **With Transactions**  | ✅ Atomic                            | Operations within `startTransaction()`      |

**Key Takeaway:**

> MongoDB guarantees atomicity at the document level by default. For multi-document atomicity, use transactions (MongoDB 4.0+).

**Design Philosophy:**

- **Prefer embedding** related data in single documents
- **Use transactions** when multi-document atomicity is required
- **Understand the guarantee**: Each CRUD operation on a single document is atomic, including all embedded subdocuments

---

## Importing Data with mongoimport

**`mongoimport`** is a command-line utility that imports data from JSON, CSV, or TSV files into MongoDB collections.

### Basic Syntax

```bash
mongoimport [options] <file>
```

### Common Options

| Option | Description | Example |
| ------ | ----------- | ------- |

| `-d, --
` | Database name | `-d movieData` |
| `-c, --collection` | Collection name | `-c movies` |
| `--drop` | Drop collection before importing | `--drop` |
| `--jsonArray` | Import a JSON array (file contains `[{...}, ...]`) | `--jsonArray` |
| `--file` | Input file path | `--file data.json` |
| `--type` | File type: json, csv, tsv | `--type csv` |
| `--headerline` | Use first line as field names (CSV/TSV) | `--headerline` |
| `--mode` | Import mode: insert, upsert, merge | `--mode upsert` |
| `--uri` | MongoDB connection string | `--uri mongodb://...` |
| `--host` | MongoDB host | `--host localhost:27017` |
| `--ignoreBlanks` | Ignore blank fields in CSV/TSV | `--ignoreBlanks` |
| `--stopOnError` | Stop on first error | `--stopOnError` |
| `--maintainInsertionOrder` | Process documents in order | `--maintainInsertionOrder` |

---

### Complete Import Example

**Command:**

```bash
mongoimport tv-shows.json -d movieData -c movies --jsonArray --drop
```

**Breakdown:**

- `tv-shows.json` - Input file (can also use `--file tv-shows.json`)
- `-d movieData` - Database name
- `-c movies` - Collection name
- `--jsonArray` - File contains JSON array format `[{...}, {...}]`
- `--drop` - Drop existing `movies` collection before importing

---

**Output:**

```bash
2026-02-22T17:41:13.419+0530    connected to: mongodb://localhost/
2026-02-22T17:41:13.420+0530    dropping: movieData.movies
2026-02-22T17:41:13.485+0530    240 document(s) imported successfully. 0 document(s) failed to import.
```

**Explanation:**

1. ✅ **Connected** to MongoDB on localhost
2. ✅ **Dropped** existing `movieData.movies` collection
3. ✅ **Imported** 240 documents successfully with 0 failures

---

**Verify Import:**

```js
test> show dbs
admin         40.00 KiB
config        72.00 KiB
contactData   72.00 KiB
hobbies       72.00 KiB
local         72.00 KiB
movieData    188.00 KiB  // ✅ New database created

test> use movieData
switched to
 movieData

movieData> show collections
movies  // ✅ Collection created

movieData>
.movies.find().limit(1)  // View first document
[
  {
    _id: ObjectId('699af2612adc1485c87da5ab'),  // Auto-generated _id
    id: 1,
    url: 'http://www.tvmaze.com/shows/1/under-the-dome',
    name: 'Under the Dome',
    type: 'Scripted',
    language: 'English',
    genres: [ 'Drama', 'Science-Fiction', 'Thriller' ],
    status: 'Ended',
    runtime: 60,
    premiered: '2013-06-24',
    officialSite: 'http://www.cbs.com/shows/under-the-dome/',
    schedule: { time: '22:00', days: [ 'Thursday' ] },
    rating: { average: 6.5 },
    weight: 91,
    network: {
      id: 2,
      name: 'CBS',
      country: {
        name: 'United States',
        code: 'US',
        timezone: 'America/New_York'
      }
    },
    webChannel: null,
    externals: {
      tvrage: 25988,
      thetvdb: 264492,
      imdb: 'tt1553656'
    },
    image: {
      medium: 'http://static.tvmaze.com/uploads/images/medium_portrait/0/1.jpg',
      original: 'http://static.tvmaze.com/uploads/images/original_untouched/0/1.jpg'
    },
    summary: "<p><b>Under the Dome</b> is the story of a small town...",
    updated: 1529612668,
    _links: {
      self: { href: 'http://api.tvmaze.com/shows/1' },
      previousepisode: { href: 'http://api.tvmaze.com/episodes/185054' }
    }
  }
]
```

**Key Observations:**

- MongoDB automatically added `_id: ObjectId(...)` to each document
- Nested objects (network, country, schedule) imported correctly
- Arrays (genres) preserved
- 240 TV show documents now available for querying

---

### Import Modes

**`--mode insert` (Default)**

```bash
mongoimport data.json -d mydb -c mycoll --mode insert
```

- Inserts all documents
- Fails if document with same `_id` exists
- Use for new data

---

**`--mode upsert`**

```bash
mongoimport data.json -d mydb -c mycoll --mode upsert
```

- **Insert** if document doesn't exist
- **Update** if document with same `_id` exists
- Use for updating existing datasets

---

**`--mode merge`**

```bash
mongoimport data.json -d mydb -c mycoll --mode merge
```

- Only updates existing fields
- Preserves fields not in import file
- Use for partial updates

---

### File Format Examples

**JSON Format (Single Document per Line)**

```json
{"name": "Alice", "age": 30}
{"name": "Bob", "age": 25}
{"name": "Charlie", "age": 35}
```

```bash
mongoimport data.json -d users -c people
```

---

**JSON Array Format**

```json
[
  { "name": "Alice", "age": 30 },
  { "name": "Bob", "age": 25 },
  { "name": "Charlie", "age": 35 }
]
```

```bash
mongoimport data.json -d users -c people --jsonArray
```

---

**CSV Format**

```csv
name,age,city
Alice,30,New York
Bob,25,London
Charlie,35,Paris
```

```bash
mongoimport data.csv -d users -c people --type csv --headerline
```

**Options:**

- `--type csv` - Specifies CSV format
- `--headerline` - First row contains field names
- `--fields name,age,city` - Manually specify field names (if no header)

---

**TSV Format (Tab-Separated)**

```tsv
name	age	city
Alice	30	New York
Bob	25	London
```

```bash
mongoimport data.tsv -d users -c people --type tsv --headerline
```

---

### Advanced Usage Examples

**Import to Remote Server**

```bash
mongoimport data.json \
  --uri "mongodb://username:password@remote-server:27017/mydb" \
  -c mycollection \
  --drop
```

---

**Import with Field Mapping (CSV)**

```bash
mongoimport contacts.csv -d crm -c contacts \
  --type csv \
  --fields firstName,lastName,email,phone \
  --headerline
```

---

**Import Only Valid Documents (Stop on Error)**

```bash
mongoimport data.json -d mydb -c mycoll \
  --stopOnError
```

Without this flag, mongoimport continues despite errors.

---

**Import Large Files with Progress**

```bash
mongoimport large-dataset.json -d analytics -c events \
  --numInsertionWorkers 4 \
  --batchSize 100
```

- `--numInsertionWorkers` - Parallel import threads (default: 1)
- `--batchSize` - Documents per batch (default varies by format)

---

### Common Use Cases

**1. Initial Data Loading**

```bash
mongoimport products.json -d shop -c products --drop
```

Load product catalog for new e-commerce site.

---

**2. Daily Data Updates**

```bash
mongoimport daily-sales.json -d analytics -c sales --mode upsert
```

Update sales data with new/changed records.

---

**3. Migration from SQL**

```bash
# Export from MySQL/PostgreSQL to CSV
# Then import to MongoDB
mongoimport users.csv -d myapp -c users --type csv --headerline
```

---

**4. Restore Backup**

```bash
mongoimport backup.json -d production -c orders --drop
```

Restore collection from backup file.

---

### Error Handling

**Duplicate Key Error:**

```bash
mongoimport data.json -d mydb -c mycoll
# Error: E11000 duplicate key error
```

**Solutions:**

- Use `--drop` to remove existing data first
- Use `--mode upsert` to update duplicates
- Remove `_id` field from import file (let MongoDB generate)

---

**Invalid JSON:**

```bash
mongoimport bad-data.json -d mydb -c mycoll
# Error: Failed to parse JSON
```

**Solutions:**

- Validate JSON with `jq` or online validators
- Check for missing commas, quotes, brackets
- Use `--stopOnError` to identify problematic documents

---

### Best Practices

**1. Always Backup Before Import**

```bash
mongodump -d mydb -c mycoll -o /backup/before-import/
mongoimport new-data.json -d mydb -c mycoll --drop
```

---

**2. Validate Data First**

```bash
# Count lines in file
wc -l data.json

# Preview first few documents
head -n 5 data.json | jq
```

---

**3. Test on Sample Data**

```bash
# Import first 100 documents only
head -n 100 data.json > sample.json
mongoimport sample.json -d test -c mycoll
```

---

**4. Use Indexes After Import**

```bash
mongoimport large-data.json -d mydb -c mycoll

# Then create indexes in shell
mongosh mydb --eval '
.mycoll.createIndex({email: 1})'
```

Importing without indexes is faster; add indexes after.

---

**5. Monitor Large Imports**

```bash
# Run in background and log output
mongoimport huge-file.json -d mydb -c mycoll > import.log 2>&1 &

# Monitor progress
tail -f import.log
```

---

### mongoimport vs insertMany()

| Aspect          | mongoimport                | insertMany()                |
| --------------- | -------------------------- | --------------------------- |
| **Use Case**    | Import from files          | Programmatic inserts        |
| **Data Source** | JSON, CSV, TSV files       | JavaScript arrays           |
| **Performance** | Optimized for bulk imports | Good for app-generated data |
| **Mode**        | CLI tool                   | Shell/Driver method         |
| **Best For**    | Initial load, migrations   | Application logic           |

---

### Summary

**mongoimport** is the go-to tool for:

✅ Importing external data files  
✅ Migrating data from other systems  
✅ Loading initial datasets  
✅ Restoring backups  
✅ Bulk data operations

**Key Commands to Remember:**

```bash
# JSON import
mongoimport file.json -d dbname -c collection

# JSON array import
mongoimport file.json -d dbname -c collection --jsonArray

# CSV import
mongoimport file.csv -d dbname -c collection --type csv --headerline

# Drop existing data
mongoimport file.json -d dbname -c collection --drop

# Upsert mode
mongoimport file.json -d dbname -c collection --mode upsert
```

---

## Read Operations Deep Dive

Read operations in MongoDB allow you to query and retrieve documents efficiently using various operators and filters.

**Key Objectives:**

- Read documents with powerful query operators
- Access required data efficiently
- Filter results precisely
- Control data presentation with projection

---

### Understanding MongoDB Query Syntax

MongoDB queries follow a structured pattern:

```js

.collectionName.method(filter, options)
```

**Query Structure Breakdown:**

```js

.                        // Access current database
  mycollection.            // Access this collection
  find()                   // Apply this method
```

**Filter Examples:**

```js
// Simple equality filter

.users.find({ age: 32 })
// Field: age, Value: 32

// Operator-based filter

.users.find({ age: { $gt: 30 } })
// Field: age, Operator: $gt, Value: 30
```

---

### MongoDB Operators Overview

MongoDB provides three main categories of operators:

| Operator Type            | Purpose                  | Changes Data? | Example |
| ------------------------ | ------------------------ | ------------- | ------- |
| **Query Selectors**      | Locate data              | ❌ No         | `$eq`   |
| **Projection Operators** | Modify data presentation | ❌ No         | `$`     |
| **Update Operators**     | Modify and add data      | ✅ Yes        | `$inc`  |

**Explanation:**

- **Query Selectors**: Filter which documents to retrieve (e.g., find users older than 30)
- **Projection Operators**: Control which fields to show (e.g., show only name and email)
- **Update Operators**: Modify document content (e.g., increment a counter)

---

## Query Selectors

Query selectors allow you to filter documents based on specific criteria.

### Comparison Operators

Used to compare field values against specified values.

#### Complete Comparison Operators Reference

| Operator | Meaning               | Example                           | Description                |
| -------- | --------------------- | --------------------------------- | -------------------------- |
| `$eq`    | Equal                 | `{ runtime: { $eq: 60 } }`        | Exactly equals             |
| `$ne`    | Not Equal             | `{ runtime: { $ne: 60 } }`        | Does not equal             |
| `$gt`    | Greater Than          | `{ runtime: { $gt: 60 } }`        | Strictly greater           |
| `$gte`   | Greater Than or Equal | `{ runtime: { $gte: 60 } }`       | Greater or equal           |
| `$lt`    | Less Than             | `{ runtime: { $lt: 60 } }`        | Strictly less              |
| `$lte`   | Less Than or Equal    | `{ runtime: { $lte: 60 } }`       | Less or equal              |
| `$in`    | In Array              | `{ runtime: { $in: [30, 42] } }`  | Matches any value in array |
| `$nin`   | Not In Array          | `{ runtime: { $nin: [30, 42] } }` | Matches no value in array  |

---

#### Comparison Operators Examples

**`$eq` - Equal**

```js
// Find movies with exactly 60 minute runtime

.movies.find({ runtime: { $eq: 60 } })

// Shorthand (implicit $eq)

.movies.find({ runtime: 60 })
```

---

**`$ne` - Not Equal**

```js
// Find movies that are NOT 60 minutes

.movies.find({ runtime: { $ne: 60 } })
```

**Use Cases:**

- Exclude specific values
- Find all documents except certain ones
- Filter out default or placeholder values

---

**`$gt` and `$gte` - Greater Than**

```js
// Movies longer than 60 minutes (exclusive)

.movies.find({ runtime: { $gt: 60 } })

// Movies 60 minutes or longer (inclusive)

.movies.find({ runtime: { $gte: 60 } })
```

---

**`$lt` and `$lte` - Less Than**

```js
// Movies shorter than 60 minutes

.movies.find({ runtime: { $lt: 60 } })

// Movies 60 minutes or shorter

.movies.find({ runtime: { $lte: 60 } })
```

---

**Querying Nested Fields**

Use **dot notation** to query embedded document fields:

```js
// Find highly rated movies (rating > 7)

.movies.find({ "rating.average": { $gt: 7 } })

// Find lower rated movies

.movies.find({ "rating.average": { $lt: 7 } })
```

**Important:**

- Use quotes around dotted field names
- Works with any nesting depth
- Example: `"network.country.name"`

---

**`$in` - Match Any Value in Array**

```js
// Find movies with specific genres

.movies.find({ genres: { $in: ["Anime"] } })

// Shorthand for single value

.movies.find({ genres: "Anime" })

// Multiple values - match ANY

.movies.find({ runtime: { $in: [30, 42] } })
```

**Explanation:**

- Returns documents where field matches **any** value in the array
- Useful for OR-like queries on a single field
- More efficient than multiple queries

**Use Cases:**

- Find users in multiple cities: `{ city: { $in: ["NYC", "LA", "Chicago"] } }`
- Find products in specific categories: `{ category: { $in: ["Electronics", "Books"] } }`

---

**`$nin` - Not In Array**

```js
// Exclude specific genres

.movies.find({ genres: { $nin: ["Anime", "Drama"] } })
```

**Explanation:**

- Returns documents where field does **not** match any value in the array
- Opposite of `$in`

**Use Cases:**

- Exclude blocked users: `{ userId: { $nin: blockedUserIds } }`
- Filter out specific statuses: `{ status: { $nin: ["cancelled", "deleted"] } }`

---

### Example Query Result

**Query:**

```js

.movies.find({ runtime: { $ne: 60 } }).limit(1)
```

**Result:**

```js
[
  {
    _id: ObjectId("699af2612adc1485c87da5fb"),
    id: 86,
    url: "http://www.tvmaze.com/shows/86/stalker",
    name: "Stalker",
    type: "Scripted",
    language: "English",
    genres: ["Crime", "Thriller"],
    status: "Ended",
    runtime: 60, // Runtime value
    premiered: "2014-10-01",
    officialSite: null,
    schedule: {
      time: "22:00",
      days: ["Wednesday"],
    },
    rating: {
      average: 7.7, // Nested rating field
    },
    weight: 73,
    network: {
      id: 2,
      name: "CBS",
      country: {
        name: "United States",
        code: "US",
        timezone: "America/New_York",
      }, // Deep nesting example
    },
    webChannel: null,
    externals: {
      tvrage: 41213,
      thetvdb: 281697,
      imdb: "tt3560094",
    },
    image: {
      medium:
        "http://static.tvmaze.com/uploads/images/medium_portrait/0/647.jpg",
      original:
        "http://static.tvmaze.com/uploads/images/original_untouched/0/647.jpg",
    },
    summary:
      "<p><b>Stalker</b> is a psychological thriller about detectives who investigate stalking incidents...</p>",
    updated: 1535297749,
    _links: {
      self: { href: "http://api.tvmaze.com/shows/86" },
      previousepisode: { href: "http://api.tvmaze.com/episodes/155326" },
    },
  },
];
```

**Document Features:**

- **Nested Objects**: `rating.average`, `network.country.name`
- **Arrays**: `genres`, `schedule.days`
- **Null Values**: `officialSite`, `webChannel`
- **ObjectId**: Automatically generated `_id`

---

### Other Query Selector Categories

MongoDB provides additional query selector types for advanced filtering:

### Evaluation Operators

Evaluate expressions and perform text searches.

**Common Evaluation Operators:**

- `$regex` - Pattern matching
- `$text` - Full-text search
- `$where` - JavaScript expressions
- `$expr` - Aggregation expressions in queries
- `$mod` - Modulo operation
- `$jsonSchema` - Validate documents against JSON Schema

**Example:**

```js
// Find movies with names starting with "The"

db.movies.find({ name: { $regex: /^The/ } });

db.movies.find({ summary: { $regex: /Dome/ } });

// Full-text search

db.movies.find({ $text: { $search: "thriller action" } });

// expression

financialData >
  db.sales.find({ $expr: { $gt: ["$volume", "$target"] } })[
    ({ _id: ObjectId("699c7e7a9c0ae94b759e3c09"), volume: 89, target: 80 },
    { _id: ObjectId("699c7e7a9c0ae94b759e3c0a"), volume: 200, target: 177 })
  ];

financialData >
  db.sales.find({
    $expr: {
      $gt: [
        {
          $cond: {
            if: { $gte: ["$volume", 190] },
            then: { $subtract: ["$volume", 10] },
            else: "$volume",
          },
        },
        "$target",
      ],
    },
  })[
    ({ _id: ObjectId("699c7e7a9c0ae94b759e3c09"), volume: 89, target: 80 },
    { _id: ObjectId("699c7e7a9c0ae94b759e3c0a"), volume: 200, target: 177 })
  ];
financialData >
  db.sales.find({
    $expr: {
      $gt: [
        {
          $cond: {
            if: { $gte: ["$volume", 190] },
            then: { $subtract: ["$volume", 20] },
            else: "$volume",
          },
        },
        "$target",
      ],
    },
  })[
    ({ _id: ObjectId("699c7e7a9c0ae94b759e3c09"), volume: 89, target: 80 },
    { _id: ObjectId("699c7e7a9c0ae94b759e3c0a"), volume: 200, target: 177 })
  ];
financialData >
  db.sales.find({
    $expr: {
      $gt: [
        {
          $cond: {
            if: { $gte: ["$volume", 190] },
            then: { $subtract: ["$volume", 30] },
            else: "$volume",
          },
        },
        "$target",
      ],
    },
  })[{ _id: ObjectId("699c7e7a9c0ae94b759e3c09"), volume: 89, target: 80 }];
```

---

### Logical Operators

Combine multiple query conditions.

**Logical Operators:**

- `$and` - All conditions must be true
- `$or` - At least one condition must be true
- `$not` - Inverts the effect of a query
- `$nor` - None of the conditions can be true

**Examples:**

```js
// AND - Both conditions must match

.movies.find({
  $and: [
    { runtime: { $gt: 60 } },
    { "rating.average": { $gte: 8 } }
  ]
})


.movies.find( { $and : [ {"rating.average" : { $gt: 9}} , {genres : "Drama"}]})

movieData>
.movies.find({$and : [{genres : "Drama"} , {genres: "Horror"}]} ).count()
17
movieData>
.movies.find({ genres : "Drama" , genres: "Horror"}).count();
23

// OR - Either condition matches

.movies.find({
  $or: [
    { genres: "Comedy" },
    { genres: "Drama" }
  ]
})


.movies.find({
  $or :  [
    { "rating.average" : {$gt : 9}} ,
    { "rating.average" : { $lt : 5}}
  ]
})

// NOR

.movies.find({
  $nor :  [
    { "rating.average" : {$gt : 9}} ,
    { "rating.average" : { $lt : 5}}
  ]
})

// NOT - Invert condition

.movies.find({
  runtime: { $not: { $gte: 60 } }
})


.movies.find( {runtime : {$not : {$eq : 50}}})
```

---

### Array Operators

Query array fields with advanced conditions.

**Array Operators:**

- `$all` - Array contains all specified elements
- `$elemMatch` - At least one array element matches all conditions
- `$size` - Array has specific number of elements

**Examples:**

```js
// Array contains all genres

db.movies.find({
  genres: { $all: ["Drama", "Thriller"] },
});

boxOffice > db.movieStarts.find({ genre: ["thriller"] });

boxOffice > db.movieStarts.find({ genre: { $all: ["thriller"] } });
[
  {
    _id: ObjectId("699c83569c0ae94b759e3c0c"),
    title: "The Last Student Returns",
    meta: { rating: 9.5, aired: 2018, runtime: 100 },
    visitors: 1300000,
    expectedVisitors: 1550000,
    genre: ["thriller", "drama", "action"],
  },
  {
    _id: ObjectId("699c83569c0ae94b759e3c0d"),
    title: "Supercharged Teaching",
    meta: { rating: 9.3, aired: 2016, runtime: 60 },
    visitors: 370000,
    expectedVisitors: 1000000,
    genre: ["thriller", "action"],
  },
  {
    _id: ObjectId("699c83569c0ae94b759e3c0e"),
    title: "Teach me if you can",
    meta: { rating: 8.5, aired: 2014, runtime: 90 },
    visitors: 590378,
    expectedVisitors: 500000,
    genre: ["action", "thriller"],
  },
];

// Array element matches multiple conditions

db.movies.find({
  genres: { $elemMatch: { $regex: /^S/ } },
});

users >
  db.users.find({
    hobbies: { $elemMatch: { title: "Sports", freq: { $gte: 3 } } },
  })[
    ({
      _id: ObjectId("699c79af9c0ae94b759e3c04"),
      name: "Max",
      hobbies: [
        { title: "Sports", freq: 3 },
        { title: "Cooking", freq: 6 },
      ],
      phone: 1213309053,
    },
    {
      _id: ObjectId("699c7a209c0ae94b759e3c06"),
      name: "Prashant",
      hobbies: [
        { title: "Sports", freq: 3 },
        { title: "Cooking", freq: 6 },
      ],
      phone: "01213309052",
      age: 26,
    },
    {
      _id: ObjectId("699c7ab59c0ae94b759e3c07"),
      name: "Anna",
      hobbies: [
        { title: "Sports", freq: 3 },
        { title: "Cooking", freq: 6 },
      ],
      phone: "01213309050",
      age: null,
    })
  ];

// Array has exactly 2 elements

db.movies.find({
  genres: { $size: 2 },
});

users >
  db.users.find({ hobbies: { $size: 3 } })[
    {
      _id: ObjectId("699c82e79c0ae94b759e3c0b"),
      name: "Chris",
      hobbies: ["Sports", "Cooking", "Hiking"],
    }
  ];

db.users.find({ "hobbies.title": "Sports" });
```

---

### Element Operators

Query based on field existence and type.

**Element Operators:**

- `$exists` - Field exists or not
- `$type` - Field is of specific BSON type

**Examples:**

```js
// Find documents where officialSite exists

db.movies.find({ officialSite: { $exists: true } })

// Find documents where rating is missing

db.movies.find({ rating: { $exists: false } })

// Find where runtime is a number

db.movies.find({ runtime: { $type: "number" } })

// Find where name is a string

db.movies.find({ name: { $type: "string" } })

users> db.users.find( { age : { $exists : true} })
[
  {
    _id: ObjectId('699c7a209c0ae94b759e3c06'),
    name: 'Prashant',
    hobbies: [ { title: 'Sports', freq: 3 }, { title: 'Cooking', freq: 6 } ],
    phone: '01213309052',
    age: 26
  }
]
users> db.users.find( { age : { $exists : false} })
[
  {
    _id: ObjectId('699c79af9c0ae94b759e3c04'),
    name: 'Max',
    hobbies: [ { title: 'Sports', freq: 3 }, { title: 'Cooking', freq: 6 } ],
    phone: 1213309053
  },
  {
    _id: ObjectId('699c79af9c0ae94b759e3c05'),
    name: 'Manuel',
    hobbies: [ { title: 'Cars', freq: 3 }, { title: 'Cooking', freq: 5 } ],
    phone: 121330933
  }
]
users> db.users.find( { age : { $exists : true} })
[
  {
    _id: ObjectId('699c7a209c0ae94b759e3c06'),
    name: 'Prashant',
    hobbies: [ { title: 'Sports', freq: 3 }, { title: 'Cooking', freq: 6 } ],
    phone: '01213309052',
    age: 26
  }
]
users> db.users.find( { age : { $exists : false} })
[
  {
    _id: ObjectId('699c79af9c0ae94b759e3c04'),
    name: 'Max',
    hobbies: [ { title: 'Sports', freq: 3 }, { title: 'Cooking', freq: 6 } ],
    phone: 1213309053
  },
  {
    _id: ObjectId('699c79af9c0ae94b759e3c05'),
    name: 'Manuel',
    hobbies: [ { title: 'Cars', freq: 3 }, { title: 'Cooking', freq: 5 } ],
    phone: 121330933
  }
]
users> db.users.find({ phone : {$type : "number"}})
[
  {
    _id: ObjectId('699c79af9c0ae94b759e3c04'),
    name: 'Max',
    hobbies: [ { title: 'Sports', freq: 3 }, { title: 'Cooking', freq: 6 } ],
    phone: 1213309053
  },
  {
    _id: ObjectId('699c79af9c0ae94b759e3c05'),
    name: 'Manuel',
    hobbies: [ { title: 'Cars', freq: 3 }, { title: 'Cooking', freq: 5 } ],
    phone: 121330933
  }
]
users> db.users.find({ phone : {$type : "double"}})

users> db.users.find({ phone : {$type : ["number" , "string"]}})
[
  {
    _id: ObjectId('699c79af9c0ae94b759e3c04'),
    name: 'Max',
    hobbies: [ { title: 'Sports', freq: 3 }, { title: 'Cooking', freq: 6 } ],
    phone: 1213309053
  },
  {
    _id: ObjectId('699c79af9c0ae94b759e3c05'),
    name: 'Manuel',
    hobbies: [ { title: 'Cars', freq: 3 }, { title: 'Cooking', freq: 5 } ],
    phone: 121330933
  },
  {
    _id: ObjectId('699c7a209c0ae94b759e3c06'),
    name: 'Prashant',
    hobbies: [ { title: 'Sports', freq: 3 }, { title: 'Cooking', freq: 6 } ],
    phone: '01213309052',
    age: 26
  },
  {
    _id: ObjectId('699c7ab59c0ae94b759e3c07'),
    name: 'Anna',
    hobbies: [ { title: 'Sports', freq: 3 }, { title: 'Cooking', freq: 6 } ],
    phone: '01213309050',
    age: null
  }
]
users>

```

---

### Geospatial Operators

Query location-based data.

**Geospatial Operators:**

- `$geoWithin` - Within a specified shape
- `$geoIntersects` - Intersects with a shape
- `$near` - Near a point
- `$nearSphere` - Near a point on a sphere

**Example:**

```js
// Find locations within 5km radius

.locations.find({
  coordinates: {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.9667, 40.78] },
      $maxDistance: 5000
    }
  }
})
```

---

## Working with Cursors

When you execute a `find()` query, MongoDB doesn't immediately return all documents. Instead, it returns a **cursor** - a pointer to the result set that allows you to iterate through documents efficiently.

### What is a Cursor?

**Key Characteristics:**

- `find()` returns a cursor object, not an array
- Cursors fetch documents in **batches** (not all at once)
- Default batch size: **101 documents** for first batch, then **16 MB** or **1000 documents** per batch
- Shell automatically iterates first **20 documents**
- Efficient for large result sets (memory-friendly)

**Why Cursors?**

```
Without Cursor (Bad):
find() → Load ALL 1,000,000 docs → Memory overflow ❌

With Cursor (Good):
find() → Cursor → Fetch 101 docs → Process → Fetch next batch →
Process → ... ✅
```

---

### Cursor Methods

#### `cursor.next()`

Retrieves the next document from the cursor.

**Example:**

```js
// Create a cursor
const cursor = db.movies.find();

// Get first document
cursor.next();
```

**Result:**

```js
{
  _id: ObjectId('699af2612adc1485c87da5ab'),
  id: 1,
  name: 'Under the Dome',
  type: 'Scripted',
  language: 'English',
  genres: [ 'Drama', 'Science-Fiction', 'Thriller' ],
  status: 'Ended',
  runtime: 60,
  rating: { average: 6.5 },
  network: {
    id: 2,
    name: 'CBS',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' }
  },
  // ... more fields
}
```

**Get next document:**

```js
cursor.next();
```

**Result:**

```js
{
  _id: ObjectId('699af2612adc1485c87da5ac'),
  id: 5,
  name: 'True Detective',
  type: 'Scripted',
  language: 'English',
  genres: [ 'Drama', 'Crime', 'Thriller' ],
  status: 'Running',
  runtime: 60,
  rating: { average: 8.3 },
  network: {
    id: 8,
    name: 'HBO',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' }
  },
  // ... more fields
}
```

---

#### `cursor.hasNext()`

Checks if there are more documents to retrieve.

**Example:**

```js
const cursor = db.movies.find();

// Check if cursor has documents
cursor.hasNext(); // true

// Consume all documents
cursor.forEach((doc) => {
  printjson(doc);
});

// Check again after exhausting cursor
cursor.hasNext(); // false
```

**Use Case:**

```js
// Manual iteration
while (cursor.hasNext()) {
  const doc = cursor.next();
  // Process document
}
```

---

#### `cursor.forEach()`

Iterates through all remaining documents in the cursor.

**Syntax:**

```js
cursor.forEach((document) => {
  // Process each document
});
```

**Example:**

```js
const cursor = db.movies.find({ genres: "Drama" });

cursor.forEach((doc) => {
  printjson(doc);
});

// After forEach, cursor is exhausted
cursor.hasNext(); // false
```

---

### Creating New Cursors

Once a cursor is exhausted, you need to create a new one:

```js
// First cursor
const cursor = db.movies.find();
cursor.forEach((doc) => {
  /* process */
});
cursor.hasNext(); // false - exhausted

// Create new cursor to iterate again
const newCursor = db.movies.find();
newCursor.hasNext(); // true - ready to use
```

---

## Sorting Results

The `sort()` method orders query results by one or more fields.

### Sort Syntax

```js
db.collection.find().sort({ field: 1 }); // Ascending
db.collection.find().sort({ field: -1 }); // Descending
```

**Sort Values:**

- `1` = Ascending order (A→Z, 0→9, low→high)
- `-1` = Descending order (Z→A, 9→0, high→low)

---

### Single Field Sorting

**Ascending Order (Low to High):**

```js
db.movies.find().sort({ "rating.average": 1 });
```

**Result:**

```js
// Returns movies sorted by rating from lowest to highest
{ name: "Bad Movie", rating: { average: 3.2 } }
{ name: "OK Movie", rating: { average: 5.5 } }
{ name: "Good Movie", rating: { average: 7.8 } }
{ name: "Great Movie", rating: { average: 9.1 } }
```

---

**Descending Order (High to Low):**

```js
db.movies.find().sort({ "rating.average": -1 });
```

**Result:**

```js
// Returns movies sorted by rating from highest to lowest
{ name: "Great Movie", rating: { average: 9.1 } }
{ name: "Good Movie", rating: { average: 7.8 } }
{ name: "OK Movie", rating: { average: 5.5 } }
{ name: "Bad Movie", rating: { average: 3.2 } }
```

---

### Multi-Field Sorting

Sort by multiple fields with priority order.

**Example:**

```js
db.movies.find().sort({ "rating.average": 1, runtime: -1 });
```

**How it works:**

1. **Primary sort**: By `rating.average` ascending (low→high)
2. **Secondary sort**: If ratings are equal, sort by `runtime` descending (high→low)

**Result:**

```js
// Same rating: sorted by runtime (high to low)
{ name: "Movie A", rating: { average: 7.5 }, runtime: 120 }
{ name: "Movie B", rating: { average: 7.5 }, runtime: 90 }
{ name: "Movie C", rating: { average: 7.5 }, runtime: 60 }

// Different rating: sorted by rating (low to high)
{ name: "Movie D", rating: { average: 8.0 }, runtime: 45 }
{ name: "Movie E", rating: { average: 8.2 }, runtime: 150 }
```

**Sort Priority:**

- First field has highest priority
- Subsequent fields break ties
- Can sort by unlimited fields

---

## Pagination: Skip & Limit

Control which subset of results to retrieve - essential for pagination.

### The `.count()` Method

Returns the total number of matching documents.

**Example:**

```js
db.movies.find().sort({ "rating.average": 1, runtime: -1 }).count();
// Result: 240
```

**Total documents:** 240 movies

---

### The `.skip()` Method

Skips the specified number of documents from the beginning.

**Syntax:**

```js
db.collection.find().skip(n);
```

**Example 1: Skip 10 documents**

```js
db.movies.find().sort({ "rating.average": 1, runtime: -1 }).skip(10).count();
// Result: 230
```

**Explanation:**

- Total: 240 documents
- Skip: 10 documents
- Remaining: 230 documents

---

**Example 2: Skip 100 documents**

```js
db.movies.find().sort({ "rating.average": 1, runtime: -1 }).skip(100).count();
// Result: 140
```

**Explanation:**

- Total: 240 documents
- Skip: 100 documents
- Remaining: 140 documents

---

### The `.limit()` Method

Limits the number of documents returned.

**Syntax:**

```js
db.collection.find().limit(n);
```

**Example 1: Skip 10, limit to 10**

```js
db.movies
  .find()
  .sort({ "rating.average": 1, runtime: -1 })
  .skip(10)
  .limit(10)
  .count();
// Result: 10
```

**Explanation:**

- Skip first 10 documents
- Return next 10 documents
- **Page 2** of results (if 10 per page)

---

**Example 2: Skip 100, limit to 10**

```js
db.movies
  .find()
  .sort({ "rating.average": 1, runtime: -1 })
  .skip(100)
  .limit(10)
  .count();
// Result: 10
```

**Explanation:**

- Skip first 100 documents
- Return next 10 documents
- **Page 11** of results (if 10 per page)

---

### Pagination Implementation

**Pagination Formula:**

```js
const page = 5; // Which page to show
const pageSize = 10; // Documents per page

db.movies
  .find()
  .skip((page - 1) * pageSize) // Skip previous pages
  .limit(pageSize); // Show only current page
```

**Example: Show page 5 with 10 items per page**

```js
const page = 5;
const pageSize = 10;

db.movies
  .find()
  .sort({ "rating.average": -1 })
  .skip((5 - 1) * 10) // Skip 40 documents (pages 1-4)
  .limit(10); // Show 10 documents (page 5)
```

**Page Breakdown:**

- Page 1: Documents 1-10 (skip: 0, limit: 10)
- Page 2: Documents 11-20 (skip: 10, limit: 10)
- Page 3: Documents 21-30 (skip: 20, limit: 10)
- Page 4: Documents 31-40 (skip: 30, limit: 10)
- **Page 5: Documents 41-50** (skip: 40, limit: 10)

---

### Method Chaining Order

**Best Practice Order:**

```js
db.collection
  .find(filter) // 1. Filter
  .sort(sortSpec) // 2. Sort
  .skip(n) // 3. Skip
  .limit(n); // 4. Limit
```

**Why this order?**

1. **Filter** - Get matching documents
2. **Sort** - Order them
3. **Skip** - Skip already-shown documents
4. **Limit** - Return only needed documents

**MongoDB optimizes internally**, but this is the logical order.

---

### Cursor Methods Summary

| Method       | Purpose                    | Example                      | Returns      |
| ------------ | -------------------------- | ---------------------------- | ------------ |
| `.next()`    | Get next document          | `cursor.next()`              | Document     |
| `.hasNext()` | Check if more docs exist   | `cursor.hasNext()`           | Boolean      |
| `.forEach()` | Iterate all docs           | `cursor.forEach(fn)`         | Void         |
| `.toArray()` | Convert to array           | `cursor.toArray()`           | Array        |
| `.count()`   | Count matching docs        | `cursor.count()`             | Number       |
| `.sort()`    | Sort results               | `.sort({ field: 1 })`        | Cursor       |
| `.skip()`    | Skip N documents           | `.skip(10)`                  | Cursor       |
| `.limit()`   | Limit to N documents       | `.limit(10)`                 | Cursor       |
| `.pretty()`  | Format output (shell only) | `.pretty()`                  | Cursor       |
| `.explain()` | Show query plan            | `.explain("executionStats")` | Explain data |

---

### Performance Considerations

**Efficient Pagination:**

✅ **Good** for small skip values:

```js
db.movies.find().skip(10).limit(10); // Fast
```

❌ **Slow** for large skip values:

```js
db.movies.find().skip(100000).limit(10); // Slow!
```

**Why?** MongoDB still scans through skipped documents.

---

**Better Approach for Large Offsets:**

Use **range queries** instead of skip:

```js
// Instead of: .skip(10000).limit(10)
// Use:
db.movies.find({ _id: { $gt: lastSeenId } }).limit(10);
```

**Benefits:**

- Uses index efficiently
- Constant performance regardless of page
- Skips no documents

---

### Practical Examples

**Example 1: Top 10 Highest Rated Movies**

```js
db.movies.find().sort({ "rating.average": -1 }).limit(10);
```

---

**Example 2: Movies 21-30 by Runtime**

```js
db.movies.find({ status: "Running" }).sort({ runtime: -1 }).skip(20).limit(10);
```

---

**Example 3: Search with Pagination**

```js
const searchTerm = "Detective";
const page = 3;
const perPage = 20;

db.movies
  .find({ name: { $regex: searchTerm, $options: "i" } })
  .sort({ "rating.average": -1 })
  .skip((page - 1) * perPage)
  .limit(perPage);
```

---

**Example 4: Count Total Pages**

```js
const totalDocs = db.movies.find({ genres: "Drama" }).count();
const perPage = 20;
const totalPages = Math.ceil(totalDocs / perPage);

print(`Total pages: ${totalPages}`);
// Result: Total pages: 12 (240 documents / 20 per page)
```

---

### Best Practices

**1. Always Sort Before Pagination**

```js
// ❌ Bad: Inconsistent results across pages
db.movies.find().skip(10).limit(10);

// ✅ Good: Consistent ordering
db.movies.find().sort({ _id: 1 }).skip(10).limit(10);
```

---

**2. Use Indexes for Sort Fields**

```js
// Create index for frequently sorted fields
db.movies.createIndex({ "rating.average": -1 });

// Now sorting is much faster
db.movies.find().sort({ "rating.average": -1 });
```

---

**3. Limit Results When Possible**

```js
// ❌ Avoid: Fetching everything
db.movies.find().toArray(); // Loads all 240 docs

// ✅ Better: Limit what you need
db.movies.find().limit(20); // Loads only 20 docs
```

---

**4. Combine with Projection**

```js
// Only fetch needed fields
db.movies
  .find({}, { name: 1, "rating.average": 1 })
  .sort({ "rating.average": -1 })
  .limit(10);
```

Reduces network bandwidth and improves performance.

---

## Projection Operators

Projection operators control which fields are returned and how array fields are presented.

### Projection Operators Overview

| Operator     | Description                                  | Example                             |
| ------------ | -------------------------------------------- | ----------------------------------- |
| `$`          | Projects first matching array element        | `{ "comments.$": 1 }`               |
| `$elemMatch` | Projects first matching element by condition | `{ comments: { $elemMatch: {...} }` |
| `$slice`     | Limits number of array elements              | `{ comments: { $slice: 5 } }`       |
| `$meta`      | Projects metadata (text search score)        | `{ score: { $meta: "textScore" } }` |

---

### Projection Operator Examples

**`$` - Positional Operator**

Projects the first array element that matches the query condition.

```js
// Find movie with specific genre and return only that genre

db.movies.find({ genres: "Drama" }, { "genres.$": 1 });

// Result: Only the matched "Drama" entry in genres array
```

---

**`$elemMatch` - Element Match Projection**

Projects the first array element that matches the specified condition.

```js
// Project only comments with score > 5

db.posts.find(
  {},
  {
    comments: {
      $elemMatch: { score: { $gt: 5 } },
    },
  }
);
```

---

**`$slice` - Array Slice**

Limits the number of array elements returned.

```js
// Return only first 3 genres

db.movies.find({}, { genres: { $slice: 3 } });

// Return last 2 genres

db.movies.find({}, { genres: { $slice: -2 } });

// Skip 1, return 3

db.movies.find({}, { genres: { $slice: [1, 3] } });
```

**Syntax:**

- `{ $slice: N }` - First N elements
- `{ $slice: -N }` - Last N elements
- `{ $slice: [skip, limit] }` - Skip and limit

---

**`$meta` - Metadata Projection**

Projects metadata, such as text search relevance scores.

```js
// Text search with relevance score

db.movies
  .find(
    { $text: { $search: "thriller" } },
    {
      name: 1,
      score: { $meta: "textScore" },
    }
  )
  .sort({ score: { $meta: "textScore" } });
```

**Use Cases:**

- Sort results by text search relevance
- Show search score to users
- Implement "best match" features

---

### Summary

**Query Selectors** help you find the right documents:

- **Comparison**: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`
- **Logical**: `$and`, `$or`, `$not`, `$nor`
- **Element**: `$exists`, `$type`
- **Array**: `$all`, `$elemMatch`, `$size`
- **Evaluation**: `$regex`, `$text`, `$expr`
- **Geospatial**: `$near`, `$geoWithin`

**Projection Operators** control what fields are returned:

- `$` - First matching array element
- `$elemMatch` - Conditional array element
- `$slice` - Limited array elements
- `$meta` - Metadata like search scores

**Best Practices:**

1. Use indexes on frequently queried fields
2. Combine operators for precise filtering
3. Use projection to reduce data transfer
4. Test queries with `.explain()` for performance insights
