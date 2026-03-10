# MongoDB

## Table of Contents

- [JSON(BSON) Data Format](#jsonbson-data-format)
- [The Key MongoDB Characteristics](#the-key-mongodb-characteristics)
- [MongoDB Ecosystem](#mongodb-ecosystem)
- [Shell vs Drivers](#shell-vs-drivers)
- [MongoDB Server Architecture](#mongodb-server-architecture)
- [Document & CRUD Basics](#document--crud-basics)
- [Projection](#projection)
- [Embedded Documents & Arrays](#embedded-documents--arrays)
- [Data Schemas and Data Modelling](#data-schemas-and-data-modelling)
- [Relations-Options](#relations-options)
- [Relationship Patterns](#relationship-patterns)
- [Choosing Between Embedded vs Referenced](#choosing-between-embedded-vs-referenced)
- [Joining with $lookup](#joining-with-lookup)
- [Schema Validation](#schema-validation)
- [Exploring The Shell & The Server](#exploring-the-shell--the-server)
- [Create Operations (Deep Dive)](#create-operations-deep-dive)
  - [Write Concern](#write-concern)
  - [Atomicity](#atomicity)
- [Importing Data with mongoimport](#importing-data-with-mongoimport)
- [Read Operations Deep Dive](#read-operations-deep-dive)
  - [Query Selectors](#query-selectors)
  - [Working with Cursors](#working-with-cursors)
  - [Sorting Results](#sorting-results)
  - [Pagination: Skip & Limit](#pagination-skip--limit)
  - [Projection Operators](#projection-operators)
- [Update Operations Deep Dive](#update-operations-deep-dive)
- [Field Update Operators](#field-update-operators)
- [Upsert - Update or Insert](#upsert---update-or-insert)
- [Updating Array Fields](#updating-array-fields)
- [Adding Elements to Arrays](#adding-elements-to-arrays)
- [Removing Elements from Arrays](#removing-elements-from-arrays)
- [The `$addToSet` Operator](#the-addtoset-operator)
- [Update Operations Module Summary](#update-operations-module-summary)
- [Delete Operations](#delete-operations-deep-dive)
- [Indexes](#indexes)
  - [Why Indexes?](#why-indexes)
  - [Adding a Single Field Index](#adding-a-single-field-index)
  - [Understanding Index Restrictions](#understanding-index-restrictions)
  - [Compound Indexes](#compound-indexes)
  - [Using Indexes for Sorting](#using-indexes-for-sorting)
  - [Default Index](#default-index)
  - [Configuring Indexes — Unique Index](#configuring-indexes--unique-index)
  - [Understanding Partial Indexes](#understanding-partial-indexes)
  - [Partial Index + Unique Constraint](#partial-index--unique-constraint)
  - [Understanding the Time-To-Live (TTL) Index](#understanding-the-time-to-live-ttl-index)
  - [Query Diagnosis and Query Planning](#query-diagnosis-and-query-planning)
  - [Understanding Covered Queries](#understanding-covered-queries)
  - [How MongoDB Rejects a Plan](#how-mongodb-rejects-a-plan)
  - [Using Multi Key Index](#using-multi-key-index)
  - [Understanding `text` Index](#understanding-text-index)
  - [Text Indexes and Sorting](#text-indexes-and-sorting)
  - [Creating Combined Text Indexes](#creating-combined-text-indexes)
  - [Using Text Index to Exclude Words](#using-text-index-to-exclude-words)
  - [Setting Default Language and Using Weights](#setting-default-language-and-using-weights)
  - [Building Indexes](#building-indexes)
- [Geospatial Data](#geospatial-data)
  - [Adding GeoJSON Data](#adding-geojson-data)
  - [Running Geo Queries](#running-geo-queries)
  - [Adding a Geospatial Index](#adding-a-geospatial-index)
  - [Adding Additional Locations](#adding-additional-locations)
  - [Finding Places Inside a Certain Area](#finding-places-inside-a-certain-area)
  - [Finding out if a User is Inside a Specific Area](#finding-out-if-a-user-is-inside-a-specific-area)
  - [Finding Places within certain Radius](#finding-places-within-certain-radius)
  - [Geospatial Data — Summary](#geospatial-data--summary)
- [Understanding the Aggregation Framework](#understanding-the-aggregation-framework)
  - [What is the Aggregation Framework?](#what-is-the-aggregation-framework-)
  - [Getting started with Aggregation pipeline](#getting-started-with-aggregation-pipeline)
  - [Using the Aggregation framework](#using-the-aggregation-framework)
  - [Understanding the Group Stage](#understanding-the-group-stage)
  - [Diving Deep into Group Stage](#diving-deep-into-group-stage)
  - [Working with $project](#working-with-project)
  - [Turning the Location into a geoJSON Object](#turning-the-location-into-a-geojson-object)
  - [Transforming Birthdate](#transforming-birthdate)
  - [Using Shortcuts for Transformation](#using-shortcuts-for-transformation)
  - [Understanding the $isoWeekYear Operator](#understanding-the-isoweekyear-operator)
  - [$group vs $project](#group-vs-project)
  - [Pushing Elements into Newly Created Arrays](#pushing-elements-into-newly-created-arrays)
  - [Using Projection with Arrays](#using-projection-with-arrays)
  - [Using the $filter Operator](#using-the-filter-operator)
  - [Applying Multiple Operations to Arrays](#applying-multiple-operations-to-arrays)
  - [Understanding $bucket](#understanding-bucket)
  - [Diving into Additional Stages](#diving-into-additional-stages)
  - [Writing Pipeline Results into a New Collection](#writing-pipeline-results-into-a-new-collection)
  - [Working with the $geoNear Stage](#working-with-the-geonear-stage)
  - [Understanding the Aggregation Framework — Summary](#understanding-the-aggregation-framework--summary)
- [Working with Numeric Data](#working-with-numeric-data)
  - [Number Types](#number-types)
  - [Understanding Programming Language Defaults](#understanding-programming-language-defaults)
  - [Working with int32](#working-with-int32)
  - [Working with int64](#working-with-int64)
  - [Doing Math with Floats int32 and int64](#doing-math-with-floats-int32-and-int64)
  - [What's Wrong with Normal Doubles?](#whats-wrong-with-normal-doubles)
  - [Working with Decimal 128bit](#working-with-decimal-128bit)
  - [Model Monetary Data](#model-monetary-data)
  - [Working with Numeric Data — Summary](#working-with-numeric-data--summary)
- [MongoDB and Security](#mongodb-and-security)
  - [Introduction](#introduction)
  - [Understanding Role Based Access Control](#understanding-role-based-access-control)
  - [Creating a User](#creating-a-user)
  - [Built-In Roles — An Overview](#built-in-roles--an-overview)
  - [Assigning Roles to Users and Databases](#assigning-roles-to-users-and-databases)
  - [Updating and Extending Roles to Other Databases](#updating-and-extending-roles-to-other-databases)
  - [Adding SSL Transport Encryption](#adding-ssl-transport-encryption)
  - [Encryption at Rest](#encryption-at-rest)
  - [MongoDB and Security — Summary](#mongodb-and-security--summary)

---

## JSON(BSON) Data Format

**BSON** = **B**inary J**S**ON (Binary-encoded JSON)

**Explanation:**

- MongoDB stores data in BSON format internally, which is a binary representation of JSON
- **Why BSON?** It's more efficient for storage and faster to traverse than plain JSON
- MongoDB drivers automatically convert JSON to BSON when you insert data
- BSON supports additional data types not available in JSON (e.g., Date, ObjectId, Binary data)

```mermaid
flowchart LR
    subgraph YOUR_APP ["Your Application"]
        J["JSON object<br/>{ name: 'Max', age: 29,<br/>  dob: new Date() }"]
    end

    subgraph DRIVER ["MongoDB Driver (auto-converts)"]
        D["Serialises to BSON<br/>+ adds extra types"]
    end

    subgraph MONGODB ["MongoDB Storage"]
        B["BSON binary<br/>String · Int · Double<br/>ObjectId · Date · Bool<br/>Binary · Timestamp · ..."]
    end

    J -->|"insert / update"| D --> B
    B -->|"find / query"| D -->|"deserialise"| J

    style YOUR_APP fill:#cce5ff,color:#000
    style DRIVER fill:#fff3cd,color:#000
    style MONGODB fill:#d4edda,color:#000
```

> [⬆ Back to Index](#table-of-contents)

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

> [⬆ Back to Index](#table-of-contents)

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

```mermaid
flowchart TD
    subgraph DB ["MongoDB Database"]
        SE["Self-Managed / Enterprise<br/>(your own servers)"]
        AT["Atlas — Cloud DBaaS<br/>(AWS / Azure / GCP)"]
        MO["Mobile — Realm<br/>(offline-first)"]
    end

    subgraph TOOLS ["Tools"]
        CP["Compass (GUI)"]
        BI["BI Connectors"]
        CH["Charts"]
    end

    subgraph STITCH ["Stitch / Realm (Serverless)"]
        FN["Functions"]
        TR["Triggers"]
        SY["Real-Time Sync"]
    end

    DB --- TOOLS
    DB --- STITCH

    style DB fill:#cce5ff,color:#000
    style TOOLS fill:#d4edda,color:#000
    style STITCH fill:#fff3cd,color:#000
```

> [⬆ Back to Index](#table-of-contents)

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

```mermaid
flowchart LR
    subgraph SHELL ["MongoDB Shell (mongosh)"]
        SH["Interactive JS REPL<br/>for admins & learning<br/>runs queries directly"]
    end

    subgraph DRIVERS ["Language Drivers"]
        direction TB
        N["Node.js"] --- PY["Python"]
        J["Java"]   --- CS["C#"]
        G["Go"]     --- PH["PHP"]
    end

    DB[("MongoDB Server")]

    SHELL  -->|"direct connection"| DB
    DRIVERS -->|"native language API"| DB

    style SHELL fill:#fff3cd,color:#000
    style DRIVERS fill:#cce5ff,color:#000
    style DB fill:#d4edda,color:#000
```

> [⬆ Back to Index](#table-of-contents)

---

## MongoDB Server Architecture

MongoDB uses a storage engine to manage how data is stored and accessed:

```mermaid
flowchart TD
    APP(["Application / Shell"]) -->|"read / write"| MS

    subgraph MS ["MongoDB Server"]
        direction TB
        SE["Storage Engine<br/>(WiredTiger default)"]
        SE --> MEM["Memory (RAM)<br/>Fast but volatile<br/>Lost on crash"]
        SE --> JOUR["Journal (WAL)<br/>Crash-recovery log<br/>Flushed every ~100ms"]
        SE --> DISK["Data Files (.wt)<br/>Permanent storage<br/>Flushed every ~60s"]
        MEM -.->|"periodic checkpoint"| DISK
        JOUR -.->|"replayed on restart"| DISK
    end

    style APP fill:#cce5ff,color:#000
    style MEM fill:#fff3cd,color:#000
    style JOUR fill:#ffe0b2,color:#000
    style DISK fill:#d4edda,color:#000
    style SE fill:#f8f9fa,color:#000
```

**Explanation:**

1. **Memory Storage\*\*\*\***

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

> [⬆ Back to Index](#table-of-contents)

---

## Document & CRUD Basics

CRUD stands for **Create**, **Read**, **Update**, and **Delete** - the four basic operations for managing data.

```mermaid
flowchart LR
    subgraph C ["Create"]
        C1["insertOne()"]
        C2["insertMany()"]
    end
    subgraph R ["Read"]
        R1["find()"]
        R2["findOne()"]
    end
    subgraph U ["Update"]
        U1["updateOne()"]
        U2["updateMany()"]
        U3["replaceOne()"]
    end
    subgraph D ["Delete"]
        D1["deleteOne()"]
        D2["deleteMany()"]
    end

    DB[("MongoDB<br/>Collection")]

    C -->|"insert docs"| DB
    R -->|"query docs"| DB
    U -->|"modify docs"| DB
    D -->|"remove docs"| DB

    style C fill:#d4edda,color:#000
    style R fill:#cce5ff,color:#000
    style U fill:#fff3cd,color:#000
    style D fill:#f8d7da,color:#000
    style DB fill:#e2e3e5,color:#000
```

### Create Operations

Use these methods to insert new documents into a collection:

#### _`insertOne(data, options)`_

Inserts a single document into a collection.

```js
db.users.insertOne({ name: "John", age: 30 });
```

#### _`insertMany(data, options)`_

Inserts multiple documents at once.

```js
db.users.insertMany([
  { name: "Alice", age: 25 },
  { name: "Bob", age: 28 },
]);
```

---

### Read Operations

Retrieve documents from a collection using these methods:

#### _`find(filter, options)`_

Returns all documents that match the filter criteria.

**Important:** Returns a **cursor object**, not an array!

- To get all documents: use `.toArray()` or `.forEach()`
- Cursors are efficient for large datasets (they load data in batches)

#### _`findOne(filter, options)`_

Returns the first document that matches the filter.

---

#### _Query Examples_

**Comparison Operators:**

```js
// Find flights with distance greater than 10000

db.flightData.find({ distance: { $gt: 10000 } });

// Find flights with distance less than 10000

db.flightData.find({ distance: { $lt: 10000 } });

// Find first flight with distance > 900

db.flightData.findOne({ distance: { $gt: 900 } });
```

**Accessing Embedded Fields:**

```js
// Get hobbies of a specific person

db.passengers.findOne({ name: "Albert Twostone" }).hobbies;

// Find passengers with a specific hobby

db.passengers.findOne({ hobbies: "Sports" });

// Search in nested objects using dot notation

db.flightData.find({ "status.description": "on-time" });

db.flightData.find({ "status.details.responsible": "Prashant" });
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

#### _`updateOne(filter, data, options)`_

Updates the first document that matches the filter.

#### _`updateMany(filter, data, options)`_

Updates all documents that match the filter.

#### _`replaceOne(filter, data, options)`_

Replaces an entire document with new data.

#### _`update(filter, data, options)` *(Legacy - Avoid)*_

Older method that overrides complete data; use `updateOne` or `updateMany` instead.

---

#### _Update Examples_

**Update Operators:**

```js
// Add a marker field to one document

db.flightData.updateOne({ distance: 980 }, { $set: { marker: "delete" } });

// Add marker to all documents

db.flightData.updateMany(
  {}, // empty filter = match all
  { $set: { marker: "delete" } }
);

// Update an array field

db.passengers.updateOne(
  { name: "Albert Twostone" },
  { $set: { hobbies: ["Sports", "Cooking"] } }
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

#### _`deleteOne(filter, options)`_

Deletes the first document that matches the filter.

```js
db.users.deleteOne({ name: "John" });
```

#### _`deleteMany(filter, options)`_

Deletes all documents that match the filter.

```js
// Delete all users over 65

db.users.deleteMany({ age: { $gt: 65 } });

// Delete all documents in collection

db.users.deleteMany({});
```

**⚠️ Warning:** Be careful with `deleteMany({})` - it deletes everything!

> [⬆ Back to Index](#table-of-contents)

---

## Projection

**Projection** allows you to retrieve only specific fields from documents, reducing network bandwidth and improving performance.

```mermaid
flowchart LR
    subgraph DOC ["Document in DB"]
        direction TB
        F1["_id: 1"]
        F2["name: 'Alice'"]
        F3["age: 25"]
        F4["password: 'abc'"]
        F5["address: {...}"]
    end

    PROJ["Projection<br/>{ name: 1, age: 1, _id: 0 }"]

    subgraph RES ["Result Returned"]
        direction TB
        R1["name: 'Alice'"]
        R2["age: 25"]
    end

    DOC --> PROJ --> RES

    style DOC fill:#cce5ff,color:#000
    style PROJ fill:#fff3cd,color:#000
    style RES fill:#d4edda,color:#000
```

**Syntax:**

```js
db.collection.find(filter, projection);
```

### How Projection Works

Use `1` to include a field and `0` to exclude it:

```js
// Only return name and age, exclude _id

db.passengers.find({}, { name: 1, age: 1, _id: 0 })[
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

db.users.find({}, { name: 1, email: 1 }); // _id is included by default

// Exclude specific fields

db.users.find({}, { password: 0, secret: 0 }); // Everything except password and secret

// Include fields and exclude _id

db.products.find({}, { title: 1, price: 1, _id: 0 });
```

> [⬆ Back to Index](#table-of-contents)

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

db.users.find({ "address.city": "New York" });

// Query array elements

db.users.find({ hobbies: "Reading" }); // Matches if array contains "Reading"

// Query nested objects in arrays

db.users.find({ "tags.category": "premium" });
```

> [⬆ Back to Index](#table-of-contents)

---

## Data Schemas and Data Modelling

MongoDB is schema-less, but you should still design your data structure carefully.

### Example Document with Various Data Types

```js
db.companies.insertOne({
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

> [⬆ Back to Index](#table-of-contents)

---

## Relations-Options

MongoDB offers two main approaches to model relationships between data:

```mermaid
flowchart LR
    subgraph EMB ["Option 1 — Embedded"]
        direction TB
        DOC["users collection<br/>─────────────────<br/>_id: 1<br/>name: 'Max'<br/>address: {<br/>  street: '2nd St',<br/>  city: 'NYC'<br/>}"]
    end

    subgraph REF ["Option 2 — Referenced"]
        direction LR
        U["users<br/>──────────<br/>_id: 1<br/>name: 'Max'<br/>addressId: 101"]
        A["addresses<br/>──────────────<br/>_id: 101<br/>street: '2nd St'<br/>city: 'NYC'"]
        U -->|"references"| A
    end

    EMB -->|"One query — all data"| X(" ")
    REF -->|"Two queries — data is split"| X
```

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

> [⬆ Back to Index](#table-of-contents)

---

## Relationship Patterns

### One-to-One Relations - Embedded

**Use Case:** User profile with address (always accessed together)

```mermaid
flowchart TD
    subgraph DOC ["Single Document — users collection"]
        direction TB
        F1["_id: ObjectId('u1')"]
        F2["name: 'Max'"]
        F3["age: 29"]
        subgraph ADDR ["address  (embedded sub-document)"]
            direction LR
            A1["street: '2nd St'"] --- A2["city: 'NYC'"]
        end
    end
    style ADDR fill:#d4edda,color:#000
    style DOC fill:#cce5ff,color:#000
```

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

```mermaid
flowchart LR
    subgraph PC ["persons collection"]
        P["_id: ObjectId('abc123')<br/>name: 'Max'<br/>age: 29"]
    end
    subgraph CC ["cars collection"]
        C["_id: ObjectId('xyz789')<br/>model: 'BMW'<br/>price: 40000<br/>owner: ObjectId('abc123')"]
    end
    C -->|"owner points to _id"| P
    style P fill:#d4edda,color:#000
    style C fill:#fff3cd,color:#000
```

**Example:**

```js
// Persons Collection
carData>
db.persons.insertOne({name: "Max", age: 29, salary: 3000})
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
db.cars.insertOne({
  model: "BMW",
  price: 40000,
  owner: ObjectId('6994872e0aed413665b6c1d8')  // Reference to person
})
{
  acknowledged: true,
  insertedId: ObjectId('699487560aed413665b6c1d9')
}

carData>
db.cars.findOne()
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

```mermaid
flowchart TD
    subgraph THREAD ["Single Document — questionThreads collection"]
        direction TB
        Q["creator: 'Max'</br>question: 'How does that all work?'"]
        subgraph ARR ["answers  (embedded array)"]
            direction LR
            A1["[0] text: 'Like That'"] --- A2["[1] text: 'Thanks'"]
        end
        Q --> ARR
    end
    style ARR fill:#d4edda,color:#000
    style THREAD fill:#cce5ff,color:#000
```

```js
support>
db.questionThreads.insertOne({
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
db.questionThreads.find()
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

```mermaid
flowchart LR
    subgraph CITIES ["cities collection"]
        NYC["_id: ObjectId('c1')<br/>name: 'New York City'"]
    end
    subgraph CITIZENS ["citizens collection"]
        P1["_id: ObjectId('p1')<br/>name: 'Prashant'<br/>cityId: ObjectId('c1')"]
        P2["_id: ObjectId('p2')<br/>name: 'XYZ'<br/>cityId: ObjectId('c1')"]
    end
    P1 -->|"cityId → _id"| NYC
    P2 -->|"cityId → _id"| NYC
    style NYC fill:#d4edda,color:#000
    style P1 fill:#fff3cd,color:#000
    style P2 fill:#fff3cd,color:#000
```

```js
// Cities Collection
cityData>
db.cities.insertOne({
  name: "New York City",
  coordinates: { lat: 21, lng: 55 }
})
{
  acknowledged: true,
  insertedId: ObjectId('69948ab20aed413665b6c1dc')
}

cityData>
db.cities.find()
[
  {
    _id: ObjectId('69948ab20aed413665b6c1dc'),
    name: 'New York City',
    coordinates: { lat: 21, lng: 55 }
  }
]

// Citizens Collection (each citizen references their city)
cityData>
db.citizens.insertMany([
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
db.citizens.find()
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
db.citizens.find({ cityId: cityId })`
- To get city details for a citizen: look up the city using the `cityId`

**When to Use Referenced One-to-Many:**

- Many related items (could be thousands or millions)
- Related items are frequently queried independently
- Related items would exceed document size limit if embedded

---

### Many-to-Many Embedded

**Use Case:** Customers can order multiple products; products can be ordered by multiple customers.

```mermaid
flowchart LR
    subgraph PROD ["products collection (source of truth)"]
        BOOK["_id: ObjectId('b1')<br/>title: 'A Book'<br/>price: 12.99"]
    end
    subgraph CUST ["customers collection"]
        subgraph CDOC ["Customer Document"]
            direction TB
            CI["name: 'Prashant', age: 29"]
            subgraph ORD ["orders (embedded array — snapshot)"]
                O1["title: 'A Book'<br/>price: 12.99<br/>quantity: 2"]
            end
        end
    end
    BOOK -. "copied at order time (price may change later)" .-> O1
    style BOOK fill:#d4edda,color:#000
    style ORD fill:#fff3cd,color:#000
    style CDOC fill:#cce5ff,color:#000
```

```js
// Products Collection
shop>
db.products.insertOne({ title: "A Book", price: 12.99 })
{
  acknowledged: true,
  insertedId: ObjectId('69948c880aed413665b6c1df')
}

// Customers Collection (orders embedded in customer)
shop>
db.customers.insertOne({name: "Prashant", age: 29})
{
  acknowledged: true,
  insertedId: ObjectId('69948ca50aed413665b6c1e0')
}

shop>
db.customers.updateOne(
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
db.customers.find()
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

```mermaid
flowchart LR
    subgraph SC ["students collection"]
        S1["Alice<br/>courseIds: [c1, c2]"]
        S2["Bob<br/>courseIds: [c1, c3]"]
    end
    subgraph CC ["courses collection"]
        C1["MongoDB Basics<br/>studentIds: [s1, s2]"]
        C2["Advanced Queries<br/>studentIds: [s1]"]
        C3["Data Modeling<br/>studentIds: [s2]"]
    end
    S1 -->|"enrolled"| C1
    S1 -->|"enrolled"| C2
    S2 -->|"enrolled"| C1
    S2 -->|"enrolled"| C3
    style S1 fill:#cce5ff,color:#000
    style S2 fill:#cce5ff,color:#000
    style C1 fill:#d4edda,color:#000
    style C2 fill:#d4edda,color:#000
    style C3 fill:#d4edda,color:#000
```

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

> [⬆ Back to Index](#table-of-contents)

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

### Decision Flowchart

```mermaid
flowchart TD
    A["Do you always fetch parent + related data together?"] -->|Yes| B
    A -->|No — queried separately| REF

    B["Is the related data small and bounded?"] -->|Yes| C
    B -->|No — could grow large| REF

    C["Will the document stay under 16 MB?"] -->|Yes| D
    C -->|No| REF

    D["Is a data snapshot OK? e.g. order price at purchase time"] -->|Yes| EMB
    D -->|No — need live/current data| REF

    EMB["Use EMBEDDED"]
    REF["Use REFERENCED"]

    style EMB fill:#27ae60,color:#fff
    style REF fill:#2980b9,color:#fff
```

> [⬆ Back to Index](#table-of-contents)

---

## Joining with $lookup

The `$lookup` aggregation stage performs a **left outer join** between collections, allowing you to combine referenced data into a single result document.

```mermaid
flowchart TD
    subgraph IN ["Input — citizens collection"]
        C1["{ name: 'Prashant', cityId: ObjectId('c1') }"]
        C2["{ name: 'XYZ',      cityId: ObjectId('c1') }"]
    end

    LK["$lookup stage<br/>─────────────────────<br/>from:         'cities'<br/>localField:   'cityId'<br/>foreignField: '_id'<br/>as:           'cityDetails'"]

    subgraph FK ["Foreign — cities collection"]
        CITY["{ _id: ObjectId('c1'), name: 'New York City' }"]
    end

    subgraph OUT ["Output — merged result"]
        R1["{ name: 'Prashant',<br/>  cityId: ObjectId('c1'),<br/>  cityDetails: [{ name: 'New York City' }] }"]
    end

    IN --> LK
    FK -->|"matched by _id"| LK
    LK --> OUT

    style LK fill:#fff3cd,color:#000
    style IN fill:#cce5ff,color:#000
    style FK fill:#d4edda,color:#000
    style OUT fill:#f8d7da,color:#000
```

### How $lookup Works

**Syntax:**

```js
db.collection.aggregate([
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
  db.citizens.aggregate([
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

db.citizens.aggregate([
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

db.citizens.aggregate([
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

> [⬆ Back to Index](#table-of-contents)

---

## Schema Validation

MongoDB allows you to enforce **data validation rules** on collections to ensure documents meet specific requirements.

```mermaid
flowchart TD
    OP(["Insert / Update operation"]) --> LEVEL

    LEVEL{"Validation Level?"}
    LEVEL -->|"strict  (all docs)"| VALIDATE
    LEVEL -->|"moderate (only valid docs)"| VALIDATE
    LEVEL -->|"no schema set"| PASS

    VALIDATE{"Does doc pass schema?"}
    VALIDATE -->|"Yes"| PASS
    VALIDATE -->|"No"| ACTION

    ACTION{"Validation Action?"}
    ACTION -->|"error (default)"| REJECT
    ACTION -->|"warn"| LOG

    PASS["Document saved"]
    REJECT["Operation rejected<br/>(MongoServerError)"]
    LOG["Document saved<br/>+ warning logged"]

    style PASS fill:#d4edda,color:#000
    style REJECT fill:#f8d7da,color:#000
    style LOG fill:#fff3cd,color:#000
    style OP fill:#cce5ff,color:#000
```

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
db.createCollection("posts", {
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
db.posts.insertOne({
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
db.runCommand()` with `collMod` to update validation rules:

```js
db.runCommand({
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
db.posts.insertOne({
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
db.posts.find()
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
db.users.createIndex({ email: 1 }, { unique: true });
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

> [⬆ Back to Index](#table-of-contents)

---

## Exploring The Shell & The Server

MongoDB provides powerful command-line tools for server administration and database interaction.

### MongoDB Server (mongod)

The `mongod` process is the core database server that handles data requests, manages data access, and performs background operations.

#### _Getting Help_

```bash
mongod --help
```

Lists all available server options and configurations.

---

#### _Essential Server Options_

**1. Database and Log Paths**

```bash
mongod --dbpath <path-to-data> --logpath <path-to-log-file>
```

**Example:**

```bash
mongod --dbpath /data/ --logpath /var/log/mongodb/mongod.log
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

#### _Common Shell Options_

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

> [⬆ Back to Index](#table-of-contents)

---

## Create Operations (Deep Dive)

MongoDB provides multiple methods for inserting documents into collections.

### Creating Documents - Methods Overview

#### _1. `insertOne(document, options)`_

Inserts a single document into a collection.

**Syntax:**

```js
db.collectionName.insertOne({ field: "value" });
```

**Example:**

```js

db.users.insertOne({
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

#### _2. `insertMany(documents, options)`_

Inserts multiple documents in a single operation.

**Syntax:**

```js
db.collectionName.insertMany([{ field: "value1" }, { field: "value2" }]);
```

**Example:**

```js

db.users.insertMany([
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

#### _3. `insert()` *(Deprecated - Avoid)*_

**Legacy method** that works for both single and multiple documents.

```js
// Don't use this anymore!

db.collectionName.insert({ field: "value" })  // Single

db.collectionName.insert([{...}, {...}])      // Multiple
```

**Why Avoid:**

- Less clear intent (single vs. multiple)
- Deprecated in newer MongoDB versions
- Use `insertOne()` or `insertMany()` instead

---

#### _4. `mongoimport` Command-Line Tool_

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

```mermaid
flowchart TD
    subgraph ORD ["ordered: true  (default)"]
        direction TB
        O1["Insert doc[0] sports"] --> O1R["OK"]
        O1R --> O2["Insert doc[1] sports"] --> O2R["ERROR: duplicate key"]
        O2R --> O3["doc[2] hiking"] --> O3R["SKIPPED — never attempted"]
        style O2R fill:#f8d7da,color:#000
        style O3R fill:#e2e3e5,color:#000
    end

    subgraph UNORD ["ordered: false"]
        direction TB
        U1["Insert doc[0] sports"] --> U1R["ERROR: duplicate"]
        U1R --> U2["Insert doc[1] hiking"] --> U2R["OK — inserted"]
        U2R --> U3["Insert doc[2] yoga"] --> U3R["ERROR: duplicate"]
        style U1R fill:#f8d7da,color:#000
        style U2R fill:#d4edda,color:#000
        style U3R fill:#f8d7da,color:#000
    end

    style ORD fill:#fff3cd,color:#000
    style UNORD fill:#cce5ff,color:#000
```

By default, `insertMany()` is **ordered** - it inserts documents sequentially and stops at the first error.

**Initial Setup:**

```js
hobbies>
db.hobbies.insertMany([
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
db.hobbies.insertMany([
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
  db.hobbies.find()[
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

#### _Unordered Inserts_

Set `ordered: false` to continue inserting even after errors.

**Unordered Insert with Errors:**

```js
hobbies>
db.hobbies.insertMany([
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
  db.hobbies.find()[
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

#### _Comparison Table_

| Aspect              | Ordered (`true`)    | Unordered (`false`)   |
| ------------------- | ------------------- | --------------------- |
| **Default**         | Yes                 | No                    |
| **Processing**      | Sequential          | All attempted         |
| **Error Handling**  | Stop at first error | Continue after errors |
| **Error Reporting** | First error only    | All errors            |
| **Performance**     | Slower (sequential) | Faster (parallel)     |
| **Use Case**        | Order matters       | Maximum inserts       |

---

#### _When to Use Each_

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
  const result = db.products.insertMany(productArray, { ordered: false });
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

#### _How MongoDB Writes Data_

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

#### _Storage Engine, Memory, Journal & Data Files_

MongoDB does not write directly to disk on every operation — that would be far too slow. Instead, the **WiredTiger storage engine** manages a layered pipeline between your write command and permanent storage.

---

**Architecture Diagram**

```mermaid
flowchart TD
    A([Client / Application]) -->|"insertOne / updateOne / deleteOne"| B[mongod Process]

    subgraph SE["WiredTiger Storage Engine"]
        direction TB

        subgraph MEM["MEMORY  RAM - volatile"]
            C["WiredTiger Cache</br>~50% of available RAM</br>Fast - lost on crash"]
        end

        subgraph DSK["DISK - durable"]
            D["Journal  WAL</br>Sequential append-only log</br>Survives crash"]
            E["Data Files  .wt</br>Actual persistent storage</br>Written every 60s checkpoint"]
        end

        B --> C
        C -->|"Every 100ms</br>or j:true = immediate"| D
        C -->|"Checkpoint every 60s"| E

        R["Crash Recovery</br>On restart: replay journal</br>rebuilds dirty cache pages"]
        D -.-> R
        R -.-> C
    end

    C -->|"w:1 ack - Memory only"| ACK2(["Ack: w:1</br>fast, not crash-safe"])
    D -->|"j:true ack - written to Disk"| ACK1(["Ack: j:true</br>crash-safe"])

    style C fill:#fff3cd,stroke:#ffc107,color:#000
    style D fill:#d1ecf1,stroke:#17a2b8,color:#000
    style E fill:#d4edda,stroke:#28a745,color:#000
    style R fill:#f8d7da,stroke:#dc3545,color:#000
    style MEM fill:#fffde7,stroke:#ffc107,color:#333
    style DSK fill:#e8f5e9,stroke:#28a745,color:#333
    style SE fill:#f8f9fa,stroke:#6c757d
```

---

**1. Storage Engine — WiredTiger**

WiredTiger is MongoDB's default storage engine (since v3.2). It sits between your application and the raw disk, managing everything about how data is stored, retrieved, and recovered.

| Responsibility   | Details                                                            |
| ---------------- | ------------------------------------------------------------------ |
| Cache management | Allocates ~50% of RAM (min 1 GB) as an in-memory page cache        |
| Compression      | Snappy compression on data files by default; zlib/zstd optional    |
| Encryption       | Supports at-rest encryption (Enterprise only)                      |
| Concurrency      | Document-level locking — multiple writes can happen simultaneously |
| Checkpointing    | Periodically flushes dirty cache pages to data files (every 60s)   |
| Crash recovery   | Replays the journal on startup to recover any uncommitted changes  |

---

**2. Memory (WiredTiger Cache)**

Every write operation lands in RAM first — this is the WiredTiger in-memory cache.

| Aspect               | Details                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| Default size         | `max(50% of RAM − 1 GB, 256 MB)`                                          |
| Speed                | Nanosecond access — extremely fast                                        |
| Durability           | **Volatile** — lost on power loss or crash                                |
| Dirty pages          | Modified pages are flagged "dirty" until flushed to journal or data files |
| Acknowledgment point | `w: 1` (default write concern) confirms once data reaches here            |

> When `{ w: 1, j: false }` (the default), MongoDB acknowledges your write as soon as it hits RAM. If the server crashes in the next 100ms before the journal is written, that write is **lost**.

---

**3. Journal (Write-Ahead Log — WAL)**

The journal is a sequential, append-only log file on disk. It is the **safety net** between memory and data files.

| Aspect               | Details                                                             |
| -------------------- | ------------------------------------------------------------------- |
| Location             | `mongodb-data/journal/` directory                                   |
| Write frequency      | Every **100ms** automatically, OR immediately when `j: true`        |
| Format               | Sequential binary log — each entry records the exact change         |
| Purpose              | Enables crash recovery — MongoDB replays journal on restart         |
| Size                 | Each journal file is max 100 MB; old files deleted after checkpoint |
| Acknowledgment point | `j: true` confirms once data is written here (on disk, durable)     |

**What a journal entry contains:**

```
[Timestamp]  [Operation]  [Namespace]       [Change]
2026-03-01   INSERT       mydb.orders       { _id: ObjectId(...), amount: 500 }
2026-03-01   UPDATE       mydb.orders       { _id: ..., $set: { status: "paid" } }
2026-03-01   DELETE       mydb.users        { _id: ObjectId(...) }
```

**Journal crash recovery example:**

```
Scenario:
  T=0:00  — insertOne({ order: "A" })  → written to RAM ✅, journal ✅, data file ❌
  T=0:01  — insertOne({ order: "B" })  → written to RAM ✅, journal ✅, data file ❌
  T=0:02  — SERVER CRASHES (power loss)
  T=0:03  — MongoDB restarts

Recovery:
  MongoDB reads journal file → finds 2 uncommitted entries
  Replays both inserts into WiredTiger cache
  Next checkpoint flushes them to data files
  Result: Both documents survive ✅
```

Without the journal (`--nojournal` flag), both writes above would be **permanently lost** after the crash.

---

**4. Data Files (.wt files)**

Data files are the final, permanent home for your data on disk.

| Aspect                  | Details                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| Location                | `mongodb-data/collection-*.wt`, `index-*.wt`                      |
| Write frequency         | Every **60 seconds** (checkpoint)                                 |
| Format                  | WiredTiger B-tree format, compressed                              |
| Contents                | One `.wt` file per collection, one per index                      |
| Relationship to journal | Journal entries are removed once data is safely checkpointed here |

**Checkpoint process:**

```
Every 60 seconds:
  1. WiredTiger identifies all dirty (modified) cache pages
  2. Writes them atomically to .wt data files
  3. Updates the checkpoint record (WiredTiger.turtle file)
  4. Removes journal entries that are now safely on disk
  5. Cache pages marked clean
```

---

**Full Write Lifecycle — Concrete Example**

```js
// You run:
db.orders.insertOne({ _id: 1, item: "laptop", amount: 1200 });
```

```
Step 1 — mongod receives the write command

Step 2 — WiredTiger writes to cache (RAM)
         Page for "orders" collection marked dirty
         Duration: ~microseconds

Step 3 — Journal entry appended to disk  ← happens within 100ms
         Entry: INSERT orders { _id:1, item:"laptop", amount:1200 }
         Duration: ~1–5ms (disk write)

Step 4 — Acknowledgment sent to client
         { acknowledged: true, insertedId: 1 }
         (with j:true, ack waits for step 3; with j:false, ack after step 2)

Step 5 — Checkpoint (every 60s)
         Dirty cache page flushed to collection-X.wt data file
         Journal entry for this insert is now deleted

Step 6 — Data is permanently on disk ✅
```

---

**What Happens on a Crash — Three Scenarios**

| Crash timing                | Journal status    | Data files  | Recovery outcome                            |
| --------------------------- | ----------------- | ----------- | ------------------------------------------- |
| After step 2, before step 3 | Not yet written   | Not updated | **Write lost** — journal has no record      |
| After step 3, before step 5 | Written           | Not updated | **Recovered** — journal replayed on restart |
| After step 5                | Written + deleted | Updated     | **Safe** — data already in data files       |

> This is why `j: true` is important for critical data — it guarantees the write reached the journal (step 3) before acknowledging, making it recoverable in all crash scenarios.

---

#### _Write Concern Options_

**Syntax:**

```js

db.collection.insertOne(
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

#### _The `w` Option (Write Acknowledgment)_

**`w: 0` - No Acknowledgment (Fire and Forget)**

```js

db.persons.insertOne(
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

db.persons.insertOne(
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
db.persons.insertOne(
  { name: "Sara", age: 35 },
  { writeConcern: { w: "majority" } }
);
```

**Characteristics:**

- Waits for majority of replica set members to acknowledge
- Highest durability (data replicated to multiple servers)
- Slower than `w: 1`
- Recommended for critical data

---

#### _The `j` Option (Journal Acknowledgment)_

**`j: false` or `undefined` - Memory Only**

```js

db.persons.insertOne(
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

db.persons.insertOne(
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

#### _The `wtimeout` Option_

Sets a time limit for write concern acknowledgment.

```js

db.persons.insertOne(
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

db.persons.insertOne(
  { name: "Test" },
  { writeConcern: { w: "majority", wtimeout: 100 } }
);
// Error: waiting for replication timed out
```

---

#### _Write Concern Levels Comparison_

| Configuration                | Speed   | Durability | Use Case                      |
| ---------------------------- | ------- | ---------- | ----------------------------- |
| `{ w: 0 }`                   | Fastest | Lowest     | Non-critical logs, analytics  |
| `{ w: 1 }`                   | Fast    | Medium     | General purpose (default)     |
| `{ w: 1, j: true }`          | Medium  | High       | Important data, single server |
| `{ w: "majority" }`          | Slow    | Highest    | Critical data, replica sets   |
| `{ w: "majority", j: true }` | Slowest | Maximum    | Financial transactions        |

---

#### _Choosing the Right Write Concern_

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

#### _Performance vs Durability Trade-off_

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

#### _What is Atomicity?_

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

#### _MongoDB's Atomicity Guarantee_

**MongoDB CRUD operations are atomic at the DOCUMENT level** (including embedded documents).

**What This Means:**

✅ **Atomic (Single Document)**

```js
// This entire operation is atomic

db.users.updateOne(
  { _id: 1 },
  {
    $set: { name: "John Doe" },
    $inc: { loginCount: 1 },
    $push: { loginHistory: new Date() },
  }
);
```

- **All changes succeed together** or **all fail together**
- No way to have partial updates (e.g., name changed but loginCount not incremented)
- Other clients see either old state or new state, never an intermediate state

---

❌ **Not Atomic (Multiple Documents without Transactions)**

```js
// These are separate atomic operations

db.accounts.updateOne({ _id: "A" }, { $inc: { balance: -100 } }); // Operation 1

db.accounts.updateOne({ _id: "B" }, { $inc: { balance: +100 } }); // Operation 2
```

- If Operation 1 succeeds but Operation 2 fails:
  - Account A loses $100
  - Account B doesn't gain $100
  - Money "disappears" from the system!
- Each operation is atomic, but **together they are not**

---

#### _Document-Level Atomicity Examples_

**Example 1: Insert with Embedded Documents**

```js
db.orders.insertOne({
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
db.users.updateOne(
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
  }
);
```

**Atomicity Guarantee:**

- All changes ($set, $push, $inc) happen together
- Other clients never see intermediate states
- If any part fails, entire update is rolled back

---

**Example 3: Embedded Document Update**

```js
db.blogs.updateOne(
  { _id: "post123", "comments._id": "comment456" },
  {
    $set: {
      "comments.$.text": "Updated comment",
      "comments.$.editedAt": new Date(),
    },
    $inc: { "comments.$.editCount": 1 },
  }
);
```

**Atomicity Guarantee:**

- Comment text, editedAt, and editCount update atomically
- The entire embedded comment is updated as one unit

---

#### _Multi-Document Transactions (MongoDB 4.0+)_

For operations spanning **multiple documents**, use transactions:

```js
const session = db.getMongo().startSession();
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

#### _Atomicity Best Practices_

**1. Design for Single-Document Atomicity**

```js
// Good: Embed related data

db.orders.insertOne({
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

db.products.updateOne(
  { _id: "product123" },
  { $inc: { quantity: -1 } } // Atomic decrement
);
```

**4. Handle Failures Gracefully**

```js
try {

  db.collection.insertOne({ ... });
} catch (error) {
  // Operation is already rolled back
  console.error("Insert failed:", error);
}
```

---

#### _Atomicity Summary_

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

> [⬆ Back to Index](#table-of-contents)

---

## Importing Data with mongoimport

**`mongoimport`** is a command-line utility that imports data from JSON, CSV, or TSV files into MongoDB collections.

### Basic Syntax

```bash
mongoimport [options] <file>
```

### Common Options

| Option                     | Description                                        | Example                    |
| -------------------------- | -------------------------------------------------- | -------------------------- |
| `-d, --database`           | Database name                                      | `-d movieData`             |
| `-c, --collection`         | Collection name                                    | `-c movies`                |
| `--drop`                   | Drop collection before importing                   | `--drop`                   |
| `--jsonArray`              | Import a JSON array (file contains `[{...}, ...]`) | `--jsonArray`              |
| `--file`                   | Input file path                                    | `--file data.json`         |
| `--type`                   | File type: json, csv, tsv                          | `--type csv`               |
| `--headerline`             | Use first line as field names (CSV/TSV)            | `--headerline`             |
| `--mode`                   | Import mode: insert, upsert, merge                 | `--mode upsert`            |
| `--uri`                    | MongoDB connection string                          | `--uri mongodb://...`      |
| `--host`                   | MongoDB host                                       | `--host localhost:27017`   |
| `--ignoreBlanks`           | Ignore blank fields in CSV/TSV                     | `--ignoreBlanks`           |
| `--stopOnError`            | Stop on first error                                | `--stopOnError`            |
| `--maintainInsertionOrder` | Process documents in order                         | `--maintainInsertionOrder` |

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

````js
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

moviewData>
db.movies.find().limit(1)  // View first document
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
    updat | Example                                     |
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

> [⬆ Back to Index](#table-of-contents)

---

## Importing Data with mongoimport

**`mongoimport`** is a command-line utility that imports data from JSON, CSV, or TSV files into MongoDB collections.

### Basic Syntax

```bash
mongoimport [options] <file>
````

### Common Options

| Option                     | Description                                        | Example                    |
| -------------------------- | -------------------------------------------------- | -------------------------- |
| `-d, --database`           | Database name                                      | `-d movieData`             |
| `-c, --collection`         | Collection name                                    | `-c movies`                |
| `--drop`                   | Drop collection before importing                   | `--drop`                   |
| `--jsonArray`              | Import a JSON array (file contains `[{...}, ...]`) | `--jsonArray`              |
| `--file`                   | Input file path                                    | `--file data.json`         |
| `--type`                   | File type: json, csv, tsv                          | `--type csv`               |
| `--headerline`             | Use first line as field names (CSV/TSV)            | `--headerline`             |
| `--mode`                   | Import mode: insert, upsert, merge                 | `--mode upsert`            |
| `--uri`                    | MongoDB connection string                          | `--uri mongodb://...`      |
| `--host`                   | MongoDB host                                       | `--host localhost:27017`   |
| `--ignoreBlanks`           | Ignore blank fields in CSV/TSV                     | `--ignoreBlanks`           |
| `--stopOnError`            | Stop on first error                                | `--stopOnError`            |
| `--maintainInsertionOrder` | Process documents in order                         | `--maintainInsertionOrder` |

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

moviewData>
db.movies.find().limit(1)  // View first document
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
db.mycoll.createIndex({email: 1})'
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

### mongoimport — Summary

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

> [⬆ Back to Index](#table-of-contents)

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
db.collectionName.method(filter, options);
```

**Query Structure Breakdown:**

```js
db.mycollection // Access current database // Access this collection
  .find(); // Apply this method
```

**Filter Examples:**

```js
// Simple equality filter

db.users.find({ age: 32 });
// Field: age, Value: 32

// Operator-based filter

db.users.find({ age: { $gt: 30 } });
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

#### _Query Selectors_

Query selectors allow you to filter documents based on specific criteria.

#### _Comparison Operators_

Used to compare field values against specified values.

| Operator | Meaning                    | Example                           |
| -------- | -------------------------- | --------------------------------- |
| `$eq`    | Equal                      | `{ age: { $eq: 30 } }`            |
| `$ne`    | Not equal                  | `{ age: { $ne: 30 } }`            |
| `$gt`    | Greater than               | `{ age: { $gt: 30 } }`            |
| `$gte`   | Greater than or equal      | `{ age: { $gte: 30 } }`           |
| `$lt`    | Less than                  | `{ age: { $lt: 30 } }`            |
| `$lte`   | Less than or equal         | `{ age: { $lte: 30 } }`           |
| `$in`    | Matches any value in array | `{ status: { $in: ["A","B"] } }`  |
| `$nin`   | Matches no value in array  | `{ status: { $nin: ["A","B"] } }` |

#### _Comparison Operators Examples_

> **Note:** These examples query the `movies` collection imported from `tv-shows.json` (240 documents). Below is a representative sample of that data to help you understand the queries.

**Sample Input Data (`db.movies` collection):**

```js
db.movies.insertMany([
  {
    name: "Under the Dome",
    runtime: 60,
    genres: ["Drama", "Science-Fiction", "Thriller"],
    rating: { average: 6.5 },
    status: "Ended",
  },
  {
    name: "True Detective",
    runtime: 60,
    genres: ["Drama", "Crime", "Thriller"],
    rating: { average: 8.3 },
    status: "Running",
  },
  {
    name: "Rick and Morty",
    runtime: 30,
    genres: ["Animation", "Comedy", "Adventure"],
    rating: { average: 9.2 },
    status: "Running",
  },
  {
    name: "Breaking Bad",
    runtime: 47,
    genres: ["Drama", "Crime", "Thriller"],
    rating: { average: 9.5 },
    status: "Ended",
  },
  {
    name: "Game of Thrones",
    runtime: 60,
    genres: ["Drama", "Adventure", "Fantasy"],
    rating: { average: 9.4 },
    status: "Ended",
  },
  {
    name: "Stalker",
    runtime: 42,
    genres: ["Crime", "Thriller"],
    rating: { average: 7.7 },
    status: "Ended",
  },
]);
```

**Key fields queried in the examples below:**

| `name`          | `runtime` | `rating.average` | `genres`                         |
| --------------- | --------- | ---------------- | -------------------------------- |
| Under the Dome  | 60        | 6.5              | Drama, Science-Fiction, Thriller |
| True Detective  | 60        | 8.3              | Drama, Crime, Thriller           |
| Rick and Morty  | 30        | 9.2              | Animation, Comedy, Adventure     |
| Breaking Bad    | 47        | 9.5              | Drama, Crime, Thriller           |
| Game of Thrones | 60        | 9.4              | Drama, Adventure, Fantasy        |
| Stalker         | 42        | 7.7              | Crime, Thriller                  |

---

**`$eq` - Equal**

```js
// Find movies with exactly 60  minute runtime
// Matches: Under the Dome, True Detective, Game of Thrones

db.movies.find({ runtime: { $eq: 60 } });

// Shorthand (implicit $eq)

db.movies.find({ runtime: 60 });
```

---

**`$ne` - Not Equal**

```js
// Find movies that are NOT 60 minutes

db.movies.find({ runtime: { $ne: 60 } });
```

**Use Cases:**

- Exclude specific values
- Find all documents except certain ones
- Filter out default or placeholder values

---

**`$gt` and `$gte` - Greater Than**

```js
// Movies longer than 60 minutes (exclusive)

db.movies.find({ runtime: { $gt: 60 } });

// Movies 60 minutes or longer (inclusive)

db.movies.find({ runtime: { $gte: 60 } });
```

---

**`$lt` and `$lte` - Less Than**

```js
// Movies shorter than 60 minutes

db.movies.find({ runtime: { $lt: 60 } });

// Movies 60 minutes or shorter

db.movies.find({ runtime: { $lte: 60 } });
```

---

**Querying Nested Fields**

Use **dot notation** to query embedded document fields:

```js
// Find highly rated movies (rating > 7)

db.movies.find({ "rating.average": { $gt: 7 } });

// Find lower rated movies

db.movies.find({ "rating.average": { $lt: 7 } });
```

**Important:**

- Use quotes around dotted field names
- Works with any nesting depth
- Example: `"network.country.name"`

---

**`$in` - Match Any Value in Array**

```js
// Find movies with specific genres

db.movies.find({ genres: { $in: ["Anime"] } });

// Shorthand for single value

db.movies.find({ genres: "Anime" });

// Multiple values - match ANY

db.movies.find({ runtime: { $in: [30, 42] } });
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

db.movies.find({ genres: { $nin: ["Anime", "Drama"] } });
```

**Explanation:**

- Returns documents where field does **not** match any value in the array
- Opposite of `$in`

**Use Cases:**

- Exclude blocked users: `{ userId: { $nin: blockedUserIds } }`
- Filter out specific statuses: `{ status: { $nin: ["cancelled", "deleted"] } }`

---

#### _Example Query Result_

**Query:**

```js
db.movies.find({ runtime: { $ne: 60 } }).limit(1);
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

#### _Other Query Selector Categories_

MongoDB provides additional query selector types for advanced filtering:

#### _Evaluation Operators_

Evaluate expressions and perform text searches.

| Operator      | Meaning                                | Example                                      |
| ------------- | -------------------------------------- | -------------------------------------------- |
| `$regex`      | Pattern match                          | `{ name: { $regex: /^Max/ } }`               |
| `$text`       | Full-text search (requires text index) | `{ $text: { $search: "awesome" } }`          |
| `$expr`       | Compare two fields in same doc         | `{ $expr: { $gt: ["$volume", "$target"] } }` |
| `$where`      | JavaScript expression                  | `{ $where: "this.age > 30" }`                |
| `$mod`        | Modulo                                 | `{ age: { $mod: [4, 0] } }`                  |
| `$jsonSchema` | Validate against JSON Schema           | `{ $jsonSchema: { required: ["name"] } }`    |

**Examples:**

```js
// Find movies with names starting with "The"

db.movies.find({ name: { $regex: /^The/ } });

db.movies.find({ summary: { $regex: /Dome/ } });

// Full-text search

db.movies.find({ $text: { $search: "thriller action" } });

// expression

// --- Input Data Setup ---
// financialData> db.sales.insertMany([
//   { volume: 89,  target: 80  },   // volume > target  ✅ matches $gt
//   { volume: 177, target: 200 },   // volume < target  ❌ does not match
//   { volume: 200, target: 177 }    // volume > target  ✅ matches $gt
// ])
// --- End Input Data Setup ---

financialData >
  db.sales.find({ $expr: { $gt: ["$volume", "$target"] } })[ // Returns: volume=89 & volume=200 (both exceed their target)
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

financialData > db.sales.find({ $where: "this.volume == 89" });
```

---

#### _Logical Operators_

Combine multiple query conditions.

| Operator | Meaning                         | Example                                                 |
| -------- | ------------------------------- | ------------------------------------------------------- |
| `$and`   | All conditions must be true     | `{ $and: [{ age: { $gt: 20 } }, { active: true }] }`    |
| `$or`    | At least one condition is true  | `{ $or: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }] }` |
| `$nor`   | None of the conditions are true | `{ $nor: [{ age: { $gt: 9 } }, { age: { $lt: 5 } }] }`  |
| `$not`   | Inverts the condition           | `{ age: { $not: { $gt: 30 } } }`                        |

**Examples:**

```js
// AND - Both conditions must match

db.movies.find({
  $and: [{ runtime: { $gt: 60 } }, { "rating.average": { $gte: 8 } }],
});

db.movies.find({
  $and: [{ "rating.average": { $gt: 9 } }, { genres: "Drama" }],
});

movieData >
  db.movies.find({ $and: [{ genres: "Drama" }, { genres: "Horror" }] }).count();
17;
movieData > db.movies.find({ genres: "Drama", genres: "Horror" }).count();
23;

// OR - Either condition matches

db.movies.find({
  $or: [{ genres: "Comedy" }, { genres: "Drama" }],
});

db.movies.find({
  $or: [{ "rating.average": { $gt: 9 } }, { "rating.average": { $lt: 5 } }],
});

// NOR

db.movies.find({
  $nor: [{ "rating.average": { $gt: 9 } }, { "rating.average": { $lt: 5 } }],
});

// NOT - Invert condition

db.movies.find({
  runtime: { $not: { $gte: 60 } },
});

db.movies.find({ runtime: { $not: { $eq: 50 } } });
```

---

#### _Array Operators_

Query array fields with advanced conditions.

| Operator     | Meaning                                     | Example                                             |
| ------------ | ------------------------------------------- | --------------------------------------------------- |
| `$all`       | Array contains all specified values         | `{ tags: { $all: ["red","blue"] } }`                |
| `$size`      | Array has exact length                      | `{ tags: { $size: 3 } }`                            |
| `$elemMatch` | At least one element matches all conditions | `{ scores: { $elemMatch: { $gt: 80, $lt: 100 } } }` |

**Examples:**

```js
// Array contains all genres

db.movies.find({
  genres: { $all: ["Drama", "Thriller"] },
});

// --- Input Data Setup ---
// boxOffice> db.movieStarts.insertMany([
//   {
//     title: "The Last Student Returns",
//     meta: { rating: 9.5, aired: 2018, runtime: 100 },
//     visitors: 1300000, expectedVisitors: 1550000,
//     genre: ["thriller", "drama", "action"]
//   },
//   {
//     title: "Supercharged Teaching",
//     meta: { rating: 9.3, aired: 2016, runtime: 60 },
//     visitors: 370000, expectedVisitors: 1000000,
//     genre: ["thriller", "action"]
//   },
//   {
//     title: "Teach me if you can",
//     meta: { rating: 8.5, aired: 2014, runtime: 90 },
//     visitors: 590378, expectedVisitors: 500000,
//     genre: ["action", "thriller"]
//   }
// ])
// --- End Input Data Setup ---

// Exact array match — genre must be EXACTLY ["thriller"] — returns 0 results
boxOffice > db.movieStarts.find({ genre: ["thriller"] });

// $all match — genre array must CONTAIN "thriller" — returns all 3 documents
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

#### _Element Operators_

Query based on field existence and type.

| Operator  | Meaning                 | Example                        |
| --------- | ----------------------- | ------------------------------ |
| `$exists` | Field exists (or not)   | `{ phone: { $exists: true } }` |
| `$type`   | Field matches BSON type | `{ age: { $type: "number" } }` |

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

#### _Geospatial Operators_

Query location-based data.

**Geospatial Operators:**

- `$geoWithin` - Within a specified shape
- `$geoIntersects` - Intersects with a shape
- `$near` - Near a point
- `$nearSphere` - Near a point on a sphere

**Example:**

```js
// Find locations within 5km radius

db.locations.find({
  coordinates: {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.9667, 40.78] },
      $maxDistance: 5000,
    },
  },
});
```

---

### Working with Cursors

When you execute a `find()` query, MongoDB doesn't immediately return all documents. Instead, it returns a **cursor** - a pointer to the result set that allows you to iterate through documents efficiently.

#### _What is a Cursor?_

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

#### _Cursor Methods_

##### `cursor.next()`

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

##### `cursor.hasNext()`

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

##### `cursor.forEach()`

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

#### _Creating New Cursors_

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

### Sorting Results

The `sort()` method orders query results by one or more fields.

#### _Sort Syntax_

```js
db.collection.find().sort({ field: 1 }); // Ascending
db.collection.find().sort({ field: -1 }); // Descending
```

**Sort Values:**

- `1` = Ascending order (A→Z, 0→9, low→high)
- `-1` = Descending order (Z→A, 9→0, high→low)

---

#### _Single Field Sorting_

> **Input Data:** These examples use the `movies` collection (240 TV shows). Below is a representative subset matching the output shown:
>
> ```js
> db.movies.insertMany([
>   {
>     name: "Bad Movie",
>     runtime: 90,
>     rating: { average: 3.2 },
>     genres: ["Drama"],
>   },
>   {
>     name: "OK Movie",
>     runtime: 60,
>     rating: { average: 5.5 },
>     genres: ["Comedy"],
>   },
>   {
>     name: "Good Movie",
>     runtime: 45,
>     rating: { average: 7.8 },
>     genres: ["Thriller"],
>   },
>   {
>     name: "Great Movie",
>     runtime: 120,
>     rating: { average: 9.1 },
>     genres: ["Sci-Fi"],
>   },
> ]);
> ```

**Ascending Order (Low to High):**

```js
db.movies.find().sort({ "rating.average": 1 });
```

**Result:**

```js
// Returns movies sorted by rating from lowest to highest
{ name: "Bad Movie",   rating: { average: 3.2 } }
{ name: "OK Movie",    rating: { average: 5.5 } }
{ name: "Good Movie",  rating: { average: 7.8 } }
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

#### _Multi-Field Sorting_

Sort by multiple fields with priority order.

**Input Data:**

```js
db.movies.insertMany([
  {
    name: "Movie A",
    rating: { average: 7.5 },
    runtime: 120,
    genres: ["Drama"],
  },
  { name: "Movie B", rating: { average: 7.5 }, runtime: 90, genres: ["Drama"] },
  { name: "Movie C", rating: { average: 7.5 }, runtime: 60, genres: ["Drama"] },
  {
    name: "Movie D",
    rating: { average: 8.0 },
    runtime: 45,
    genres: ["Comedy"],
  },
  {
    name: "Movie E",
    rating: { average: 8.2 },
    runtime: 150,
    genres: ["Thriller"],
  },
]);
```

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

### Pagination: Skip & Limit

Control which subset of results to retrieve - essential for pagination.

#### _The `.count()` Method_

Returns the total number of matching documents.

**Example:**

```js
db.movies.find().sort({ "rating.average": 1, runtime: -1 }).count();
// Result: 240
```

**Total documents:** 240 movies

---

#### _The `.skip()` Method_

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

#### _The `.limit()` Method_

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

#### _Pagination Implementation_

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

#### _Method Chaining Order_

**Best Practice Order:\*\***

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

#### _Cursor Methods Summary_

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

#### _Performance Considerations_

**Efficient Pagination:\*\***

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

#### _Practical Examples_

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

#### _Best Practices_

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

### Projection Operators

Projection operators control which fields are returned and how array fields are presented.

#### _Projection Operators Overview_

| Operator     | Description                                  | Example                             |
| ------------ | -------------------------------------------- | ----------------------------------- |
| `$`          | Projects first matching array element        | `{ "comments.$": 1 }`               |
| `$elemMatch` | Projects first matching element by condition | `{ comments: { $elemMatch: {...} }` |
| `$slice`     | Limits number of array elements              | `{ comments: { $slice: 5 } }`       |
| `$meta`      | Projects metadata (text search score)        | `{ score: { $meta: "textScore" } }` |

---

#### _Projection Operator Examples_

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

**Input Data:**

```js
db.posts.insertMany([
  {
    title: "MongoDB Tips",
    comments: [
      { text: "Great post!", score: 9 },
      { text: "Too long", score: 3 },
      { text: "Very helpful!", score: 7 },
    ],
  },
  {
    title: "NoSQL Basics",
    comments: [
      { text: "Interesting", score: 4 },
      { text: "Nice write-up", score: 6 },
    ],
  },
  {
    title: "Aggregation Guide",
    comments: [{ text: "Confusing", score: 2 }],
  },
]);
```

```js
// Project only the FIRST comment with score > 5 per document
// Result: Only "MongoDB Tips" and "NoSQL Basics" appear
//   ("Aggregation Guide" has no comment with score > 5)

db.posts.find(
  {},
  {
    comments: {
      $elemMatch: { score: { $gt: 5 } },
    },
  }
);
```

**Output:**

```js
[
  {
    _id: ObjectId("..."),
    comments: [{ text: "Great post!", score: 9 }], // First matching comment
  },
  {
    _id: ObjectId("..."),
    comments: [{ text: "Nice write-up", score: 6 }], // First matching comment
  },
  // "Aggregation Guide" excluded — no comment with score > 5
];
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

#### _Summary_

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

> [⬆ Back to Index](#table-of-contents)

---

## Update Operations Deep Dive

Update operations allow you to modify existing documents in MongoDB collections using powerful operators.

**Key Objectives:**

- Modify document fields efficiently
- Update array elements selectively or in bulk
- Use atomic operators for safe concurrent updates
- Understand upsert behavior

**Main Update Methods:**

- `updateOne()` - Updates first matching document
- `updateMany()` - Updates all matching documents
- `replaceOne()` - Replaces entire document
- `findOneAndUpdate()` - Updates and returns document

> **Initial Setup — `users` collection used across all Update Operation examples:**
>
> ```js
> use updateOps
>
> db.users.insertMany([
>   {
>     name: "Max",
>     hobbies: [{ title: "Sports", frequency: 3 }, { title: "Cooking", frequency: 6 }],
>     phone: 131782734
>   },
>   {
>     name: "Manuel",
>     hobbies: [{ title: "Cars", frequency: 2 }, { title: "Cooking", frequency: 5 }],
>     phone: 121330933
>   },
>   {
>     name: "Anna",
>     hobbies: [{ title: "Sports", frequency: 2 }, { title: "Yoga", frequency: 3 }],
>     phone: "80811987291",
>     age: null
>   },
>   {
>     name: "Chris",
>     hobbies: [{ title: "Sports", frequency: 3 }, { title: "Cooking", frequency: 6 }],
>     phone: "01213309052",
>     age: 26
>   }
> ]);
> ```
>
> **Key fields used in examples:**
>
> | `name` | `age` | `isSporty`    | hobbies count |
> | ------ | ----- | ------------- | ------------- |
> | Max    | —     | (added later) | 2             |
> | Manuel | 32    | (added later) | 2             |
> | Anna   | null  | (added later) | 2             |
> | Chris  | 26→29 | (added later) | 2→3           |

> [⬆ Back to Index](#table-of-contents)

---

## Field Update Operators

### The `$set` Operator

**Purpose:** Sets the value of a field. Creates the field if it doesn't exist.

**Syntax:**

```js
db.collection.updateOne({ filter }, { $set: { field: value } });
```

---

#### _`$set` with updateOne()_

```js
users> db.users.updateOne({_id : ObjectId('699d1a86704ebd0e15ed4433')} , { $set : {phone : "3830297039" , age : 26}})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
users> db.users.updateOne(
   { _id: ObjectId("699d1a86704ebd0e15ed4433") },
   {
     $set: {
       hobbies: [
         { title: "Sports", freq: 5 },
         { title: "Cooking", freq: 3 },
         { title: "Hiking", freq: 1 },
       ],
     },
   },
 );

{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

---

#### _`$set` with updateMany()_

**Example: Update Multiple Documents**

```js
db.users.updateMany(
  { "hobbies.title": "Sports" },
  { $set: { isSporty: true } }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 3,      // Found 3 documents with Sports hobby
  modifiedCount: 3,     // Modified all 3 documents
  upsertedCount: 0
}
```

---

**Verify Changes:**

```js
db.users.find({ "hobbies.title": "Sports" });
```

**Result:**

```js
[
  {
    _id: ObjectId("699d1a86704ebd0e15ed4430"),
    name: "Max",
    hobbies: [
      { title: "Sports", frequency: 3 },
      { title: "Cooking", frequency: 6 },
    ],
    phone: 131782734,
    isSporty: true, // ✅ New field added
  },
  {
    _id: ObjectId("699d1a86704ebd0e15ed4432"),
    name: "Anna",
    hobbies: [
      { title: "Sports", frequency: 2 },
      { title: "Yoga", frequency: 3 },
    ],
    phone: "80811987291",
    age: null,
    isSporty: true, // ✅ New field added
  },
  {
    _id: ObjectId("699d1a86704ebd0e15ed4433"),
    name: "Chris",
    hobbies: [
      { title: "Sports", freq: 5 },
      { title: "Cooking", freq: 3 },
      { title: "Hiking", freq: 1 },
    ],
    age: 26,
    phone: "3830297039",
    isSporty: true, // ✅ New field added
  },
];
```

**What Happened:**

- Found all users with "Sports" in their hobbies array
- Added `isSporty: true` field to each matching user
- All 3 users now have the new field

---

### The `$inc` Operator

**Purpose:** Increments (or decrements) the value of a numeric field by a specified amount.

**Syntax:**

```js
db.collection.updateOne({ filter }, { $inc: { field: amount } });
```

**Key Points:**

- Positive values increment
- Negative values decrement
- Field must be numeric (or will be created as 0 + increment)
- Atomic operation (safe for concurrent updates)

---

**Example 1: Increment Age**

```js
db.users.updateOne(
  { name: "Manuel" },
  {
    $inc: {
      age: 2, // Increment age by 2
    },
  }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
// Manuel's age: 32 → 34
```

---

**Example 2: Combine `$inc` with `$set`**

```js
db.users.updateOne(
  { name: "Manuel" },
  {
    $inc: {
      age: 1, // Increment age by 1
    },
    $set: {
      isSporty: false, // Set isSporty field
    },
  }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

---

**Verify Changes:**

```js
db.users.find({ name: "Manuel" });
```

**Result:**

```js
[
  {
    _id: ObjectId("699d1a86704ebd0e15ed4431"),
    name: "Manuel",
    hobbies: [
      { title: "Cooking", frequency: 5 },
      { title: "Cars", frequency: 2 },
    ],
    phone: "012177972",
    age: 35, // ✅ Incremented from 34 to 35
    isSporty: false, // ✅ Set to false
  },
];
```

**Common Use Cases:**

- Page view counters: `{ $inc: { views: 1 } }`
- Inventory management: `{ $inc: { quantity: -5 } }` (decrement)
- Score updates: `{ $inc: { score: 100 } }`
- Like/upvote counters: `{ $inc: { likes: 1 } }`

---

### The `$min`, `$max`, and `$mul` Operators

These operators provide specialized numeric update operations.

> **Input Data:** These examples work on `Chris` whose current `age` is **29** (set by `$set` in an earlier step).
>
> ```js
> // Chris's document at this point:
> db.users.insertOne({
>   name: "Chris",
>   hobbies: [
>     { title: "Sports", freq: 5 },
>     { title: "Cooking", freq: 3 },
>     { title: "Hiking", freq: 1 },
>   ],
>   age: 29,
>   phone: "3830297039",
>   isSporty: true,
> });
> ```

---

#### _`$min` - Update Only if Smaller_

**Purpose:** Updates the field value only if the specified value is **less than** the current value.

**Syntax:**

```js
db.collection.updateOne({ filter }, { $min: { field: value } });
```

**Example:**

```js
db.users.updateOne({ name: "Chris" }, { $min: { age: 30 } });
```

**Behavior:**

- Current age: 29 → Updates to 30 ❌ (29 < 30, no change)
- Current age: 35 → Updates to 30 ✅ (35 > 30, updates to 30)

**Use Cases:**

- Ensure value doesn't exceed maximum: `{ $min: { price: 100 } }`
- Cap values at certain threshold
- Track minimum scores/values

---

#### _`$max` - Update Only if Larger_

**Purpose:** Updates the field value only if the specified value is **greater than** the current value.

**Syntax:**

```js
db.collection.updateOne({ filter }, { $max: { field: value } });
```

**Example:**

```js
db.users.updateOne({ name: "Chris" }, { $max: { age: 30 } });
```

**Behavior:**

- Current age: 25 → Updates to 30 ✅ (25 < 30, updates)
- Current age: 35 → Updates to 30 ❌ (35 > 30, no change)

**Use Cases:**

- Track highest score: `{ $max: { highScore: newScore } }`
- Ensure minimum value: `{ $max: { price: 10 } }`
- Update "last seen" timestamps

---

#### _`$mul` - Multiply Value_

**Purpose:** Multiplies the field value by a specified number.

**Syntax:**

```js
db.collection.updateOne({ filter }, { $mul: { field: multiplier } });
```

**Example:**

```js
db.users.updateOne(
  { name: "Chris" },
  { $mul: { age: 1.1 } } // Multiply age by 1.1 (10% increase)
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

---

**Verify Change:**

```js
db.users.find({ name: "Chris" });
```

**Result:**

```js
[
  {
    _id: ObjectId("699d1a86704ebd0e15ed4433"),
    name: "Chris",
    hobbies: [
      { title: "Sports", freq: 5 },
      { title: "Cooking", freq: 3 },
      { title: "Hiking", freq: 1 },
    ],
    age: 31.900000000000002, // ✅ 29 * 1.1 = 31.9
    phone: "3830297039",
    isSporty: true,
  },
];
```

**Original age:** 29  
**After multiplication:** 29 × 1.1 = 31.9

**Use Cases:**

- Apply percentage increases: `{ $mul: { price: 1.15 } }` (15% increase)
- Apply discounts: `{ $mul: { price: 0.8 } }` (20% discount)
- Scale values: `{ $mul: { quantity: 2 } }` (double)
- Depreciation: `{ $mul: { value: 0.9 } }` (10% decrease)

---

### Comparison Table

| Operator | Purpose                    | Example                 | Result (if age=30) |
| -------- | -------------------------- | ----------------------- | ------------------ |
| `$inc`   | Add/subtract value         | `{ $inc: { age: 5 } }`  | 35                 |
| `$mul`   | Multiply by value          | `{ $mul: { age: 2 } }`  | 60                 |
| `$min`   | Set if new value < current | `{ $min: { age: 25 } }` | 25                 |
| `$max`   | Set if new value > current | `{ $max: { age: 35 } }` | 35                 |
| `$set`   | Set to exact value         | `{ $set: { age: 40 } }` | 40                 |

---

### The `$unset` Operator

**Purpose:** Removes a field from documents.

**Syntax:**

```js
db.collection.updateMany(
  { filter },
  { $unset: { field: "" } } // Value doesn't matter (use "" or 1)
);
```

**Key Points:**

- Deletes the field completely
- Value specified doesn't matter (use `""` or `1` by convention)
- If field doesn't exist, no error occurs
- Cannot unset `_id` field

---

**Example: Remove Phone Field**

> **Input Data:** This example builds on the `users` collection after the previous `$set` / `$rename` operations. The collection at this point looks like:
>
> ```js
> db.users.insertMany([
>   {
>     name: "Max",
>     hobbies: [
>       { title: "Sports", frequency: 3 },
>       { title: "Cooking", frequency: 6 },
>     ],
>     phone: "131782734",
>     isSporty: true,
>   },
>   {
>     name: "Manuel",
>     hobbies: [
>       { title: "Cars", frequency: 2 },
>       { title: "Cooking", frequency: 5 },
>     ],
>     phone: "012177972",
>     isSporty: false,
>     totalAge: 35,
>   },
>   {
>     name: "Anna",
>     hobbies: [
>       { title: "Sports", frequency: 2 },
>       { title: "Yoga", frequency: 3 },
>     ],
>     phone: "80811987291",
>     isSporty: true,
>     totalAge: null,
>   },
>   {
>     name: "Chris",
>     hobbies: [
>       { title: "Sports", freq: 5 },
>       { title: "Cooking", freq: 3 },
>       { title: "Hiking", freq: 1 },
>     ],
>     phone: "3830297039",
>     isSporty: true,
>     totalAge: 31.9,
>   },
> ]);
> ```

```js
db.users.updateMany(
  { isSporty: true },
  { $unset: { phone: "" } } // Remove 'phone' field
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 3,      // Found 3 sporty users
  modifiedCount: 3,     // Removed phone from all 3
  upsertedCount: 0
}
```

**What Happened:**

- Found all users where `isSporty: true`
- Removed `phone` field from those documents
- Documents no longer have `phone` field at all

**Before:**

```js
{ name: "Max", phone: "131782734", isSporty: true }
```

**After:**

```js
{ name: "Max", isSporty: true }    // phone field removed
```

**Use Cases:**

- Remove deprecated fields
- Clean up unnecessary data
- Remove sensitive information
- Schema migration

---

### The `$rename` Operator

**Purpose:** Renames a field.

**Syntax:**

```js
db.collection.updateMany(
  { filter },
  { $rename: { oldFieldName: "newFieldName" } }
);
```

**Key Points:**

- Renames field without changing its value
- If old field doesn't exist, nothing happens (no error)
- If new field already exists, it gets overwritten
- Can rename nested fields using dot notation

---

**Example: Rename 'age' to 'totalAge'**

```js
db.users.updateMany(
  {}, // Empty filter = all documents
  { $rename: { age: "totalAge" } }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 4,      // Checked 4 documents
  modifiedCount: 3,     // Only 3 had 'age' field to rename
  upsertedCount: 0
}
```

**What Happened:**

- Found all users in collection (4 total)
- Renamed `age` field to `totalAge` in 3 documents
- 1 document didn't have `age` field (not modified)

**Before:**

```js
{ name: "Max", age: 29 }
```

**After:**

```js
{ name: "Max", totalAge: 29 }
```

**Use Cases:**

- Fix naming conventions
- Schema migrations
- Standardize field names across collections
- Refactoring data structure

**Example: Rename Nested Field**

```js
db.users.updateMany(
  {},
  { $rename: { "address.zipCode": "address.postalCode" } }
);
```

> [⬆ Back to Index](#table-of-contents)

---

## Upsert - Update or Insert

**Upsert** = **Up**date + In**sert**

**Purpose:** If a document matching the filter exists, update it. If not, insert a new document.

**Syntax:**

```js
db.collection.updateOne(
  { filter },
  { updateOperators },
  { upsert: true } // Enable upsert
);
```

**Default Behavior:** `upsert: false` (only update existing documents)

```mermaid
flowchart TD
    START(["updateOne(filter, update, { upsert: true })"]) --> FIND
    FIND{"Document matching<br/>filter found?"}
    FIND -->|"Yes"| UPDATE["Update existing document"]
    FIND -->|"No"| INSERT["Insert new document<br/>(filter fields + $set fields)"]
    UPDATE --> ACK1["{matchedCount: 1,<br/>modifiedCount: 1,<br/>upsertedCount: 0 }"]
    INSERT --> ACK2["{matchedCount: 0,<br/>modifiedCount: 0,<br/>upsertedCount: 1,<br/>insertedId: ObjectId(...) }"]
    style UPDATE fill:#d4edda,color:#000
    style INSERT fill:#cce5ff,color:#000
    style ACK1 fill:#d4edda,color:#000
    style ACK2 fill:#cce5ff,color:#000
    style START fill:#fff3cd,color:#000
```

---

### Upsert Example

**Scenario:** Update Maria's data, or create her document if she doesn't exist.

```js
db.users.updateOne(
  { name: "Maria" }, // Filter: Find Maria
  {
    $set: {
      age: 29,
      hobbies: [{ title: "Good food", freq: 3 }],
      isSporty: true,
    },
  },
  { upsert: true } // If not found, insert
);
```

**Result (Maria doesn't exist):**

```js
{
  acknowledged: true,
  insertedId: ObjectId('699d2fcb1932bc8273d4a6bf'),  // ✅ New document created
  matchedCount: 0,        // No existing document found
  modifiedCount: 0,       // Nothing to modify
  upsertedCount: 1        // 1 document inserted
}
```

**New Document Created:**

```js
{
  _id: ObjectId('699d2fcb1932bc8273d4a6bf'),
  name: "Maria",          // From filter
  age: 29,                // From $set
  hobbies: [{ title: "Good food", freq: 3 }],
  isSporty: true
}
```

---

### Upsert Behavior

**Case 1: Document Exists**

```js
// Maria already exists
db.users.updateOne(
  { name: "Maria" },
  { $set: { age: 30 } },
  { upsert: true }
)

// Result:
{
  matchedCount: 1,        // Found Maria
  modifiedCount: 1,       // Updated her age
  upsertedCount: 0        // No insert needed
}
```

---

**Case 2: Document Doesn't Exist**

```js
// Maria doesn't exist
db.users.updateOne(
  { name: "Maria" },
  { $set: { age: 30 } },
  { upsert: true }
)

// Result:
{
  insertedId: ObjectId('...'),  // New document created
  matchedCount: 0,              // No match found
  modifiedCount: 0,             // Nothing to update
  upsertedCount: 1              // Inserted new doc
}
```

---

### Use Cases for Upsert

**1. Counters and Metrics**

```js
// Increment page view counter (create if doesn't exist)
db.pageViews.updateOne(
  { page: "/home" },
  { $inc: { views: 1 } },
  { upsert: true }
);
```

---

**2. User Preferences**

```js
// Save user settings (update or create)
db.settings.updateOne(
  { userId: "user123" },
  { $set: { theme: "dark", language: "en" } },
  { upsert: true }
);
```

---

**3. Session Tracking**

```js
// Update or create session
db.sessions.updateOne(
  { sessionId: "abc123" },
  {
    $set: { lastActive: new Date() },
    $inc: { requestCount: 1 },
  },
  { upsert: true }
);
```

---

**4. Inventory Management**

```js
// Update stock or add new product
db.inventory.updateOne(
  { sku: "LAPTOP-001" },
  { $set: { quantity: 50, price: 999 } },
  { upsert: true }
);
```

---

### Important Notes

**Filter Fields in Insert:**

- Filter criteria become part of the new document
- Filter: `{ name: "Maria" }` → New doc will have `name: "Maria"`

**Combining Operators:**

```js
db.users.updateOne(
  { email: "maria@example.com" },
  {
    $set: { name: "Maria" },
    $inc: { loginCount: 1 },
    $setOnInsert: { createdAt: new Date() }, // Only on insert
  },
  { upsert: true }
);
```

**`$setOnInsert` Operator:**

- Sets fields only when inserting (upsert creates new doc)
- Ignored when updating existing doc
- Useful for timestamps, defaults

> [⬆ Back to Index](#table-of-contents)

---

## Updating Array Fields

MongoDB provides powerful operators to update specific elements within arrays.

> **Input Data for this entire section:** The examples below use the `users` collection in the state before upsert/Maria was added. The core documents are:
>
> ```js
> db.users.insertMany([
>   {
>     name: "Max",
>     hobbies: [
>       { title: "Sports", frequency: 3 },
>       { title: "Cooking", frequency: 6 },
>     ],
>     isSporty: true,
>   },
>   {
>     name: "Manuel",
>     hobbies: [
>       { title: "Cars", frequency: 2 },
>       { title: "Cooking", frequency: 5 },
>     ],
>     isSporty: false,
>     totalAge: 35,
>   },
>   {
>     name: "Anna",
>     hobbies: [
>       { title: "Sports", frequency: 2 },
>       { title: "Yoga", frequency: 3 },
>     ],
>     isSporty: true,
>     totalAge: null,
>   },
>   {
>     name: "Chris",
>     hobbies: [
>       { title: "Sports", freq: 5 },
>       { title: "Cooking", freq: 3 },
>       { title: "Hiking", freq: 1 },
>     ],
>     isSporty: true,
>     totalAge: 31.9,
>   },
> ]);
> ```

### The Problem with Simple Queries

**`$and` vs `$elemMatch` for Arrays:**

❌ **Using separate conditions** (implicit `$and`):

```js
db.users.find({
  "hobbies.title": "Sports",
  "hobbies.frequency": { $gte: 3 },
});
```

**Problem:** Matches if **any** hobby is "Sports" AND **any** hobby has frequency ≥ 3 (they don't have to be the same hobby!).

✅ **Using `$elemMatch`:**

```js
db.users.find({
  hobbies: {
    $elemMatch: {
      title: "Sports",
      frequency: { $gte: 3 },
    },
  },
});
```

**Solution:** Matches only if **the same** hobby element satisfies both conditions.

---

### Updating Matched Array Elements with `$`

**The `$` Positional Operator:**

**Purpose:** Updates the **first** array element that matched the query filter.

**Syntax:**

```js
db.collection.updateMany(
  { "array.field": value }, // Filter
  { $set: { "array.$.newField": value } } // $ = matched element
);
```

---

**Example: Add 'highFrequency' Flag**

```js
db.users.updateMany(
  {
    hobbies: {
      $elemMatch: {
        title: "Sports",
        frequency: { $gte: 3 },
      },
    },
  },
  {
    $set: {
      "hobbies.$.highFrequency": true, // $ = first matched hobby
    },
  }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,      // 1 user has Sports hobby with freq ≥ 3
  modifiedCount: 1,     // Updated that user
  upsertedCount: 0
}
```

---

**Verify Change:**

```js
db.users.find({
  hobbies: {
    $elemMatch: {
      title: "Sports",
      frequency: { $gte: 3 },
    },
  },
});
```

**Result:**

```js
[
  {
    _id: ObjectId("699d1a86704ebd0e15ed4430"),
    name: "Max",
    hobbies: [
      {
        title: "Sports",
        frequency: 3,
        highFrequency: true, // ✅ Added to matched element
      },
      {
        title: "Cooking",
        frequency: 6, // ❌ Not modified (not matched)
      },
    ],
    isSporty: true,
  },
];
```

**Key Point:** Only the **first matching element** in the `hobbies` array was updated.

---

### Limitation of `$` Operator

**Problem:** `$` only updates the **first** matching array element per document.

**Example:**

```js
// User has multiple high-frequency hobbies
{
  name: "Alex",
  hobbies: [
    { title: "Sports", frequency: 5 },      // Matches
    { title: "Cooking", frequency: 4 }      // Also matches, but NOT updated
  ]
}
```

After update with `$`:

```js
{
  name: "Alex",
  hobbies: [
    { title: "Sports", frequency: 5, highFrequency: true },   // ✅ Updated
    { title: "Cooking", frequency: 4 }                        // ❌ Not updated
  ]
}
```

---

### Updating All Array Elements with `$[]`

**The `$[]` Operator (All Positional):**

**Purpose:** Updates **all** elements in an array, regardless of filter conditions.

**Syntax:**

```js
db.collection.updateMany(
  { filter },
  { $set: { "array.$[].field": value } } // $[] = all elements
);
```

---

### Understanding the Difference

| Operator        | Updates                        | Use Case                       |
| --------------- | ------------------------------ | ------------------------------ |
| `$`             | First matched array element    | Update specific matching item  |
| `$[]`           | All array elements             | Update every item in array     |
| `$[identifier]` | Elements matching arrayFilters | Update multiple matching items |

---

### Example: Decrement All Hobby Frequencies

**Scenario:** For users over 30, decrease frequency of all their hobbies by 1.

> **Input Data:** At this stage the `users` collection contains these two users with `totalAge` set (renamed from `age` using `$rename`):
>
> ```js
> // Manuel — totalAge: 35
> { name: "Manuel", totalAge: 35, hobbies: [{ title: "Cooking", frequency: 5 }, { title: "Cars", frequency: 2 }] }
>
> // Chris — totalAge: 31.9  (result of 29 * 1.1 from earlier $mul example)
> { name: "Chris",  totalAge: 31.9, hobbies: [{ title: "Sports", freq: 5 }, { title: "Cooking", freq: 3 }, { title: "Hiking", freq: 1 }] }
> ```

**Step 1: Find Users Over 30**

```js
db.users.find({ totalAge: { $gt: 30 } });
```

**Found:**

```js
[
  { name: "Manuel", totalAge: 35, hobbies: [...] },
  { name: "Chris", totalAge: 31.9, hobbies: [...] }
]
```

---

**Step 2: Update All Hobbies for These Users**

❌ **Wrong Approach** (treats hobbies as single field):

```js
db.users.updateMany(
  { totalAge: { $gt: 30 } },
  { $inc: { "hobbies.frequency": -1 } } // ERROR!
);
// Error: Cannot create field frequency in element hobbies
```

**Problem:** `hobbies` is an array, not a document.

---

✅ **Correct Approach** (update all array elements):

```js
db.users.updateMany(
  { totalAge: { $gt: 30 } },
  {
    $inc: {
      "hobbies.$[].frequency": -1, // $[] = all hobbies
    },
  }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 2,      // Found 2 users over 30
  modifiedCount: 2,     // Updated both users
  upsertedCount: 0
}
```

---

**Step 3: Verify Changes**

```js
db.users.find({ totalAge: { $gt: 30 } });
```

**Result:**

```js
[
  {
    _id: ObjectId("699d1a86704ebd0e15ed4431"),
    name: "Manuel",
    hobbies: [
      { title: "Cooking", frequency: 4 }, // Was 5, now 4 ✅
      { title: "Cars", frequency: 1 }, // Was 2, now 1 ✅
    ],
    isSporty: false,
    totalAge: 35,
  },
  {
    _id: ObjectId("699d1a86704ebd0e15ed4433"),
    name: "Chris",
    hobbies: [
      { title: "Sports", frequency: -1 }, // All frequencies
      { title: "Cooking", frequency: -1 }, // decremented ✅
      { title: "Hiking", frequency: -1 },
    ],
    isSporty: true,
    totalAge: 31.9,
  },
];
```

**What Happened:**

- Found users with `totalAge > 30` (Manuel and Chris)
- Decremented **all** hobby frequencies by 1
- Every element in the hobbies array was updated

---

### Key Differences Illustrated

**Original Data:**

```js
{
  name: "Alex",
  hobbies: [
    { title: "Sports", frequency: 5 },
    { title: "Cooking", frequency: 3 },
    { title: "Reading", frequency: 2 }
  ]
}
```

---

**Using `$` (First Match Only):**

```js
db.users.updateOne(
  { name: "Alex", "hobbies.frequency": { $gte: 3 } },
  { $set: { "hobbies.$.popular": true } }
);

// Result:
{
  hobbies: [
    { title: "Sports", frequency: 5, popular: true }, // ✅ Updated
    { title: "Cooking", frequency: 3 }, // ❌ Not updated
    { title: "Reading", frequency: 2 },
  ];
}
```

---

**Using `$[]` (All Elements):**

```js
db.users.updateOne({ name: "Alex" }, { $inc: { "hobbies.$[].frequency": 1 } });

// Result:
{
  hobbies: [
    { title: "Sports", frequency: 6 }, // ✅ Incremented
    { title: "Cooking", frequency: 4 }, // ✅ Incremented
    { title: "Reading", frequency: 3 }, // ✅ Incremented
  ];
}
```

---

### When to Use `$[]`

**Use Cases:**

✅ Apply bulk changes to all array elements

```js
// Add field to all items
db.products.updateOne(
  { _id: productId },
  { $set: { "reviews.$[].verified": false } }
);
```

✅ Increment/decrement all values

```js
// Increase all prices by 10%
db.products.updateMany({}, { $mul: { "prices.$[].amount": 1.1 } });
```

✅ Remove field from all array elements

```js
// Remove temporary flag from all comments
db.posts.updateMany({}, { $unset: { "comments.$[].tempFlag": "" } });
```

---

### Important Notes

**1. Works with Embedded Documents:**

```js
// Update nested field in all array elements
db.users.updateOne(
  { name: "Alex" },
  { $set: { "hobbies.$[].metadata.lastUpdated": new Date() } }
);
```

**2. Works with Simple Arrays:**

```js
// Array of primitives
{
  tags: ["mongodb", "database", "nosql"];
}

// Can't use dot notation after $[]
db.blogs.updateOne(
  { _id: blogId },
  { $set: { "tags.$[]": "updated" } } // Replaces all tags with "updated"
);
```

**3. Combine with Other Operators:**

```js
db.users.updateOne(
  { name: "Alex" },
  {
    $inc: { "hobbies.$[].frequency": 1 },
    $set: { lastModified: new Date() },
  }
);
```

---

### Updating Specific Array Elements with `arrayFilters`

**The `$[<identifier>]` Operator with `arrayFilters`:**

**Purpose:** Updates **multiple** array elements that match specific conditions (more flexible than `$` or `$[]`).

**Why Use It?**

| Limitation                       | Solution                                           |
| -------------------------------- | -------------------------------------------------- |
| `$` updates only **first** match | `$[identifier]` updates **all** matches            |
| `$[]` updates **all** elements   | `$[identifier]` updates only **filtered** elements |

**Syntax:**

```js
db.collection.updateMany(
  { documentFilter }, // Filter documents
  { $set: { "array.$[identifier].field": value } }, // Update matching array elements
  { arrayFilters: [{ "identifier.field": condition }] } // Filter array elements
);
```

---

### Complete Example

**Scenario:** Add `goodFrequency: true` to all hobbies with frequency > 2.

> **Input Data:** The `users` collection at this point (after all prior update ops + Maria was upserted):
>
> ```js
> db.users.insertMany([
>   {
>     name: "Maria",
>     hobbies: [{ title: "Cooking", frequency: 3 }],
>     isSporty: true,
>   },
>   {
>     name: "Anna",
>     hobbies: [
>       { title: "Sports", frequency: 5 },
>       { title: "Reading", frequency: 1 },
>     ],
>     isSporty: true,
>   },
>   {
>     name: "Max",
>     hobbies: [
>       { title: "Gaming", frequency: 4 },
>       { title: "Coding", frequency: 5 },
>     ],
>     isSporty: true,
>   },
> ]);
> ```

**Step 1: Find Users with High-Frequency Hobbies**

```js
db.users.find({ "hobbies.frequency": { $gt: 2 } });
```

**Found Users:**

```js
// Maria - has one hobby with freq > 2
{ name: "Maria", hobbies: [{ title: "Cooking", frequency: 3 }] }

// Anna - has hobbies with mixed frequencies
{ name: "Anna", hobbies: [
  { title: "Sports", frequency: 5 },    // ✅ > 2
  { title: "Reading", frequency: 1 }    // ❌ ≤ 2
]}

// Max - both hobbies qualify
{ name: "Max", hobbies: [
  { title: "Gaming", frequency: 4 },    // ✅ > 2
  { title: "Coding", frequency: 5 }     // ✅ > 2
]}
```

**Key Point:** Finding documents with `"hobbies.frequency": { $gt: 2 }` returns the **entire document**, not just matching hobbies.

---

**Step 2: Update Matching Array Elements**

```js
db.users.updateMany(
  { "hobbies.frequency": { $gt: 2 } }, // Document filter
  { $set: { "hobbies.$[el].goodFrequency": true } }, // Array update
  { arrayFilters: [{ "el.frequency": { $gt: 2 } }] } // Array element filter
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 3,      // Found 3 users
  modifiedCount: 3,     // Updated all 3
  upsertedCount: 0
}
```

---

**Step 3: Verify Changes**

```js
db.users.find();
```

**Result:**

```js
// Maria - goodFrequency added to qualifying hobby
{
  name: "Maria",
  hobbies: [{
    title: "Cooking",
    frequency: 3,
    goodFrequency: true    // ✅ Added (freq > 2)
  }]
}

// Anna - only high-frequency hobby updated
{
  name: "Anna",
  hobbies: [
    {
      title: "Sports",
      frequency: 5,
      goodFrequency: true    // ✅ Added (freq > 2)
    },
    {
      title: "Reading",
      frequency: 1           // ❌ Not updated (freq ≤ 2)
    }
  ]
}

// Max - both hobbies updated
{
  name: "Max",
  hobbies: [
    {
      title: "Gaming",
      frequency: 4,
      goodFrequency: true    // ✅ Added (freq > 2)
    },
    {
      title: "Coding",
      frequency: 5,
      goodFrequency: true    // ✅ Added (freq > 2)
    }
  ]
}
```

---

### Breaking Down the Syntax

**1. Document Filter (First Argument)**

```js
{ "hobbies.frequency": { $gt: 2 } }
```

- Finds **documents** where at least one hobby has frequency > 2
- Determines which documents to update

---

**2. Update Expression (Second Argument)**

```js
{ $set: { "hobbies.$[el].goodFrequency": true } }
```

- `$[el]` is a placeholder/identifier (you choose the name)
- Refers to array elements that match the `arrayFilters` condition
- `el` could be any name: `$[hobby]`, `$[item]`, `$[x]`, etc.

---

**3. Array Filters (Third Argument)**

```js
{
  arrayFilters: [{ "el.frequency": { $gt: 2 } }];
}
```

- Defines which array elements to update
- `"el"` must match the identifier used in update expression
- Can have multiple filters for different arrays

---

### Key Differences: Document Filter vs Array Filter

**Important:** These two filters are **independent**!

```js
db.users.updateMany(
  { totalAge: { $gt: 30 } }, // ← Document filter
  { $set: { "hobbies.$[el].goodFrequency": true } },
  { arrayFilters: [{ "el.frequency": { $gt: 2 } }] } // ← Array element filter
);
```

**What This Does:**

1. Find users older than 30 (document filter)
2. Within those users, update hobbies with frequency > 2 (array filter)
3. Filters don't need to match!

**Result:**

- Users under 30: Not touched at all
- Users over 30 with low-frequency hobbies: Document matched, but hobbies not updated
- Users over 30 with high-frequency hobbies: Both document and hobbies updated

---

### Multiple Array Filters

You can filter multiple arrays with different identifiers:

```js
db.posts.updateMany(
  { status: "published" },
  {
    $set: {
      "comments.$[comment].verified": true,
      "tags.$[tag].active": true,
    },
  },
  {
    arrayFilters: [
      { "comment.upvotes": { $gte: 10 } }, // Filter for comments
      { "tag.category": "tech" }, // Filter for tags
    ],
  }
);
```

---

### Comparison Table

| Operator        | Updates                   | Filtering           | Example Use Case                  |
| --------------- | ------------------------- | ------------------- | --------------------------------- |
| `$`             | First match per document  | Query filter only   | Update first expired session      |
| `$[]`           | All elements              | No filtering        | Add timestamp to all items        |
| `$[identifier]` | Multiple filtered matches | Custom arrayFilters | Update all items with price > 100 |

---

### Practical Examples

**Example 1: Update Product Ratings**

```js
// Verify all reviews with upvotes >= 5
db.products.updateMany(
  { category: "Electronics" },
  { $set: { "reviews.$[review].verified": true } },
  { arrayFilters: [{ "review.upvotes": { $gte: 5 } }] }
);
```

---

**Example 2: Apply Discount to Expensive Items**

```js
// Apply 10% discount to items over $50
db.orders.updateMany(
  { status: "pending" },
  { $mul: { "items.$[item].price": 0.9 } },
  { arrayFilters: [{ "item.price": { $gt: 50 } }] }
);
```

---

**Example 3: Multiple Conditions in Array Filter**

```js
// Update comments that are old AND popular
db.posts.updateMany(
  {},
  { $set: { "comments.$[c].featured": true } },
  {
    arrayFilters: [
      {
        "c.upvotes": { $gte: 10 },
        "c.createdAt": { $lt: new Date("2025-01-01") },
      },
    ],
  }
);
```

---

### Best Practices

**1. Choose Descriptive Identifiers**

```js
// ❌ Unclear
{
  arrayFilters: [{ "x.status": "active" }];
}

// ✅ Clear
{
  arrayFilters: [{ "employee.status": "active" }];
}
```

**2. Document Filters Should Be Broad**

```js
// Get all potentially relevant documents first
{
  category: "tech";
}
// Then filter array elements precisely
{
  arrayFilters: [{ "item.price": { $lt: 100 } }];
}
```

**3. Test Array Filters First**

```js
// Test your filter with a find query first
db.users.find({
  hobbies: {
    $elemMatch: { frequency: { $gt: 2 } },
  },
});

// Then apply in update
db.users.updateMany(
  {},
  { $set: { "hobbies.$[h].goodFrequency": true } },
  { arrayFilters: [{ "h.frequency": { $gt: 2 } }] }
);
```

> [⬆ Back to Index](#table-of-contents)

---

## Adding Elements to Arrays

### The `$push` Operator

**Purpose:** Adds one or more elements to an array field.

**Syntax:**

```js
// Single element
db.collection.updateOne({ filter }, { $push: { arrayField: value } });

// Multiple elements with modifiers
db.collection.updateOne(
  { filter },
  {
    $push: {
      arrayField: {
        $each: [value1, value2],
        $sort: { field: 1 },
        $slice: N,
        $position: N,
      },
    },
  }
);
```

---

### Simple Push (Single Element)

**Example: Add One Hobby**

**Before:**

```js
{
  name: "Maria",
  hobbies: [{ title: "Good food", freq: 3 }]
}
```

**Update:**

```js
db.users.updateOne(
  { name: "Maria" },
  { $push: { hobbies: { title: "Sports", frequency: 2 } } }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

**After:**

```js
{
  name: "Maria",
  hobbies: [
    { title: "Good food", freq: 3 },
    { title: "Sports", frequency: 2 }    // ✅ Added to end
  ]
}
```

**Key Points:**

- Element added to **end** of array
- Previous elements remain unchanged
- Can push any data type (strings, numbers, objects, arrays)

---

### Push Multiple Elements with `$each`

**`$each` Modifier:** Adds multiple elements at once.

**Example: Add Multiple Hobbies**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: {
        $each: [
          { title: "abc", frequency: 2 },
          { title: "xyz", frequency: 1 },
        ],
      },
    },
  }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

**Multiple elements added to array at once!**

---

### Push with Sorting - `$sort`

**`$sort` Modifier:** Sorts the array **after** pushing new elements.

**Why Use It?**

✅ User data comes in random order  
✅ You want consistent sorted arrays  
✅ Automatic sorting during insert

**Example: Add and Sort Hobbies**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: {
        $each: [
          { title: "abc", frequency: 2 },
          { title: "xyz", frequency: 1 },
        ],
        $sort: { frequency: -1 }, // Sort by frequency descending
      },
    },
  }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

**Verify:**

```js
db.users.find({ name: "Maria" });
```

**Result:**

```js
[
  {
    _id: ObjectId("699d2fcb1932bc8273d4a6bf"),
    name: "Maria",
    age: 29,
    hobbies: [
      { title: "Good food", freq: 3 }, // Highest first
      { title: "Sports", frequency: 2 }, // Then 2
      { title: "abc", frequency: 2 }, // Then 2
      { title: "xyz", frequency: 1 }, // Lowest last
    ],
    isSporty: true,
  },
];
```

**Key Points:**

- `$sort` sorts the **entire array**, not just new elements
- Existing elements are re-sorted too
- Use `1` for ascending, `-1` for descending
- Works with any field in array elements

**Important:** If you execute the same push again, the array stays sorted:

```js
// Running same command again
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: {
        $each: [
          { title: "abc", frequency: 2 },
          { title: "xyz", frequency: 1 },
        ],
        $sort: { frequency: -1 },
      },
    },
  }
);

// Array remains sorted even with duplicates
// freq: 3, 2, 2, 2, 2, 1, 1 (descending order maintained)
```

---

### Push with Limit - `$slice`

**`$slice` Modifier:** Limits array size **after** pushing (keeps first/last N elements).

**Syntax:**

```js
{
  $push: {
    array: {
      $each: [values],
      $sort: { field: 1 },      // Optional: sort first
      $slice: N                 // Then limit
    }
  }
}
```

**Slice Values:**

- **Positive N**: Keep first N elements
- **Negative N**: Keep last N elements
- **0**: Empty the array

---

**Example: Keep Top 3 Hobbies**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: {
        $each: [{ title: "Reading", frequency: 4 }],
        $sort: { frequency: -1 }, // Sort highest first
        $slice: 3, // Keep only top 3
      },
    },
  }
);
```

**Result:**

```js
{
  hobbies: [
    { title: "Reading", frequency: 4 }, // Highest
    { title: "Good food", frequency: 3 }, // Second
    { title: "Sports", frequency: 2 }, // Third
    // Others removed to keep only 3
  ];
}
```

**Use Cases:**

- Leaderboards (keep top 10 scores)
- Recent activity feeds (keep last 20 items)
- Limited history (keep last 5 logins)
- Top performers (keep top 3 products)

---

### Push with Position - `$position`

**`$position` Modifier:** Inserts elements at specific index.

**Syntax:**

```js
{
  $push: {
    array: {
      $each: [values],
      $position: index    // 0-based
    }
  }
}
```

**Example: Insert at Beginning**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: {
        $each: [{ title: "Priority", frequency: 5 }],
        $position: 0, // Insert at start
      },
    },
  }
);

// Result: New hobby is first in array
```

---

### Combining Push Modifiers

**Example: Complex Push Operation**

```js
db.products.updateOne(
  { _id: productId },
  {
    $push: {
      reviews: {
        $each: [
          { user: "Alice", rating: 5, text: "Great!" },
          { user: "Bob", rating: 4, text: "Good" },
        ],
        $sort: { rating: -1 }, // Sort by rating (highest first)
        $slice: 10, // Keep only top 10 reviews
        $position: 0, // Insert at beginning
      },
    },
  }
);
```

**Execution Order:**

1. Insert new elements at position
2. Sort the array
3. Slice to limit size

---

### Push Modifiers Summary

| Modifier    | Purpose                | Example                      | Use Case                        |
| ----------- | ---------------------- | ---------------------------- | ------------------------------- |
| `$each`     | Push multiple elements | `$each: [1, 2, 3]`           | Bulk additions                  |
| `$sort`     | Sort after push        | `$sort: { date: -1 }`        | Keep sorted order               |
| `$slice`    | Limit array size       | `$slice: 10` or `$slice: -5` | Top N, Recent N                 |
| `$position` | Insert at index        | `$position: 0`               | Prepend/Insert at specific spot |

**Best Practices:**

1. Use `$each` even for single element (consistency)
2. Always `$sort` before `$slice` for predictable results
3. Combine modifiers for powerful array management
4. Consider performance with large arrays

> [⬆ Back to Index](#table-of-contents)

---

## Removing Elements from Arrays

### The `$pull` Operator

**Purpose:** Removes **all** array elements that match a condition.

**Syntax:**

```js
db.collection.updateOne(
  { documentFilter },
  { $pull: { arrayField: condition } }
);
```

**Key Points:**

- Removes **all matching** elements (not just first)
- Can use full query operators in condition
- If no elements match, no error occurs

---

### Simple Pull (Exact Match)

**Example: Remove Hobby by Title**

**Before:**

```js
{
  name: "Maria",
  hobbies: [
    { title: "Hiking", frequency: 2 },
    { title: "Good Wine", frequency: 1 },
    { title: "Good food", frequency: 3 }
  ]
}
```

**Update:**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $pull: {
      hobbies: {
        title: "Good food", // Remove by exact match
      },
    },
  }
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

**After:**

```js
{
  name: "Maria",
  hobbies: [
    { title: "Hiking", frequency: 2 },
    { title: "Good Wine", frequency: 1 }
    // "Good food" removed ✅
  ]
}
```

---

### Pull with Query Operators

**Example: Remove All Low-Frequency Hobbies**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $pull: {
      hobbies: {
        frequency: { $lte: 1 }, // Remove if frequency ≤ 1
      },
    },
  }
);
```

**Result:**

Removes all hobbies with frequency 1 or less.

---

### Pull vs Filter

| Feature          | `$pull`        | `$filter` (aggregation)     |
| ---------------- | -------------- | --------------------------- |
| Updates database | ✅ Yes         | ❌ No (read-only)           |
| Removes elements | ✅ Permanently | ❌ Just hides in result     |
| Use case         | Modify data    | Query/display filtered data |

---

### The `$pop` Operator

**Purpose:** Removes **first** or **last** element from an array.

**Syntax:**

```js
db.collection.updateOne({ filter }, { $pop: { arrayField: value } });
```

**Pop Values:**

- `1` - Remove **last** element (end of array)
- `-1` - Remove **first** element (start of array)

---

**Example: Remove Last Hobby**

**Before:**

```js
{
  name: "Chris",
  hobbies: [
    { title: "Sports", freq: 5 },
    { title: "Cooking", freq: 3 },
    { title: "Hiking", freq: 0 }    // Last element
  ]
}
```

**Update:**

```js
db.users.updateOne(
  { name: "Chris" },
  { $pop: { hobbies: 1 } } // 1 = remove last
);
```

**Result:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

**After:**

```js
{
  name: "Chris",
  hobbies: [
    { title: "Sports", freq: 5 },
    { title: "Cooking", freq: 3 }
    // Hiking removed ✅
  ]
}
```

---

**Example: Remove First Hobby**

```js
db.users.updateOne(
  { name: "Chris" },
  { $pop: { hobbies: -1 } } // -1 = remove first
);

// Result: "Sports" would be removed
```

---

### When to Use Each Operator

| Operator | Use When            | Example                         |
| -------- | ------------------- | ------------------------------- |
| `$pull`  | Remove by condition | Remove all items with low stock |
| `$pop`   | Remove first/last   | Remove oldest/newest item       |
| `$unset` | Remove entire array | Delete whole field              |

---

### Comparison: Pull vs Pop

**`$pull` - Condition-Based Removal**

```js
// Remove all hobbies with low frequency
db.users.updateOne(
  { name: "Maria" },
  { $pull: { hobbies: { frequency: { $lt: 2 } } } }
);
// Removes: All matching elements (could be 0, 1, or many)
```

**`$pop` - Position-Based Removal**

```js
// Remove last hobby (whatever it is)
db.users.updateOne({ name: "Maria" }, { $pop: { hobbies: 1 } });
// Removes: Exactly one element (last one)
```

---

### Practical Examples

**Example 1: Queue Behavior (FIFO)**

```js
// Add to end
db.queues.updateOne({ name: "tasks" }, { $push: { items: newTask } });

// Remove from beginning
db.queues.updateOne({ name: "tasks" }, { $pop: { items: -1 } });
```

---

**Example 2: Stack Behavior (LIFO)**

```js
// Add to end
db.stacks.updateOne({ name: "history" }, { $push: { actions: newAction } });

// Remove from end
db.stacks.updateOne({ name: "history" }, { $pop: { actions: 1 } });
```

---

**Example 3: Remove Expired Items**

```js
// Remove all sessions older than 30 days
db.users.updateMany(
  {},
  {
    $pull: {
      sessions: {
        createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    },
  }
);
```

---

**Example 4: Maintain Top 5 Scores**

```js
// Add new score and keep only top 5
db.players.updateOne(
  { playerId: "player123" },
  {
    $push: {
      scores: {
        $each: [newScore],
        $sort: { points: -1 },
        $slice: 5, // Keep top 5
      },
    },
  }
);
```

> [⬆ Back to Index](#table-of-contents)

---

## The `$addToSet` Operator

### Overview

**Purpose:** Adds elements to an array **only if they don't already exist** (ensures uniqueness).

**Key Difference from `$push`:**

| Operator    | Duplicates Allowed? | Use Case                           |
| ----------- | ------------------- | ---------------------------------- |
| `$push`     | ✅ Yes              | Add all elements (even duplicates) |
| `$addToSet` | ❌ No               | Add only unique elements           |

**Syntax:**

```js
db.collection.updateOne({ filter }, { $addToSet: { arrayField: value } });
```

---

### Basic Usage

> **Input Data:** Maria was created via upsert in an earlier step. At the start of the `$addToSet` examples her `hobbies` array looks like this (after prior `$push` and `$pull` operations reduced it back):
>
> ```js
> // Maria's document before $addToSet examples:
> {
>   name: "Maria",
>   age: 29,
>   hobbies: [
>     { title: "Hiking",    frequency: 2 },
>     { title: "Good Wine", frequency: 1 }
>   ],
>   isSporty: true
> }
> ```

**Example: Add Single Element**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $addToSet: {
      hobbies: { title: "Hiking", frequency: 2 },
    },
  }
);
```

**First Execution:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,     // ✅ Element added
  upsertedCount: 0
}
```

**Second Execution (same command):**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 0,     // ❌ No change - already exists
  upsertedCount: 0
}
```

**Key Point:** `modifiedCount: 0` means the element already existed, so nothing was added.

---

### Comparison: `$push` vs `$addToSet`

**Using `$push`:**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: { title: "Hiking", frequency: 2 },
    },
  }
);
// Run again...
// Run again...

// Result:
{
  hobbies: [
    { title: "Hiking", frequency: 2 },
    { title: "Hiking", frequency: 2 }, // Duplicate ✅
    { title: "Hiking", frequency: 2 }, // Duplicate ✅
  ];
}
```

**Using `$addToSet`:**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $addToSet: {
      hobbies: { title: "Hiking", frequency: 2 },
    },
  }
);
// Run again...
// Run again...

// Result:
{
  hobbies: [
    { title: "Hiking", frequency: 2 }, // Only one ✅
  ];
}
```

---

### Using `$addToSet` with `$each`

**Add Multiple Unique Elements:**

```js
db.users.updateOne(
  { name: "Maria" },
  {
    $addToSet: {
      hobbies: {
        $each: [
          { title: "abc", frequency: 2 },
          { title: "xyz", frequency: 1 },
        ],
      },
    },
  }
);
```

**First Execution:**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,     // ✅ Both elements added
  upsertedCount: 0
}
```

**Second Execution (same command):**

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 0,     // ❌ No duplicates added
  upsertedCount: 0
}
```

---

### How Uniqueness is Determined

**For Primitive Values:**

```js
// Tags array
db.posts.updateOne({ _id: postId }, { $addToSet: { tags: "mongodb" } });

// "mongodb" compared as string
// Exact match = duplicate
```

**For Objects:**

```js
// Two objects are equal if ALL fields match
{ title: "Hiking", frequency: 2 }
===
{ title: "Hiking", frequency: 2 }    // ✅ Duplicate

≠

{ title: "Hiking", frequency: 3 }    // ❌ Not duplicate (different frequency)
```

**Important:** Object comparison is **exact** - field order matters in some cases.

---

### Practical Use Cases

**1. User Tags/Categories**

```js
db.articles.updateOne(
  { _id: articleId },
  { $addToSet: { tags: "javascript" } }
);
// Prevents duplicate tags
```

**2. Followers/Following**

```js
db.users.updateOne({ username: "alice" }, { $addToSet: { followers: "bob" } });
// Bob can't follow Alice twice
```

**3. Viewed Items**

```js
db.users.updateOne(
  { userId: "user123" },
  { $addToSet: { viewedProducts: productId } }
);
// Track unique views only
```

**4. Permissions/Roles**

```js
db.users.updateOne(
  { email: "admin@example.com" },
  { $addToSet: { roles: "moderator" } }
);
// Can't assign same role twice
```

---

### Limitations

**1. Cannot Use with Sort/Slice:**

```js
// ❌ INVALID - $addToSet doesn't support $sort or $slice
db.users.updateOne(
  { name: "Maria" },
  {
    $addToSet: {
      hobbies: {
        $each: [{ title: "abc", frequency: 2 }],
        $sort: { frequency: -1 }, // ❌ Error!
      },
    },
  }
);
```

**Solution:** Use `$push` with `$sort` if you need sorting.

---

**2. Performance with Large Arrays:**

- MongoDB must scan entire array to check for duplicates
- Consider using a separate collection for large sets

---

### Best Practices

**✅ Use `$addToSet` when:**

- Uniqueness is required (tags, followers, categories)
- Duplicate prevention is critical
- Array size is manageable (< 1000 elements)

**✅ Use `$push` when:**

- Duplicates are allowed (activity logs, history)
- You need modifiers like `$sort`, `$slice`, `$position`
- Performance is critical with large arrays

---

### Decision Tree

```
Need to add to array?
  |
  ├─ Need uniqueness?
  |   |
  |   ├─ Yes → Use $addToSet
  |   └─ No → Use $push
  |
  ├─ Need sorting/limiting?
  │   └─ Use $push with $sort/$slice
  |
  └─ Array > 1000 elements?
      └─ Consider separate collection
```

---

### $addToSet — Summary

| Feature                | `$addToSet` | `$push`         |
| ---------------------- | ----------- | --------------- |
| Adds duplicates        | ❌ No       | ✅ Yes          |
| Works with `$each`     | ✅ Yes      | ✅ Yes          |
| Works with `$sort`     | ❌ No       | ✅ Yes          |
| Works with `$slice`    | ❌ No       | ✅ Yes          |
| Works with `$position` | ❌ No       | ✅ Yes          |
| Use case               | Unique sets | Lists/sequences |

> [⬆ Back to Index](#table-of-contents)

---

## Update Operations Module Summary

### Key Concepts Covered

**1. Update Methods**

| Method              | Purpose                   | Updates                    |
| ------------------- | ------------------------- | -------------------------- |
| `updateOne()`       | Update single document    | First match only           |
| `updateMany()`      | Update multiple documents | All matches                |
| `replaceOne()`      | Replace entire document   | Keeps only `_id`           |
| `update()` (legacy) | Old update method         | Use updateOne/Many instead |

---

**2. Method Structure**

```js
db.collection.updateOne(
  { filter }, // 1st argument: Query selector (which documents?)
  { update }, // 2nd argument: Update operators (what changes?)
  { options } // 3rd argument: Options (upsert, arrayFilters, etc.)
);
```

**Arguments:**

1. **Filter (Query Selector):** Same syntax as `find()` - use any query operators
2. **Update Operators:** `$set`, `$inc`, `$min`, `$max`, etc.
3. **Options:** `upsert`, `arrayFilters`, `writeConcern`, etc.

---

### Update Operators Reference

**Field Update Operators:**

| Operator  | Purpose                    | Example                          |
| --------- | -------------------------- | -------------------------------- |
| `$set`    | Set field value            | `{ $set: { age: 30 } }`          |
| `$inc`    | Increment/decrement        | `{ $inc: { age: 1 } }`           |
| `$min`    | Update if value is smaller | `{ $min: { age: 18 } }`          |
| `$max`    | Update if value is larger  | `{ $max: { score: 100 } }`       |
| `$mul`    | Multiply field value       | `{ $mul: { price: 1.1 } }`       |
| `$unset`  | Remove field               | `{ $unset: { deprecated: "" } }` |
| `$rename` | Rename field               | `{ $rename: { old: "new" } }`    |

---

**Array Positional Operators:**

| Operator          | Updates                | Requires              |
| ----------------- | ---------------------- | --------------------- |
| `$`               | First matching element | Array field in query  |
| `$[]`             | All elements           | Nothing               |
| `$[<identifier>]` | Filtered elements      | `arrayFilters` option |

**Example:**

```js
// Update first match
db.users.updateOne(
  { "hobbies.title": "Sports" },
  { $set: { "hobbies.$.frequency": 5 } }
);

// Update all elements
db.users.updateOne({ name: "Maria" }, { $inc: { "hobbies.$[].frequency": 1 } });

// Update filtered elements
db.users.updateOne(
  { name: "Maria" },
  { $set: { "hobbies.$[el].goodFrequency": true } },
  { arrayFilters: [{ "el.frequency": { $gt: 2 } }] }
);
```

---

**Array Manipulation Operators:**

| Operator    | Purpose                  | Modifiers                               |
| ----------- | ------------------------ | --------------------------------------- |
| `$push`     | Add elements             | `$each`, `$sort`, `$slice`, `$position` |
| `$pull`     | Remove matching elements | Supports query operators                |
| `$pop`      | Remove first/last        | `1` (last), `-1` (first)                |
| `$addToSet` | Add unique elements      | `$each` only                            |

**Example:**

```js
// Push with sorting and limiting
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: {
        $each: [{ title: "Reading", frequency: 4 }],
        $sort: { frequency: -1 },
        $slice: 5,
      },
    },
  }
);

// Pull by condition
db.users.updateOne(
  { name: "Maria" },
  { $pull: { hobbies: { frequency: { $lt: 2 } } } }
);

// Pop last element
db.users.updateOne({ name: "Chris" }, { $pop: { hobbies: 1 } });

// Add unique values
db.users.updateOne({ name: "Maria" }, { $addToSet: { tags: "featured" } });
```

---

### Important Options

**1. Upsert:**

```js
db.users.updateOne(
  { username: "alice" },
  { $set: { lastLogin: new Date() } },
  { upsert: true } // Insert if not found
);
```

**2. arrayFilters:**

```js
db.users.updateMany(
  {},
  { $set: { "hobbies.$[hobby].active": true } },
  { arrayFilters: [{ "hobby.frequency": { $gte: 3 } }] }
);
```

---

### Document Replacement

**Alternative to Updates:**

```js
// Replace entire document (keeps _id only)
db.users.replaceOne(
  { name: "Maria" },
  {
    name: "Maria",
    age: 30,
    hobbies: [],
    active: true,
    // All other fields removed
  }
);
```

**Use Case:** When you need to completely redefine a document structure.

---

### Best Practices Summary

**✅ DO:**

- Use `updateOne()` when updating single documents
- Use `updateMany()` for bulk updates
- Leverage positional operators (`$`, `$[]`, `$[identifier]`) for arrays
- Use `arrayFilters` for complex array element updates
- Combine `$push` with modifiers for powerful array management
- Use `$addToSet` to prevent duplicates
- Use `upsert` for "update or insert" patterns

**❌ DON'T:**

- Use legacy `update()` method (deprecated)
- Forget to test filters before bulk updates
- Overuse `replaceOne()` when field updates suffice
- Use `$addToSet` with `$sort`/`$slice` (not supported)

---

### Quick Reference Decision Tree

```
Need to modify documents?
  |
  ├─ Replace entire document?
  │   └─ Use replaceOne()
  |
  ├─ Update fields?
  │   |
  │   ├─ One document → updateOne()
  │   └─ Multiple → updateMany()
  |
  ├─ Working with arrays?
  │   |
  │   ├─ Add elements?
  │   │   ├─ Unique? → $addToSet
  │   │   └─ Any? → $push (with modifiers)
  │   |
  │   ├─ Remove elements?
  │   │   ├─ By condition? → $pull
  │   │   └─ First/last? → $pop
  │   |
  │   └─ Update elements?
  │       ├─ First match → $ (positional)
  │       ├─ All elements → $[]
  │       └─ Filtered → $[identifier] + arrayFilters
  |
  └─ Document might not exist?
      └─ Add { upsert: true }
```

> [⬆ Back to Index](#table-of-contents)

---

## Delete Operations Deep Dive

### Overview

MongoDB provides several methods to delete documents and collections:

| Method           | Scope              | Deletes                      |
| ---------------- | ------------------ | ---------------------------- |
| `deleteOne()`    | Single document    | First matching document      |
| `deleteMany()`   | Multiple documents | All matching documents       |
| `drop()`         | Entire collection  | Collection and all documents |
| `dropDatabase()` | Entire database    | Database and all collections |

---

### `deleteOne()` Method

**Purpose:** Deletes the **first** document that matches the filter.

**Syntax:**

```js
db.collection.deleteOne(
  { filter }, // Required: Query selector
  { writeConcern } // Optional: Write concern settings
);
```

**Key Points:**

- Deletes **only one** document (first match based on natural order)
- If multiple documents match, only the first is deleted
- Returns `deletedCount` (0 or 1)
- Filter syntax same as `find()` - use any query operators

---

> **Input Data:** The `users` collection at the start of the Delete Operations section (after all prior update examples). This matches the state used throughout all delete examples below:
>
> ```js
> db.users.insertMany([
>   {
>     name: "Max",
>     isSporty: true,
>     // phone was removed by $unset, age was renamed to totalAge but then removed by Chris's $mul
>   },
>   {
>     name: "Manuel",
>     isSporty: false,
>     totalAge: 35,
>   },
>   {
>     name: "Anna",
>     isSporty: true,
>     totalAge: null, // field EXISTS with null value (important for $exists example)
>   },
>   {
>     name: "Chris",
>     isSporty: true,
>     totalAge: 31.9,
>   },
>   {
>     name: "Maria",
>     age: 29,
>     hobbies: [{ title: "Good food", freq: 3 }],
>     isSporty: true,
>     // Maria was created by upsert — note she has 'age', not 'totalAge'
>   },
> ]);
> ```

**Example: Delete Single User**

```js
db.users.deleteOne({ name: "Maria" });
```

**Result:**

```js
{
  acknowledged: true,
  deletedCount: 1        // ✅ One document deleted
}
```

**Verify:**

```js
db.users.find();
// Maria is gone, others remain (Chris, Anna, Manuel, Max)
```

---

**Example: Delete by Multiple Conditions**

```js
db.users.deleteOne({
  age: { $gte: 30 },
  name: "Chris",
  "hobbies.title": "Sports",
});
```

**Behavior:**

- All conditions must match (AND logic)
- Only first matching document deleted
- If no match, `deletedCount: 0` (no error)

---

### `deleteMany()` Method

**Purpose:** Deletes **all** documents that match the filter.

**Syntax:**

```js
db.collection.deleteMany(
  { filter }, // Required: Query selector
  { writeConcern } // Optional: Write concern settings
);
```

**Key Difference from `deleteOne()`:**

| Aspect              | `deleteOne()`         | `deleteMany()` |
| ------------------- | --------------------- | -------------- |
| Matches 1 document  | Deletes 1             | Deletes 1      |
| Matches 5 documents | Deletes 1 (first)     | Deletes all 5  |
| Use case            | Single record removal | Bulk deletion  |

---

**Example: Delete by Single Condition**

```js
db.users.deleteMany({ totalAge: { $gt: 30 }, isSporty: true });
```

**Result:**

```js
{
  acknowledged: true,
  deletedCount: 1        // Deleted all matching (could be 0, 1, or many)
}
```

---

**Example: Delete by Field Existence**

**Scenario:** Delete all sporty users who don't have a `totalAge` field.

```js
db.users.deleteMany({
  totalAge: { $exists: false },
  isSporty: true,
});
```

**Result:**

```js
{
  acknowledged: true,
  deletedCount: 2        // Max and Maria deleted
}
```

**Why Some Documents Survived:**

```js
// Anna - Still exists
{
  name: "Anna",
  isSporty: true,
  totalAge: null         // ❌ Field EXISTS (but is null)
}
// $exists: false requires field to be ABSENT, not just null

// Manuel - Still exists
{
  name: "Manuel",
  isSporty: false,       // ❌ Not sporty
  totalAge: 35
}
```

**Important:** `null` value ≠ field doesn't exist!

---

**Example: Delete All Documents**

```js
db.users.deleteMany({}); // Empty filter = match all
```

**Result:**

```js
{
  acknowledged: true,
  deletedCount: 2        // All documents deleted
}

db.users.find()          // Empty result []
// Collection still exists (just empty)
```

---

### `drop()` Method

**Purpose:** Removes an **entire collection** (including all documents and indexes).

**Syntax:**

```js
db.collection.drop();
```

**Difference from `deleteMany({})`:**

| Action             | `deleteMany({})` | `drop()` |
| ------------------ | ---------------- | -------- |
| Deletes documents  | ✅ Yes           | ✅ Yes   |
| Deletes indexes    | ❌ No            | ✅ Yes   |
| Removes collection | ❌ No            | ✅ Yes   |
| Speed              | Slower           | Faster   |
| Can undo           | ❌ No            | ❌ No    |

---

**Example: Drop Collection**

```js
db.users.drop();
```

**Result:**

```js
true; // ✅ Collection dropped successfully
```

**Verify:**

```js
db.users.find()
// Error or empty - collection no longer exists

show collections
// "users" not in list
```

---

### `dropDatabase()` Method

**Purpose:** Removes the **entire current database** and all its collections.

**Syntax:**

```js
db.dropDatabase();
```

⚠️ **DANGER:** This is irreversible and deletes EVERYTHING in the database!

---

**Example: Drop Database**

```js
db.dropDatabase();
```

**Result:**

```js
{
  ok: 1,
  dropped: 'users'       // Database name that was dropped
}
```

**Verify:**

```js
show dbs
// Database no longer in list
```

---

### Return Values

**`deleteOne()` / `deleteMany()` Return:**

```js
{
  acknowledged: true,     // Write operation acknowledged
  deletedCount: 2         // Number of documents deleted
}
```

**Common `deletedCount` Values:**

- `0` - No documents matched filter
- `1` - One document deleted (`deleteOne` or `deleteMany` with one match)
- `N` - N documents deleted (`deleteMany` only)

---

**`drop()` Return:**

```js
true; // Collection dropped
false; // Collection doesn't exist (no error)
```

---

**`dropDatabase()` Return:**

```js
{
  ok: 1,                  // Success
  dropped: 'dbName'       // Database that was dropped
}
```

---

### Write Concern (Optional)

**Purpose:** Control acknowledgment level for delete operations.

**Example:**

```js
db.users.deleteOne(
  { name: "Chris" },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
);
```

**Parameters:**

- `w`: Number of servers that must acknowledge
  - `1` - Primary only (default)
  - `"majority"` - Majority of replica set
  - `N` - N servers
- `wtimeout`: Maximum wait time (milliseconds)

---

### Filters and Query Operators

**Delete operations use the same filter syntax as `find()`:**

```js
// Comparison operators
db.products.deleteMany({ price: { $lt: 10 } });

// Logical operators
db.users.deleteMany({
  $or: [{ age: { $lt: 18 } }, { status: "inactive" }],
});

// Array operators
db.posts.deleteMany({ tags: { $in: ["spam", "deleted"] } });

// Field existence
db.users.deleteMany({ email: { $exists: false } });

// Regular expressions
db.users.deleteMany({ name: /^test/i });
```

---

### Best Practices

**✅ DO:**

1. **Always test filters first:**

```js
// Test with find() before deleting
db.users.find({ totalAge: { $gt: 30 } });
// Verify results, then:
db.users.deleteMany({ totalAge: { $gt: 30 } });
```

2. **Use `deleteOne()` when expecting single match:**

```js
db.users.deleteOne({ _id: ObjectId("...") }); // ✅ Safer
```

3. **Check `deletedCount` after deletion:**

```js
const result = db.users.deleteMany({ status: "inactive" });
if (result.deletedCount === 0) {
  print("No inactive users found");
}
```

4. **Use `drop()` for full collection removal:**

```js
// Instead of:
db.tempData.deleteMany({}); // ❌ Slower, leaves indexes

// Use:
db.tempData.drop(); // ✅ Faster, complete cleanup
```

---

**❌ DON'T:**

1. **Don't use empty filter accidentally:**

```js
db.users.deleteMany({}); // ⚠️ Deletes ALL documents!
```

2. **Don't forget field names can be typos:**

```js
// Intended: delete users with age > 30
db.users.deleteMany({ totalAge: { $gt: 30 } }); // ✅ Correct

db.users.deleteMany({ age: { $gt: 30 } }); // ❌ Wrong field!
// deletedCount: 0 (no error, just no matches)
```

3. **Don't confuse `null` with non-existence:**

```js
// Different behaviors:
db.users.deleteMany({ field: null }); // Matches null OR missing
db.users.deleteMany({ field: { $exists: false } }); // Only missing
```

---

### Practical Examples

**Example 1: Cleanup Old Records**

```js
// Delete logs older than 30 days
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const result = db.logs.deleteMany({
  createdAt: { $lt: thirtyDaysAgo },
});

print(`Deleted ${result.deletedCount} old log entries`);
```

---

**Example 2: Delete User and Related Data**

```js
// Delete user by email
const userEmail = "user@example.com";

db.users.deleteOne({ email: userEmail });
db.posts.deleteMany({ author: userEmail });
db.comments.deleteMany({ author: userEmail });
```

---

**Example 3: Delete Duplicates (Keep First)**

```js
// Find duplicate emails
db.users
  .aggregate([
    { $group: { _id: "$email", ids: { $push: "$_id" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ])
  .forEach((doc) => {
    // Keep first, delete rest
    doc.ids.shift(); // Remove first ID from array
    db.users.deleteMany({ _id: { $in: doc.ids } });
  });
```

---

**Example 4: Conditional Collection Drop**

```js
// Drop collection if empty
if (db.tempData.countDocuments() === 0) {
  db.tempData.drop();
  print("Dropped empty collection");
}
```

---

### Decision Tree

```
Need to delete?
  |
  ├─ Entire database?
  │   └─ db.dropDatabase() ⚠️ IRREVERSIBLE
  |
  ├─ Entire collection?
  │   ├─ Keep structure? → deleteMany({})
  │   └─ Complete removal? → drop()
  |
  ├─ Multiple documents?
  │   └─ deleteMany({ filter })
  |
  └─ Single document?
      └─ deleteOne({ filter })
```

---

### Delete Operations — Summary

| Method           | Deletes         | Returns        | Speed     | Indexes | Collection |
| ---------------- | --------------- | -------------- | --------- | ------- | ---------- |
| `deleteOne()`    | 1 document      | `deletedCount` | Fast      | Kept    | Kept       |
| `deleteMany()`   | N documents     | `deletedCount` | Medium    | Kept    | Kept       |
| `drop()`         | All documents   | `true/false`   | Very Fast | Removed | Removed    |
| `dropDatabase()` | All collections | `{ok:1}`       | Very Fast | Removed | Removed    |

**Key Takeaways:**

- Use `find()` to test filters before deleting
- `deleteOne()` stops after first match
- `deleteMany()` deletes all matches
- `drop()` is faster than `deleteMany({})` for clearing collections
- All delete operations are **irreversible** - no undo!
- `deletedCount: 0` is not an error - just no matches

> [⬆ Back to Index](#table-of-contents)

---

## Indexes

Indexes allow MongoDB to retrieve data efficiently without scanning every document in a collection.

---

### Why Indexes?

**What is an Index?**

An index is an **additional data structure** maintained alongside a collection. It stores selected field values in **sorted order** together with **pointers** to the original documents.

| Without Index                                                | With Index                                                  |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| **Collection Scan (COLLSCAN)** — every document is inspected | **Index Scan (IXSCAN)** — jumps directly to matching values |
| Slow on large collections                                    | Fast for selective queries                                  |
| No extra disk or write cost                                  | Extra disk space + write overhead per index                 |

**When Indexes Help**

- Queries returning a **small subset** of documents (selective queries)
- Fields frequently used in `find`, `update`, or `delete` filters
- `sort()` operations on large result sets

**Costs of Indexes**

- Extra **disk space** per index
- **Write slowdown** — every `insert`, `update`, and `delete` must also update all indexes on the collection
- Too many indexes can hurt write performance more than they help read performance

> **Rule of Thumb:** Index fields used in frequent, selective queries. Don't index everything.

```mermaid
flowchart LR
    subgraph NO_IDX ["Without Index (COLLSCAN)"]
        direction TB
        Q1["find({ age: { $gt: 30 } })"] --> S1
        S1["Scan doc 1"] --> S2["Scan doc 2"] --> S3["Scan doc 3"] --> SN["... scan all 5000 docs"]
        style SN fill:#f8d7da,color:#000
    end

    subgraph WITH_IDX ["With Index (IXSCAN)"]
        direction TB
        Q2["find({ age: { $gt: 30 } })"] --> IDX
        IDX["Index on 'age'<br/>(sorted B-tree)"]
        IDX -->|"jump to age > 30"| MATCH["Return only matching docs"]
        style IDX fill:#fff3cd,color:#000
        style MATCH fill:#d4edda,color:#000
    end

    style NO_IDX fill:#f8d7da,color:#000
    style WITH_IDX fill:#d4edda,color:#000
```

### Adding a Single Field Index

**Goal:** Create an index on a single field and measure performance before and after.

Use `explain("executionStats")` to analyze how MongoDB executes a query. Key metrics:

| Metric                | Meaning                                           |
| --------------------- | ------------------------------------------------- |
| `stage`               | `COLLSCAN` = no index used, `IXSCAN` = index used |
| `executionTimeMillis` | Total query time in ms                            |
| `totalDocsExamined`   | How many documents MongoDB had to read            |
| `totalKeysExamined`   | How many index entries were scanned               |
| `nReturned`           | How many documents were actually returned         |

---

> **Input Data:** The `contacts` collection is created by importing `persons.json` (5000 documents) using `mongoimport`:
>
> ```bash
> mongoimport persons.json -d contactData -c contacts --jsonArray --drop
> ```
>
> Each document has this shape:
>
> ```js
> {
>   gender: "male",
>   name: { title: "mr", first: "Leon", last: "Curtis" },
>   location: { street: "4656 Park Road", city: "Bradford", ... },
>   email: "leon.curtis@example.com",
>   dob: { date: "1952-08-14", age: 65 },   // ← queried field
>   phone: "016977 8806",
>   nat: "GB"
> }
> ```
>
> After importing:
>
> ```js
> use contactData
> db.contacts.countDocuments()  // 5000 documents
> ```

**Step 1 — Run the query WITHOUT an index**

```js
// No index exists yet — MongoDB must scan every document in the collection
db.contacts.explain("executionStats").find({ "dob.age": { $gt: 60 } });
```

```js
// Result: 5000 docs examined to return just 1222 — completely wasteful
"executionStats": {
  "nReturned": 1222,
  "executionTimeMillis": 8,
  "totalKeysExamined": 0,     // no index used
  "totalDocsExamined": 5000,  // entire collection scanned
  "executionStages": {
    "stage": "COLLSCAN"       // full collection scan
  }
}
```

---

**Step 2 — Create a single-field index on `dob.age`**

```js
// 1 = ascending order, -1 = descending
// MongoDB can traverse the index in either direction, so the choice rarely matters for range queries
db.contacts.createIndex({ "dob.age": 1 });
// Returns: "dob.age_1"  ← MongoDB auto-generates the index name
```

---

**Step 3 — Same query AFTER creating the index**

```js
db.contacts.explain("executionStats").find({ "dob.age": { $gt: 60 } });
```

```js
// Result: Only 1222 keys examined — exactly matching what was returned. 8× faster.
"executionStats": {
  "nReturned": 1222,
  "executionTimeMillis": 1,   // 8ms → 1ms
  "totalKeysExamined": 1222,  // only keys matching the filter
  "totalDocsExamined": 1222,  // only the relevant docs fetched
  "executionStages": {
    "stage": "FETCH",         // retrieves full documents from collection...
    "inputStage": {
      "stage": "IXSCAN",      // ...guided by the index scan
      "indexName": "dob.age_1",
      "indexBounds": {
        "dob.age": ["(60, inf.0]"]  // only values > 60 were visited
      }
    }
  }
}
```

> **Before index:** 5000 docs examined → 1222 returned (wasteful).
> **After index:** 1222 docs examined → 1222 returned (zero wasted reads).

---

#### _How `createIndex()` Works Internally_

The index is a **sorted list** of field values with pointers back to the original documents. MongoDB only stores the indexed value + a reference, not the full document.

```
Index on "dob.age" (ascending):
  (29,  → pointer to document a1)
  (30,  → pointer to document a2)
  (33,  → pointer to document a3)
  ...
```

- Collection documents are stored in **insertion order** (unsorted)
- The index is always **sorted** — MongoDB can binary-search it and skip whole value ranges
- `createIndex({ age: 1 })` — ascending (smallest first)
- `createIndex({ age: -1 })` — descending (largest first)
- For range filters, MongoDB can traverse the index in either direction regardless of creation order

### Understanding Index Restrictions

**Indexes Don't Always Help**

Indexes are most effective for **selective queries** — those returning a small fraction of documents. When a query returns most or all documents, the index adds overhead: MongoDB still has to visit nearly every document, but now also has the extra cost of traversing the index first.

| Query                    | Docs returned | Selectivity | Index helps?          |
| ------------------------ | ------------- | ----------- | --------------------- |
| `"dob.age": { $gt: 60 }` | 1222 / 5000   | ~24%        | ✅ Yes                |
| `"dob.age": { $gt: 20 }` | 5000 / 5000   | 100%        | ❌ No — adds overhead |

---

**Example — Non-selective query is SLOWER with an index**

```js
// Step 1: Run with the index in place — almost all 5000 docs match
db.contacts.explain("executionStats").find({ "dob.age": { $gt: 20 } });
```

```js
// Index used but unhelpful — 5000 keys scanned, 5000 docs returned, took 8ms
// The extra index traversal step made it slower than a plain collection scan
"executionStats": {
  "nReturned": 5000,
  "executionTimeMillis": 8,
  "totalKeysExamined": 5000,
  "totalDocsExamined": 5000
}
```

```js
// Step 2: Drop the index to compare
db.contacts.dropIndex({ "dob.age": 1 });
```

```js
// Step 3: Same query WITHOUT the index
db.contacts.explain("executionStats").find({ "dob.age": { $gt: 20 } });
```

```js
// Collection scan is now FASTER — no index overhead, documents loaded directly into memory
"executionStats": {
  "nReturned": 5000,
  "executionTimeMillis": 2,   // 4× faster without the index
  "totalKeysExamined": 0,
  "totalDocsExamined": 5000
}
```

> **Rule of thumb:** Index fields where queries return less than ~20% of documents.
> For queries that routinely return the majority of docs, skip the index.

### Compound Indexes

**What Is a Compound Index?**

- An index on **multiple fields**, e.g. `{ "dob.age": 1, gender: 1 }`.
- Each entry in the index is a **combined key**, e.g. `(30, "male")`, `(30, "female")`, `(31, "male")`, ...
- It is **one single index**, not two separate ones.

**Left-Prefix Rule**

A compound index `{ "dob.age": 1, gender: 1 }` can serve these queries:

| Fields used in query                | Index used? | Reason                                    |
| ----------------------------------- | ----------- | ----------------------------------------- |
| `{ "dob.age": 35 }`                 | ✅ Yes      | leftmost prefix                           |
| `{ "dob.age": 35, gender: "male" }` | ✅ Yes      | all fields                                |
| `{ gender: "male" }`                | ❌ No       | right-only field — falls back to COLLSCAN |

**When to use compound indexes:** queries that filter on multiple fields together, or filter on one field and sort on another.

---

**Example 1 — Single-field gender index (low selectivity, not very useful)**

```js
// Create a single-field index on gender
db.contacts.createIndex({ gender: 1 });

// Explain: gender has only 2 values, so ~half the docs match every query
db.contacts.explain("executionStats").find({ gender: "male" });
```

```js
// Result: 2435 keys scanned for 2435 returned — not selective enough to benefit much
"executionStats": {
  "nReturned": 2435,
  "executionTimeMillis": 2,
  "totalKeysExamined": 2435,
  "totalDocsExamined": 2435
}
// Verdict: A single-field index on a boolean-like field rarely pays off
```

---

**Example 2 — Create a compound index on age + gender**

```js
// Drop the single-field gender index, then create a compound one
db.contacts.dropIndex({ gender: 1 });

db.contacts.createIndex({ "dob.age": 1, gender: 1 });
// index name auto-generated: "dob.age_1_gender_1"
```

---

**Example 3 — Query using both fields (best case for compound index)**

```js
db.contacts.explain("executionStats").find({ "dob.age": 35, gender: "male" });
```

```js
// Result: Highly selective — only 43 docs found, 43 keys examined
"winningPlan": {
  "stage": "FETCH",
  "inputStage": {
    "stage": "IXSCAN",
    "indexName": "dob.age_1_gender_1"  // compound index used for both fields
  }
},
"executionStats": {
  "nReturned": 43,
  "executionTimeMillis": 3,
  "totalKeysExamined": 43,
  "totalDocsExamined": 43
}
```

---

**Example 4 — Query using only the leftmost field (still uses the index)**

```js
db.contacts.explain("executionStats").find({ "dob.age": 35 });
```

```js
// Left-prefix rule: compound index is reused even for age-only query
"winningPlan": {
  "stage": "FETCH",
  "inputStage": {
    "stage": "IXSCAN",
    "indexName": "dob.age_1_gender_1"  // compound index reused
  }
}
```

---

**Example 5 — Query using only the right field (index NOT used)**

```js
db.contacts.explain("executionStats").find({ gender: "male" });
```

```js
// Falls back to COLLSCAN — cannot enter the compound index without the left prefix (age)
"winningPlan": {
  "stage": "COLLSCAN",
  "filter": { "gender": { "$eq": "male" } }
}
```

### Using Indexes for Sorting

**How Indexes Speed Up `sort()`**

An index already stores values in **sorted order**. MongoDB can reuse that order for `sort()` — eliminating the need for an expensive in-memory sort.

- **Without a suitable index:** MongoDB loads all matching documents into RAM and sorts them there. Subject to a **32 MB in-memory sort limit**.
- **With a matching index:** MongoDB reads documents in index order directly — no separate sort step needed.

> **Important:** If the unsorted result set exceeds 32 MB and no index matches the sort, **the query fails** with a sort memory limit error. Always index fields you sort on for large collections.

---

**Example — Filter by age, sort by gender — both covered by one compound index**

```js
// Uses the existing compound index { "dob.age": 1, gender: 1 }
db.contacts
  .explain("executionStats")
  .find({ "dob.age": 35 })
  .sort({ gender: 1 });
```

```js
// Result: Single IXSCAN covers both the filter (age = 35) and the sort (gender asc)
// No in-memory sort stage — the index order IS the sort order
"winningPlan": {
  "stage": "FETCH",
  "inputStage": {
    "stage": "IXSCAN",
    "indexName": "dob.age_1_gender_1",
    "direction": "forward",           // ascending traversal matches sort({ gender: 1 })
    "indexBounds": {
      "dob.age": ["[35, 35]"],        // exact match on age
      "gender": ["[MinKey, MaxKey]"]  // full gender range, already sorted by index
    }
  }
}
```

> **Takeaway:** Design compound indexes to match your most common **filter + sort** combinations to avoid the 32 MB sort limit and get free sort ordering.

### Default Index

**The Built-in `_id` Index**

MongoDB automatically creates a **unique ascending index on `_id`** for every collection. You cannot drop it.

- Queries and sorts on `_id` are always fast
- `_id` values are guaranteed to be unique within a collection
- Use `getIndexes()` to list all indexes currently on a collection

```js
// List all indexes on the contacts collection
db.contacts.getIndexes();
```

```js
// Output: Two indexes — the default _id index + the compound index we created
[
  {
    v: 2,
    key: { _id: 1 },
    name: "_id_", // always present — cannot be dropped
  },
  {
    v: 2,
    key: { "dob.age": 1, gender: 1 },
    name: "dob.age_1_gender_1", // our compound index
  },
];
```

### Configuring Indexes — Unique Index

**What is a Unique Index?**

A unique index guarantees **no two documents** share the same value for the indexed field. The built-in `_id` index is unique by default. You can apply the same constraint to any other field.

**Use cases:** `email`, `username`, `phone`, any business key that must not repeat.

---

**Example — Create a unique index on `email`**

```js
db.contacts.createIndex({ email: 1 }, { unique: true });
```

```js
// Error: Index build fails because duplicates already exist in the data
// E11000 duplicate key error index: email_1  dup key: { email: "abigail.clark@example.com" }
```

> MongoDB refuses to build the index — this reveals existing data quality issues.
> Fix the duplicates first, then create the index.

```js
// Once duplicates are resolved and the index exists, any future duplicate insert fails:
db.contacts.insertOne({ name: "Test", email: "abigail.clark@example.com" });
// → E11000 duplicate key error — enforces uniqueness at the database level
```

### Understanding Partial Indexes

**What is a Partial Index?**

A partial index indexes **only documents that match a given filter** (`partialFilterExpression`). Documents that don't match the filter are simply not added to the index.

|                 | Regular Index          | Partial Index                           |
| --------------- | ---------------------- | --------------------------------------- |
| What it indexes | Every document         | Only docs matching the filter           |
| Index size      | Full                   | Smaller                                 |
| Write cost      | Updated on every write | Only updated when filter matches        |
| When usable     | Any query on the field | Only queries that imply the same filter |

**Supported filter operators:** `$eq`, `$gt`, `$gte`, `$lt`, `$lte`, `$exists`, `$type`, `$and`

---

**Example 1 — Index `dob.age`, but only for male contacts**

```js
// Create partial index: only store dob.age entries where gender = "male"
db.contacts.createIndex(
  { "dob.age": 1 },
  { partialFilterExpression: { gender: "male" } }
);
```

**Query WITHOUT the partial filter condition — index NOT used**

```js
// MongoDB cannot safely use this index — the result set could include females
// who are not in the index, so MongoDB falls back to a full scan
db.contacts.explain("executionStats").find({ "dob.age": { $gt: 60 } });
```

```js
// Result: COLLSCAN — MongoDB bypasses the partial index to avoid missing female docs
"executionStages": {
  "stage": "COLLSCAN",
  "filter": { "dob.age": { "$gt": 60 } }
}
```

**Query WITH the partial filter condition — index IS used**

```js
// Including gender: "male" tells MongoDB the result is fully within the index
db.contacts.explain("executionStats").find({
  "dob.age": { $gt: 60 },
  gender: "male",
});
```

```js
// Result: IXSCAN used — 610 matching entries, zero wasted reads
"executionStages": {
  "stage": "FETCH",
  "nReturned": 610,
  "docsExamined": 610,
  "inputStage": {
    "stage": "IXSCAN"   // partial index used successfully
  }
}
```

> **Partial vs Compound Index:** Both require both fields in the query. The advantage of a partial index is **smaller index size** — female documents are never stored in it, saving disk space and reducing write cost for female inserts/updates.

---

**Example 2 — Partial index on the same field (age > 60 only)**

```js
// Alternative: filter on the same field being indexed
// Only ages > 60 are stored — useful app that almost never queries younger ages
db.contacts.createIndex(
  { "dob.age": 1 },
  { partialFilterExpression: { "dob.age": { $gt: 60 } } }
);
```

#### _Partial Index + Unique Constraint_

**Problem: Unique index on an optional field**

A plain `unique` index treats **missing field values as `null`**. If two documents both lack the `email` field, MongoDB sees two `null` values → duplicate key error.

---

**Step 1 — Setup: insert docs with and without email**

```js
db.users.insertMany([
  { name: "Prashant", email: "Prashant@test.com" }, // has email
  { name: "Kohli" }, // no email field
]);
```

---

**Step 2 — Plain (non-unique) index — no issues**

```js
db.users.createIndex({ email: 1 });

db.users.insertOne({ name: "xyz" }); // ✅ Works — plain index allows null values

db.users.dropIndex({ email: 1 }); // drop before trying unique
```

---

**Step 3 — Unique index — breaks for docs without email**

```js
db.users.createIndex({ email: 1 }, { unique: true });

db.users.insertOne({ name: "xyz" });
// ❌ E11000 duplicate key error  dup key: { email: null }
// "Kohli" already has null in the index — the second null value is a duplicate

db.users.dropIndex({ email: 1 }); // drop and fix with partial filter
```

---

**Step 4 — Correct solution: unique + partialFilterExpression**

```js
// Only index documents WHERE email field actually exists
// Documents without email are excluded from the index entirely
db.users.createIndex(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $exists: true } },
  }
);
```

```js
// Test 1: Insert without email — allowed (not indexed, no uniqueness check)
db.users.insertOne({ name: "xyz" });
// ✅ Inserted successfully

// Test 2: Insert with a duplicate email — blocked by unique constraint
db.users.insertOne({ name: "abc", email: "Prashant@test.com" });
// ❌ E11000 duplicate key error  dup key: { email: "Prashant@test.com" }
```

**Summary of behaviors:**

| Action                                                     | Result                          |
| ---------------------------------------------------------- | ------------------------------- |
| Insert doc **without** `email`                             | ✅ Allowed — not added to index |
| Insert doc **with unique** `email`                         | ✅ Allowed                      |
| Insert second doc **without** `email` (plain unique index) | ❌ Duplicate `null`             |
| Insert doc with **existing** `email`                       | ❌ Duplicate key error          |

### Understanding the Time-To-Live (TTL) Index

**What is a TTL Index?**

A TTL index automatically **deletes documents** after a specified number of seconds. MongoDB's background thread runs roughly every 60 seconds and removes expired documents.

**Expiry calculation:**

```
expires when:  now − document[dateField]  ≥  expireAfterSeconds
```

**Common use cases:** user sessions, auth tokens, OTP codes, temporary cart data, log entries with a retention window.

**Restrictions:**

| Rule                | Detail                                                                          |
| ------------------- | ------------------------------------------------------------------------------- |
| Field type          | Must be a **BSON Date** value (`new Date()`)                                    |
| Index type          | **Single-field only** — not supported on compound indexes                       |
| Cleanup granularity | Background job runs ~every 60s — not exact to the second                        |
| Pre-existing docs   | Not deleted immediately on index creation — removed on the next background pass |

---

**Example — Auto-expiring session documents after 10 seconds**

**Step 1 — Create the TTL index**

```js
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 });
// Output: "createdAt_1"
```

---

**Step 2 — Insert session documents with a Date value**

```js
db.sessions.insertOne({ data: "session-abc", createdAt: new Date() });
// { acknowledged: true, insertedId: ObjectId('699f2991...') }

db.sessions.insertOne({ data: "session-xyz", createdAt: new Date() });
// { acknowledged: true, insertedId: ObjectId('699f2993...') }
```

---

**Step 3 — Verify documents are in the collection**

```js
db.sessions.find();
// [
//   { _id: ObjectId('...'), data: 'session-abc', createdAt: ISODate('2026-02-25T16:55:45.332Z') },
//   { _id: ObjectId('...'), data: 'session-xyz', createdAt: ISODate('2026-02-25T16:55:47.039Z') }
// ]
```

---

**Step 4 — After ~10–60 seconds MongoDB removes expired documents**

```js
db.sessions.find();
// [] — collection is now empty; both documents were auto-deleted
```

> **Note:** The TTL background task removes documents **approximately** on schedule. Documents may persist up to 60 seconds past `expireAfterSeconds`. Do not rely on TTL for exact-second deletion.

### Query Diagnosis and Query Planning

Understanding how MongoDB executes your queries is essential for index optimization. The `explain()` method provides three verbosity levels, each offering different depths of insight.

| Verbosity                | What It Shows                                              |
| ------------------------ | ---------------------------------------------------------- |
| `queryPlanner` (default) | Winning plan, index used — no execution stats              |
| `executionStats`         | Winning plan + time, keys/docs examined, docs returned     |
| `allPlansExecution`      | Full stats for ALL candidate plans including rejected ones |

**Key Metrics to Evaluate Query Efficiency**

| Metric                | Ideal Value        | Meaning                             |
| --------------------- | ------------------ | ----------------------------------- |
| `totalKeysExamined`   | ≈ `nReturned`      | Index is selective                  |
| `totalDocsExamined`   | ≈ `nReturned`      | Fetching only needed docs           |
| `totalDocsExamined`   | `0`                | Covered query — no doc fetch needed |
| `executionTimeMillis` | As low as possible | Query execution time                |

> **Rule of Thumb:** Keys examined and docs examined should be close to docs returned. If far apart, the index may not be selective enough for this query.

---

#### _Understanding Covered Queries_

A **covered query** is one that can be answered entirely from the index — MongoDB never touches the actual collection documents. This is the most efficient query possible.

**How to achieve a covered query:**

1. Filter on an indexed field
2. Project **only** the indexed field(s) — explicitly exclude `_id` with `_id: 0`
3. Do NOT request any non-indexed fields

When these conditions are met, `totalDocsExamined` drops to `0`.

---

**Step 1 — Setup: insert sample documents and create index**

```js
db.customers.insertMany([
  { name: "Max", age: 29, salary: 3000 },
  { name: "Manu", age: 30, salary: 4000 },
]);

db.customers.createIndex({ name: 1 });
```

---

**Step 2 — Normal IXSCAN query (FETCH stage still required)**

```js
db.customers.explain("executionStats").find({ name: "Max" });
```

```js
// Result: index used, but MongoDB still fetches the full document
"winningPlan": {
  "stage": "FETCH",           // must fetch document from collection
  "inputStage": {
    "stage": "IXSCAN",
    "keyPattern": { "name": 1 }
  }
},
"executionStats": {
  "nReturned": 1,
  "executionTimeMillis": 12,
  "totalKeysExamined": 1,
  "totalDocsExamined": 1      // one document fetched from disk
}
```

---

**Step 3 — Covered query (project only the indexed field)**

```js
db.customers.explain("executionStats").find(
  { name: "Max" },
  { _id: 0, name: 1 } // only return indexed field, exclude _id
);
```

```js
// Result: no document fetch — answered entirely from the index
"executionStats": {
  "nReturned": 1,
  "executionTimeMillis": 3,   // faster — no disk access
  "totalKeysExamined": 1,
  "totalDocsExamined": 0      // covered query: zero docs examined
}
```

> **When to use:** If a query always returns only specific fields that happen to be indexed, create a compound index on exactly those fields. Projecting them (with `_id: 0`) achieves a covered query — MongoDB reads the answer from the B-tree without touching the collection at all.

---

#### _How MongoDB Rejects a Plan_

When multiple indexes could satisfy a query, MongoDB uses a **plan racing** mechanism to select the most efficient one.

**Plan Selection Process**

| Step                   | What Happens                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| 1. Identify candidates | MongoDB finds all indexes relevant to the query fields              |
| 2. Race                | All candidate plans run in parallel; first to return ~101 docs wins |
| 3. Cache winner        | The winning plan is cached for this exact query shape               |
| 4. Reuse               | Future identical queries skip the race and use the cached plan      |

**When the Plan Cache is Cleared**

| Trigger                      | Reason                                                               |
| ---------------------------- | -------------------------------------------------------------------- |
| ~1,000 new documents written | Collection changed significantly — old plan may no longer be optimal |
| Index dropped and recreated  | Index structure changed                                              |
| New index added              | New candidate may outperform the cached winner                       |
| MongoDB server restarted     | Cache is in-memory only, not persisted to disk                       |

---

**Example — Compound index wins over single-field index**

```js
// Existing index: { name: 1 }
// Add a compound index
db.customers.createIndex({ age: 1, name: 1 });

// Query uses both fields — note: field ORDER in the query does not matter
db.customers.explain().find({ name: "Max", age: 30 });
```

```js
// Result: compound index wins; single-field name index is rejected
"winningPlan": {
  "stage": "FETCH",
  "inputStage": {
    "stage": "IXSCAN",
    "keyPattern": { "age": 1, "name": 1 },  // compound index used
    "indexName": "age_1_name_1"
  }
},
"rejectedPlans": [
  {
    "stage": "FETCH",
    "inputStage": {
      "stage": "IXSCAN",
      "keyPattern": { "name": 1 },           // single-field index rejected
      "indexName": "name_1"
    }
  }
]
```

```js
// See full execution stats for ALL plans including rejected ones
db.customers.explain("allPlansExecution").find({ name: "Max", age: 30 });
```

> **Note:** Query field order does not matter — `{ name: "Max", age: 30 }` and `{ age: 30, name: "Max" }` both use the same `age_1_name_1` compound index. MongoDB normalizes the AND conditions automatically.

---

#### _Using Multi Key Index_

A **multi-key index** is an index on an **array field**. MongoDB detects the array automatically and stores each element as a separate entry in the index — no special syntax needed.

**How Multi-Key Indexes Work**

| Aspect              | Details                                                              |
| ------------------- | -------------------------------------------------------------------- |
| Trigger             | Any `createIndex()` on a field that holds an array                   |
| Storage             | Each array element → one entry in the index                          |
| `isMultiKey` flag   | Set to `true` in `explain()` output                                  |
| Size impact         | Larger than single-field indexes (elements × docs)                   |
| Nested field access | Index `"addresses.street"` for sub-fields inside objects in an array |

**Compound Index Restriction**

| Combination                                            | Allowed?                            |
| ------------------------------------------------------ | ----------------------------------- |
| One array field + one non-array field                  | Yes                                 |
| Two array fields in one compound index                 | No — "cannot index parallel arrays" |
| Multiple separate multi-key indexes on same collection | Yes                                 |

---

**Step 1 — Insert document with array fields**

```js
db.dummyContacts.insertOne({
  name: "Max",
  hobbies: ["Cooking", "Sports"],
  addresses: [{ street: "Main Street" }, { street: "Second Street" }],
});
```

---

**Step 2 — Create and use multi-key index on primitive array**

```js
db.dummyContacts.createIndex({ hobbies: 1 });

db.dummyContacts.explain("executionStats").find({ hobbies: "Sports" });
```

```js
// Result: IXSCAN with isMultiKey: true
"winningPlan": {
  "stage": "FETCH",
  "inputStage": {
    "stage": "IXSCAN",
    "keyPattern": { "hobbies": 1 },
    "indexName": "hobbies_1",
    "isMultiKey": true,                      // confirms multi-key index
    "multiKeyPaths": { "hobbies": ["hobbies"] }
  }
}
```

---

**Step 3 — Index on array of objects: whole document vs. nested field**

```js
db.dummyContacts.createIndex({ addresses: 1 });

// Dot-notation query — does NOT use index (index holds whole objects, not sub-fields)
db.dummyContacts
  .explain("executionStats")
  .find({ "addresses.street": "Main Street" });
```

```js
// Result: COLLSCAN — the index stores full address objects, not individual sub-fields
"winningPlan": {
  "stage": "COLLSCAN"          // falls back to collection scan
}
```

```js
// Whole-document match — DOES use the index
db.dummyContacts.explain("executionStats").find({
  addresses: { street: "Main Street" },
});
```

```js
// Result: IXSCAN — whole embedded document matched against index entry
"winningPlan": {
  "stage": "FETCH",
  "inputStage": {
    "stage": "IXSCAN",
    "keyPattern": { "addresses": 1 },
    "indexName": "addresses_1"
  }
}
```

---

**Step 4 — Index on nested field path inside array of objects**

```js
// Index directly on the nested field path using dot notation
db.dummyContacts.createIndex({ "addresses.street": 1 });

// Now dot-notation queries use the index
db.dummyContacts
  .explain("executionStats")
  .find({ "addresses.street": "Main Street" });
```

```js
// Result: IXSCAN on nested path, isMultiKey: true
"winningPlan": {
  "stage": "FETCH",
  "inputStage": {
    "stage": "IXSCAN",
    "keyPattern": { "addresses.street": 1 },
    "indexName": "addresses.street_1",
    "isMultiKey": true,
    "multiKeyPaths": { "addresses.street": ["addresses"] }
  }
}
```

---

**Step 5 — Compound index: one array field is allowed**

```js
// Allowed — one array field (hobbies) + one non-array field (name)
db.dummyContacts.createIndex({ name: 1, hobbies: 1 });
// creates index: name_1_hobbies_1
```

```js
// Not allowed — two array fields in one compound index
db.dummyContacts.createIndex({ addresses: 1, hobbies: 1 });
```

```js
// Error: cannot index parallel arrays
// "caused by :: cannot index parallel arrays [hobbies] [addresses]"
```

> **Why parallel arrays are forbidden:** MongoDB would need to store the Cartesian product of both arrays. With 2 addresses x 5 hobbies = 10 index entries per document — growing exponentially with array sizes. You can have multiple separate multi-key indexes on the same collection, but a single compound index can only include **one** array field.

### Understanding `text` Index

A **text index** is a special multi-key index that tokenizes a text field into individual keywords, removes stop words (e.g. "is", "the", "a"), and stems words (strips prefixes/suffixes). It enables fast full-text keyword search — far more performant than regex.

**Key Characteristics**

| Feature            | Details                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| Index type         | Special multi-key index on a string field                                   |
| Storage            | Field value is split into stemmed keywords; stop words discarded            |
| Syntax             | `createIndex({ field: "text" })` — use the string `"text"`, not `1` or `-1` |
| One per collection | Only **one** text index allowed per collection (can span multiple fields)   |
| Case sensitivity   | Case-insensitive by default                                                 |
| Query operator     | `$text: { $search: "..." }` — no need to specify the field name             |

**Search Modes**

| Query                       | Behaviour                                                                     |
| --------------------------- | ----------------------------------------------------------------------------- |
| `$search: "awesome"`        | Find docs containing the word _awesome_                                       |
| `$search: "red book"`       | Find docs containing _red_ **or** _book_ (OR logic)                           |
| `$search: '"awesome book"'` | Find docs containing the exact phrase _awesome book_ (wrap in escaped quotes) |

---

**Step 1 — Setup: insert products and create text index**

```js
db.product.insertMany([
  {
    title: "A Book",
    description: "This is an awesome book written by a young artist",
  },
  {
    title: "A T-Shirt",
    description: "This T-Shirt is in red and it's pretty awesome",
  },
]);

// "text" keyword — NOT 1 or -1
db.product.createIndex({ description: "text" });
```

---

**Step 2 — Keyword OR search (both words treated independently)**

```js
db.product.find({ $text: { $search: "red book" } });
```

```js
// Result: both documents returned — one has "book", the other has "red"
[
  {
    title: "A Book",
    description: "This is an awesome book written by a young artist",
  },
  {
    title: "A T-Shirt",
    description: "This T-Shirt is in red and it's pretty awesome",
  },
];
```

---

**Step 3 — Exact phrase search (wrap phrase in escaped double quotes)**

```js
db.product.find({ $text: { $search: '"red book"' } });
// Result: [] — no document contains the exact phrase "red book"

db.product.find({ $text: { $search: '"awesome book"' } });
```

```js
// Result: only the Book document — exact phrase "awesome book" matches
[
  {
    title: "A Book",
    description: "This is an awesome book written by a young artist",
  },
];
```

> **Why no field name in `$text`?** MongoDB only allows one text index per collection. The `$text` operator automatically searches that single index — you don't specify which field.

---

### Text Indexes and Sorting

When searching text, MongoDB internally calculates a **relevance score** for each result. You can project and sort by this score to return the best matches first.

| Construct                                  | Purpose                                   |
| ------------------------------------------ | ----------------------------------------- |
| `{ score: { $meta: "textScore" } }`        | Add relevance score to projected output   |
| `.sort({ score: { $meta: "textScore" } })` | Sort results by relevance (highest first) |

> Higher score = more keyword matches in the document.

---

**Example — Sort results by relevance score**

```js
db.product
  .find(
    { $text: { $search: "awesome t-shirt" } },
    { score: { $meta: "textScore" } } // project the score field
  )
  .sort(
    { score: { $meta: "textScore" } } // sort by score descending
  );
```

```js
// Result: T-Shirt scores higher (matches both "awesome" AND "t-shirt")
[
  {
    title: "A T-shirt",
    description: "This T-shirt is in red and it's pretty awesome",
    score: 1.8, // higher — two keyword matches
  },
  {
    title: "A Book",
    description: "This is an awesome book written by a young artist",
    score: 0.6, // lower — only one keyword match
  },
];
```

---

### Creating Combined Text Indexes

Only **one** text index is allowed per collection. To search across multiple fields, **merge** them into a single text index.

| Action                           | Command                                               |
| -------------------------------- | ----------------------------------------------------- |
| Create combined index            | `createIndex({ title: "text", description: "text" })` |
| Drop existing text index by name | `dropIndex("<index_name>")`                           |
| Get index name                   | `getIndexes()`                                        |

> You **cannot** add a second separate text index — MongoDB returns "An equivalent index already exists". Drop the existing one and recreate with both fields combined.

---

**Step 1 — Try (and fail) to add a second text index**

```js
db.product.createIndex({ title: "text" });
// Error: An equivalent index already exists with a different name and options.
// Only one text index is permitted per collection.
```

---

**Step 2 — Drop existing text index and recreate as combined**

```js
// Get name of existing text index
db.product.getIndexes();
// → name: "description_text"

db.product.dropIndex("description_text");

// Create combined index covering both fields
db.product.createIndex({ title: "text", description: "text" });
```

---

**Step 3 — Search now covers both title and description**

```js
db.product.insertOne({ title: "A Ship", description: "Floating perfectly!" });

// "ship" only appears in the title — still found via the combined index
db.product.find({ $text: { $search: "ship" } });
```

```js
// Result: found via title field in the combined index
[{ title: "A Ship", description: "Floating perfectly!" }];
```

---

### Using Text Index to Exclude Words

Prefix a search term with `-` (minus) to **exclude** documents containing that word.

| Query                         | Behaviour                                  |
| ----------------------------- | ------------------------------------------ |
| `$search: "awesome"`          | Find docs with _awesome_                   |
| `$search: "awesome -t-shirt"` | Find docs with _awesome_ but NOT _t-shirt_ |

---

**Example — Exclude a keyword**

```js
// Without exclusion — both products returned
db.product.find({ $text: { $search: "awesome" } });
```

```js
[
  {
    title: "A T-shirt",
    description: "This T-shirt is in red and it's pretty awesome",
  },
  {
    title: "A Book",
    description: "This is an awesome book written by a young artist",
  },
];
```

```js
// With exclusion — t-shirt documents filtered out
db.product.find({ $text: { $search: "awesome -t-shirt" } });
```

```js
// Result: only the Book — "t-shirt" excluded
[
  {
    title: "A Book",
    description: "This is an awesome book written by a young artist",
  },
];
```

---

### Setting Default Language and Using Weights

When creating a text index you can configure two important options:

**`default_language`** — controls how words are stemmed and which stop words are removed. Defaults to `"english"`. Set it to match the actual language of your data.

**`weights`** — assign relative importance to each field in a combined text index. Affects the relevance score used for sorting.

| Option                  | Default            | Effect                                    |
| ----------------------- | ------------------ | ----------------------------------------- |
| `default_language`      | `"english"`        | Determines stemming rules and stop words  |
| `weights: { field: N }` | `1` for all fields | Higher weight → higher score contribution |
| `$caseSensitive: true`  | `false`            | Enable case-sensitive text search         |

---

**Step 1 — Create a text index with language and weights**

```js
db.product.createIndex(
  { title: "text", description: "text" },
  {
    default_language: "english",
    weights: { title: 1, description: 10 }, // description weighs 10x more than title
  }
);
```

---

**Step 2 — Search with score projection (weights affect score)**

```js
db.product.find(
  { $text: { $search: "red" } },
  { score: { $meta: "textScore" } }
);
```

```js
// Result: score is higher because "description" has weight 10
[
  {
    title: "A T-shirt",
    description: "This T-shirt is in red and it's pretty awesome",
    score: 6, // boosted by description weight of 10
  },
];
```

---

**Step 3 — Case-sensitive search**

```js
// Default: case-insensitive — "Red" and "red" are equivalent
db.product.find(
  { $text: { $search: "Red", $caseSensitive: true } },
  { score: { $meta: "textScore" } }
);
// Result: [] — "Red" (capital R) not found (document stores "red" lowercase in index)
```

---

**Step 4 — Inspect the index to verify weights**

```js
db.product.getIndexes();
```

```js
[
  { key: { _id: 1 }, name: "_id_" },
  {
    key: { _fts: "text", _ftsx: 1 },
    name: "title_text_description_text",
    weights: { description: 10, title: 1 },
    default_language: "english",
    textIndexVersion: 3,
  },
];
```

> **Weights are for scoring, not filtering.** They influence the relevance sort order but do not change which documents are returned.

---

### Building Indexes

MongoDB supports two modes for index creation. The correct choice depends on whether the collection is in active use.

**Foreground vs Background**

| Mode                                | Speed  | Collection locked?                           | Use case                        |
| ----------------------------------- | ------ | -------------------------------------------- | ------------------------------- |
| Foreground (default)                | Faster | Yes — reads & writes blocked during creation | Development / small collections |
| Background (`{ background: true }`) | Slower | No — collection remains accessible           | Production databases            |

> In newer MongoDB versions (4.2+) all index builds are performed without fully blocking the collection, but `background: true` was the way to achieve this in older versions and remains good practice to know.

---

**Step 1 — Load test data (1 million documents)**

```js
// credit-rating.js inserts 1,000,000 documents into db.ratings
// Each document: { personId: N, age: N, score: N }
db.ratings.find().count(); // → 1000000
```

---

**Step 2 — Foreground index creation (blocks collection)**

```js
db.ratings.createIndex({ age: 1 });
// Collection is LOCKED during creation — other queries are deferred until done
```

---

**Step 3 — Query with index vs without index**

```js
// With index
db.ratings.explain("executionStats").find({ age: { $gt: 80 } });
```

```js
"executionStats": {
  "nReturned": 99761,
  "executionTimeMillis": 208,   // 208ms with index
  "totalKeysExamined": 99761,
  "totalDocsExamined": 99761
}
```

```js
// Drop index and re-run same query
db.ratings.dropIndex({ age: 1 });
db.ratings.explain("executionStats").find({ age: { $gt: 80 } });
```

```js
"executionStats": {
  "nReturned": 99761,
  "executionTimeMillis": 506,   // 506ms without index — 2.4x slower
  "totalKeysExamined": 0,
  "totalDocsExamined": 1000000  // full collection scan
}
```

---

**Step 4 — Background index creation (non-blocking)**

```js
// background: true — collection stays accessible during index build
db.ratings.createIndex({ age: 1 }, { background: true });
// Reads and writes proceed normally while the index is being built
```

> **When to use background:** Always prefer `{ background: true }` when adding indexes on production collections. Foreground mode is twice as fast but locks the entire collection, blocking all application reads and writes until the build completes.

> [⬆ Back to Index](#table-of-contents)

---

## Geospatial Data

MongoDB supports **GeoJSON** objects for storing and querying location data. All geospatial queries work via special operators and require a `2dsphere` index for most distance/proximity queries.

| Concept          | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| GeoJSON          | Standard format for geographic data objects used by MongoDB                          |
| Supported types  | `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiPolygon`, etc.                 |
| Coordinate order | Always **longitude first, latitude second** in MongoDB (opposite of Google Maps URL) |
| Index type       | `"2dsphere"` — required for `$near`; recommended for all geo queries                 |
| Collections used | `awesomePlaces.places` (points), `awesomePlaces.areas` (polygons)                    |

```mermaid
flowchart TD
    subgraph GeoJSON Types
        PT["Point<br/>{ type: 'Point',<br/>coordinates: [lng, lat] }"]
        PG["Polygon<br/>{ type: 'Polygon',<br/>coordinates: [[p1,p2,p3,p1]] }"]
        LS["LineString<br/>{ type: 'LineString',<br/>coordinates: [[lng,lat],...] }"]
    end

    subgraph Query Operators
        NEAR["$near<br/>Closest points first<br/>Requires 2dsphere index"]
        WITHIN["$geoWithin<br/>Points inside a shape<br/>Index optional"]
        INTERSECTS["$geoIntersects<br/>Areas that contain a point<br/>Reverse lookup"]
    end

    PT --> NEAR
    PT --> WITHIN
    PG --> WITHIN
    PG --> INTERSECTS

    style PT fill:#cce5ff,color:#000
    style PG fill:#d4edda,color:#000
    style LS fill:#fff3cd,color:#000
    style NEAR fill:#f8d7da,color:#000
    style WITHIN fill:#f8d7da,color:#000
    style INTERSECTS fill:#f8d7da,color:#000
```

---

### Adding GeoJSON Data

Store a location as a **GeoJSON Point** embedded in a document. The `location` field name is arbitrary; the structure inside it is not.

| Field         | Required | Value                                               |
| ------------- | -------- | --------------------------------------------------- |
| `type`        | ✅       | One of the supported GeoJSON types (e.g. `"Point"`) |
| `coordinates` | ✅       | `[longitude, latitude]` — longitude first           |

> **Coordinate order:** Google Maps URL shows `latitude, longitude`. MongoDB GeoJSON requires **longitude first**.

```js
test> use awesomePlaces
switched to db awesomePlaces

awesomePlaces> db.places.insertOne({ name : "Boulder Hills Golf & Country Club" ,location : { type: "Point" , coordinates : [17.432523 , 78.3500869]}})
{
  acknowledged: true,
  insertedId: ObjectId('69a6f8edb89e2f048dc6bcba')
}

awesomePlaces> db.places.find()
[
  {
    _id: ObjectId('69a6f8edb89e2f048dc6bcba'),
    name: 'Boulder Hills Golf & Country Club',
    location: { type: 'Point', coordinates: [ 17.432523, 78.3500869 ] }
  }
]
```

---

### Running Geo Queries

Use `$near` to find documents ordered by proximity to a given point. `$near` **requires a `2dsphere` index** — it will throw an error without one.

| Operator       | Purpose                                            |
| -------------- | -------------------------------------------------- |
| `$near`        | Find documents near a point, sorted closest-first  |
| `$geometry`    | Wraps a GeoJSON object used as the reference point |
| `$maxDistance` | Upper distance bound in **meters**                 |
| `$minDistance` | Lower distance bound in **meters**                 |

```js
awesomePlaces> db.places.find({ location : { $near : { $geometry : { type : "Point" , coordinates : [17.425742, 78.3371349]}}}})
Uncaught:
MongoServerError[NoQueryExecutionPlans]: error processing query: ns=awesomePlaces.placesTree: GEONEAR  field=location maxdist=1.79769e+308 isNearSphere=0
Sort: {}
Proj: {}
planner returned error :: caused by :: unable to find index for $geoNear query
```

---

### Adding a Geospatial Index

Create a `2dsphere` index on the field storing GeoJSON data. Once added, `$near` queries work and results are **sorted by proximity**.

```mermaid
flowchart LR
    Q["User Query<br/>{ $near: { $geometry:<br/>{ type: 'Point',<br/>coordinates: [lng, lat] } } }"]
    Q --> IDX{2dsphere<br/>index exists?}
    IDX -->|No| ERR["❌ Error:<br/>unable to find index<br/>for $geoNear query"]
    IDX -->|Yes| RES["✅ Sorted Results<br/>Nearest place first<br/>→ 2nd nearest<br/>→ 3rd nearest..."]

    style Q fill:#cce5ff,color:#000
    style IDX fill:#fff3cd,color:#000
    style ERR fill:#f8d7da,color:#000
    style RES fill:#d4edda,color:#000
```

```js
awesomePlaces > db.places.createIndex({ location: "2dsphere" });
location_2dsphere;

awesomePlaces >
  db.places.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [17.425742, 78.3371349] },
      },
    },
  })[
    {
      _id: ObjectId("69a6fb4cb89e2f048dc6bcbb"),
      name: "Boulder Hills Golf & Country Club",
      location: { type: "Point", coordinates: [17.432523, 78.3500869] },
    }
  ];

// With min/max distance (in meters)
awesomePlaces >
  db.places.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [17.3836591, 78.3116478] },
        $maxDistance: 30,
        $minDistance: 10,
      },
    },
  });
// Empty — no places within 10–30 m of this location

awesomePlaces >
  db.places.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [17.3836591, 78.3116478] },
        $maxDistance: 500,
        $minDistance: 10,
      },
    },
  })[
    {
      _id: ObjectId("69a6fb4cb89e2f048dc6bcbb"),
      name: "Boulder Hills Golf & Country Club",
      location: { type: "Point", coordinates: [17.432523, 78.3500869] },
    }
  ];
```

> **Distance unit:** `$maxDistance` / `$minDistance` are in **meters**.

---

### Adding Additional Locations

Insert multiple points to support polygon and radius queries.

```js
awesomePlaces> db.places.insertOne({ name : "Zero40 Brewing" , location : { type: "Point" , coordinates : [17.42040486218034, 78.32871079392024]}})
{ acknowledged: true, insertedId: ObjectId('69a6fd07b89e2f048dc6bcbc') }

awesomePlaces> db.places.insertOne({ name : "Kairos School" , location : { type: "Point" , coordinates : [17.434367248040953, 78.31952691051639]}})
{ acknowledged: true, insertedId: ObjectId('69a6fd62b89e2f048dc6bcbd') }

awesomePlaces> db.places.insertOne({ name : "Genpact India pvt" , location : { type: "Point" , coordinates : [17.485713991896347, 78.35946187978975]}})
{ acknowledged: true, insertedId: ObjectId('69a6fdaeb89e2f048dc6bcbe') }

awesomePlaces> db.places.find()
[
  {
    _id: ObjectId('69a6fb4cb89e2f048dc6bcbb'),
    name: 'Boulder Hills Golf & Country Club',
    location: { type: 'Point', coordinates: [ 17.432523, 78.3500869 ] }
  },
  {
    _id: ObjectId('69a6fd07b89e2f048dc6bcbc'),
    name: 'Zero40 Brewing',
    location: { type: 'Point', coordinates: [ 17.42040486218034, 78.32871079392024 ] }
  },
  {
    _id: ObjectId('69a6fd62b89e2f048dc6bcbd'),
    name: 'Kairos School',
    location: { type: 'Point', coordinates: [ 17.434367248040953, 78.31952691051639 ] }
  },
  {
    _id: ObjectId('69a6fdaeb89e2f048dc6bcbe'),
    name: 'Genpact India pvt',
    location: { type: 'Point', coordinates: [ 17.485713991896347, 78.35946187978975 ] }
  }
]
```

---

### Finding Places Inside a Certain Area

Use `$geoWithin` + `$geometry` with a **Polygon** to find all points that lie inside a defined area.

| Operator       | Purpose                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `$geoWithin`   | Find documents whose location falls inside a shape                                              |
| `$geometry`    | Wraps a GeoJSON object (here: Polygon)                                                          |
| Polygon format | `coordinates: [[ [lng,lat], [lng,lat], ..., [lng,lat] ]]` — must close by repeating first point |

> **Important:** A polygon must close by repeating the **first coordinate** as the last element.

```mermaid
flowchart TD
    subgraph Polygon Area
        P1["point1 [17.462, 78.335]"]
        P2["point2 [17.413, 78.294]"]
        P3["point3 [17.397, 78.348]"]
        P4["point4 [17.438, 78.362]"]
    end

    Q["$geoWithin query<br/>{ $geometry: { type: 'Polygon',<br/>coordinates: [[p1,p2,p3,p4,p1]] } }"]
    P1 & P2 & P3 & P4 --> Q
    Q --> IN["✅ Points INSIDE polygon<br/>e.g. Kairos School<br/>e.g. Zero40 Brewing"]
    Q --> OUT["❌ Points OUTSIDE polygon<br/>not returned"]

    style P1 fill:#e2e3e5,color:#000
    style P2 fill:#e2e3e5,color:#000
    style P3 fill:#e2e3e5,color:#000
    style P4 fill:#e2e3e5,color:#000
    style Q fill:#cce5ff,color:#000
    style IN fill:#d4edda,color:#000
    style OUT fill:#f8d7da,color:#000
```

```js
awesomePlaces> const point1 = [17.462003287536497, 78.33543337385615]
awesomePlaces> const point2 = [17.413232242478013, 78.29445905349466]
awesomePlaces> const point3 = [17.397717092025395, 78.34896140343581]
awesomePlaces> const point4 = [17.438674236452748, 78.36287966463797]

awesomePlaces> db.places.find({location : { $geoWithin : { $geometry : { type : "Polygon" , coordinates : [[point1 , point2, point3, point4,point1]]}}}})
[
  {
    _id: ObjectId('69a6fd62b89e2f048dc6bcbd'),
    name: 'Kairos School',
    location: { type: 'Point', coordinates: [ 17.434367248040953, 78.31952691051639 ] }
  },
  {
    _id: ObjectId('69a6fd07b89e2f048dc6bcbc'),
    name: 'Zero40 Brewing',
    location: { type: 'Point', coordinates: [ 17.42040486218034, 78.32871079392024 ] }
  },
  {
    _id: ObjectId('69a6fb4cb89e2f048dc6bcbb'),
    name: 'Boulder Hills Golf & Country Club',
    location: { type: 'Point', coordinates: [ 17.432523, 78.3500869 ] }
  }
]
// Note: Genpact India pvt is NOT returned — it is outside the polygon boundary
```

---

### Finding out if a user is inside a specific area

The **reverse** of `$geoWithin`: given a user's coordinates, find which stored areas contain that point. Store areas (polygons) in their own collection and query with `$geoIntersects`.

| Operator         | Purpose                                                                                |
| ---------------- | -------------------------------------------------------------------------------------- |
| `$geoIntersects` | Returns documents whose geometry shares any point with the query geometry              |
| Use case         | "Which neighborhood is this user in?" — pass user's Point, find matching Polygon areas |

```mermaid
flowchart LR
    subgraph areas collection
        A1["IT City Polygon<br/>[p1,p2,p3,p4,p1]"]
        A2["Other Area Polygon<br/>[q1,q2,q3,q4,q1]"]
    end

    USER["User's Point<br/>coordinates:<br/>[17.425, 78.343]"]
    USER --> Q["$geoIntersects query<br/>{ $geometry: { type: 'Point',<br/>coordinates: [17.425, 78.343] } }"]
    Q --> A1 & A2
    A1 --> MATCH["✅ Match returned<br/>User is inside IT City"]
    A2 --> NOMATCH["❌ No match<br/>User not in Other Area"]

    style USER fill:#cce5ff,color:#000
    style Q fill:#fff3cd,color:#000
    style A1 fill:#e2e3e5,color:#000
    style A2 fill:#e2e3e5,color:#000
    style MATCH fill:#d4edda,color:#000
    style NOMATCH fill:#f8d7da,color:#000
```

```js
awesomePlaces> db.areas.insertOne({ name : "IT City" , location : { type : "Polygon" , coordinates : [[ point1,point2,point3,point4,point1]]}})
{
  acknowledged: true,
  insertedId: ObjectId('69a7055cb89e2f048dc6bcbf')
}

awesomePlaces> db.areas.find()
[
  {
    _id: ObjectId('69a7055cb89e2f048dc6bcbf'),
    name: 'IT City',
    location: {
      type: 'Polygon',
      coordinates: [
        [
          [ 17.462003287536497, 78.33543337385615 ],
          [ 17.413232242478013, 78.29445905349466 ],
          [ 17.397717092025395, 78.34896140343581 ],
          [ 17.438674236452748, 78.36287966463797 ],
          [ 17.462003287536497, 78.33543337385615 ]
        ]
      ]
    }
  }
]

awesomePlaces> db.areas.createIndex({ location : "2dsphere" })
location_2dsphere

awesomePlaces> db.areas.find({location  : { $geoIntersects : {$geometry : { type : "Point" , coordinates: [17.4258034186618, 78.34351525212571]}}}})
[
  {
    _id: ObjectId('69a7055cb89e2f048dc6bcbf'),
    name: 'IT City',
    location: {
      type: 'Polygon',
      coordinates: [
        [
          [ 17.462003287536497, 78.33543337385615 ],
          [ 17.413232242478013, 78.29445905349466 ],
          [ 17.397717092025395, 78.34896140343581 ],
          [ 17.438674236452748, 78.36287966463797 ],
          [ 17.462003287536497, 78.33543337385615 ]
        ]
      ]
    }
  }
]

awesomePlaces> db.areas.find({location  : { $geoIntersects : {$geometry : { type : "Point" , coordinates: [19.4258034186618, 80.34351525212571]}}}})
// Empty — no area contains this point
awesomePlaces>
```

---

### Finding Places within certain Radius

Use `$geoWithin` + `$centerSphere` to find all points within a circular radius. Unlike `$near`, results are **unsorted**.

| Operator        | Purpose                                           |
| --------------- | ------------------------------------------------- |
| `$geoWithin`    | Find points inside a shape (here: a circle)       |
| `$centerSphere` | Define a circle by center + radius in **radians** |

```mermaid
flowchart TD
    CENTER["Center Point<br/>[lng: 17.432, lat: 78.346]"]
    R1["Radius = 1km<br/>1 / 6378.1 radians"]
    R2["Radius = 2km<br/>2 / 6378.1 radians"]
    R3["Radius = 3km<br/>3 / 6378.1 radians"]

    CENTER --> R1
    CENTER --> R2
    CENTER --> R3

    R1 --> res1["1 place found<br/>(closest only)"]
    R2 --> res2["2 places found<br/>(wider circle)"]
    R3 --> res3["3 places found<br/>(widest circle)"]

    NOTE["⚠️ Results are NOT sorted<br/>by distance (unlike $near)"]

    style CENTER fill:#cce5ff,color:#000
    style R1 fill:#fff3cd,color:#000
    style R2 fill:#fff3cd,color:#000
    style R3 fill:#fff3cd,color:#000
    style res1 fill:#d4edda,color:#000
    style res2 fill:#d4edda,color:#000
    style res3 fill:#d4edda,color:#000
    style NOTE fill:#f8d7da,color:#000
```

```js
$centerSphere: [[longitude, latitude], radius_in_radians];
```

**Radius conversion:**

| Unit       | Formula          |
| ---------- | ---------------- |
| Kilometers | `km / 6378.1`    |
| Miles      | `miles / 3963.2` |

```js
// 1 km radius
awesomePlaces> db.places.find({ location : {$geoWithin : {$centerSphere : [[17.43222762731333, 78.34653053884888],1/6398.1]}}})
[
  {
    _id: ObjectId('69a6fb4cb89e2f048dc6bcbb'),
    name: 'Boulder Hills Golf & Country Club',
    location: { type: 'Point', coordinates: [ 17.432523, 78.3500869 ] }
  }
]

// 2 km radius
awesomePlaces> db.places.find({ location : {$geoWithin : {$centerSphere : [[17.43222762731333, 78.34653053884888],2/6398.1]}}})
[
  {
    _id: ObjectId('69a6fdaeb89e2f048dc6bcbe'),
    name: 'Genpact India pvt',
    location: { type: 'Point', coordinates: [ 17.485713991896347, 78.35946187978975 ] }
  },
  {
    _id: ObjectId('69a6fb4cb89e2f048dc6bcbb'),
    name: 'Boulder Hills Golf & Country Club',
    location: { type: 'Point', coordinates: [ 17.432523, 78.3500869 ] }
  }
]

// 3 km radius
awesomePlaces> db.places.find({ location : {$geoWithin : {$centerSphere : [[17.43222762731333, 78.34653053884888],3/6398.1]}}})
[
  {
    _id: ObjectId('69a6fdaeb89e2f048dc6bcbe'),
    name: 'Genpact India pvt',
    location: { type: 'Point', coordinates: [ 17.485713991896347, 78.35946187978975 ] }
  },
  {
    _id: ObjectId('69a6fd07b89e2f048dc6bcbc'),
    name: 'Zero40 Brewing',
    location: { type: 'Point', coordinates: [ 17.42040486218034, 78.32871079392024 ] }
  },
  {
    _id: ObjectId('69a6fb4cb89e2f048dc6bcbb'),
    name: 'Boulder Hills Golf & Country Club',
    location: { type: 'Point', coordinates: [ 17.432523, 78.3500869 ] }
  }
]
awesomePlaces>
```

#### _$near vs $geoWithin + $centerSphere_

| Feature                    | `$near`                           | `$geoWithin + $centerSphere`                          |
| -------------------------- | --------------------------------- | ----------------------------------------------------- |
| Results sorted by distance | ✅ Yes (nearest first)            | ❌ No (database order)                                |
| Requires index             | ✅ Mandatory                      | ❌ Not strictly required                              |
| Distance unit              | Meters (`$maxDistance`)           | Radians (manual conversion)                           |
| Use when                   | You need sorted proximity results | You need all points in a radius, order doesn't matter |

### Geospatial Data — Summary

| Topic              | Key Takeaway                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Storing geo data   | Use **GeoJSON** format — `{ type: "Point", coordinates: [lng, lat] }`                     |
| Coordinate order   | `[longitude, latitude]` — longitude **first** in MongoDB                                  |
| Supported types    | `Point`, `Polygon`, `LineString`, `MultiPoint`, `MultiPolygon` (see official docs)        |
| Geospatial index   | `createIndex({ field: "2dsphere" })` — required for `$near`, speeds up all geo queries    |
| `$near`            | Finds points near a location, sorted by distance; requires index                          |
| `$geoWithin`       | Finds points inside a shape (Polygon or `$centerSphere` circle); unsorted; index optional |
| `$geoIntersects`   | Finds areas that share any point with the query; great for "which area is this user in?"  |
| GeoJSON in queries | All three operators accept GeoJSON objects — same format as stored data                   |

> [⬆ Back to Index](#table-of-contents)

---

## Understanding the Aggregation Framework

|                   |                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------- |
| **What it is**    | An alternative to `find()` for complex data retrieval and transformation            |
| **Core concept**  | A **pipeline of stages** — each stage transforms the data and passes it to the next |
| **Use cases**     | Custom/dynamic reports, data-science transformations, server-side aggregations      |
| **Key advantage** | Executes on the MongoDB server, can use indexes, avoids client-side processing      |
| **Entry point**   | `db.<collection>.aggregate([stage1, stage2, ...])`                                  |

```mermaid
flowchart LR
    COL[("persons<br/>collection")] --> M

    M["$match<br/>Filter documents<br/>{ gender: 'female' }"]
    M --> G
    G["$group<br/>Group + compute<br/>{ _id: '$state', total: $sum: 1 }"]
    G --> S
    S["$sort<br/>Order results<br/>{ total: -1 }"]
    S --> P
    P["$project<br/>Shape output<br/>{ state: 1, total: 1 }"]
    P --> OUT(["Final Result"])

    style COL fill:#e2e3e5,color:#000
    style M fill:#cce5ff,color:#000
    style G fill:#fff3cd,color:#000
    style S fill:#d4edda,color:#000
    style P fill:#f8d7da,color:#000
    style OUT fill:#e2e3e5,color:#000
```

---

### What is the Aggregation Framework ?

#### _Overview_

The aggregation framework is a **pipeline-based** system for transforming and computing results from collection data.

| Concept         | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| **Pipeline**    | An ordered series of stages; each receives the output of the previous stage          |
| **Stage**       | A single transformation step (e.g. `$match`, `$group`, `$sort`, `$project`)          |
| `$match`        | Equivalent to filtering in `find()` — supports all standard query operators          |
| **Index usage** | First/early stages can use indexes (e.g. `$match`, `$sort`)                          |
| **Flexibility** | Stages can be repeated; e.g. you can `$match` again mid-pipeline on transformed data |
| **Docs**        | Official docs list all available stages and accumulator operators                    |

> Each stage receives only the **output** of the previous stage — not the original collection data.

---

### Getting started with Aggregation pipeline

#### _Setup — Import the `persons` dataset_

```bash
# Run inside the folder containing persons.json
mongoimport persons.json -d analytics -c persons --jsonArray
# Imports 5,000 documents into analytics.persons
```

#### _Connect and explore_

```js
use analytics
db.persons.find()
```

**Person document shape** (sample fields):

| Field        | Notes                                                                      |
| ------------ | -------------------------------------------------------------------------- |
| `gender`     | `"male"` / `"female"`                                                      |
| `age`        | Numeric                                                                    |
| `location`   | Embedded doc — `location.state`, `location.city`, etc. (dummy/random data) |
| `name`       | Embedded doc — `name.first`, `name.last`                                   |
| Other fields | Email, login, DOB, picture, etc.                                           |

---

### Using the Aggregation framework

#### _Basic syntax_

```js
db.persons.aggregate([
  /* array of stage documents */
]);
```

- Returns a **cursor**, just like `find()`
- Executes on the **MongoDB server** — uses indexes

#### _`$match` stage — filter documents_

`$match` filters documents using the same query syntax as `find()`.

```js
db.persons.aggregate([{ $match: { gender: "female" } }]);
```

**Output** — only female documents are passed to the next stage (or returned if it is the last stage).

| `$match` property | Detail                                                       |
| ----------------- | ------------------------------------------------------------ |
| Query syntax      | Identical to `find()` filters                                |
| Position          | Best placed early to reduce data volume and leverage indexes |
| Returns           | A cursor of matching documents                               |

---

### Understanding the Group Stage

#### _Concept — `$group`_

`$group` **merges multiple documents** into grouped result documents. Unlike `$project`, it reduces the number of output documents.

| Property           | Description                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `_id`              | **Required** — defines the grouping key. Use `"$fieldName"` or an object with multiple fields  |
| Accumulator fields | User-defined fields computed with accumulator operators (`$sum`, `$avg`, `$min`, `$max`, etc.) |
| `$sum: 1`          | Counts documents in each group                                                                 |
| Output volume      | **Reduced** — one document per unique `_id` value                                              |

```mermaid
flowchart LR
    subgraph Input Documents
        D1["{ gender:'female',<br/>location.state: 'texas' }"]
        D2["{ gender:'female',<br/>location.state: 'texas' }"]
        D3["{ gender:'female',<br/>location.state: 'alaska' }"]
        D4["{ gender:'female',<br/>location.state: 'alaska' }"]
        D5["{ gender:'female',<br/>location.state: 'alaska' }"]
    end

    G["$group<br/>_id: '$location.state'<br/>totalPersons: { $sum: 1 }"]

    subgraph Grouped Output
        R1["{ _id: 'texas', totalPersons: 2 }"]
        R2["{ _id: 'alaska', totalPersons: 3 }"]
    end

    D1 & D2 & D3 & D4 & D5 --> G
    G --> R1 & R2

    style D1 fill:#cce5ff,color:#000
    style D2 fill:#cce5ff,color:#000
    style D3 fill:#d4edda,color:#000
    style D4 fill:#d4edda,color:#000
    style D5 fill:#d4edda,color:#000
    style G fill:#fff3cd,color:#000
    style R1 fill:#cce5ff,color:#000
    style R2 fill:#d4edda,color:#000
```

#### _Group by a single field — count persons per state (females only)_

```js
db.persons.aggregate([
  { $match: { gender: "female" } },
  {
    $group: {
      _id: { state: "$location.state" },
      totalPersons: { $sum: 1 },
    },
  },
]);
```

**Output (sample):**

```js
[
  { _id: { state: 'australian capital territory' }, totalPersons: 24 },
  { _id: { state: 'satakunta' }, totalPersons: 4 },
  { _id: { state: 'nordjylland' }, totalPersons: 27 },
  // ...
]
Type "it" for more
```

> `$location.state` — the `$` prefix inside a string tells MongoDB to **reference the value of a field** in the incoming document, not treat it as a literal string.

#### _Key operator — `$sum`_

| Usage                | Meaning                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `{ $sum: 1 }`        | Increment counter by 1 for each grouped document                    |
| `{ $sum: "$price" }` | Sum the numeric value of the `price` field across grouped documents |

---

### Diving Deep into Group Stage

#### _Adding `$sort` after `$group`_

`$sort` can be placed **after** `$group` to sort on fields that were created in the group stage — this is not possible with `find()`.

```js
db.persons.aggregate([
  { $match: { gender: "female" } },
  {
    $group: {
      _id: { state: "$location.state" },
      totalPersons: { $sum: 1 },
    },
  },
  { $sort: { totalPersons: -1 } },
]);
```

**Output (top results):**

```js
[
  { _id: { state: "midtjylland" }, totalPersons: 33 },
  { _id: { state: "nordjylland" }, totalPersons: 27 },
  { _id: { state: "syddanmark" }, totalPersons: 24 },
  { _id: { state: "australian capital territory" }, totalPersons: 24 },
  { _id: { state: "new south wales" }, totalPersons: 24 },
  { _id: { state: "south australia" }, totalPersons: 22 },
  // ...
];
```

| Pattern                   | Detail                                                                      |
| ------------------------- | --------------------------------------------------------------------------- |
| Stage ordering            | Each stage only sees the **output** of the previous stage                   |
| `$sort` on derived fields | Valid — `totalPersons` exists in the `$group` output, so `$sort` can use it |
| Server-side               | All stages run on the MongoDB server — no client-side sorting needed        |

---

### Working with $project

#### _Concept_

`$project` **transforms every document** without merging them. It can include/exclude fields, rename them, and **create new computed fields** using expressions.

| Property           | Description                                               |
| ------------------ | --------------------------------------------------------- |
| Excludes `_id`     | `_id: 0`                                                  |
| Include field      | `fieldName: 1`                                            |
| New/computed field | Assign an expression document (e.g. `{ $concat: [...] }`) |
| Document volume    | **Unchanged** — same number of documents in and out       |

```mermaid
flowchart LR
    subgraph Input Document
        IN["{ _id: ObjectId,<br/>name: { first:'john', last:'doe' },<br/>gender: 'male',<br/>email: 'j@x.com',<br/>age: 30,<br/>location: { city: ..., state: ... } }"]
    end

    P["$project<br/>_id: 0<br/>gender: 1<br/>fullName: { $concat: ['$name.first',' ','$name.last'] }"]

    subgraph Output Document
        OUT["{ gender: 'male',<br/>fullName: 'John Doe' }"]
    end

    IN --> P --> OUT

    NOTE["Same number of<br/>documents — each<br/>one is reshaped"]

    style IN fill:#cce5ff,color:#000
    style P fill:#fff3cd,color:#000
    style OUT fill:#d4edda,color:#000
    style NOTE fill:#e2e3e5,color:#000
```

```js
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      gender: 1,
      fullName: { $concat: ["$name.first", " ", "$name.last"] },
    },
  },
]);
```

**Output (sample):**

```js
[
  { gender: "male", fullName: "zachary lo" },
  { gender: "male", fullName: "gideon van drongelen" },
  // ...
];
```

#### _String expression operators_

| Operator    | Purpose                             | Example                                             |
| ----------- | ----------------------------------- | --------------------------------------------------- |
| `$concat`   | Concatenate strings or field refs   | `{ $concat: ["$name.first", " ", "$name.last"] }`   |
| `$toUpper`  | Convert string to uppercase         | `{ $toUpper: "$name.first" }`                       |
| `$toLower`  | Convert string to lowercase         | `{ $toLower: "$name.last" }`                        |
| `$substrCP` | Extract a substring (by code point) | `{ $substrCP: ["$name.first", 0, 1] }` → first char |
| `$strLenCP` | String length (by code point)       | `{ $strLenCP: "$name.first" }`                      |
| `$subtract` | Subtract two numbers                | `{ $subtract: [{ $strLenCP: "$name.first" }, 1] }`  |

#### _Capitalise first letter only — `$substrCP` + `$strLenCP` + `$subtract`_

To produce `Gideon Van Drongelen` from `gideon` / `van drongelen`:

```js
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      gender: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ["$name.first", 0, 1] } }, // first char → uppercase
          {
            $substrCP: [
              "$name.first",
              1,
              { $subtract: [{ $strLenCP: "$name.first" }, 1] }, // rest of name
            ],
          },
          " ",
          { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
          {
            $substrCP: [
              "$name.last",
              1,
              { $subtract: [{ $strLenCP: "$name.last" }, 1] },
            ],
          },
        ],
      },
    },
  },
]);
```

**Output (sample):**

```js
[
  { gender: "male", fullName: "Zachary Lo" },
  { gender: "male", fullName: "Gideon Van Drongelen" },
  { gender: "female", fullName: "Olav Oehme" },
  // ...
];
```

> **Pattern**: expressions are always wrapped in **documents** (objects). Operators can be nested — the output of one expression becomes the input of another.

### Turning the Location into a geoJSON Object

#### _Concept — multi-stage `$project` + `$convert`_

You can use **multiple `$project` stages** in a pipeline — the second stage receives only the output of the first. This is useful for splitting complex transformations into readable chunks.

The `$convert` operator transforms a field value to a new BSON type, with optional fallback values on error or null.

| `$convert` property | Description                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| `input`             | Field reference (`"$field.path"`) or expression to convert                        |
| `to`                | Target type as string: `"double"`, `"int"`, `"long"`, `"date"`, `"decimal"`, etc. |
| `onError`           | Value to return if conversion fails (optional)                                    |
| `onNull`            | Value to return if `input` is null/missing (optional)                             |

#### _Building a GeoJSON Point from string coordinates_

`location.coordinates.longitude` and `location.coordinates.latitude` are stored as strings — they must be converted to `double` for a valid GeoJSON object.

```js
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.latitude",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        ],
      },
    },
  },
  {
    $project: {
      gender: 1,
      email: 1,
      location: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
          {
            $substrCP: [
              "$name.first",
              1,
              { $subtract: [{ $strLenCP: "$name.first" }, 1] },
            ],
          },
          " ",
          "$name.last",
        ],
      },
    },
  },
]);
```

**Output (sample):**

```js
[
  {
    location: { type: "Point", coordinates: [174.2405, 3.6559] },
    email: "anaëlle.adam@example.com",
    fullName: "Anaëlle adam",
  },
  {
    location: { type: "Point", coordinates: [168.9462, -22.5329] },
    email: "harvey.chambers@example.com",
    fullName: "Harvey chambers",
  },
  // ...
];
```

> GeoJSON coordinate order is always **[longitude, latitude]**.

---

### Transforming Birthdate

#### _Adding top-level `birthdate` and `age` fields_

`dob.date` is stored as a string — convert it to the `date` type. `dob.age` is already a number and can be aliased directly.

```js
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      birthdate: {
        $convert: {
          input: "$dob.date",
          to: "date",
        },
      },
      age: "$dob.age", // pull nested field to top level
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.latitude",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        ],
      },
    },
  },
  {
    $project: {
      gender: 1,
      email: 1,
      location: 1,
      birthdate: 1, // carry new fields through to next stage
      age: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
          {
            $substrCP: [
              "$name.first",
              1,
              { $subtract: [{ $strLenCP: "$name.first" }, 1] },
            ],
          },
          " ",
          "$name.last",
        ],
      },
    },
  },
]);
```

**Output (sample):**

```js
[
  {
    location: { type: "Point", coordinates: [168.9462, -22.5329] },
    email: "harvey.chambers@example.com",
    birthdate: ISODate("1988-05-27T00:14:03.000Z"),
    age: 30,
    fullName: "Harvey chambers",
  },
  // ...
];
```

> **Important**: because there are two `$project` stages, any new field created in stage 1 (e.g. `birthdate`, `age`) **must be explicitly included** in stage 2 to appear in the output.

---

### Using Shortcuts for Transformation

#### _Type conversion shortcut operators_

When you don't need custom `onError`/`onNull` fallback values, MongoDB provides shorthand conversion operators:

| Shortcut operator | Equivalent `$convert` `to` value |
| ----------------- | -------------------------------- |
| `$toDate`         | `"date"`                         |
| `$toDouble`       | `"double"`                       |
| `$toInt`          | `"int"`                          |
| `$toLong`         | `"long"`                         |
| `$toDecimal`      | `"decimal"`                      |
| `$toString`       | `"string"`                       |
| `$toBool`         | `"bool"`                         |

```js
// Using shortcut instead of $convert... to: "date"
birthdate: {
  $toDate: "$dob.date";
}
```

| Use `$convert` when                       | Use shortcut when                      |
| ----------------------------------------- | -------------------------------------- |
| Need custom `onError` / `onNull` fallback | Data is reliable, no fallback required |
| Explicit control over edge cases          | Concise, simple conversion             |

---

### Understanding the $isoWeekYear Operator

#### _Grouping on derived date fields_

After projecting `birthdate` as a real `date` type, you can group on **parts of that date** in a subsequent `$group` stage. This demonstrates a core pipeline pattern: project first to derive new fields, then group on those fields.

| Date extraction operator | Returns                            |
| ------------------------ | ---------------------------------- |
| `$isoWeekYear`           | ISO week-numbering year (a `Long`) |
| `$year`                  | Calendar year                      |
| `$month`                 | Month (1–12)                       |
| `$dayOfMonth`            | Day of month (1–31)                |
| `$dayOfWeek`             | Day of week (1 = Sunday)           |
| `$isoDayOfWeek`          | ISO day of week (1 = Monday)       |

#### _Count persons per birth year, sorted by most common_

```js
db.persons.aggregate([
  // Stage 1 — project: convert dob.date to a real date
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      birthdate: { $toDate: "$dob.date" },
      age: "$dob.age",
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.latitude",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        ],
      },
    },
  },
  // Stage 2 — project: build fullName, carry through other fields
  {
    $project: {
      gender: 1,
      email: 1,
      location: 1,
      birthdate: 1,
      age: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
          {
            $substrCP: [
              "$name.first",
              1,
              { $subtract: [{ $strLenCP: "$name.first" }, 1] },
            ],
          },
          " ",
          "$name.last",
        ],
      },
    },
  },
  // Stage 3 — group by ISO birth year, count persons
  {
    $group: {
      _id: { birthYear: { $isoWeekYear: "$birthdate" } },
      numPersons: { $sum: 1 },
    },
  },
  // Stage 4 — sort descending by count
  { $sort: { numPersons: -1 } },
]);
```

**Output (top results):**

```js
[
  { _id: { birthYear: Long("1955") }, numPersons: 113 },
  { _id: { birthYear: Long("1961") }, numPersons: 111 },
  { _id: { birthYear: Long("1960") }, numPersons: 110 },
  { _id: { birthYear: Long("1993") }, numPersons: 110 },
  { _id: { birthYear: Long("1975") }, numPersons: 107 },
  // ...
];
```

> `$isoWeekYear` returns a `Long`. The example dataset peaks at **1955** (113 persons).

---

### $group vs $project

|                            | `$group`                                                  | `$project`                                                      |
| -------------------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| **Relationship**           | Many-to-one                                               | One-to-one                                                      |
| **Documents out**          | Fewer than in (one per unique `_id`)                      | Same count as in                                                |
| **Primary use**            | Summarise, count, sum, average across multiple documents  | Transform, rename, add/remove fields in each document           |
| **Typical operators**      | `$sum`, `$avg`, `$min`, `$max`, `$push`, `$addToSet`      | `$concat`, `$toUpper`, `$substrCP`, `$convert`, `$toDate`, etc. |
| **Loses original fields?** | Yes — only `_id` and explicitly accumulated fields remain | No — you choose which fields to keep or transform               |

> Use `$project` to **shape individual documents**. Use `$group` to **aggregate across documents**.

```mermaid
flowchart TD
    subgraph "$group — Many to One"
        GIN1["Doc 1: state='texas'"]
        GIN2["Doc 2: state='texas'"]
        GIN3["Doc 3: state='alaska'"]
        GSTAGE["$group<br/>_id: '$state'<br/>count: { $sum:1 }"]
        GOUT1["{ _id:'texas', count:2 }"]
        GOUT2["{ _id:'alaska', count:1 }"]
        GIN1 & GIN2 & GIN3 --> GSTAGE
        GSTAGE --> GOUT1 & GOUT2
    end

    subgraph "$project — One to One"
        PIN1["Doc 1: { first:'john', last:'doe' }"]
        PIN2["Doc 2: { first:'jane', last:'doe' }"]
        PSTAGE["$project<br/>fullName: $concat<br/>_id: 0"]
        POUT1["{ fullName: 'john doe' }"]
        POUT2["{ fullName: 'jane doe' }"]
        PIN1 --> PSTAGE --> POUT1
        PIN2 --> PSTAGE --> POUT2
    end

    style GSTAGE fill:#fff3cd,color:#000
    style PSTAGE fill:#fff3cd,color:#000
    style GOUT1 fill:#d4edda,color:#000
    style GOUT2 fill:#d4edda,color:#000
    style POUT1 fill:#cce5ff,color:#000
    style POUT2 fill:#cce5ff,color:#000
```

---

### Pushing Elements into Newly Created Arrays

#### _`$push` — accumulate values into an array per group_

In a `$group` stage, `$push` appends the specified field value from each incoming document into a new group-level array.

```js
db.friends.insertMany([
  {
    name: "Max",
    age: 29,
    hobbies: ["Sports", "Cooking"],
    examScores: [
      { difficulty: 4, score: 57.9 },
      { difficulty: 6, score: 62.1 },
      { difficulty: 3, score: 88.5 },
    ],
  },
  {
    name: "Manu",
    age: 30,
    hobbies: ["Eating", "Data Analytics"],
    examScores: [
      { difficulty: 7, score: 52.1 },
      { difficulty: 2, score: 74.3 },
      { difficulty: 5, score: 53.1 },
    ],
  },
  {
    name: "Maria",
    age: 29,
    hobbies: ["Cooking", "Skiing"],
    examScores: [
      { difficulty: 3, score: 75.1 },
      { difficulty: 8, score: 44.2 },
      { difficulty: 6, score: 61.5 },
    ],
  },
]);
```

```js
db.friends.aggregate([
  { $group: { _id: { age: "$age" }, allHobbies: { $push: "$hobbies" } } },
]);
```

**Output — array of arrays** (because `hobbies` is itself an array):

```js
[
  { _id: { age: 30 }, allHobbies: [["Eating", "Data Analytics"]] },
  {
    _id: { age: 29 },
    allHobbies: [
      ["Sports", "Cooking"],
      ["Cooking", "Skiing"],
    ],
  },
];
```

> `$push` preserves duplicates. Use `$addToSet` to collect unique values only.

#### _`$unwind` — flatten an array into separate documents_

`$unwind` takes one document with an array field and outputs **one document per array element**, repeating all other fields.

```mermaid
flowchart TD
    IN["1 document<br/>{ name: 'Max',<br/>hobbies: ['Sports','Cooking'],<br/>age: 29 }"]
    U["$unwind: '$hobbies'"]
    OUT1["{ name: 'Max',<br/>hobbies: 'Sports',<br/>age: 29 }"]
    OUT2["{ name: 'Max',<br/>hobbies: 'Cooking',<br/>age: 29 }"]

    IN --> U
    U --> OUT1 & OUT2

    NOTE["1 document in →<br/>2 documents out<br/>(one per array element)"]

    style IN fill:#cce5ff,color:#000
    style U fill:#fff3cd,color:#000
    style OUT1 fill:#d4edda,color:#000
    style OUT2 fill:#d4edda,color:#000
    style NOTE fill:#e2e3e5,color:#000
```

**Output (partial):**

```js
[
  { name: 'Max', hobbies: 'Sports', age: 29, examScores: [...] },
  { name: 'Max', hobbies: 'Cooking', age: 29, examScores: [...] },
  { name: 'Manu', hobbies: 'Eating', age: 30, examScores: [...] },
  // ...
]
```

| Stage     | Direction  | Document count                  |
| --------- | ---------- | ------------------------------- |
| `$group`  | Many → one | Reduces                         |
| `$unwind` | One → many | Expands (one per array element) |

#### _Pattern — `$unwind` + `$group` with `$addToSet` for unique flat values_

```js
db.friends.aggregate([
  { $unwind: "$hobbies" },
  { $group: { _id: { age: "$age" }, allHobbies: { $addToSet: "$hobbies" } } },
]);
```

**Output — flat arrays, no duplicates:**

```js
[
  { _id: { age: 30 }, allHobbies: ["Eating", "Data Analytics"] },
  { _id: { age: 29 }, allHobbies: ["Cooking", "Skiing", "Sports"] },
];
```

| Accumulator | Behaviour                                   |
| ----------- | ------------------------------------------- |
| `$push`     | Adds every value — **duplicates allowed**   |
| `$addToSet` | Adds only unique values — **no duplicates** |

---

### Using Projection with Arrays

#### _`$slice` — extract a subset of an array_

```js
db.friends.aggregate([
  {
    $project: {
      _id: 0,
      examScore: { $slice: ["$examScores", 1] }, // first 1 element
    },
  },
]);
// Output: [ { examScore: [ { difficulty: 4, score: 57.9 } ] }, ... ]
```

| `$slice` syntax       | Meaning                                                   |
| --------------------- | --------------------------------------------------------- |
| `[$array, n]`         | First `n` elements                                        |
| `[$array, -n]`        | Last `n` elements                                         |
| `[$array, offset, n]` | Skip `offset` elements, then take `n` (zero-based offset) |

**Examples:**

```js
{
  $slice: ["$examScores", -2];
} // last 2 elements
{
  $slice: ["$examScores", 2, 1];
} // skip 2, take 1 → element at index 2 (the last one)
```

#### _`$size` — count array elements_

```js
db.friends.aggregate([
  {
    $project: {
      _id: 0,
      numScores: { $size: "$examScores" },
    },
  },
]);
// Output: [ { numScores: 3 }, { numScores: 3 }, { numScores: 3 } ]
```

| Operator       | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `$slice`       | Extract a subset of an array by position/count       |
| `$size`        | Return the number of elements in an array            |
| `$filter`      | Return only elements matching a condition (see docs) |
| `$arrayElemAt` | Return element at a specific index                   |

---

### Using the $filter Operator

#### _Concept — filter array elements in `$project`_

`$filter` keeps only the elements from an array that satisfy a condition, **without changing the number of documents** (it works inside `$project`, not `$group`).

| `$filter` property | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `input`            | The array to filter (`"$fieldName"`)                               |
| `as`               | Local variable name for each element (referenced as `"$$varName"`) |
| `cond`             | Expression that must be truthy for an element to be kept           |

> Use `$$` (double dollar) to reference the local `as` variable inside `cond`. A single `$` would look for a collection field named after the variable.

#### _Example — keep only exam scores > 60_

```js
db.friends.aggregate([
  {
    $project: {
      _id: 0,
      examScores: {
        $filter: {
          input: "$examScores",
          as: "sc",
          cond: { $gt: ["$$sc.score", 60] }, // $$sc = current element
        },
      },
    },
  },
]);
```

**Output:**

```js
[
  {
    examScores: [
      { difficulty: 6, score: 62.1 },
      { difficulty: 3, score: 88.5 },
    ],
  },
  { examScores: [{ difficulty: 2, score: 74.3 }] },
  {
    examScores: [
      { difficulty: 3, score: 75.1 },
      { difficulty: 6, score: 61.5 },
    ],
  },
];
```

> `$gt` inside `$filter`'s `cond` takes an array `[value, threshold]` — different from the document syntax `{ $gt: threshold }` used in `$match`/`find()`.

---

### Applying Multiple Operations to Arrays

#### _Goal — find the highest exam score per person_

This demonstrates **combining multiple stages** to process arrays:

| Step | Stage                           | Purpose                              |
| ---- | ------------------------------- | ------------------------------------ |
| 1    | `$unwind: "$examScores"`        | Flatten array → one doc per score    |
| 2    | `$project`                      | Extract `score` as a top-level field |
| 3    | `$sort: { score: -1 }`          | Highest scores first                 |
| 4    | `$group` with `$max` / `$first` | One doc per person, pick max score   |
| 5    | `$sort: { maxScore: -1 }`       | Order results descending             |

```js
db.friends.aggregate([
  { $unwind: "$examScores" },
  { $project: { _id: 1, name: 1, age: 1, score: "$examScores.score" } },
  { $sort: { score: -1 } },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" }, // same value in every group doc — take first
      maxScore: { $max: "$score" },
    },
  },
  { $sort: { maxScore: -1 } },
]);
```

**Output:**

```js
[
  { _id: ObjectId("...458"), name: "Max", maxScore: 88.5 },
  { _id: ObjectId("...45a"), name: "Maria", maxScore: 75.1 },
  { _id: ObjectId("...459"), name: "Manu", maxScore: 74.3 },
];
```

**Intermediate step (after `$unwind` + `$project` + `$sort`) — verifying the sort:**

```js
db.friends.aggregate([
  { $unwind: "$examScores" },
  { $project: { _id: 0, name: 1, age: 1, score: "$examScores.score" } },
  { $sort: { score: -1 } },
]);
// → 9 flat documents, sorted highest score first
// [ { name:'Max', age:29, score:88.5 }, { name:'Maria', age:29, score:75.1 }, ... ]
```

| Accumulator | Use in `$group`                                                     |
| ----------- | ------------------------------------------------------------------- |
| `$max`      | Largest value across grouped documents                              |
| `$min`      | Smallest value                                                      |
| `$first`    | Value from the first document in the group (useful after a `$sort`) |
| `$last`     | Value from the last document in the group                           |

---

### Understanding $bucket

#### _Concept — categorise data into ranges_

`$bucket` groups documents into **user-defined range buckets** and computes summary statistics per bucket — useful for understanding data distribution.

| `$bucket` property | Description                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `groupBy`          | Field expression to bucket on (e.g. `"$dob.age"`)                                                                                                                                 |
| `boundaries`       | Array of boundary values — must be in ascending order. Each boundary is the inclusive lower bound of a bucket; the last boundary is the exclusive upper bound of the final bucket |
| `default`          | (Optional) Bucket name for values that don't fall in any boundary range                                                                                                           |
| `output`           | Accumulator expressions for each bucket — same syntax as `$group`                                                                                                                 |

```mermaid
flowchart TD
    DOCS["All documents<br/>with age field"]
    B["$bucket<br/>groupBy: '$dob.age'<br/>boundaries: [0, 18, 30, 40, 50, 60, 120]"]
    DOCS --> B

    B --> B1["Bucket: 18–29<br/>_id: 18<br/>numPersons: 868<br/>avgAge: 25.1"]
    B --> B2["Bucket: 30–39<br/>_id: 30<br/>numPersons: 910<br/>avgAge: 34.5"]
    B --> B3["Bucket: 40–49<br/>_id: 40<br/>numPersons: 918<br/>avgAge: 44.4"]
    B --> B4["Bucket: 50–59<br/>_id: 50<br/>numPersons: 976<br/>avgAge: 54.5"]
    B --> B5["Bucket: 60–119<br/>_id: 60<br/>numPersons: 1328<br/>avgAge: 66.6"]

    style DOCS fill:#cce5ff,color:#000
    style B fill:#fff3cd,color:#000
    style B1 fill:#d4edda,color:#000
    style B2 fill:#d4edda,color:#000
    style B3 fill:#d4edda,color:#000
    style B4 fill:#d4edda,color:#000
    style B5 fill:#d4edda,color:#000
```

```js
db.persons.aggregate([
  {
    $bucket: {
      groupBy: "$dob.age",
      boundaries: [0, 18, 30, 40, 50, 60, 120],
      output: {
        averageAge: { $avg: "$dob.age" },
        numPersons: { $sum: 1 },
      },
    },
  },
]);
```

**Output:**

```js
[
  { _id: 18, averageAge: 25.1, numPersons: 868 },
  { _id: 30, averageAge: 34.52, numPersons: 910 },
  { _id: 40, averageAge: 44.42, numPersons: 918 },
  { _id: 50, averageAge: 54.53, numPersons: 976 },
  { _id: 60, averageAge: 66.56, numPersons: 1328 },
];
```

> `_id` in the output is the **lower boundary** of that bucket.

#### _`$bucketAuto` — automatic equal-distribution bucketing_

```js
db.persons.aggregate([
  {
    $bucketAuto: {
      groupBy: "$dob.age",
      buckets: 5,
      output: {
        averageAge: { $avg: "$dob.age" },
        numPersons: { $sum: 1 },
      },
    },
  },
]);
```

**Output:**

```js
[
  { _id: { min: 21, max: 32 }, averageAge: 26.0, numPersons: 1042 },
  { _id: { min: 32, max: 43 }, averageAge: 36.98, numPersons: 1010 },
  { _id: { min: 43, max: 54 }, averageAge: 47.99, numPersons: 1033 },
  { _id: { min: 54, max: 65 }, averageAge: 58.99, numPersons: 1064 },
  { _id: { min: 65, max: 74 }, averageAge: 69.12, numPersons: 851 },
];
```

|              | `$bucket`                           | `$bucketAuto`                         |
| ------------ | ----------------------------------- | ------------------------------------- |
| Boundaries   | You define them                     | MongoDB derives them automatically    |
| Distribution | Uneven (depends on your boundaries) | Attempts equal distribution           |
| `_id` output | Lower boundary value                | `{ min, max }` object                 |
| Use when     | You know meaningful category ranges | You want a quick feel for data spread |

---

### Diving into Additional Stages

#### _`$limit` and `$skip` — pagination_

`$limit` and `$skip` are aggregation stages equivalent to the cursor methods on `find()`. **Order matters** — they are applied exactly where you place them in the pipeline.

```js
// Top 10 oldest persons
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      name: { $concat: ["$name.first", " ", "$name.last"] },
      birthdate: { $toDate: "$dob.date" },
    },
  },
  { $sort: { birthdate: 1 } }, // oldest first (lowest date = oldest)
  { $limit: 10 },
]);
```

**Output (first 10):**

```js
[
  { name: "victoria hale", birthdate: ISODate("1944-09-07T15:52:50.000Z") },
  { name: "عباس یاسمی", birthdate: ISODate("1944-09-12T07:49:20.000Z") },
  // ...8 more
];
```

```js
// Page 2 — next 10 (skip must come BEFORE limit)
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      name: { $concat: ["$name.first", " ", "$name.last"] },
      birthdate: { $toDate: "$dob.date" },
    },
  },
  { $sort: { birthdate: 1 } },
  { $skip: 10 }, // ← must be before $limit
  { $limit: 10 },
]);
```

#### _Stage ordering rules_

| Rule                            | Explanation                                                                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `$skip` before `$limit`         | If `$limit` comes first, the remaining documents after `$limit` are gone — `$skip` would skip within those already-limited results |
| `$sort` before `$skip`/`$limit` | Sort must precede pagination or you paginate an unsorted set                                                                       |
| `$match` as early as possible   | Filters data before expensive transforms; also enables index use                                                                   |
| `$match` before `$project`      | Fields you want to match on must exist in the current stage's documents — projecting them away first means you can't match on them |

```js
// Correct — $match early, then project, sort, paginate
db.persons.aggregate([
  { $match: { gender: "male" } }, // filter first
  {
    $project: {
      _id: 0,
      name: { $concat: ["$name.first", " ", "$name.last"] },
      birthdate: { $toDate: "$dob.date" },
    },
  },
  { $sort: { birthdate: 1 } },
  { $skip: 10 },
  { $limit: 10 },
]);
```

**Output (10 oldest males, page 2):**

```js
[
  { name: "pierre boyer", birthdate: ISODate("1945-01-01T22:35:55.000Z") },
  { name: "emile noel", birthdate: ISODate("1945-01-10T03:05:21.000Z") },
  // ...8 more
];
```

> MongoDB applies some automatic pipeline optimisations behind the scenes (e.g. pushing `$match` earlier), but you should still write pipelines with the correct logical order.

---

### Writing Pipeline Results into a New Collection

#### _`$out` — persist pipeline output as a collection_

`$out` is a terminal pipeline stage that **writes the result documents into a named collection** instead of returning them to the client. If the collection exists it is replaced; if not it is created.

```js
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      birthdate: { $toDate: "$dob.date" },
      age: "$dob.age",
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.latitude",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        ],
      },
    },
  },
  {
    $project: {
      gender: 1,
      email: 1,
      location: 1,
      birthdate: 1,
      age: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
          {
            $substrCP: [
              "$name.first",
              1,
              { $subtract: [{ $strLenCP: "$name.first" }, 1] },
            ],
          },
          " ",
          "$name.last",
        ],
      },
    },
  },
  { $out: "transformedPersons" }, // ← write to new collection
]);
```

```js
show collections
// → transformedPersons now exists

db.transformedPersons.findOne()
// {
//   _id: ObjectId('...'),
//   location: { type: 'Point', coordinates: [ -70.2264, 76.4507 ] },
//   email: 'zachary.lo@example.com',
//   birthdate: ISODate('1988-10-17T03:45:04.000Z'),
//   age: 29,
//   fullName: 'Zachary lo'
// }
```

| `$out` behaviour    | Detail                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Position            | Must be the **last** stage in the pipeline                                                    |
| Existing collection | **Replaces** it entirely                                                                      |
| New collection      | Creates it on the fly                                                                         |
| No cursor returned  | The aggregation returns nothing to the client                                                 |
| Use case            | Pre-compute transformed views, cache expensive pipeline results, prepare data for geo queries |

---

### Working with the $geoNear Stage

#### _Concept_

`$geoNear` is an aggregation stage that finds documents near a given point, ordered by distance. It **must be the first stage** in the pipeline (it needs direct collection access to use the geospatial index).

| `$geoNear` property | Description                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ |
| `near`              | GeoJSON Point `{ type: "Point", coordinates: [lng, lat] }` — your reference location |
| `maxDistance`       | Maximum distance in **metres**                                                       |
| `distanceField`     | Name of the new field added to each result containing the calculated distance        |
| `num` / `limit`     | Maximum number of results (more efficient than a separate `$limit` stage)            |
| `query`             | Extra filter document (applied on the collection before distance calculation)        |

#### _Setup — create a 2dsphere index on the transformed collection_

```js
db.transformedPersons.createIndex({ location: "2dsphere" });
```

#### _Find persons within 1,000 km, age > 30_

```js
db.transformedPersons.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-71.24, 75.47], // reference point [lng, lat]
      },
      maxDistance: 1000000, // 1,000 km in metres
      num: 10,
      query: { age: { $gt: 30 } },
      distanceField: "distance", // new field added to each result
    },
  },
]);
```

| Rule                | Detail                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| First stage only    | `$geoNear` must be the first pipeline stage — later stages don't have direct collection access |
| Index required      | A `2dsphere` (or `2d`) index must exist on the field referenced in `near`                      |
| `query` vs `$match` | Use `query` inside `$geoNear` rather than a separate early `$match` — it's more efficient      |
| Distance units      | Always **metres** for `2dsphere` indexes                                                       |

---

### Understanding the Aggregation Framework — Summary

| Stage / Operator             | Type        | Purpose                                                                                                                            |
| ---------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `$match`                     | Stage       | Filter documents — same syntax as `find()`. Place early to use indexes.                                                            |
| `$project`                   | Stage       | One-to-one transform: include/exclude/rename/compute fields                                                                        |
| `$group`                     | Stage       | Many-to-one: merge documents, compute aggregates (`$sum`, `$avg`, `$min`, `$max`, `$push`, `$addToSet`, `$first`, `$last`, `$max`) |
| `$sort`                      | Stage       | Sort on any field, including fields derived from prior stages                                                                      |
| `$unwind`                    | Stage       | Expand array field into one document per element                                                                                   |
| `$limit`                     | Stage       | Keep only the first N documents — place after `$sort`                                                                              |
| `$skip`                      | Stage       | Skip the first N documents — place before `$limit` for pagination                                                                  |
| `$bucket`                    | Stage       | Group into user-defined range buckets with summary stats                                                                           |
| `$bucketAuto`                | Stage       | Auto-derive equal-distribution buckets                                                                                             |
| `$out`                       | Stage       | Write pipeline results to a collection (must be last stage)                                                                        |
| `$geoNear`                   | Stage       | Find documents near a point by distance (must be first stage)                                                                      |
| `$convert`                   | Operator    | Convert field to a BSON type; supports `onError`/`onNull`                                                                          |
| `$toDate` / `$toDouble` etc. | Operator    | Shortcut conversion operators                                                                                                      |
| `$isoWeekYear`               | Operator    | Extract ISO year from a `date` field                                                                                               |
| `$concat`                    | Operator    | Concatenate strings                                                                                                                |
| `$toUpper` / `$toLower`      | Operator    | Case conversion                                                                                                                    |
| `$substrCP`                  | Operator    | Extract substring by code point                                                                                                    |
| `$strLenCP`                  | Operator    | String length by code point                                                                                                        |
| `$subtract`                  | Operator    | Subtract two numbers                                                                                                               |
| `$filter`                    | Operator    | Filter array elements by condition (inside `$project`)                                                                             |
| `$push`                      | Accumulator | Append values to group array (duplicates kept)                                                                                     |
| `$addToSet`                  | Accumulator | Append unique values to group array                                                                                                |
| `$first` / `$last`           | Accumulator | First/last value in group (useful after `$sort`)                                                                                   |
| `$max` / `$min`              | Accumulator | Max/min value across grouped documents                                                                                             |
| `$avg`                       | Accumulator | Average value across grouped documents                                                                                             |
| `$slice`                     | Operator    | Extract first/last/range subset of array                                                                                           |
| `$size`                      | Operator    | Count elements in an array                                                                                                         |

**Key pipeline design rules:**

- `$match` and `$sort` early to use indexes and minimise data volume
- `$skip` before `$limit` for pagination
- `$geoNear` must be first; `$out` must be last
- MongoDB auto-optimises some stage orders, but write explicit correct pipelines

> [⬆ Back to Index](#table-of-contents)

---

## Working with Numeric Data

MongoDB supports multiple numeric types for efficient storage and precise calculations. The type you choose affects storage size, query behaviour, and arithmetic precision.

---

### Number Types

MongoDB has four numeric types:

| Type                 | Shell Constructor       | Bits | Integer Only | Decimal Precision                 |
| -------------------- | ----------------------- | ---- | ------------ | --------------------------------- |
| **int32**            | `NumberInt("val")`      | 32   | ✅           | N/A (integers only)               |
| **int64 / long**     | `NumberLong("val")`     | 64   | ✅           | N/A (integers only)               |
| **double (float64)** | plain number e.g. `1.5` | 64   | ❌           | Approximated (IEEE 754)           |
| **Decimal128**       | `NumberDecimal("val")`  | 128  | ❌           | Exact up to 34 significant digits |

**Ranges:**

| Type       | Min                        | Max                                     |
| ---------- | -------------------------- | --------------------------------------- |
| int32      | -2,147,483,648             | 2,147,483,647                           |
| int64      | -9,223,372,036,854,775,808 | 9,223,372,036,854,775,807               |
| double     | Very large range           | Decimal values approximated             |
| Decimal128 | Smaller integer range      | Decimal values exact (≤ 34 sig. digits) |

**When to use each:**

| Type         | Use case                                                               |
| ------------ | ---------------------------------------------------------------------- |
| `int32`      | Normal integers within ±2.1 billion (e.g., age, count, quantity)       |
| `int64`      | Large integers exceeding int32 range (e.g., company valuations)        |
| `double`     | Prices/floats where 2 decimal place display precision is sufficient    |
| `Decimal128` | Financial or scientific calculations requiring exact decimal precision |

```mermaid
flowchart TD
    Q["What number am I storing?"]
    Q --> INT{Whole number only?}
    INT -->|Yes| RANGE{Within ±2.1 billion?}
    RANGE -->|Yes| I32["NumberInt('val')<br/>int32 — 32 bits<br/>e.g. age, count, quantity"]
    RANGE -->|No| I64["NumberLong('val')<br/>int64 — 64 bits<br/>e.g. large IDs, valuations"]
    INT -->|No — has decimals| PREC{Need exact precision?<br/>e.g. money / science}
    PREC -->|No — display only| DBL["plain 1.5<br/>double — 64 bits<br/>⚠️ approximated (IEEE 754)"]
    PREC -->|Yes — must be exact| DEC128["NumberDecimal('val')<br/>Decimal128 — 128 bits<br/>exact up to 34 sig. digits"]

    style Q fill:#e2e3e5,color:#000
    style INT fill:#fff3cd,color:#000
    style RANGE fill:#fff3cd,color:#000
    style PREC fill:#fff3cd,color:#000
    style I32 fill:#d4edda,color:#000
    style I64 fill:#d4edda,color:#000
    style DBL fill:#f8d7da,color:#000
    style DEC128 fill:#cce5ff,color:#000
```

**Shell constructor rules:**

- `NumberInt("val")` → int32
- `NumberLong("val")` → int64
- Plain number (e.g. `1`, `0.3`) → double 64-bit (Shell/JavaScript default)
- `NumberDecimal("val")` → Decimal128

> **Always pass large values as strings** to `NumberInt`, `NumberLong`, and `NumberDecimal` — this prevents JavaScript's own numeric precision limits from corrupting the value before it reaches MongoDB.

**MongoDB Shell is JavaScript-based:** JavaScript treats all numbers as 64-bit floats. Without a constructor, any number — including an integer like `1` — is stored as a double.

---

### Understanding Programming Language Defaults

The MongoDB Shell is implemented in JavaScript. JavaScript **does not differentiate** between integers and floating-point numbers — every number is a 64-bit double by default.

```js
db.numtest.insertOne({ a: 1 });
// Stored as float64 (double) — NOT int32, even though the value is a whole number
```

This is a Shell/JavaScript constraint, **not a MongoDB constraint**. Other language drivers behave differently:

| Language               | Integer type                     | Float type              | Stored in MongoDB as                  |
| ---------------------- | -------------------------------- | ----------------------- | ------------------------------------- |
| **JavaScript / Shell** | No integer type                  | float64 for all numbers | double (64-bit)                       |
| **Python**             | `int` (arbitrary precision)      | `float` (float64)       | `int` → int32/int64; `float` → double |
| **Java**               | `int` (32-bit) / `long` (64-bit) | `double` (64-bit)       | Matches Java types directly           |

**Practical rule:**

- In the Shell (JavaScript): always use `NumberInt(...)` / `NumberLong(...)` / `NumberDecimal(...)` explicitly to store the intended type.
- In Python: a plain `int` variable is already stored as int32 by the driver — no extra wrapper needed.
- Consult your language's MongoDB driver documentation to understand what each native type maps to.

---

### Working with int32

Use `NumberInt("value")` to store a 32-bit integer. This uses less storage than the default 64-bit double for the same whole-number value.

```js
// Insert as int32 (string form is preferred)
db.numtest.insertOne({ a: NumberInt("29") });

// Check storage
db.numtest.stats();
// size is smaller vs. plain `a: 29` stored as double
```

**Shell output:**

```js
test> db.numtest.insertOne({ a: NumberInt(29) })
{
  acknowledged: true,
  insertedId: ObjectId('69abdfce7ed55a861ae21127')
}
test> db.numtest.stats()
{
  size: 29,        // smaller than double (35 bytes for the same value)
  count: 1,
  avgObjSize: 29,
  ...
}
```

**Key points:**

- `NumberInt(29)` and `NumberInt("29")` both work; string form is preferred
- Saves a few bytes per document — meaningful at scale across millions of documents
- Use when the value is always a whole number within the ±2.1 billion range
- In Python/Java, plain integer variables are already stored as int32 by the driver — no wrapper needed in those languages

---

### Working with int64

Use `NumberLong("value")` for integers that exceed int32's ±2.1 billion range.

**Why pass the value as a string:** The Shell runs JavaScript. JavaScript cannot precisely represent very large integers as numeric literals — a bare `NumberLong(9223372036854775807)` silently loses precision because JavaScript truncates the number before MongoDB ever sees it. Passing a string bypasses JavaScript's numeric handling entirely.

```js
// ❌ Wrong — JavaScript drops precision before MongoDB receives the value
db.companies.insertOne({ valuation: NumberLong(9223372036854775807) });
// Warning: NumberLong: specifying a number as argument is deprecated and may
// lead to loss of precision, pass a string instead

// ✅ Correct — pass as string
db.companies.insertOne({ valuation: NumberLong("9223372036854775807") });
```

**int32 overflow — no error, silent value corruption:**

```js
// 5 billion exceeds int32 range — no error, but stored value is WRONG
test > db.numtest.insertOne({ valuation: NumberInt("5000000000") });
test > db.numtest.find()[{ valuation: 705032704 }]; // ❌ Corrupted value, no error thrown

// At exactly the max, it's correct:
test >
  db.numtest.insertOne({ valuation: NumberInt("2147483647") })[
    { valuation: 2147483647 }
  ]; // ✅

// One above max wraps to the minimum (negative):
test >
  db.numtest.insertOne({ valuation: NumberInt("2147483648") })[
    { valuation: -2147483648 }
  ]; // ❌ Overflow wraps to negative
```

> **MongoDB does NOT throw an error on integer overflow** — the value silently wraps or corrupts. Always know the range you need.

**NumberLong shell example:**

```js
test> db.numtest.insertOne({ valuation: NumberLong("1234567891234567890") })
{
  acknowledged: true,
  insertedId: ObjectId('69ac0fca7ed55a861ae2112c')
}
test> db.numtest.find()
[ { valuation: Long('1234567891234567890') } ]  // ✅ Stored exactly
```

---

### Doing Math with Floats int32 and int64

**Why not store numbers as strings?**

Strings cannot be used with arithmetic operators — `$inc`, `$multiply`, etc. will throw a type error:

```js
db.accounts.insertOne({ amount: "10" }); // stored as a string
db.accounts.updateOne({}, { $inc: { amount: 10 } });
// MongoServerError: Cannot apply $inc to a value of non-numeric type
```

**Type preservation during arithmetic:**

If you use `$inc` with a plain number on a `NumberInt` field, MongoDB silently converts the field to float64. Use the same constructor in the update to preserve the type:

```js
// ❌ Type is lost — NumberInt field converted to float64 after update
db.accounts.updateOne({}, { $inc: { amount: 10 } });

// ✅ int32 type preserved
db.accounts.updateOne({}, { $inc: { amount: NumberInt("10") } });

// ✅ int64 type preserved
db.accounts.updateOne({}, { $inc: { valuation: NumberLong("1") } });
```

**int64 precision consequence if plain number is used in `$inc`:**

```js
// Field stored as NumberLong("1234567891234567890")
db.accounts.updateOne({}, { $inc: { amount: 10 } }); // plain number
// Result: Long('1234567891234567900') — WRONG due to float64 intermediate conversion

// Correct:
db.accounts.updateOne({}, { $inc: { amount: NumberLong("10") } });
// Result: Long('1234567891234567900') — ✅ exact
```

**Full working example:**

```js
test> db.accounts.insertOne({ name: "Max", amount: NumberInt("10") })
test> db.accounts.updateOne({}, { $inc: { amount: NumberInt("10") } })
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
test> db.accounts.find()
[ { name: 'Max', amount: 20 } ]  // stored as int32 behind the scenes (looks like plain number in shell)
```

> `NumberInt` and `NumberLong` support all query and update operators (`$gt`, `$lt`, `$sort`, `$inc`) exactly like plain numbers — with the added benefit of their type constraints and storage efficiency.

---

### What's Wrong with Normal Doubles?

Normal 64-bit doubles (the Shell/JavaScript default) use IEEE 754 binary floating-point representation, which **approximates** decimal values rather than storing them exactly. This is a computer science constraint — not a MongoDB limitation.

```mermaid
flowchart LR
    subgraph double path
        A1["Insert: { a: 0.3, b: 0.1 }<br/>stored as float64 approximation"]
        A2["$subtract in $project"]
        A3["Result: 0.19999999999999998 ❌<br/>Wrong due to IEEE 754 binary encoding"]
        A1 --> A2 --> A3
    end

    subgraph Decimal128 path
        B1["Insert: { a: NumberDecimal('0.3'),<br/>b: NumberDecimal('0.1') }<br/>stored as exact base-10"]
        B2["$subtract in $project"]
        B3["Result: Decimal128('0.2') ✅<br/>Exactly correct"]
        B1 --> B2 --> B3
    end

    style A1 fill:#f8d7da,color:#000
    style A2 fill:#fff3cd,color:#000
    style A3 fill:#f8d7da,color:#000
    style B1 fill:#d4edda,color:#000
    style B2 fill:#fff3cd,color:#000
    style B3 fill:#d4edda,color:#000
```

```js
db.science.insertOne({ a: 0.3, b: 0.1 }); // stored as 64-bit floats (approximated)
db.science.aggregate([{ $project: { result: { $subtract: ["$a", "$b"] } } }]);
// Expected: 0.2
// Actual:   0.19999999999999998  ❌ — imprecision from float64 representation
```

**Shell output:**

```js
test> db.science.insertOne({ a: 0.3, b: 0.1 })
{ acknowledged: true, insertedId: ObjectId('69ac14ac7ed55a861ae2113d') }
test> db.science.aggregate([
|   { $project: { result: { $subtract: ["$a", "$b"] } } }
| ])
[
  {
    _id: ObjectId('69ac14ac7ed55a861ae2113d'),
    result: 0.19999999999999998
  }
]
```

**When doubles are acceptable:**

- Displaying a price on a webpage (rounding to 2 decimal places is fine for display)
- Passing values to a third-party payment provider that handles precision on their end
- Approximate scientific values where exact decimal representation is not required

**When doubles are NOT acceptable:**

- Server-side arithmetic in aggregation pipelines where the computed result is used in business logic
- Storing financials that require auditable precision
- Scientific calculations requiring exact decimal representation

Use `Decimal128` when precision matters.

---

### Working with Decimal 128bit

`Decimal128` stores decimal values with **exact precision up to 34 significant digits**. Use `NumberDecimal("value")` in the Shell (always pass as string).

**Direct comparison with double:**

```js
// With normal double (imprecise):
db.science.insertOne({ a: 0.3, b: 0.1 });
db.science.aggregate([{ $project: { result: { $subtract: ["$a", "$b"] } } }]);
// result: 0.19999999999999998  ❌

// With Decimal128 (exact):
db.science.insertOne({ a: NumberDecimal("0.3"), b: NumberDecimal("0.1") });
db.science.aggregate([{ $project: { result: { $subtract: ["$a", "$b"] } } }]);
// result: Decimal128('0.2')  ✅
```

**Shell example:**

```js
test> db.science.insertOne({ a: NumberDecimal("0.3"), b: NumberDecimal("0.1") })
test> db.science.find({})
[
  {
    _id: ObjectId('69ac16627ed55a861ae2113f'),
    a: Decimal128('0.3'),
    b: Decimal128('0.1')
  }
]
test> db.science.aggregate([
|   { $project: { result: { $subtract: ["$a", "$b"] } } }
| ])
[
  {
    _id: ObjectId('69ac16627ed55a861ae2113f'),
    result: Decimal128('0.2')
  }
]
```

**Preserve precision in updates — always use `NumberDecimal` in `$inc`:**

```js
// ❌ Mixes plain float64 into a Decimal128 field — re-introduces imprecision
db.science.updateOne({}, { $inc: { a: 0.1 } });
// Result: Decimal128('0.400000000000000')  — trailing zeros, potential precision drift

// ✅ Keeps full precision
db.science.updateOne({}, { $inc: { a: NumberDecimal("0.1") } });
// Result: Decimal128('0.5')  — exact
```

**Storage trade-off:**

Decimal128 consumes more storage than a double per document:

```js
db.nums.insertOne({ a: 0.1 }); // double — smaller footprint
db.nums.stats(); // size: N

db.nums.insertOne({ a: NumberDecimal("0.1") }); // Decimal128 — larger footprint
db.nums.stats(); // size: N + delta (higher storage cost per document)
```

**Guidelines:**

- Use for financial data (prices, interest, tax calculations)
- Use for scientific work requiring exact decimal representation
- Do **not** use as a default for all floats — wastes storage
- Always use `NumberDecimal("value")` in both inserts and `$inc` updates

---

### Model Monetary Data

> **Source:** MongoDB official documentation (`model-monetary-data`) + established software engineering best practices (IEEE 754, ISO 4217).

---

#### Why float64 (double) Must Never Be Used for Money

MongoDB's default numeric type — when you write a bare decimal literal like `9.99` in the shell or most drivers — is **float64** (BSON double, IEEE 754 binary64). It stores numbers in **base 2**, not base 10.

**Root cause:** Fractions like `1/10` (0.1) cannot be expressed exactly in base 2, just as `1/3` cannot be expressed exactly in base 10. MongoDB stores the closest representable binary fraction — which is almost, but not exactly, the intended value.

**Concrete precision failures:**

```js
// JavaScript / MongoDB shell — all plain number literals are float64:
0.1 + 0.2; // → 0.30000000000000004  (not 0.3)
0.3 - 0.1; // → 0.19999999999999998  (not 0.2)
9.99 * 100; // → 998.9999999999999    (not 999)
1.005 * 100; // → 100.50000000000001   (should be 100.5, rounds wrong)
1.1 + 1.1 + 1.1; // → 3.3000000000000003  (not 3.3)
```

**Real financial harm these errors cause:**

| Error type             | Consequence                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Aggregation drift      | Summing thousands of transactions accumulates tiny errors into visible rounding differences |
| Tax miscalculation     | `amount * taxRate` already inexact; rounding on an inexact value gives wrong cent           |
| Balance mismatch       | Sum of debits ≠ sum of credits in a ledger by a fraction of a cent                          |
| Sorting anomaly        | Two values that are logically equal compare as unequal due to binary representation         |
| Batch processing drift | 1,000,000 × $0.01 in float64 does not reliably sum to exactly $10,000.00                    |

> **Rule:** Never store monetary values as plain untyped numbers (`9.99`) in MongoDB. Use either **Decimal128** or the **Scale Factor (integer)** approach.

---

#### Approach 1 — Decimal128 (`NumberDecimal`)

##### How It Works

BSON type `Decimal128` implements **IEEE 754-2008 decimal128** — it stores numbers in **base 10**, so decimal fractions are represented exactly as written.

| Property           | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| Storage            | 128 bits (16 bytes)                                    |
| Significant digits | Up to **34** decimal digits                            |
| Exponent range     | −6143 to +6144                                         |
| Shell constructor  | `NumberDecimal("value")` — **always pass as a string** |

##### When to Use

- Financial, monetary, or accounting calculations
- Any aggregation pipeline that does arithmetic on money (`$sum`, `$multiply`, `$divide`, etc.)
- Scientific measurements requiring exact decimal representation
- Multi-currency apps where different currencies have different numbers of decimal places
- New applications using modern drivers (all official drivers ≥ 2018 support it)

##### Pros and Cons

| Pros                                                    | Cons                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Exact base-10 representation — no drift                 | 16 bytes per value (2× a double, 4× an int32)                                         |
| Works directly with all MongoDB arithmetic operators    | Must always pass value as a **string** to the constructor                             |
| Human-readable — stored value matches what you inserted | Slightly slower arithmetic than integer types                                         |
| Handles variable-precision currencies natively          | Older drivers (pre-2016) may not support it                                           |
| `$gte`/`$lte` comparisons are exact                     | Trailing zeros preserved: `"9.90"` ≠ `"9.9"` in string form but are numerically equal |

##### Code Examples

```js
// ── INSERT ─────────────────────────────────────────────────────────────────

db.orders.insertOne({
  item: "laptop",
  price: NumberDecimal("999.99"), // ✅ exact
  taxRate: NumberDecimal("0.08875"),
  qty: NumberInt("2"),
});

// ❌ WRONG — bare literal stores as float64:
db.orders.insertOne({ price: 999.99 }); // → double, not Decimal128

// ── QUERY ──────────────────────────────────────────────────────────────────

// Exact match
db.orders.find({ price: NumberDecimal("999.99") });

// Range query
db.orders.find({
  price: { $gte: NumberDecimal("100.00"), $lte: NumberDecimal("1000.00") },
});

// ── ARITHMETIC IN AGGREGATION ──────────────────────────────────────────────

db.orders.aggregate([
  {
    $project: {
      subtotal: { $multiply: ["$price", "$qty"] },
      tax: { $multiply: ["$price", "$qty", "$taxRate"] },
      total: {
        $add: [
          { $multiply: ["$price", "$qty"] },
          { $multiply: ["$price", "$qty", "$taxRate"] },
        ],
      },
    },
  },
]);
// subtotal → Decimal128('1999.98')   ✅ exact
// tax      → Decimal128('177.498225')
// total    → Decimal128('2177.478225')

// ── UPDATE — use NumberDecimal in $inc too ─────────────────────────────────

// ❌ WRONG — mixes plain float into Decimal128 field → re-introduces imprecision:
db.orders.updateOne({ item: "laptop" }, { $inc: { price: 0.01 } });

// ✅ CORRECT — stays Decimal128:
db.orders.updateOne(
  { item: "laptop" },
  { $inc: { price: NumberDecimal("0.01") } }
);

// ── SUM ACROSS DOCUMENTS ──────────────────────────────────────────────────

db.orders.aggregate([
  {
    $group: { _id: null, revenue: { $sum: { $multiply: ["$price", "$qty"] } } },
  },
]);
// → Decimal128('...') — exact sum, no drift
```

##### Gotchas

1. **Always use string argument:** `NumberDecimal("9.99")` not `NumberDecimal(9.99)`. The numeric literal `9.99` is already a float64 _before_ it reaches the constructor.
2. **Mixed-type arithmetic:** If one operand is Decimal128 and another is double, MongoDB promotes to double — precision is lost. Keep all monetary fields as Decimal128.
3. **`$inc` with wrong type:** Using `{ $inc: { amount: 0.01 } }` on a Decimal128 field silently converts it to double. Always `$inc` with `NumberDecimal("0.01")`.
4. **Trailing zeros:** `NumberDecimal("9.90")` and `NumberDecimal("9.9")` are numerically equal but have different string representations. When comparing or displaying, be consistent.
5. **Driver support:** Verify your application driver version supports Decimal128 — all modern official MongoDB drivers do.

---

#### Approach 2 — Scale Factor (Integer)

##### How It Works

Store monetary values **multiplied by a power of 10** (the scale factor) as an integer. Integers are always exact in base 2.

```
$9.99  →  stored as  999   (scale = 100, i.e., ×100 = cents)
$1,234.56  →  stored as 123456
€0.50  →  stored as 50
¥1499  →  stored as 1499   (JPY has 0 decimal places, scale = 1)
```

The scale factor is either:

- **Implied by convention** (e.g., "all prices are in cents") documented in your schema
- **Stored per-document** in a `scale` field (safer for multi-currency)

##### When to Use

- Single-currency applications where decimal place count is fixed (e.g., USD always has 2)
- Performance- or storage-critical systems
- Environments using older drivers without Decimal128 support
- When the application layer handles all arithmetic anyway (no DB-side math)
- Systems that already use integers for money (common in payments industry — Stripe API uses integer cents)

##### Pros and Cons

| Pros                                                             | Cons                                                                          |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Compact: int32 = 4 bytes, int64 = 8 bytes (vs 16 for Decimal128) | Stored value doesn't look like the real price (999 ≠ $9.99)                   |
| Fastest arithmetic — integer operations                          | Scale factor must be consistently applied and removed in app code             |
| Perfect precision for fixed-decimal currencies                   | Multi-currency complicates things (JPY = 0 decimals, KWD = 3 decimals)        |
| Universal — all drivers handle integers identically              | `$divide` in aggregation returns float64, negating precision goal             |
| Well-understood pattern (used by Stripe, payment gateways)       | Multiplication of two monetary values doubles the scale — easy source of bugs |

##### ISO 4217 Minor Unit (Scale Factor) Reference

| Currency                               | Decimal places | Scale factor |
| -------------------------------------- | -------------- | ------------ |
| USD, EUR, GBP, CAD, AUD                | 2              | 100          |
| JPY, KRW, VND                          | 0              | 1            |
| KWD, BHD, OMR (Kuwaiti/Bahraini/Omani) | 3              | 1000         |
| CLF (Chilean Unit of Account)          | 4              | 10000        |

##### Code Examples

```js
// ── INSERT ─────────────────────────────────────────────────────────────────

// Convention: all USD amounts stored as integer cents (×100)
db.orders.insertOne({
  item: "laptop",
  price_cents: NumberLong("99999"), // $999.99 stored as 99999 cents
  qty: NumberInt("2"),
  currency: "USD",
  scale: NumberInt("100"), // explicit scale — good practice
});

// ❌ WRONG — int32 overflows at 2,147,483,647 (~$21.4 million in cents):
db.orders.insertOne({ price_cents: NumberInt("999999999999") }); // silent overflow!

// ✅ Use NumberLong for large amounts:
db.orders.insertOne({ price_cents: NumberLong("999999999999") });

// ── QUERY ──────────────────────────────────────────────────────────────────

// Find all products >= $10.00 (i.e., >= 1000 cents)
db.orders.find({ price_cents: { $gte: NumberInt("1000") } });

// Find products in the $9.00–$10.00 range
db.orders.find({
  price_cents: { $gte: NumberInt("900"), $lte: NumberInt("1000") },
});

// ── AGGREGATION ───────────────────────────────────────────────────────────

// Total in cents — keep as integer, divide in application layer
db.orders.aggregate([
  {
    $project: {
      total_cents: { $multiply: ["$price_cents", "$qty"] },
      // → 199998 cents; app divides by 100 → $1999.98
    },
  },
]);

// ⚠️  Dividing inside aggregation returns float64 — defeats the purpose:
db.orders.aggregate([
  {
    $project: {
      total: { $divide: [{ $multiply: ["$price_cents", "$qty"] }, 100] },
      // → 1999.98 as float64 — imprecise for further arithmetic
    },
  },
]);
// Only do this for display/reporting, not for further monetary calculations.

// ── UPDATE ────────────────────────────────────────────────────────────────

// Apply a $1.00 discount (100 cents)
db.orders.updateOne(
  { item: "laptop" },
  { $inc: { price_cents: NumberInt("-100") } }
);
```

##### Scale Factor Gotchas

1. **`$divide` returns float64:** If you need to divide a scaled integer in the aggregation pipeline, the result is a double. For reporting this is usually fine; for further monetary arithmetic it re-introduces imprecision. Prefer dividing in application code.
2. **int32 overflow cap:** `NumberInt` holds up to ±2,147,483,647. For currencies in cents, that's ~$21.4 million. Use `NumberLong` for anything larger.
3. **Multiplication doubles the scale:** `price_cents × price_cents` would produce a value with scale² — never multiply two monetary values together; only multiply `price × quantity`.
4. **Forgetting the scale factor:** A query like `{ price_cents: { $gte: 10 } }` means ≥ $0.10, not ≥ $10.00. Always apply the scale in both reads and writes.
5. **Multi-currency scale divergence:** If you add JPY support later but forget to update the scale, `1499` in USD context is $14.99 but in JPY context it's ¥1499 — completely different values. Store an explicit `scale` or `currency` field and enforce it.

---

#### MongoDB's Official Recommendation

> MongoDB **recommends `Decimal128`** for monetary and financial data in modern applications.

The scale-factor approach is acknowledged as a valid alternative — particularly for performance-sensitive or legacy-driver environments — but Decimal128 is the primary recommendation because:

- It eliminates the application-layer burden of managing scale factors
- It works directly and correctly with the aggregation pipeline
- It is the standard IEEE 754-2008 decimal type, recognised across databases and languages
- It handles variable-decimal-place currencies (JPY, KWD) without schema changes

```mermaid
flowchart TD
    START["Storing monetary data?"]
    START --> MODERN{New app +<br/>modern driver?}
    MODERN -->|Yes| D128A["✅ Decimal128<br/>NumberDecimal('9.99')"]
    MODERN -->|No| AGG{Doing arithmetic<br/>in aggregation pipeline?}
    AGG -->|Yes| D128B["✅ Decimal128<br/>$divide returns float64<br/>with scale factor"]
    AGG -->|No| MULTI{Multi-currency or<br/>non-2-decimal currencies?}
    MULTI -->|Yes| D128C["✅ Decimal128<br/>handles JPY / KWD natively"]
    MULTI -->|No| PERF{Performance-critical<br/>or legacy driver?}
    PERF -->|Yes| SCALE["⚖️ Scale Factor<br/>NumberLong('999') = $9.99<br/>store scale separately"]
    PERF -->|No| D128D["✅ Decimal128<br/>recommended default"]

    style D128A fill:#d4edda,color:#000
    style D128B fill:#d4edda,color:#000
    style D128C fill:#d4edda,color:#000
    style D128D fill:#d4edda,color:#000
    style SCALE fill:#fff3cd,color:#000
    style START fill:#e2e3e5,color:#000
    style MODERN fill:#cce5ff,color:#000
    style AGG fill:#cce5ff,color:#000
    style MULTI fill:#cce5ff,color:#000
    style PERF fill:#cce5ff,color:#000
```

| Scenario                                      | Recommended approach          |
| --------------------------------------------- | ----------------------------- |
| New application, modern drivers               | **Decimal128**                |
| Arithmetic in the aggregation pipeline        | **Decimal128**                |
| Multi-currency with varying decimal places    | **Decimal128**                |
| Fixed-currency (e.g., USD-only), simple reads | Either — integers are simpler |
| Performance/storage-critical, no DB-side math | Scale factor (integers)       |
| Legacy / older driver compatibility           | Scale factor (integers)       |
| Scientific or high-precision calculations     | **Decimal128**                |

---

#### Multi-Currency Patterns

##### Pattern A — Embedded `{ amount, currency }` Object (Recommended)

Store amount and currency code together as an embedded document. This is the pattern shown in MongoDB's official data modelling tutorial.

```js
// Single-currency price field
db.products.insertOne({
  name: "Widget Pro",
  price: { amount: NumberDecimal("9.99"), currency: "USD" },
});

// Query
db.products.find({
  "price.currency": "USD",
  "price.amount": { $gte: NumberDecimal("5.00") },
});

// Multi-currency product — array of prices
db.products.insertOne({
  name: "Widget Pro",
  prices: [
    { amount: NumberDecimal("9.99"), currency: "USD" },
    { amount: NumberDecimal("8.75"), currency: "EUR" },
    { amount: NumberDecimal("1499"), currency: "JPY" },
    { amount: NumberDecimal("13.49"), currency: "KWD" }, // 3 decimal places — no schema change needed
  ],
});

// Find the USD price of a product
db.products.find(
  { name: "Widget Pro", "prices.currency": "USD" },
  { prices: { $elemMatch: { currency: "USD" } } }
);

// Revenue aggregation in USD
db.orders.aggregate([
  { $match: { "price.currency": "USD" } },
  { $group: { _id: null, total: { $sum: "$price.amount" } } },
]);
// → Decimal128('...') — exact
```

##### Pattern B — Scale Factor with Explicit `currency` and `scale` Fields

```js
db.orders.insertOne({
  item: "Widget Pro",
  amount: NumberLong("999"), // $9.99 in USD  →  999 cents
  currency: "USD",
  scale: NumberInt("100"), // ISO 4217 minor unit exponent
});

db.orders.insertOne({
  item: "Widget Pro",
  amount: NumberLong("1499"), // ¥1499 in JPY  →  1499 (no minor unit)
  currency: "JPY",
  scale: NumberInt("1"),
});

// Application code to get display value:
// displayValue = doc.amount / doc.scale
// 999  / 100 → 9.99 USD
// 1499 / 1   → 1499 JPY
```

##### Pattern Comparison

|                        | Decimal128 + currency | Scale factor + currency + scale  |
| ---------------------- | --------------------- | -------------------------------- |
| Human-readable in DB   | ✅ `"9.99"`           | ❌ `999`                         |
| DB-side arithmetic     | ✅ exact              | ⚠️ `$divide` → float64           |
| Multi-currency support | ✅ native             | ⚠️ must track scale per currency |
| Storage per field      | 16 bytes              | 8–12 bytes                       |
| Driver compatibility   | Modern drivers        | Universal                        |

---

#### Quick Reference — Monetary Data Decision Card

```
Is your application new and using a modern driver?
  └─ YES → Use Decimal128 ("9.99" as NumberDecimal("9.99") + currency: "USD")
  └─ NO (legacy driver / extreme storage constraint)
       └─ Use scale factor integers (amount_cents: NumberLong("999") + currency + scale)

Are you doing arithmetic in the aggregation pipeline?
  └─ YES → Use Decimal128 (scale factor + $divide = float64, defeats the purpose)

Do you have multi-currency with non-2-decimal currencies (JPY, KWD)?
  └─ YES → Use Decimal128 (scale factor requires per-currency scale management)

Absolute rules:
  ✅ Always pass NumberDecimal values as strings: NumberDecimal("9.99")
  ✅ Always use NumberDecimal in $inc on Decimal128 fields
  ✅ Use NumberLong (not NumberInt) for scale-factor amounts > $21.4 million
  ❌ Never store money as a bare decimal literal: { price: 9.99 }
  ❌ Never use $divide on monetary integers for further arithmetic
```

---

### Working with Numeric Data — Summary

| Type           | Shell Constructor      | Bits | Integer Only | Precision              | Best For                            |
| -------------- | ---------------------- | ---- | ------------ | ---------------------- | ----------------------------------- |
| **int32**      | `NumberInt("val")`     | 32   | ✅           | Exact (no decimals)    | Ages, counts, IDs within ±2.1B      |
| **int64**      | `NumberLong("val")`    | 64   | ✅           | Exact (no decimals)    | Large counters, company valuations  |
| **double**     | plain `1.5`            | 64   | ❌           | Approximated           | Prices for display, general floats  |
| **Decimal128** | `NumberDecimal("val")` | 128  | ❌           | Exact (34 sig. digits) | Financial / scientific calculations |

**Critical rules:**

1. Pass large values to `NumberLong` and `NumberDecimal` as **strings**, not numeric literals
2. Use the same number type in `$inc` updates as in inserts — mixing plain numbers converts the field to float64
3. Strings cannot be used with arithmetic operators — always store typed numbers
4. Integer overflow is **silent** — MongoDB does not throw an error, the value silently corrupts

**Precision gotcha:**

```js
0.3 - 0.1 = 0.19999999999999998  // double (default)
0.3 - 0.1 = 0.2                   // Decimal128 (exact)
```

> [⬆ Back to Index](#table-of-contents)

---

## MongoDB and Security

MongoDB provides a layered security model. As a developer, the most important areas are **authentication/authorization** and **transport encryption**.

---

### Introduction

MongoDB's security model is built around six areas:

| Area                               | Description                                      | Who is responsible                       |
| ---------------------------------- | ------------------------------------------------ | ---------------------------------------- |
| **Authentication & Authorization** | Who can connect; what they can do                | Developer + Admin                        |
| **Transport Encryption (TLS/SSL)** | Data encrypted in transit between app and server | Developer + Admin                        |
| **Encryption at Rest**             | Data encrypted on disk                           | Admin (Enterprise) + Developer (hashing) |
| **Auditing**                       | Logging who did what and when                    | Admin                                    |
| **Network Security**               | Firewalls, VPCs, IP allowlists                   | Admin / Infra                            |
| **Backups & Updates**              | Regular backups; keep software patched           | Admin                                    |

This module covers the first three — the ones that directly affect your work as a developer.

```mermaid
flowchart TD
    APP(["Your Application"])
    APP --> NET["🔒 Network Security<br/>Firewalls, VPCs, IP allowlists<br/>Admin / Infra"]
    NET --> TLS["🔒 Transport Encryption TLS/SSL<br/>Data encrypted in transit<br/>Developer + Admin"]
    TLS --> AUTH["🔑 Authentication<br/>Who can connect?<br/>Username + password<br/>Developer + Admin"]
    AUTH --> AUTHZ["🛡️ Authorization RBAC<br/>What can they do?<br/>Roles + privileges<br/>Developer + Admin"]
    AUTHZ --> DB[("MongoDB Server")]
    DB --> REST["🔒 Encryption at Rest<br/>Data encrypted on disk<br/>Admin Enterprise + Dev hashing"]
    DB --> AUDIT["📋 Auditing<br/>Logging who did what<br/>Admin"]

    style APP fill:#cce5ff,color:#000
    style NET fill:#e2e3e5,color:#000
    style TLS fill:#d4edda,color:#000
    style AUTH fill:#d4edda,color:#000
    style AUTHZ fill:#d4edda,color:#000
    style DB fill:#e2e3e5,color:#000
    style REST fill:#fff3cd,color:#000
    style AUDIT fill:#e2e3e5,color:#000
```

MongoDB uses a **Role-Based Access Control (RBAC)** model to manage both _who_ can connect and _what_ they can do.

#### _Authentication vs Authorization_

| Concept            | Question           | How                                          |
| ------------------ | ------------------ | -------------------------------------------- |
| **Authentication** | _Who are you?_     | Username + password login against a database |
| **Authorization**  | _What can you do?_ | Roles assigned to the authenticated user     |

**Analogy:** Authentication = your key card to enter the office. Authorization = what rooms and systems you can access once inside.

> **Important:** "Users" in MongoDB means users of the **MongoDB server** (your app, a DBA, a data analyst) — **not** end-users of your application. Your application's customer accounts are a separate concern managed by your own code.

#### _How RBAC Works_

```
User (username + password)
  └─ assigned Roles
       └─ each Role contains Privileges
            └─ Privilege = Resource + Action
                           e.g.  products collection  +  insert command
                           e.g.  analytics DB         +  find command
```

- **Resource**: A collection, database, or the whole cluster
- **Action**: A MongoDB command (`find`, `insert`, `update`, `delete`, `createCollection`, etc.)
- **Privilege**: One resource + one action
- **Role**: A named bundle of privileges
- **User**: A login entity assigned one or more roles

```mermaid
flowchart TD
    U["👤 User<br/>username + password"]
    U --> R1["Role: readWrite<br/>on shop DB"]
    U --> R2["Role: read<br/>on analytics DB"]

    R1 --> P1["Privilege<br/>shop.orders + find"]
    R1 --> P2["Privilege<br/>shop.orders + insert"]
    R1 --> P3["Privilege<br/>shop.orders + update"]

    R2 --> P4["Privilege<br/>analytics.persons + find"]

    P1 & P2 & P3 --> RES1[("shop database")]
    P4 --> RES2[("analytics database")]

    NOTE["Principle of Least Privilege:<br/>Grant only what is needed"]

    style U fill:#cce5ff,color:#000
    style R1 fill:#d4edda,color:#000
    style R2 fill:#d4edda,color:#000
    style P1 fill:#fff3cd,color:#000
    style P2 fill:#fff3cd,color:#000
    style P3 fill:#fff3cd,color:#000
    style P4 fill:#fff3cd,color:#000
    style RES1 fill:#e2e3e5,color:#000
    style RES2 fill:#e2e3e5,color:#000
    style NOTE fill:#f8d7da,color:#000
```

Different people/processes need different access levels — this is the **principle of least privilege**: grant only what is needed.

| User type              | Needs                                      | Example role               |
| ---------------------- | ------------------------------------------ | -------------------------- |
| Database administrator | Create users, configure server, manage DBs | `userAdminAnyDatabase`     |
| App / developer        | Insert, read, update, delete data          | `readWrite` on specific DB |
| Data analyst / BI      | Read data only                             | `read` on specific DB      |

---

### Creating a User

#### _Enabling Authentication — `--auth` flag_

By default, MongoDB runs without authentication (anyone who can connect can do anything). Add `--auth` to require all clients to log in:

```bash
mongod --auth --dbpath /path/to/data --logpath /path/to/log
```

#### _The Localhost Exception_

When `--auth` is enabled and **no users exist yet**, MongoDB allows one unauthenticated connection from `localhost` to create the first user. This is called the **localhost exception**. Use it to create your initial admin user immediately.

#### _Creating the First Admin User_

```js
// Connect to mongosh while server has --auth enabled (no users yet)
mongosh

// Switch to admin database first
use admin

// Create the first user with admin rights
db.createUser({
  user:  "adminUser",
  pwd:   "securePassword",
  roles: ["userAdminAnyDatabase"]
})
// { ok: 1 }

// Now authenticate as that user
db.auth("adminUser", "securePassword")
// { ok: 1 }

show dbs   // now works
```

> `userAdminAnyDatabase` grants this user the ability to create and manage users across all databases — but NOT to read or write data. Use it solely for user administration.

#### _Authenticating on Connection_

Pass credentials at connection time using `--authenticationDatabase` to specify which DB the user was created on:

```bash
mongosh -u adminUser -p securePassword --authenticationDatabase admin
```

#### _Shell Example — Full Flow_

```js
// Before --auth: unauthenticated connections silently allowed
// After adding --auth: connections succeed but all commands are blocked

test> show dbs
// (empty — no error, but access denied silently)

test> db.science.find({})
// MongoServerError[Unauthorized]: not authorized on test ...

// Switch to admin DB and create first user (localhost exception)
test> use admin
admin> db.createUser({ user: "Prash", pwd: "Prash", roles: ["userAdminAnyDatabase"] })
{ ok: 1 }

admin> db.auth("Prash", "Prash")
{ ok: 1 }

admin> show dbs
admin   52.00 KiB
config  12.00 KiB
local   40.00 KiB
```

---

### Built-In Roles — An Overview

MongoDB ships with a comprehensive set of built-in roles covering all standard use cases. You can also create custom roles (admin task — see official docs).

| Category             | Role                   | What it allows                                                                     |
| -------------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| **Database User**    | `read`                 | `find`, `listCollections`, aggregation reads on one DB                             |
|                      | `readWrite`            | All `read` operations + `insert`, `update`, `delete`, `createCollection` on one DB |
| **Database Admin**   | `dbAdmin`              | Stats, indexes, collections management — not data access                           |
|                      | `userAdmin`            | Create and manage users on one DB                                                  |
|                      | `dbOwner`              | Combines `readWrite` + `dbAdmin` + `userAdmin` on one DB                           |
| **All Database**     | `readAnyDatabase`      | `read` across **all** databases                                                    |
|                      | `readWriteAnyDatabase` | `readWrite` across **all** databases                                               |
|                      | `userAdminAnyDatabase` | `userAdmin` across **all** databases (used for the first admin user)               |
|                      | `dbAdminAnyDatabase`   | `dbAdmin` across **all** databases                                                 |
| **Cluster Admin**    | `clusterAdmin`         | Manage replica sets and sharded clusters                                           |
|                      | `clusterManager`       | Monitor and manage cluster operations                                              |
|                      | `clusterMonitor`       | Read-only monitoring of clusters                                                   |
|                      | `hostManager`          | Manage and monitor individual mongod instances                                     |
| **Backup / Restore** | `backup`               | Perform `mongodump` backups                                                        |
|                      | `restore`              | Perform `mongorestore` operations                                                  |
| **Superuser**        | `root`                 | Full read/write/admin access to everything — equivalent to pre-auth mode           |
|                      | `dbOwner` on `admin`   | Superuser-level: can create users and change own roles                             |
|                      | `userAdmin` on `admin` | Can create users with any role (including `root`)                                  |

> **Rule of thumb:** Assign the narrowest role that allows the user to do their job. Never use `root` for application accounts.

---

### Assigning Roles to Users and Databases

#### _Creating an Application User on a Specific Database_

Roles are scoped to the database the user is created on by default. A user created on `shop` with `readWrite` can only read/write in `shop`.

```js
// Log in as admin user first
mongosh -u Prash -p Prash --authenticationDatabase admin

// Switch to the target database
use shop

// Create app user — role is automatically scoped to 'shop'
db.createUser({
  user:  "appdev",
  pwd:   "dev",
  roles: ["readWrite"]
})
// { ok: 1 }
```

#### _Connecting as the New User_

```bash
# --authenticationDatabase must match the DB the user was created on
mongosh -u appdev -p dev --authenticationDatabase shop
```

```js
// Must explicitly switch to the database the role applies to
use shop
db.products.insertOne({ name: "A Book" })
// { acknowledged: true, insertedId: ObjectId('...') }

db.products.find()
// [ { _id: ObjectId('...'), name: 'A Book' } ]

// Trying to access another DB fails (readWrite is scoped to shop only)
use blog
db.posts.insertOne({ title: "Hello" })
// MongoServerError[Unauthorized]: not authorized on blog ...
```

#### _Shell Output Example_

```js
// Creating user
test> use shop
switched to db shop
shop> db.createUser({ user: "appdev", pwd: "dev", roles: ["readWrite"] })
{ ok: 1 }

// Connecting as appdev
mongosh -u appdev -p dev --authenticationDatabase shop
test> use shop
shop> db.products.insertOne({ name: "A Book" })
{ acknowledged: true, insertedId: ObjectId('69ac4aaeb1d9d5f99823c08a') }
```

---

### Updating and Extending Roles to Other Databases

Use `db.updateUser()` to modify an existing user's roles. This **replaces** the entire roles array (not additive) — always re-include all required roles.

#### _Adding Access to a Second Database_

To give a user `readWrite` on both `shop` and `blog`, you must be logged in as an admin user with permission to update users in that database:

```js
// Log in as admin (must switch to the DB the user was created on)
use admin
db.auth("Prash", "Prash")
// { ok: 1 }

use shop

// Update — roles array REPLACES the old one entirely
db.updateUser("appdev", {
  roles: [
    "readWrite",                      // shop (implied from the user's home DB)
    { role: "readWrite", db: "blog" } // explicit second database
  ]
})
// { ok: 1 }

// Verify
db.getUser("appdev")
// {
//   _id: 'shop.appdev',
//   user: 'appdev',
//   db: 'shop',
//   roles: [
//     { role: 'readWrite', db: 'shop' },
//     { role: 'readWrite', db: 'blog' }
//   ]
// }
```

#### _Verify the Extended Access_

```js
// Log back in as appdev
mongosh -u appdev -p dev --authenticationDatabase shop

use blog
db.posts.insertOne({ title: "hello!" })
// { acknowledged: true, insertedId: ObjectId('69ac4c21b1d9d5f99823c08b') }
// ✅ Works — blog access was granted explicitly
```

#### _Key Points_

- `db.updateUser(username, updateDoc)` — second arg describes the change, not a `$set`
- Passing `roles: [...]` **replaces** all existing roles — always include everything the user needs
- The user lives on the database they were created on (`_id: 'shop.appdev'`) but their roles can span any database
- Only users with `userAdmin` (or equivalent) on that database can call `updateUser`

---

### Adding SSL Transport Encryption

MongoDB uses **TLS** (Transport Layer Security — the modern successor to SSL) to encrypt data in transit between your application and the MongoDB server. Without this, anyone intercepting the network traffic can read your data.

#### _How TLS Works in MongoDB_

```mermaid
flowchart TD
    subgraph Development
        CERT["1. Generate self-signed cert<br/>openssl req -x509 ...<br/>CN must match hostname"]
        PEM["2. Create PEM file<br/>cat key.pem cert.pem > mongodb.pem<br/>(private key + certificate)"]
        CERT --> PEM
    end

    subgraph Connection Flow
        APP(["App / mongosh"])
        TLS["TLS Handshake<br/>App encrypts with server public key"]
        SRV["MongoDB Server<br/>--tlsMode requireTLS<br/>--tlsCertificateKeyFile mongodb.pem"]
        DEC["Decrypts with private key<br/>reads / writes data"]
        APP -->|"--tls --host localhost"| TLS
        TLS --> SRV
        SRV --> DEC
    end

    PEM --> SRV

    SNIFF["❌ Without TLS:<br/>Anyone on the network<br/>can read your data"]
    SAFE["✅ With TLS:<br/>Data is unreadable<br/>in transit"]

    TLS --> SAFE
    APP -.->|no TLS| SNIFF

    style APP fill:#cce5ff,color:#000
    style TLS fill:#d4edda,color:#000
    style SRV fill:#e2e3e5,color:#000
    style DEC fill:#d4edda,color:#000
    style CERT fill:#fff3cd,color:#000
    style PEM fill:#fff3cd,color:#000
    style SNIFF fill:#f8d7da,color:#000
    style SAFE fill:#d4edda,color:#000
```

A **PEM file** bundles the private key and certificate together. MongoDB uses it to establish the encrypted channel. In production, the certificate should come from a trusted Certificate Authority (CA); in development, a self-signed certificate is sufficient.

#### _Creating a Self-Signed Certificate (Development)_

```bash
# Generate private key and self-signed certificate (interactive — enter 'localhost' for Common Name)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 \
  -nodes -subj "/C=XX/ST=State/L=City/O=Dev/OU=Dev/CN=localhost"

# Combine into a single PEM file that MongoDB expects
cat key.pem cert.pem > mongodb.pem
```

> **Critical:** The `CN` (Common Name) in the certificate must match the hostname you use to connect. Use `localhost` for local development. In production, use your server's actual domain name.

#### _Starting mongod with TLS Required_

```bash
mongod --auth \
       --dbpath /path/to/data \
       --logpath /path/to/log \
       --tlsMode requireTLS \
       --tlsCertificateKeyFile /path/to/mongodb.pem
```

| TLS mode     | Behaviour                                    |
| ------------ | -------------------------------------------- |
| `disabled`   | TLS off — plain text connections only        |
| `allowTLS`   | Accepts both TLS and non-TLS connections     |
| `preferTLS`  | Prefers TLS but allows plain text            |
| `requireTLS` | Rejects any connection that does not use TLS |

#### _Connecting with TLS_

```bash
# Modern mongosh syntax (TLS flag + certificate key file)
mongosh --tls \
        --tlsCertificateKeyFile ./mongodb.pem \
        --host localhost \
        -u adminUser -p securePassword \
        --authenticationDatabase admin
```

> The `--host localhost` flag must match the `CN` in the certificate. Without it, mongosh will try `127.0.0.1`, which counts as a different hostname and will fail certificate validation.

#### _CA File (Production)_

In production, you get a PEM file **and** a CA file from your certificate authority. Include both:

```bash
mongod --tlsMode requireTLS \
       --tlsCertificateKeyFile /path/to/server.pem \
       --tlsCAFile /path/to/ca.pem
```

The CA file prevents man-in-the-middle attacks by verifying that the server's certificate was signed by a trusted authority.

#### _Shell Example from Course_

```bash
# Generate PEM (non-interactive)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
  -sha256 -days 3650 -nodes \
  -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=Dev/CN=localhost"

cat key.pem cert.pem > mongodb.pem

# Connect (mongosh uses --tls in newer versions)
mongosh --tlsCertificateKeyFile ./mongodb.pem
# → prompts for TLS key file password (if set), then connects
```

---

### Encryption at Rest

Encrypting data **at rest** means the data files stored on disk are unreadable without the decryption key — even if someone gains direct filesystem access to your MongoDB server.

#### _Two Approaches_

| Approach                               | Who does it                | How                                                                                                            |
| -------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Storage-level file encryption**      | Admin (MongoDB Enterprise) | MongoDB Enterprise has built-in encryption of all `.wt` data files on disk. Enable it during `mongod` startup. |
| **Application-level field encryption** | Developer                  | Hash or encrypt sensitive field values in your application code before inserting into MongoDB                  |

#### _MongoDB Enterprise — Storage Encryption_

MongoDB Enterprise provides **Encrypted Storage Engine** support, which encrypts the entire WiredTiger data directory (`collection-*.wt`, `index-*.wt`, journal files) at rest. This is transparent to queries — data is decrypted automatically on access.

See the official MongoDB documentation (linked in the course's last module lecture) for configuration steps.

#### _Application-Level Encryption — Developer Responsibility_

Even without Enterprise, you as a developer should **always hash sensitive values** before storing them:

```js
// ❌ WRONG — plain text password stored in DB
db.users.insertOne({ email: "user@example.com", password: "mySecret123" });

// ✅ CORRECT — hash the password first (e.g., using bcrypt in Node.js)
const bcrypt = require("bcrypt");
const hash = await bcrypt.hash("mySecret123", 12);
db.users.insertOne({ email: "user@example.com", password: hash });
```

**Principle:** Any data that would be damaging if exposed (passwords, national IDs, payment details) should be hashed or encrypted in application code before it ever reaches the database.

> Password hashing and field-level encryption in application drivers is covered in the **From Shell to Driver** module later in the course.

#### _Defence in Depth — Full Picture_

```
Request from app
    │
    ▼
TLS/SSL (transport encryption) ── data encrypted in transit
    │
    ▼
MongoDB server authentication (--auth + RBAC)
    │
    ▼
Data files on disk
    │
    ├── MongoDB Enterprise: storage engine encryption (file-level)
    └── Application code: hashed/encrypted field values (field-level)
```

Both layers matter: transport encryption protects data on the wire; at-rest encryption protects data if storage media is physically stolen or filesystem access is obtained.

---

### MongoDB and Security — Summary

| Topic                    | Key points                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Authentication**       | Enable with `--auth`; use `db.createUser()` in admin DB via localhost exception for first user                           |
| **Authorization**        | Users have roles; roles have privileges (resource + action); always use least-privilege                                  |
| **Built-in roles**       | `readWrite` (app user), `read` (analyst), `userAdminAnyDatabase` (user admin), `root` (full access)                      |
| **Creating users**       | `db.createUser({ user, pwd, roles })` — attach role as string (scoped to current DB) or as `{ role, db }` for another DB |
| **Updating users**       | `db.updateUser(name, { roles: [...] })` — **replaces** entire roles array                                                |
| **Transport encryption** | TLS via `--tlsMode requireTLS` + `--tlsCertificateKeyFile`; use `--tls --host localhost` in mongosh                      |
| **Encryption at rest**   | Enterprise: storage engine file encryption; Developer: always hash passwords / sensitive fields in app code              |

**Critical commands:**

```js
// Create user
db.createUser({ user: "name", pwd: "pass", roles: ["readWrite"] })

// Authenticate in shell
db.auth("name", "pass")

// Update user roles (replaces all)
db.updateUser("name", { roles: ["readWrite", { role: "readWrite", db: "otherDB" }] })

// Inspect a user
db.getUser("name")

// Connection string with auth
mongosh -u name -p pass --authenticationDatabase dbName

// Connection string with TLS
mongosh --tls --tlsCertificateKeyFile ./mongodb.pem --host localhost
```

> [⬆ Back to Index](#table-of-contents)
