# ORM / ODM Notes — Mongoose & Prisma

## Table of Contents

- [ORM / ODM Notes — Mongoose \& Prisma](#orm--odm-notes--mongoose--prisma)
  - [Table of Contents](#table-of-contents)
  - [Example Domain: Blog Platform](#example-domain-blog-platform)
    - [The Domain](#the-domain)
    - [Entity Relationship Diagram](#entity-relationship-diagram)
    - [Sample Seed Data (used in all examples)](#sample-seed-data-used-in-all-examples)
  - [What is ORM / ODM?](#what-is-orm--odm)
  - [Mongoose — ODM for MongoDB](#mongoose--odm-for-mongodb)
    - [Installation \& Connection](#installation--connection)
    - [Defining Schemas — Blog Platform](#defining-schemas--blog-platform)
    - [Schema Types \& Field Options](#schema-types--field-options)
    - [Models](#models)
    - [Instance Methods, Static Methods \& Query Helpers](#instance-methods-static-methods--query-helpers)
    - [CRUD Operations](#crud-operations)
      - [Create](#create)
      - [Read](#read)
      - [Update](#update)
      - [Delete](#delete)
    - [Querying — Filters, Sorting, Pagination](#querying--filters-sorting-pagination)
    - [Error Handling (Mongoose)](#error-handling-mongoose)
    - [Schema Validation](#schema-validation)
    - [Middleware (Hooks)](#middleware-hooks)
    - [Virtuals](#virtuals)
    - [Population (References)](#population-references)
    - [Aggregation](#aggregation)
    - [Transactions](#transactions)
    - [Indexes](#indexes)
    - [Plugins](#plugins)
    - [Performance: lean() and select()](#performance-lean-and-select)
    - [Discriminators](#discriminators)
    - [Mongoose — Summary](#mongoose--summary)
  - [Prisma — ORM for SQL + MongoDB](#prisma--orm-for-sql--mongodb)
    - [What is Prisma?](#what-is-prisma)
    - [TypeScript Integration (Prisma)](#typescript-integration-prisma)
    - [Installation \& Setup](#installation--setup)
    - [Prisma Schema — Blog Platform](#prisma-schema--blog-platform)
      - [Relation Map](#relation-map)
    - [Migrations](#migrations)
    - [Prisma Client — CRUD](#prisma-client--crud)
      - [Singleton Client](#singleton-client)
      - [Create](#create-1)
      - [Read](#read-1)
      - [Update](#update-1)
      - [Delete](#delete-1)
    - [Filtering, Sorting \& Pagination](#filtering-sorting--pagination)
    - [Relations \& Include](#relations--include)
    - [Error Handling (Prisma)](#error-handling-prisma)
    - [Nested Writes](#nested-writes)
    - [Transactions (Prisma)](#transactions-prisma)
    - [Aggregations \& Grouping](#aggregations--grouping)
    - [Raw Queries](#raw-queries)
    - [Middleware (Prisma)](#middleware-prisma)
    - [Prisma with MongoDB](#prisma-with-mongodb)
    - [Prisma vs Mongoose](#prisma-vs-mongoose)
    - [Prisma — Summary](#prisma--summary)

---

## Example Domain: Blog Platform

> **All examples throughout this file use this single Blog Platform domain.**
> This keeps every code snippet consistent and easy to follow.

### The Domain

A **Blog Platform** where:

- Users can register with a profile
- Users write Posts that belong to Categories
- Readers leave Comments on Posts
- Posts can have multiple Categories (many-to-many)

### Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id
        string firstName
        string lastName
        string email
        string password
        string role
        Date createdAt
    }
    PROFILE {
        ObjectId _id
        ObjectId userId
        string bio
        string avatarUrl
        string website
    }
    POST {
        ObjectId _id
        string title
        string slug
        string content
        boolean published
        number views
        ObjectId authorId
        Date createdAt
    }
    COMMENT {
        ObjectId _id
        string body
        ObjectId postId
        ObjectId authorId
        Date createdAt
    }
    CATEGORY {
        ObjectId _id
        string name
        string slug
    }

    USER ||--o{ POST : "writes"
    USER ||--o| PROFILE : "has one"
    USER ||--o{ COMMENT : "writes"
    POST ||--o{ COMMENT : "has many"
    POST }o--o{ CATEGORY : "tagged with"
```

### Sample Seed Data (used in all examples)

```js
// Users
{ _id: "u1", firstName: "Alice", lastName: "Smith", email: "alice@blog.com", role: "admin"  }
{ _id: "u2", firstName: "Bob",   lastName: "Jones", email: "bob@blog.com",   role: "author" }
{ _id: "u3", firstName: "Carol", lastName: "White", email: "carol@blog.com", role: "reader" }

// Profiles
{ _id: "p1", userId: "u1", bio: "Editor & founder", website: "alice.dev" }
{ _id: "p2", userId: "u2", bio: "JS developer",      website: "bob.dev"   }

// Categories
{ _id: "cat1", name: "JavaScript", slug: "javascript" }
{ _id: "cat2", name: "MongoDB",    slug: "mongodb"    }
{ _id: "cat3", name: "Node.js",    slug: "nodejs"     }

// Posts
{ _id: "post1", title: "Intro to Mongoose",   slug: "intro-mongoose",  authorId: "u2", published: true,  views: 340, categories: ["cat1","cat2"] }
{ _id: "post2", title: "Prisma vs Mongoose",  slug: "prisma-mongoose", authorId: "u2", published: true,  views: 820, categories: ["cat1","cat3"] }
{ _id: "post3", title: "MongoDB Aggregation", slug: "mongo-agg",       authorId: "u1", published: false, views: 0,   categories: ["cat2"] }

// Comments
{ _id: "c1", body: "Great intro!",          postId: "post1", authorId: "u3" }
{ _id: "c2", body: "Very helpful.",         postId: "post1", authorId: "u1" }
{ _id: "c3", body: "Love the comparisons.", postId: "post2", authorId: "u3" }
```

> [Back to Index](#table-of-contents)

---

## What is ORM / ODM?

| Term    | Full Form                | Used With               | Purpose                             |
| ------- | ------------------------ | ----------------------- | ----------------------------------- |
| **ORM** | Object-Relational Mapper | SQL (PostgreSQL, MySQL) | Map JS objects to relational tables |
| **ODM** | Object-Document Mapper   | MongoDB                 | Map JS objects to JSON documents    |

```mermaid
flowchart LR
    subgraph APP ["Your Application (JavaScript / TypeScript)"]
        CODE["User.create({ name: 'Alice' })
Post.find({ role: 'admin' })"]
    end

    subgraph ORM_LAYER ["ORM / ODM Layer"]
        MONGOOSE["Mongoose (ODM)
for MongoDB"]
        PRISMA["Prisma (ORM)
for SQL + MongoDB"]
    end

    subgraph DB ["Database"]
        MONGO[("MongoDB
documents")]
        SQL[("PostgreSQL / MySQL
tables + rows")]
    end

    CODE --> MONGOOSE --> MONGO
    CODE --> PRISMA --> SQL
    CODE --> PRISMA --> MONGO

    style APP fill:#cce5ff,color:#000
    style ORM_LAYER fill:#fff3cd,color:#000
    style DB fill:#d4edda,color:#000
```

**Why use an ORM / ODM?**

```
Without Mongoose (raw driver):       With Mongoose:
────────────────────────────────     ──────────────────────────────────
const post = await db                const post = await Post.create({
  .collection('posts')                 title: 'Intro to Mongoose',
  .insertOne({                         authorId: userId,
    title: 'Intro to Mongoose',        published: true,
    authorId: userId,                })
    published: true
  })
Benefits: schema enforcement, validation, lifecycle hooks, query builder
```

> [Back to Index](#table-of-contents)

---

## Mongoose — ODM for MongoDB

**Mongoose** is the most popular ODM (Object-Document Mapper) library for Node.js and MongoDB. It sits between your application code and the MongoDB driver, giving you:

- **Schema enforcement** — define the exact shape and data types of every document
- **Built-in validation** — reject bad data before it reaches the database
- **Lifecycle hooks (middleware)** — run code automatically before/after reads and writes
- **Query builder API** — chainable, readable query construction
- **Relationship helpers** — `.populate()` to join documents across collections

The three core building blocks are **Schema → Model → Document**:

```mermaid
flowchart TD
    SCHEMA["Schema
(shape + validation rules)"]
    MODEL["Model
(compiled class)"]
    DOC["Document
(instance in memory)"]
    DB[("MongoDB Collection")]

    SCHEMA -->|"model('Post', schema)"| MODEL
    MODEL  -->|"new Model() or Model.create()"| DOC
    DOC    -->|".save() / CRUD"| DB

    style SCHEMA fill:#cce5ff,color:#000
    style MODEL  fill:#fff3cd,color:#000
    style DOC    fill:#d4edda,color:#000
    style DB     fill:#e2e3e5,color:#000
```

---

### Installation & Connection

**What it does:** `mongoose.connect()` opens a connection pool to your MongoDB instance. All queries share this pool — you do not need to connect once per query.

**Key connection options:**

| Option                     | Purpose                                               | Blog Platform setting |
| -------------------------- | ----------------------------------------------------- | --------------------- |
| `serverSelectionTimeoutMS` | How long to wait if DB is unreachable before throwing | `5000` ms             |
| `maxPoolSize`              | Max simultaneous open connections                     | `10`                  |

**Connection events** let you react to network changes — log, retry, or gracefully shut down.

```bash
npm install mongoose
```

```js
// db.js
const mongoose = require("mongoose");

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  });
  console.log("MongoDB connected");
};

mongoose.connection.on("disconnected", () => console.log("Disconnected"));
mongoose.connection.on("error", (err) => console.error("DB error:", err));

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connect;
```

```env
MONGO_URI=mongodb://localhost:27017/blog
```

---

### Defining Schemas — Blog Platform

**What is a Schema?**
A Mongoose `Schema` is a blueprint that describes the structure (fields, types, constraints) of documents in a MongoDB collection. It is **not** a class you instantiate directly — it is config passed to `model()` to produce a usable class.

**Why define a Schema?**

- Enforce data types (e.g. `views` is always a `Number`, never a string)
- Set defaults so you never forget to supply a field
- Attach validation rules that run before every save
- Register middleware (pre/post hooks) for that collection
- Define virtual fields and population relationships

**Schema options** (`{ timestamps, versionKey }`):

- `timestamps: true` — Mongoose automatically adds `createdAt` and `updatedAt` fields to every document
- `versionKey: false` — removes the `__v` field Mongoose adds by default

The diagram below shows how our five Blog Platform schemas relate to each other:

```mermaid
flowchart LR
    subgraph SCHEMAS ["Mongoose Schemas"]
        U["userSchema
firstName, lastName
email (unique)
password (select:false)
role (enum)
timestamps"]
        P["profileSchema
userId (ref: User)
bio, avatarUrl, website"]
        POST["postSchema
title, slug (unique)
content, published, views
authorId (ref: User)
categories [ref: Category]
timestamps"]
        C["commentSchema
body
postId (ref: Post)
authorId (ref: User)
timestamps"]
        CAT["categorySchema
name (unique)
slug (unique)"]
    end

    U -->|"1:1"| P
    U -->|"1:N"| POST
    U -->|"1:N"| C
    POST -->|"1:N"| C
    POST -->|"N:N"| CAT

    style SCHEMAS fill:#f8f9fa,color:#000
```

```js
// models/User.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "author", "reader"],
      default: "reader",
    },
  },
  { timestamps: true, versionKey: false }
);
module.exports = model("User", userSchema);
```

```js
// models/Profile.js
const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  bio: { type: String, maxlength: 300 },
  avatarUrl: { type: String },
  website: { type: String },
});
module.exports = model("Profile", profileSchema);
```

```js
// models/Category.js
const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
});
module.exports = model("Category", categorySchema);
```

```js
// models/Post.js
const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0, min: 0 },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true, versionKey: false }
);
module.exports = model("Post", postSchema);
```

```js
// models/Comment.js
const commentSchema = new Schema(
  {
    body: { type: String, required: true, maxlength: 1000 },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);
module.exports = model("Comment", commentSchema);
```

---

### Schema Types & Field Options

**What are Schema Types?**
Each field in a Mongoose schema is assigned a **type** that tells Mongoose what kind of JavaScript value to expect. Mongoose automatically **casts** incoming data to the declared type (e.g. the string `"5"` becomes the number `5` if the field type is `Number`).

**What are Field Options?**
Options are constraints and behaviours applied per-field. They run during **validation** (before every save) and during **query building**. Common pattern: `{ type: TheType, option1: value, option2: value }`.

| Type         | Example Field            | Common Options                                                 |
| ------------ | ------------------------ | -------------------------------------------------------------- |
| `String`     | `title`, `email`, `role` | `trim`, `lowercase`, `enum`, `match`, `minlength`, `maxlength` |
| `Number`     | `views`                  | `min`, `max`, `default`                                        |
| `Boolean`    | `published`              | `default`                                                      |
| `Date`       | `createdAt`              | `default: Date.now`, `min`, `max`                              |
| `ObjectId`   | `authorId`, `postId`     | `ref: 'ModelName'`                                             |
| `[ObjectId]` | `categories`             | Array of refs                                                  |
| `Mixed`      | unstructured data        | Schema-less — use sparingly                                    |
| `Map`        | `metadata`               | `of: String` (typed values)                                    |

```js
// Demonstration of all option types
const demoSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  views: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  email: { type: String, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
  secret: { type: String, select: false }, // excluded from queries by default
  tags: [String], // shorthand array of strings
  metadata: { type: Map, of: String }, // { anyKey: 'anyValue' }
  nested: {
    city: String,
    country: { type: String, default: "US" },
  },
});
```

---

### Models

**What is a Model?**
A Mongoose **Model** is a class compiled from a Schema. It represents a MongoDB collection and provides all the static query methods (`find`, `create`, `updateMany`, `aggregate`, etc.) and instance methods (`.save()`, `.toObject()`, custom methods you add).

- One schema → one model → one collection
- Model name (e.g. `'Post'`) is automatically pluralised to become the collection name (`posts`)
- You instantiate documents from a model: `const doc = new Post({...})`
- Or create directly: `Post.create({...})` (shorthand for `new Post({...}).save()`)

```js
// Compile schema into model — collection name = pluralised + lowercased model name
// 'User'     → collection 'users'
// 'Post'     → collection 'posts'
// 'Category' → collection 'categories'

const User = model("User", userSchema);
const Post = model("Post", postSchema);
const Comment = model("Comment", commentSchema);
const Category = model("Category", categorySchema);
const Profile = model("Profile", profileSchema);
```

```mermaid
flowchart LR
    SC["postSchema"] -->|"model('Post', postSchema)"| M["Post Model"]
    M -->|"Post.find()"| QM["Query Methods"]
    M -->|"Post.create()"| DC["Document Creation"]
    M -->|"Post.aggregate()"| AG["Aggregation Pipeline"]
    QM --> DB[("posts collection")]
    DC --> DB
    AG --> DB

    style SC fill:#cce5ff,color:#000
    style M  fill:#fff3cd,color:#000
    style DB fill:#d4edda,color:#000
```

---

### Instance Methods, Static Methods & Query Helpers

**What are Instance Methods?**
An **instance method** is attached to `schema.methods`. It becomes a callable function on any **document** (single instance returned by `find`, `findById`, etc.). Use instance methods for operations that work on **one specific document** — validating a password, soft-archiving, computing a field.

**What are Static Methods?**
A **static method** is attached to `schema.statics`. It is callable directly on the **Model class**, not on a document. Use static methods for **custom queries** and **collection-level operations** — find by email, calculate site stats, bulk actions.

**What are Query Helpers?**
A **query helper** is attached to `schema.query`. It becomes a **chainable method** on every query built from that model — just like `.sort()` or `.limit()`. Use query helpers to encapsulate recurring filter patterns so you never repeat the same `where` condition.

| Extension             | Defined on       | Called by                             | Typical use                              |
| --------------------- | ---------------- | ------------------------------------- | ---------------------------------------- |
| `schema.methods.name` | `schema.methods` | `doc.name()` — on a document instance | `user.checkPassword()`, `post.archive()` |
| `schema.statics.name` | `schema.statics` | `Model.name()` — on the Model class   | `User.findByEmail()`, `Post.getStats()`  |
| `schema.query.name`   | `schema.query`   | `.name()` — chained on a query        | `.published()`, `.byAuthor(id)`          |

```mermaid
flowchart LR
    SM["schema.methods.xxx
instance method"]
    SS["schema.statics.xxx
static method"]
    SQ["schema.query.xxx
query helper"]

    SM -->|"doc.xxx()"| DOC["Document
(single record)"]
    SS -->|"Model.xxx()"| MODEL["Model class
(queries collection)"]
    SQ -->|".xxx() chained"| CHAIN["Chainable Query
Post.find().published().lean()"]

    style SM    fill:#cce5ff,color:#000
    style SS    fill:#fff3cd,color:#000
    style SQ    fill:#d4edda,color:#000
```

```js
// ─── Instance Methods ──────────────────────────────────────────────────────

// Verify password on login (User document)
userSchema.methods.checkPassword = async function (plainText) {
  return bcrypt.compare(plainText, this.password);
};

// Archive a post — flip published flag and save
postSchema.methods.archive = async function () {
  this.published = false;
  return this.save();
};

// Generate a shareable URL
postSchema.methods.getUrl = function (baseUrl = "https://blog.com") {
  return `${baseUrl}/posts/${this.slug}`;
};

// Usage
const user = await User.findOne({ email: "alice@blog.com" }).select(
  "+password"
);
const isValid = await user.checkPassword("secret123"); // → true / false

const post = await Post.findById(post1._id);
await post.archive(); // saves { published: false }
console.log(post.getUrl()); // "https://blog.com/posts/intro-mongoose"

// ─── Static Methods ────────────────────────────────────────────────────────

// Find all published posts by a specific author
postSchema.statics.findByAuthor = function (authorId) {
  return this.find({ authorId, published: true }).sort({ createdAt: -1 });
};

// Central email lookup (used in auth middleware)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Site-wide stats computed from the posts collection
postSchema.statics.getStats = async function () {
  const [total, published, viewsAgg] = await Promise.all([
    this.countDocuments(),
    this.countDocuments({ published: true }),
    this.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
  ]);
  return { total, published, totalViews: viewsAgg[0]?.total ?? 0 };
};

// Usage
const bobPosts = await Post.findByAuthor(bob._id); // → Post[]
const alice = await User.findByEmail("alice@blog.com");
const stats = await Post.getStats();
// → { total: 3, published: 2, totalViews: 1160 }

// ─── Query Helpers ─────────────────────────────────────────────────────────

// Only published posts
postSchema.query.published = function () {
  return this.where({ published: true });
};

// Filter by a specific author
postSchema.query.byAuthor = function (authorId) {
  return this.where({ authorId });
};

// Most recent N posts
postSchema.query.recent = function (n = 5) {
  return this.sort({ createdAt: -1 }).limit(n);
};

// Usage — query helpers are fully chainable with each other and with .sort(), .select(), .lean()
const feed = await Post.find().published().recent(10).lean();
// → 10 most recent published posts

const bobFeed = await Post.find().byAuthor(bob._id).published().lean();
// → Bob's published posts

const top5Bob = await Post.find()
  .byAuthor(bob._id)
  .sort({ views: -1 })
  .limit(5);
// → Bob's 5 most-viewed posts (any status)
```

---

### CRUD Operations

**CRUD** stands for **Create, Read, Update, Delete** — the four fundamental database operations.

| Operation  | Mongoose methods                                             | MongoDB equivalent        |
| ---------- | ------------------------------------------------------------ | ------------------------- |
| **Create** | `Model.create()`, `Model.insertMany()`, `new Model().save()` | `insertOne`, `insertMany` |
| **Read**   | `Model.find()`, `Model.findOne()`, `Model.findById()`        | `find`, `findOne`         |
| **Update** | `findByIdAndUpdate()`, `updateMany()`, `.save()`             | `updateOne`, `updateMany` |
| **Delete** | `findByIdAndDelete()`, `deleteMany()`                        | `deleteOne`, `deleteMany` |

> **`{ new: true }`** — by default `findByIdAndUpdate` returns the _old_ document. Pass `{ new: true }` to get the _updated_ document back.
> **`runValidators: true`** — validation is skipped on `update` operations unless you explicitly pass this option.

#### Create

```js
const { User, Post, Category, Comment, Profile } = require("./models");

// --- Seed Categories ---
const [js, mongo, node] = await Category.insertMany([
  { name: "JavaScript", slug: "javascript" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "Node.js", slug: "nodejs" },
]);

// --- Create User (Alice) ---
const alice = await User.create({
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@blog.com",
  password: "hashed_pw",
  role: "admin",
});

// --- Create Profile for Alice ---
await Profile.create({
  userId: alice._id,
  bio: "Editor & founder",
  website: "alice.dev",
});

// --- Create User (Bob) ---
const bob = await User.create({
  firstName: "Bob",
  lastName: "Jones",
  email: "bob@blog.com",
  password: "hashed_pw",
  role: "author",
});

// --- Create Post by Bob ---
const post1 = await Post.create({
  title: "Intro to Mongoose",
  slug: "intro-mongoose",
  content: "Mongoose is an ODM for MongoDB...",
  published: true,
  views: 340,
  authorId: bob._id,
  categories: [js._id, mongo._id],
});

// --- Add Comment on post1 ---
const comment1 = await Comment.create({
  body: "Great intro!",
  postId: post1._id,
  authorId: alice._id,
});
```

#### Read

```js
// All published posts
const all = await Post.find({ published: true });

// One post by slug
const post = await Post.findOne({ slug: "intro-mongoose" });

// By ID
const user = await User.findById(alice._id);

// Count published posts
const count = await Post.countDocuments({ published: true });
// → 2

// Existence check
const exists = await User.exists({ email: "alice@blog.com" });
// → { _id: ObjectId('...') }
```

#### Update

```js
// Atomic increment of views (does NOT fire pre('save'))
const updated = await Post.findByIdAndUpdate(
  post1._id,
  { $inc: { views: 1 } },
  { new: true } // return the updated document
);
// post1.views is now 341

// Publish a draft (with validation)
await Post.findByIdAndUpdate(
  post3._id,
  { $set: { published: true } },
  { new: true, runValidators: true }
);

// Instance update — triggers pre('save') middleware
const user = await User.findById(bob._id);
user.role = "admin";
await user.save();
```

#### Delete

```js
// Delete one comment — returns the deleted document
const deleted = await Comment.findByIdAndDelete(comment1._id);

// Delete all comments on a post
await Comment.deleteMany({ postId: post1._id });

// Delete a user
await User.findByIdAndDelete(alice._id);
```

---

### Querying — Filters, Sorting, Pagination

**Mongoose Query API** is chainable — each method returns a `Query` object so you can attach more conditions before the query is executed (execution happens when you `await` it or call `.exec()`).

**Key chain methods:**

| Method            | Purpose                                          | Example                      |
| ----------------- | ------------------------------------------------ | ---------------------------- |
| `.find(filter)`   | Match documents                                  | `.find({ published: true })` |
| `.sort(fields)`   | Order results (`1` = asc, `-1` = desc)           | `.sort({ views: -1 })`       |
| `.skip(n)`        | Skip first n documents (pagination offset)       | `.skip(10)`                  |
| `.limit(n)`       | Return at most n documents                       | `.limit(10)`                 |
| `.select(fields)` | Choose which fields to return                    | `.select('title slug -_id')` |
| `.lean()`         | Return plain JS objects instead of Mongoose Docs | `.lean()`                    |
| `.populate(path)` | Replace ObjectId refs with full documents        | `.populate('authorId')`      |

**Pagination formula:** `skip = (page - 1) * pageSize`

```mermaid
flowchart LR
    Q["Post.find()"] --> F["filter
.where({ published: true })"]
    F --> S["sort
.sort({ views: -1 })"]
    S --> SK["skip
.skip(0)"]
    SK --> L["limit
.limit(10)"]
    L --> PR["project
.select('title slug views')"]
    PR --> LN["lean
.lean()"]
    LN --> RES["[ {...}, {...} ]"]

    style Q   fill:#cce5ff,color:#000
    style RES fill:#d4edda,color:#000
```

```js
// Top 5 most-viewed published posts — only title, slug, views
const topPosts = await Post.find({ published: true })
  .sort({ views: -1 })
  .limit(5)
  .select("title slug views -_id")
  .lean();
// → [{ title: 'Prisma vs Mongoose', slug: 'prisma-mongoose', views: 820 }, ...]

// Paginated list — page 2, 10 per page
const PAGE = 2,
  SIZE = 10;
const posts = await Post.find({ published: true })
  .sort({ createdAt: -1 })
  .skip((PAGE - 1) * SIZE)
  .limit(SIZE);

// Case-insensitive title search
const results = await Post.find({ title: /mongoose/i });

// Posts with more than 300 views in 'javascript' category
const posts = await Post.find({
  views: { $gt: 300 },
  categories: js._id, // array field contains this ObjectId
  published: true,
});

// Posts authored by Alice OR Bob
const posts = await Post.find({
  $or: [{ authorId: alice._id }, { authorId: bob._id }],
});

// Posts in BOTH javascript AND mongodb categories
const posts = await Post.find({
  categories: { $all: [js._id, mongo._id] },
});

// Posts with exactly 2 categories
const posts = await Post.find({
  categories: { $size: 2 },
});
```

| Operator | Meaning             | Blog Example                                |
| -------- | ------------------- | ------------------------------------------- |
| `$gt`    | greater than        | `views: { $gt: 300 }`                       |
| `$gte`   | greater than or eq  | `views: { $gte: 340 }`                      |
| `$lt`    | less than           | `views: { $lt: 100 }`                       |
| `$in`    | value in array      | `role: { $in: ['admin', 'author'] }`        |
| `$nin`   | value not in array  | `role: { $nin: ['reader'] }`                |
| `$ne`    | not equal           | `published: { $ne: false }`                 |
| `$all`   | array contains all  | `categories: { $all: [js._id, mongo._id] }` |
| `$size`  | array length equals | `categories: { $size: 2 }`                  |
| `$or`    | logical OR          | `$or: [{ authorId }, { views: ... }]`       |
| `$and`   | logical AND         | `$and: [...]`                               |
| `$nor`   | logical NOR         | `$nor: [...]`                               |

---

### Error Handling (Mongoose)

**Why handle Mongoose errors explicitly?**
Unhandled database errors propagate as 500 responses that expose your schema structure to clients. Mongoose throws three distinct error types — each requires a different HTTP status code and message shape.

**The three error types:**

| Error class        | `err.name`           | When thrown                                                                        | Key properties                                                                |
| ------------------ | -------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `ValidationError`  | `'ValidationError'`  | A field fails `required`, `min`, `enum`, `match`, or a custom validator            | `err.errors` — object keyed by field name, each with a `.message` and `.path` |
| `CastError`        | `'CastError'`        | A value cannot be cast to the declared type (e.g. `"abc"` passed as an ObjectId)   | `err.path` (field), `err.value` (bad value), `err.kind` (expected type)       |
| `MongoServerError` | `'MongoServerError'` | MongoDB rejects at the DB level — most often `code 11000` (unique index violation) | `err.code` (11000), `err.keyValue` (the duplicate field + value)              |

```mermaid
flowchart TD
    OP(["CRUD operation"])
    VE["ValidationError
Required field missing
Value below min/max
Enum not in list
Custom validator returned false"]
    CE["CastError
Invalid ObjectId in URL param
String passed where Number expected"]
    MSE["MongoServerError code 11000
Duplicate unique key
(email, slug, etc.)"]
    OK["Success → Document"]

    OP -->|"validator fails"| VE
    OP -->|"type cast fails"| CE
    OP -->|"DB index rejects"| MSE
    OP -->|"all pass"| OK

    style VE  fill:#f8d7da,color:#000
    style CE  fill:#f8d7da,color:#000
    style MSE fill:#f8d7da,color:#000
    style OK  fill:#d4edda,color:#000
```

```js
// ─── Central error handler (reuse in all route handlers) ──────────────────

function handleMongoError(err, res) {
  // 1. ValidationError — field-level failures
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ error: "Validation failed", details });
  }

  // 2. CastError — usually a malformed ObjectId in a route param
  if (err.name === "CastError") {
    return res.status(400).json({
      error: `Invalid value '${err.value}' for field '${err.path}' (expected ${err.kind})`,
    });
  }

  // 3. MongoServerError — duplicate unique key
  if (err.name === "MongoServerError" && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: `'${err.keyValue[field]}' is already in use for '${field}'`,
    });
  }

  // 4. Fallback — unexpected error
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}

// ─── Usage in route handlers ──────────────────────────────────────────────

// POST /users — ValidationError if email is missing, MongoServerError if duplicate
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    handleMongoError(err, res);
    // Missing email   → 400 { error: "Validation failed", details: [{ field: "email", ... }] }
    // Duplicate email → 409 { error: "'alice@blog.com' is already in use for 'email'" }
  }
});

// GET /posts/:id — CastError if :id is not a valid ObjectId
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    handleMongoError(err, res);
    // Bad id "abc" → 400 { error: "Invalid value 'abc' for field '_id' (expected ObjectId)" }
  }
});

// ─── Document-level validation (without saving) ───────────────────────────
// Useful for validating data before any DB call (e.g. in a multi-step form)
const draft = new Post({
  title: "X",
  slug: "My Post!",
  published: true,
  authorId: bob._id,
});
try {
  await draft.validate(); // throws ValidationError without touching the DB
} catch (err) {
  if (err.name === "ValidationError") console.log(err.errors);
}
```

---

### Schema Validation

**What is Schema Validation?**
Mongoose validation runs **before** any write reaches MongoDB. If validation fails, Mongoose throws a `ValidationError` and nothing is written to the database.

**Validation happens in two steps:**

1. **Type casting** — Mongoose tries to coerce the incoming value to the declared type (e.g. string `"340"` → number `340`)
2. **Validator functions** — built-in rules (`required`, `min`, `enum`, `match`) and custom async/sync validators all run in sequence

**Built-in validators:**

| Validator                 | Applies to   | What it checks                                   |
| ------------------------- | ------------ | ------------------------------------------------ |
| `required: true`          | Any type     | Field must be present and non-null               |
| `minlength` / `maxlength` | String       | String length bounds                             |
| `min` / `max`             | Number, Date | Value bounds                                     |
| `enum: [...]`             | String       | Value must be one of the listed options          |
| `match: /regex/`          | String       | Value must match the regular expression          |
| `unique: true`            | Any          | Unique index (enforced by MongoDB, not Mongoose) |

**Custom validators** let you write any logic — sync (returns `true`/`false`) or async (returns `Promise<boolean>`).

```mermaid
flowchart TD
    OP(["Post.create({ ... })"])
    CAST["Type Casting
string '340' becomes number 340"]
    VALIDATE["Validation
required, min, enum, match, custom validator"]
    SAVE["Write to MongoDB"]
    ERR["ValidationError
{ errors: { fieldName: { message } } }"]

    OP --> CAST --> VALIDATE
    VALIDATE -->|"all pass"| SAVE
    VALIDATE -->|"fails"  | ERR

    style OP       fill:#cce5ff,color:#000
    style VALIDATE fill:#fff3cd,color:#000
    style SAVE     fill:#d4edda,color:#000
    style ERR      fill:#f8d7da,color:#000
```

```js
// Custom sync validator — slug must be URL-safe
postSchema.path("slug").validate({
  validator: (v) => /^[a-z0-9-]+$/.test(v),
  message: "Slug must be lowercase alphanumeric with hyphens only",
});

// Async validator — ensure slug is unique at creation time
postSchema.path("slug").validate({
  validator: async function (slug) {
    if (!this.isNew) return true; // skip on updates
    const count = await Post.countDocuments({ slug });
    return count === 0;
  },
  message: "Slug already in use",
});

// Handling validation errors
try {
  await Post.create({
    title: "X", // too short (minlength: 3)
    slug: "My Post!", // invalid chars
    published: true,
    authorId: bob._id,
    content: "hi",
  });
} catch (err) {
  if (err.name === "ValidationError") {
    Object.values(err.errors).forEach((e) =>
      console.log(`${e.path}: ${e.message}`)
    );
    // title: Path `title` (`X`) is shorter than the minimum allowed length (3).
    // slug: Slug must be lowercase alphanumeric with hyphens only
  }
}
```

---

### Middleware (Hooks)

**What is Mongoose Middleware?**
Middleware (also called **hooks**) are functions that run automatically **before** (`pre`) or **after** (`post`) specific Mongoose operations — save, find, update, delete, validate, and more.

**Two types of middleware:**

| Type                    | `this` refers to      | Triggered by                                      |
| ----------------------- | --------------------- | ------------------------------------------------- |
| **Document middleware** | The document instance | `save`, `validate`, `remove`, `init`              |
| **Query middleware**    | The Query object      | `find`, `findOne`, `updateOne`, `deleteOne`, etc. |

**Common use-cases in our Blog Platform:**

| Hook                       | Model | Purpose                                           |
| -------------------------- | ----- | ------------------------------------------------- |
| `pre('save')`              | User  | Hash password before storing                      |
| `pre('save')`              | Post  | Auto-generate slug from title                     |
| `post('findOneAndDelete')` | Post  | Cascade-delete all comments on the deleted post   |
| `pre(/^find/)`             | Post  | Exclude unpublished posts from all public queries |

> **`next()`** — document middleware must call `next()` to continue the chain. Query middleware does not need it when using `async/await`.

```mermaid
flowchart TD
    REQ(["post.save()"])
    PRE_SAVE["pre('save')
- hash password
- auto-generate slug
- set audit fields"]
    SAVE["Write to MongoDB"]
    POST_SAVE["post('save')
- send email
- emit event
- update cache"]

    REQ --> PRE_SAVE --> SAVE --> POST_SAVE

    DEL(["Post.findOneAndDelete(...)"])
    PRE_DEL["pre('findOneAndDelete')
- verify dependencies"]
    ACT_DEL["Delete document"]
    POST_DEL["post('findOneAndDelete')
- cascade delete comments
- clean up files"]

    DEL --> PRE_DEL --> ACT_DEL --> POST_DEL

    style PRE_SAVE  fill:#fff3cd,color:#000
    style SAVE      fill:#d4edda,color:#000
    style POST_SAVE fill:#cce5ff,color:#000
    style PRE_DEL   fill:#fff3cd,color:#000
    style POST_DEL  fill:#cce5ff,color:#000
```

```js
const bcrypt = require("bcrypt");
const slugify = require("slugify");

// Pre-save: hash password when it changes (User)
userSchema.pre("save", async function (next) {
  // 'this' = the User document
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method — verify password on login
userSchema.methods.checkPassword = async function (plainText) {
  return bcrypt.compare(plainText, this.password);
};

// Pre-save: auto-generate slug from title (Post)
postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
// Post.create({ title: 'Intro to Mongoose', ... })  →  slug: 'intro-to-mongoose'

// Post-delete: cascade comments when a post is removed
postSchema.post("findOneAndDelete", async function (deletedPost) {
  if (deletedPost) {
    await Comment.deleteMany({ postId: deletedPost._id });
  }
});

// Pre-query: exclude unpublished posts by default on all find* queries
postSchema.pre(/^find/, function () {
  if (!this.getOptions().showAll) {
    this.where({ published: true });
  }
});
// await Post.find()                          → only published
// await Post.find().setOptions({ showAll: true }) → all posts
```

---

### Virtuals

**What are Virtuals?**
Virtuals are **computed fields** — calculated at runtime, **never stored in MongoDB**.

They behave like normal fields when reading a document, but Mongoose simply runs a function to compute them on the fly. Because they live only in memory, they do not affect your database size or indexes.

**Two kinds of virtuals:**

| Kind                 | Description                              | Blog example                                             |
| -------------------- | ---------------------------------------- | -------------------------------------------------------- |
| **Getter**           | Compute a value from existing fields     | `fullName` = `firstName + ' ' + lastName`                |
| **Setter**           | Split an incoming value back into fields | Setting `fullName` splits into `firstName` / `lastName`  |
| **Virtual populate** | Define a reverse-reference relationship  | `Post.comments` → all Comments where `postId = post._id` |

**Important:** Virtuals are **not** included in `JSON.stringify()` output by default. To include them in API responses add `{ toJSON: { virtuals: true } }` to your schema options.

```js
// User virtual: fullName (getter)
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// User virtual: fullName (setter — split on first space)
userSchema.virtual("fullName").set(function (name) {
  const [first, ...rest] = name.split(" ");
  this.firstName = first;
  this.lastName = rest.join(" ");
});

// Post virtual: populate comments via reverse ref
postSchema.virtual("comments", {
  ref: "Comment", // model
  localField: "_id", // Post._id
  foreignField: "postId", // matches Comment.postId
});

// User virtual: all posts by this user
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "authorId",
});

// Include virtuals in JSON/toObject output
const userSchema = new Schema(
  { firstName: String, lastName: String },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
```

```js
// Usage
const user = await User.findById(bob._id);
console.log(user.fullName); // "Bob Jones"

// Virtual populate: bob's posts with their comments
const user = await User.findById(bob._id).populate({
  path: "posts",
  populate: { path: "comments" },
});
user.posts.forEach((p) =>
  console.log(p.title, "—", p.comments.length, "comments")
);
// Intro to Mongoose — 2 comments
// Prisma vs Mongoose — 1 comment
```

---

### Population (References)

**What is Population?**
MongoDB is not a relational database — it does not have SQL JOINs. Instead, related documents store the `_id` of the other document (like a foreign key). **Population** is Mongoose's mechanism to automatically fetch those referenced documents and replace the raw `ObjectId` with the full document in your query result.

**How it works:**

1. You store an `ObjectId` in a field with `ref: 'ModelName'` (e.g. `authorId` with `ref: 'User'`)
2. When you call `.populate('authorId')`, Mongoose issues a second query — `User.find({ _id: { $in: [...ids] } })` — and stitches the results in
3. The `AuthorId` field in your result is replaced with the full User document (or just selected fields if you pass a field-select string)

**Population does NOT happen in a single DB query** — it always makes one query per populated path. For very large datasets consider `$lookup` aggregation instead.

Population replaces ObjectId references with the actual documents.

```mermaid
flowchart LR
    subgraph BEFORE ["Before .populate()"]
        P1["Post
title: 'Intro to Mongoose'
authorId: ObjectId('u2')
categories: [ObjectId('cat1'), ObjectId('cat2')]"]
    end
    subgraph AFTER ["After .populate('authorId categories')"]
        P2["Post
title: 'Intro to Mongoose'
authorId: { firstName:'Bob', email:'bob@blog.com' }
categories: [{ name:'JavaScript' }, { name:'MongoDB' }]"]
    end

    BEFORE -->|".populate()"| AFTER
    style BEFORE fill:#f8d7da,color:#000
    style AFTER  fill:#d4edda,color:#000
```

```js
// Basic populate — replace authorId and categories with full documents
const post = await Post.findOne({ slug: "intro-mongoose" })
  .populate("authorId", "firstName lastName email -_id") // only these fields
  .populate("categories", "name slug");

console.log(post.authorId.firstName); // "Bob"
console.log(post.categories[0].name); // "JavaScript"

// Populate comments (via virtual) and each comment's author
const postWithComments = await Post.findById(post1._id).populate({
  path: "comments", // virtual field pointing at Comment
  populate: {
    path: "authorId", // nested: populate comment.authorId too
    select: "firstName",
  },
});

postWithComments.comments.forEach((c) => {
  console.log(`${c.authorId.firstName}: ${c.body}`);
});
// Alice: Great intro!
// Alice: Very helpful.

// Deep nested: post → author → profile
const post = await Post.findById(post1._id).populate({
  path: "authorId",
  select: "firstName lastName",
  populate: {
    path: "profile", // User.profile is a virtual
    select: "bio website",
  },
});
console.log(post.authorId.profile.bio); // "JS developer"

// Populate after query (if you already have a document)
const rawPost = await Post.findOne({ slug: "prisma-mongoose" });
await Post.populate(rawPost, { path: "authorId categories" });
```

---

### Aggregation

**What is the Aggregation Pipeline?**
MongoDB's aggregation pipeline is a **multi-stage data-processing framework** that transforms a collection's documents as they pass through a sequence of stages. Unlike `find()`, which only filters and sorts documents, aggregation can **join collections** (`$lookup`), **group and compute statistics** (`$group`), **reshape documents** (`$project`), and **bucket data by range** (`$bucket`) — all executed server-side in a single command.

**Why use it instead of multiple queries?**

- All computation runs on the MongoDB server — no per-document round-trips back to Node.js.
- Reduces bandwidth by projecting only the fields you need.
- Complex calculations (sum, average, min, max) are a single pipeline expression.
- `$lookup` replaces multiple separate `find()` calls to join related collections.

> **Important:** Mongoose's `.populate()` middleware and virtual fields are **not active** inside `.aggregate()` — the pipeline works directly on raw MongoDB documents.

| Stage        | Purpose                                      | Quick example                                                                          |
| ------------ | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `$match`     | Filter documents (same as `find` conditions) | `{ $match: { published: true } }`                                                      |
| `$group`     | Group docs + compute accumulators            | `{ $group: { _id: '$authorId', total: { $sum: 1 } } }`                                 |
| `$lookup`    | Left-join another collection                 | `{ $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'author' } }` |
| `$unwind`    | Flatten an array field — one doc per element | `{ $unwind: '$author' }`                                                               |
| `$project`   | Include / exclude / compute fields           | `{ $project: { fullName: { $concat: ['$first', ' ', '$last'] } } }`                    |
| `$sort`      | Order documents                              | `{ $sort: { totalViews: -1 } }`                                                        |
| `$limit`     | Keep the first N documents                   | `{ $limit: 5 }`                                                                        |
| `$bucket`    | Categorise values into numeric ranges        | `{ $bucket: { groupBy: '$views', boundaries: [0, 100, 500] } }`                        |
| `$addFields` | Add computed fields without removing others  | `{ $addFields: { slug: { $toLower: '$title' } } }`                                     |
| `$count`     | Return the count of documents at this stage  | `{ $count: 'total' }`                                                                  |

```mermaid
flowchart LR
    RAW[("posts collection")]
    M["$match
published: true"]
    L["$lookup
join users collection"]
    G["$group
by authorId"]
    P["$project
reshape + compute"]
    S["$sort
totalViews desc"]
    LIM["$limit
top results"]
    OUT["Result Array"]

    RAW --> M --> L --> G --> P --> S --> LIM --> OUT

    style RAW fill:#e2e3e5,color:#000
    style OUT fill:#d4edda,color:#000
```

```js
// Q: Author stats — post count, total views, avg views
const authorStats = await Post.aggregate([
  { $match: { published: true } },
  {
    $group: {
      _id: "$authorId",
      postCount: { $sum: 1 },
      totalViews: { $sum: "$views" },
      avgViews: { $avg: "$views" },
      maxViews: { $max: "$views" },
    },
  },
  {
    $lookup: {
      from: "users", // join 'users' collection
      localField: "_id", // Post._id (is authorId after $group)
      foreignField: "_id", // User._id
      as: "author",
    },
  },
  { $unwind: "$author" }, // array → single object
  {
    $project: {
      _id: 0,
      authorName: { $concat: ["$author.firstName", " ", "$author.lastName"] },
      postCount: 1,
      totalViews: 1,
      avgViews: { $round: ["$avgViews", 0] },
    },
  },
  { $sort: { totalViews: -1 } },
]);
/*
[
  { authorName: 'Bob Jones',  postCount: 2, totalViews: 1160, avgViews: 580 },
]
*/

// Q: Top 3 most-commented posts
const topCommented = await Comment.aggregate([
  { $group: { _id: "$postId", commentCount: { $sum: 1 } } },
  { $sort: { commentCount: -1 } },
  { $limit: 3 },
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "_id",
      as: "post",
    },
  },
  { $unwind: "$post" },
  { $project: { _id: 0, title: "$post.title", commentCount: 1 } },
]);
/*
[
  { title: 'Intro to Mongoose', commentCount: 2 },
  { title: 'Prisma vs Mongoose', commentCount: 1 },
]
*/

// Q: View count bucketed by range
const viewBuckets = await Post.aggregate([
  {
    $bucket: {
      groupBy: "$views",
      boundaries: [0, 100, 500, 1000],
      default: "1000+",
      output: { count: { $sum: 1 }, posts: { $push: "$title" } },
    },
  },
]);
```

---

### Transactions

**What are Transactions?**
A **transaction** groups multiple database operations into a single **atomic unit** — either ALL operations succeed and are committed, or ALL are rolled back as if they never happened.

**Why are they needed?**
MongoDB operations on a single document are always atomic. But if you need to write to _two or more documents_ and cannot allow a partial state (e.g. post deleted but its comments left behind), you must use a transaction.

**Key terms:**

| Term                  | Meaning                                                |
| --------------------- | ------------------------------------------------------ |
| `session`             | A transaction context object passed to every operation |
| `startTransaction()`  | Begin the transaction — changes are now staged         |
| `commitTransaction()` | Write all staged changes to the database permanently   |
| `abortTransaction()`  | Discard all staged changes — database is untouched     |
| `endSession()`        | Release the session object (always in `finally`)       |

Use transactions when **two or more writes must succeed or fail together** (atomic).

```mermaid
flowchart TD
    START(["Delete Post + all Comments"])
    SESSION["startSession()"]
    TXSTART["session.startTransaction()"]
    DEL_POST["Post.findByIdAndDelete(id, { session })"]
    DEL_CMTS["Comment.deleteMany({ postId }, { session })"]
    CHECK{"Any error thrown?"}
    COMMIT["session.commitTransaction()
Changes written to DB"]
    ABORT["session.abortTransaction()
All changes rolled back"]

    START --> SESSION --> TXSTART --> DEL_POST --> DEL_CMTS --> CHECK
    CHECK -->|"No"  | COMMIT
    CHECK -->|"Yes" | ABORT

    style COMMIT fill:#d4edda,color:#000
    style ABORT  fill:#f8d7da,color:#000
```

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Both operations share the same session — atomic
  const deletedPost = await Post.findByIdAndDelete(post1._id, { session });
  await Comment.deleteMany({ postId: post1._id }, { session });

  await session.commitTransaction();
  console.log(`Deleted post "${deletedPost.title}" and all its comments`);
} catch (err) {
  await session.abortTransaction();
  console.error("Transaction failed, rolled back:", err.message);
} finally {
  session.endSession();
}
```

> **Requires:** MongoDB replica set or Atlas. Standalone `mongod` does NOT support transactions.

---

### Indexes

**What are Indexes?**
An **index** is a separate data structure MongoDB maintains alongside your collection that allows queries to find matching documents in **O(log n)** time instead of scanning every document (a full collection scan — O(n)).

**Without an index:** MongoDB reads every post document to find `{ published: true }` — slow at scale.
**With an index on `published`:** MongoDB jumps directly to matching entries — fast regardless of collection size.

**Types of indexes we use in the Blog Platform:**

| Index Type       | Definition                                          | Purpose                          |
| ---------------- | --------------------------------------------------- | -------------------------------- |
| **Single-field** | `{ authorId: 1 }`                                   | Fast lookups by author           |
| **Compound**     | `{ published: 1, createdAt: -1 }`                   | Multi-field queries and sort     |
| **Unique**       | `{ slug: 1 }, { unique: true }`                     | Enforce uniqueness + fast lookup |
| **Text**         | `{ title: 'text', content: 'text' }`                | Full-text keyword search         |
| **TTL**          | `{ createdAt: 1 }, { expireAfterSeconds: N }`       | Auto-delete stale documents      |
| **Partial**      | `{ partialFilterExpression: { published: false } }` | Index only a subset of documents |

> **Trade-off:** Indexes make reads faster but slow down writes slightly (MongoDB must update the index on every insert/update/delete). Only index fields you actually query on.

```mermaid
flowchart TD
    subgraph IDX ["Indexes on posts collection"]
        I1["_id (auto)
Primary key — always exists"]
        I2["slug_1 unique
Fast slug lookups in URL routing"]
        I3["authorId_1
FK lookups: posts by author"]
        I4["published_1 + createdAt_-1
Compound — feed queries, sorted by date"]
        I5["title_text + content_text
Full-text search"]
        I6["createdAt TTL partial
Auto-expire draft posts after 30 days"]
    end

    style IDX fill:#f8f9fa,color:#000
```

```js
// Define indexes in the schema
postSchema.index({ authorId: 1 }); // single-field
postSchema.index({ published: 1, createdAt: -1 }); // compound
postSchema.index({ title: "text", content: "text" }); // full-text

// TTL index — auto-delete unpublished posts after 30 days
postSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 30 * 24 * 3600,
    partialFilterExpression: { published: false },
  }
);

// Sync schema indexes to MongoDB on startup
await Post.syncIndexes();

// Full-text search example
const searchResults = await Post.find(
  { $text: { $search: "mongoose aggregation" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });

// Explain a query to verify index usage
const explain = await Post.find({ published: true })
  .sort({ createdAt: -1 })
  .explain("executionStats");
```

---

### Plugins

**What are Plugins?**
A Mongoose **plugin** is a reusable function that extends a schema — adding fields, instance methods, static methods, and hooks in one shot. Instead of copy-pasting the same `deletedAt` field and `softDelete()` method into every schema, you write the plugin once and apply it with `schema.plugin(pluginFn)`.

**When to use plugins:**

- **Soft delete** — mark documents as deleted instead of removing them
- **Audit trail** — automatically track `createdBy` / `updatedBy` on every write
- **Timestamps with timezone** — extend the built-in timestamps
- **Pagination helpers** — add `.paginate()` static to every model

**Plugin function signature:** `function myPlugin(schema, options) { ... }`

- `schema.add({...})` — add new fields
- `schema.methods.xxx` — add instance methods (callable on documents)
- `schema.statics.xxx` — add static methods (callable on the Model class)
- `schema.pre(...)` / `schema.post(...)` — add hooks

Reusable schema extensions — attach shared behaviour across multiple models.

```js
// plugins/softDelete.js
function softDeletePlugin(schema) {
  schema.add({ deletedAt: { type: Date, default: null } });

  // Instance method: mark as deleted
  schema.methods.softDelete = async function () {
    this.deletedAt = new Date();
    return this.save();
  };

  // Static method: find only active (not deleted) docs
  schema.statics.findActive = function (filter = {}) {
    return this.find({ ...filter, deletedAt: null });
  };

  // Auto-exclude soft-deleted on find* queries
  schema.pre(/^find/, function () {
    if (!this.getOptions().withDeleted) {
      this.where({ deletedAt: null });
    }
  });
}

module.exports = softDeletePlugin;
```

```js
// plugins/auditPlugin.js
function auditPlugin(schema) {
  schema.add({
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  });

  schema.statics.findByAuthor = function (userId) {
    return this.find({ createdBy: userId });
  };
}
module.exports = auditPlugin;
```

```js
// Apply plugins to blog schemas
const softDeletePlugin = require("./plugins/softDelete");
const auditPlugin = require("./plugins/auditPlugin");

postSchema.plugin(softDeletePlugin);
postSchema.plugin(auditPlugin);
commentSchema.plugin(softDeletePlugin);

// Usage
await post1.softDelete(); // soft-delete post1
const active = await Post.findActive(); // excludes deleted
const all = await Post.find(); // also excludes deleted (pre hook)
const withDeleted = await Post.find() // use setOptions({ withDeleted: true }) to include
  .setOptions({ withDeleted: true });

// Audit
const bobsPosts = await Post.findByAuthor(bob._id); // static method from plugin
```

---

### Performance: lean() and select()

**Why does performance matter here?**
By default, `Post.find()` returns **Mongoose Document** objects — full class instances with prototype methods (`.save()`, `.toObject()`, virtuals, etc.). This is powerful but has overhead: wrapping every field, tracking which fields changed, building prototype chains.

For **read-only operations** (API responses, reports, data exports) this overhead is wasted — you only need the raw data.

**`.lean()`** — tells Mongoose to skip the Document wrapper and return plain JavaScript objects. Result: ~3x faster, lower memory, safe for `JSON.stringify()`.

**`.select()`** — tells MongoDB to only return the fields you need, reducing network and parsing overhead. Works like SQL's `SELECT col1, col2` instead of `SELECT *`.

**Rule of thumb:**

- Use `.lean()` in GET endpoints, reports, or anywhere you won't call `.save()`
- Do NOT use `.lean()` when you need to modify the document and call `.save()` afterward

```mermaid
flowchart LR
    subgraph NORMAL ["Post.find() — default (Mongoose Document)"]
        DOC1[".save() works
middleware fires on .save()
virtuals available
~3x heavier in memory"]
    end
    subgraph LEAN ["Post.find().lean() — plain JS object"]
        DOC2["No .save()
No middleware overhead
~3x faster
Lower memory — ideal for API responses"]
    end

    style NORMAL fill:#fff3cd,color:#000
    style LEAN   fill:#d4edda,color:#000
```

```js
// API endpoint — list published posts for JSON response
const posts = await Post.find({ published: true })
  .sort({ views: -1 })
  .select("title slug views createdAt") // only needed fields
  .populate("authorId", "firstName lastName")
  .lean(); // plain objects — no Mongoose overhead

res.json(posts); // fast, no circular reference issues

// When NOT to use lean() — need .save() later
const post = await Post.findById(id); // Mongoose Document
post.views += 1;
await post.save(); // needs Document — don't use .lean() here

// Field selection
Post.find().select("title slug views"); // include only these
Post.find().select("-content -__v"); // exclude these

// password has select:false in schema — excluded by default
const user = await User.findById(id);
// user.password === undefined

// Force-include a select:false field (e.g., for login)
const user = await User.findOne({ email }).select("+password");
```

---

### Discriminators

**What are Discriminators?**
A **discriminator** lets you store multiple document types in a **single MongoDB collection**, where each type shares a common base schema but also has its own unique fields.

Mongoose adds a special field (the `discriminatorKey`, usually `kind` or `__t`) to every document so it knows which type each document is, and uses it to route queries to the correct model.

**Why use discriminators instead of separate collections?**

- All event types share the same `timestamp` and `userId` fields — no duplication
- You can query ALL event types in one query (`Event.find()`)
- You can query a specific type with type-scoped queries (`ViewEvent.find()`)
- MongoDB only needs to maintain indexes once (on the shared collection)

**Blog Platform use-case:** Track different analytics event types (`ViewEvent`, `LikeEvent`, `SignupEvent`) all in one `events` collection.

```mermaid
flowchart TD
    BASE["eventSchema (base)
timestamp
userId
kind  ← discriminatorKey"]
    V["ViewEvent
+ postId
+ duration (seconds)"]
    L["LikeEvent
+ postId"]
    S["SignupEvent
+ source"]

    BASE -->|"discriminator"| V
    BASE -->|"discriminator"| L
    BASE -->|"discriminator"| S

    DB[("'events' collection
All types stored together")]
    V --> DB
    L --> DB
    S --> DB

    style BASE fill:#cce5ff,color:#000
    style DB   fill:#d4edda,color:#000
```

```js
// Base schema
const eventSchema = new Schema(
  {
    timestamp: { type: Date, default: Date.now },
    userId: Schema.Types.ObjectId,
  },
  { discriminatorKey: "kind" }
);
const Event = model("Event", eventSchema);

// Discriminator models
const ViewEvent = Event.discriminator(
  "ViewEvent",
  new Schema({
    postId: Schema.Types.ObjectId,
    duration: Number, // seconds spent reading
  })
);

const LikeEvent = Event.discriminator(
  "LikeEvent",
  new Schema({
    postId: Schema.Types.ObjectId,
  })
);

const SignupEvent = Event.discriminator(
  "SignupEvent",
  new Schema({
    source: { type: String, enum: ["google", "email", "twitter"] },
  })
);

// Create events
await ViewEvent.create({ userId: alice._id, postId: post1._id, duration: 120 });
await LikeEvent.create({ userId: alice._id, postId: post2._id });
await SignupEvent.create({ userId: bob._id, source: "google" });

// Query specific type
const views = await ViewEvent.find({ postId: post1._id });

// Query all events (base model)
const all = await Event.find();
// each doc has kind: "ViewEvent" | "LikeEvent" | "SignupEvent"

// Aggregate: total read time per post
const readStats = await ViewEvent.aggregate([
  {
    $group: {
      _id: "$postId",
      totalSec: { $sum: "$duration" },
      readers: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "_id",
      as: "post",
    },
  },
  { $unwind: "$post" },
  { $project: { title: "$post.title", totalSec: 1, readers: 1 } },
]);
```

---

### Mongoose — Summary

```mermaid
mindmap
  root((Mongoose))
    Schema
      Types: String Number Boolean Date ObjectId Array
      Options: required default enum unique select trim
      timestamps: true
    Model
      Compiled from Schema
      CRUD + aggregate methods
    CRUD
      create insertMany
      find findOne findById
      findByIdAndUpdate new:true
      findByIdAndDelete deleteMany
    Query API
      Chainable: filter sort skip limit select lean
      Operators: gt lt in all size
    Validation
      Built-in: required min max enum match
      Custom: sync and async validators
    Middleware
      pre save find update delete
      post save find delete
      this = doc in document middleware
    Virtuals
      Getters and Setters
      Not stored in DB
      Virtual populate for reverse refs
    Population
      populate field
      Selective fields
      Deep nested populate
    Aggregation
      Full MongoDB pipeline
      Bypasses middleware
    Transactions
      startSession startTransaction
      commitTransaction abortTransaction
      Requires replica set
    Indexes
      Schema-defined then syncIndexes
      TTL text compound partial
    Plugins
      schema.plugin fn
      softDelete auditTrail
    Performance
      lean for read-only responses
      select for projection
```

| Concept      | One-line reminder                                                        |
| ------------ | ------------------------------------------------------------------------ |
| Schema       | Defines shape, types, validation, defaults                               |
| Model        | `model('Name', schema)` → collection `names`                             |
| Create       | `Model.create({...})` or `new Model().save()`                            |
| Read         | `find`, `findOne`, `findById`                                            |
| Update       | `findByIdAndUpdate(id, {$set:{...}}, {new:true})`                        |
| Delete       | `findByIdAndDelete(id)` · `deleteMany({...})`                            |
| Validation   | `required` `min/max` `enum` · custom async validators                    |
| Middleware   | `pre('save')` for hashing/slugs · `post('findOneAndDelete')` for cascade |
| Virtuals     | Computed · not stored · add `toJSON:{virtuals:true}`                     |
| Population   | `.populate('authorId', 'firstName')`                                     |
| Aggregation  | `Model.aggregate([...])` · full pipeline access                          |
| Transactions | `mongoose.startSession()` → `startTransaction()` → `commit/abort`        |
| lean()       | Plain JS objects for read-only API responses (~3x faster)                |
| Plugins      | `schema.plugin(fn)` — attach reusable behaviour (softDelete, audit)      |

> [Back to Index](#table-of-contents)

---

## Prisma — ORM for SQL + MongoDB

```mermaid
flowchart LR
    SCHEMA["schema.prisma
(source of truth)"]

    subgraph TOOLS ["Prisma Toolkit"]
        CLI["prisma CLI
migrate dev
db push
studio"]
        GEN["Code generator
generates @prisma/client"]
    end

    CLIENT["PrismaClient
type-safe, auto-generated"]
    DB[("PostgreSQL / MySQL /
SQLite / MongoDB")]

    SCHEMA --> CLI
    SCHEMA --> GEN --> CLIENT
    CLIENT -->|"prisma.post.findMany()"| DB

    style SCHEMA fill:#cce5ff,color:#000
    style CLIENT fill:#d4edda,color:#000
    style DB     fill:#e2e3e5,color:#000
```

---

### What is Prisma?

**Prisma** is a next-generation ORM with a **declarative schema** and a **type-safe, auto-generated client**.

| Component          | Role                                                            |
| ------------------ | --------------------------------------------------------------- |
| **Prisma Schema**  | `schema.prisma` — define models, relations, indexes in one file |
| **Prisma Migrate** | Version-controlled SQL migration files                          |
| **Prisma Client**  | Auto-generated query client — fully typed in TypeScript         |
| **Prisma Studio**  | Browser GUI for your database (`npx prisma studio`)             |

**Supported databases:** PostgreSQL · MySQL · SQLite · SQL Server · CockroachDB · **MongoDB**

---

### TypeScript Integration (Prisma)

**Why Prisma is TypeScript-first:**
When you run `prisma generate`, Prisma reads `schema.prisma` and produces a **fully-typed `PrismaClient`** in `node_modules/@prisma/client`. Every model, relation, filter, result, and nested shape has a corresponding TypeScript type — **no manual type definitions needed**. If you rename a field in `schema.prisma` and regenerate, any code using the old name produces a compile error immediately.

**Key types generated in the `Prisma` namespace:**

| Type                                  | What it represents                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Prisma.PostCreateInput`              | All required + optional fields accepted by `prisma.post.create({ data: ... })`             |
| `Prisma.PostUpdateInput`              | All updatable fields (all optional) accepted by `.update({ data: ... })`                   |
| `Prisma.PostWhereInput`               | The `where` filter shape for Post queries                                                  |
| `Prisma.PostOrderByWithRelationInput` | The `orderBy` shape for Post queries                                                       |
| `Prisma.PostGetPayload<T>`            | Compute the **exact TypeScript shape** returned by a query that uses `include` or `select` |
| `Prisma.PostInclude`                  | The `include` shape for Post (which relations can be included)                             |

```mermaid
flowchart LR
    SCHEMA["schema.prisma"]
    GEN["prisma generate"]
    CLIENT["@prisma/client
PrismaClient (typed)
Prisma namespace types"]
    APP["TypeScript Application
type-safe queries
compile-time errors on wrong fields"]

    SCHEMA --> GEN --> CLIENT --> APP

    style SCHEMA fill:#cce5ff,color:#000
    style CLIENT fill:#d4edda,color:#000
    style APP    fill:#fff3cd,color:#000
```

```ts
import { PrismaClient, Prisma, Post, User } from "@prisma/client";

const prisma = new PrismaClient();

// ── Using generated input types as function parameter types ───────────────

async function createPost(data: Prisma.PostCreateInput): Promise<Post> {
  return prisma.post.create({ data });
}

async function updatePost(
  id: number,
  data: Prisma.PostUpdateInput
): Promise<Post> {
  return prisma.post.update({ where: { id }, data });
}

// createPost({ title: 'Hello', slug: 'hello', content: '...', authorId: 1 }) ✓
// createPost({ title: 'Hello', unknownField: true })  ← TypeScript error ✗

// ── Prisma.PostGetPayload — derive the exact return type of a query shape ─

// Step 1: define the query shape using Prisma.validator (retains full type info)
const postWithDetails = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    author: { select: { firstName: true, lastName: true } },
    categories: { select: { name: true, slug: true } },
    _count: { select: { comments: true } },
  },
});

// Step 2: derive the TypeScript type from that shape
type PostWithDetails = Prisma.PostGetPayload<typeof postWithDetails>;
// PostWithDetails = {
//   id: number, title: string, slug: string, ...
//   author:     { firstName: string, lastName: string }
//   categories: { name: string, slug: string }[]
//   _count:     { comments: number }
// }

// Step 3: use both the shape and the type in a typed function
async function getPostBySlug(slug: string): Promise<PostWithDetails | null> {
  return prisma.post.findUnique({ where: { slug }, ...postWithDetails });
}

const post = await getPostBySlug("intro-mongoose");
// TypeScript knows:
post?.author.firstName; // string ✓
post?.categories[0].name; // string ✓
post?._count.comments; // number ✓
post?.unknownField; // TypeScript error ✗

// ── Reusable paginate helper — generic and fully typed ────────────────────

type PaginatedResult<T> = { data: T[]; total: number; pages: number };

async function paginatePosts(
  where: Prisma.PostWhereInput,
  page: number = 1,
  size: number = 10
): Promise<PaginatedResult<Post>> {
  const [data, total] = await Promise.all([
    prisma.post.findMany({ where, skip: (page - 1) * size, take: size }),
    prisma.post.count({ where }),
  ]);
  return { data, total, pages: Math.ceil(total / size) };
}

const result = await paginatePosts({ published: true }, 1, 10);
// result.data  → Post[]  (fully typed)
// result.total → number
// result.pages → number
```

---

### Installation & Setup

**Two packages to install:**

- `prisma` — the **CLI** used during development. Manages schema, migrations, and code generation. Not bundled with your app.
- `@prisma/client` — the **auto-generated query client** that ships with your app. Must be regenerated (`prisma generate`) after every schema change.

**Setup workflow:**

1. Run `prisma init` → creates `prisma/schema.prisma` and a `.env` file.
2. Set `DATABASE_URL` in `.env`.
3. Define your models in `schema.prisma`.
4. Run `prisma migrate dev` (SQL databases) or `prisma db push` (MongoDB) to sync the DB schema.
5. Import and use `PrismaClient` in your application code.

```bash
npm install prisma @prisma/client
npx prisma init          # creates prisma/schema.prisma and .env
```

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/blog"
```

After editing `schema.prisma`:

```bash
npx prisma migrate dev --name init   # SQL: create migration file + apply
npx prisma db push                   # MongoDB: sync schema (no migration file)
npx prisma generate                  # regenerate the client after schema changes
npx prisma studio                    # open GUI in browser
```

---

### Prisma Schema — Blog Platform

**What is `schema.prisma`?**
The Prisma schema file is the **single source of truth** for your entire database structure. Written in Prisma's own DSL (Domain-Specific Language), it defines your models, relations, indexes, and enums in one place. Running `prisma generate` reads this file and produces the fully-typed `PrismaClient`.

| Block        | Purpose                                                                           |
| ------------ | --------------------------------------------------------------------------------- |
| `generator`  | Which client to generate (e.g. `prisma-client-js`) and output path                |
| `datasource` | Database type (`postgresql`, `mysql`, `sqlite`, `mongodb`) and connection URL     |
| `model`      | A table (SQL) or collection (MongoDB) — contains fields with types and attributes |
| `enum`       | A fixed set of allowed string values (e.g. `Role: ADMIN, AUTHOR, READER`)         |

**Key field attributes:**

| Attribute         | Meaning                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| `@id`             | Primary key — required on every model                                        |
| `@unique`         | Unique constraint on this field                                              |
| `@default(...)`   | Default value — `now()`, `autoincrement()`, `auto()`, `uuid()`, or a literal |
| `@updatedAt`      | Automatically updated to the current timestamp on every write                |
| `@relation(...)`  | Defines the FK column and which field it references                          |
| `@@index([...])`  | Composite index on multiple fields                                           |
| `@@unique([...])` | Composite unique constraint on multiple fields                               |
| `@map("name")`    | Map the Prisma field name to a different column/field name in the DB         |

The same Blog Platform modelled in `schema.prisma`:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ──────────────────────────────────────────────────

enum Role {
  ADMIN
  AUTHOR
  READER
}

// ─── Models ─────────────────────────────────────────────────

model User {
  id        Int      @id @default(autoincrement())
  firstName String
  lastName  String
  email     String   @unique
  password  String
  role      Role     @default(READER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  profile   Profile?    // one-to-one (optional)
  posts     Post[]      // one-to-many
  comments  Comment[]   // one-to-many
}

model Profile {
  id        Int     @id @default(autoincrement())
  bio       String?
  avatarUrl String?
  website   String?

  userId    Int     @unique
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  posts Post[] @relation("PostCategories")
}

model Post {
  id         Int        @id @default(autoincrement())
  title      String
  slug       String     @unique
  content    String
  published  Boolean    @default(false)
  views      Int        @default(0)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  authorId   Int
  author     User       @relation(fields: [authorId], references: [id])
  categories Category[] @relation("PostCategories")  // many-to-many (join table auto-created)
  comments   Comment[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  body      String
  createdAt DateTime @default(now())

  postId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

#### Relation Map

```mermaid
erDiagram
    User ||--o| Profile  : "has one"
    User ||--o{ Post     : "writes"
    User ||--o{ Comment  : "writes"
    Post ||--o{ Comment  : "has many"
    Post }o--o{ Category : "PostCategories (auto-join-table)"
```

---

### Migrations

**What are migrations?**
A **migration** is a versioned, tracked description of a schema change. Every time you modify `schema.prisma` and run `prisma migrate dev`, Prisma generates a new **SQL migration file** inside `prisma/migrations/`. These files are committed to git alongside your application code, giving your team a complete, reproducible history of every schema change.

**Why version-control schema changes?**

- **Reproducible deploys** — run `prisma migrate deploy` on any machine and the DB reaches the exact same state.
- **Team collaboration** — every team member applies the same migration files in order.
- **Auditability** — inspect the raw SQL to understand precisely what changed and when.
- **Safety** — migrations are applied atomically; a failed migration is rolled back.

| Command                 | When to use                  | What it does                                                           |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `prisma migrate dev`    | Development                  | Creates a SQL migration file, applies it to dev DB, regenerates client |
| `prisma migrate deploy` | Production / CI              | Applies pending migration files — does NOT create new ones             |
| `prisma migrate reset`  | Dev only                     | Drops and re-creates DB, re-applies all migrations (DESTRUCTIVE)       |
| `prisma db push`        | MongoDB or quick prototyping | Syncs schema to DB without creating migration files                    |
| `prisma db pull`        | Existing DB                  | Introspects DB and writes `schema.prisma` from the current structure   |

```mermaid
flowchart LR
    SCHEMA["schema.prisma
(updated)"]
    DEV["prisma migrate dev
creates SQL migration file
applies to dev DB
re-generates client"]
    DEPLOY["prisma migrate deploy
applies existing migration files
safe for production"]
    PUSH["prisma db push
no migration file
prototyping / MongoDB"]
    PULL["prisma db pull
DB to schema.prisma
introspection of existing DB"]

    SCHEMA --> DEV
    SCHEMA --> PUSH
    DEV -->|"commit migration files"| DEPLOY
    PULL --> SCHEMA

    style SCHEMA fill:#cce5ff,color:#000
    style DEV    fill:#d4edda,color:#000
    style DEPLOY fill:#d4edda,color:#000
```

```bash
# Create and apply a migration (development)
npx prisma migrate dev --name add_views_to_post
# → creates prisma/migrations/20260311_add_views_to_post/migration.sql
# → applies immediately to dev DB
# → regenerates @prisma/client

# Apply existing migrations (production)
npx prisma migrate deploy

# Reset dev DB (DROPS ALL DATA — dev only)
npx prisma migrate reset

# Prototype without migration files
npx prisma db push

# Pull existing DB structure into schema.prisma
npx prisma db pull
```

---

### Prisma Client — CRUD

**What is PrismaClient?**
`PrismaClient` is the **auto-generated, type-safe query engine** for your database. Each instance manages its own connection pool. In Node.js development, hot-reload creates a new `PrismaClient` on every file change — exhausting database connection limits — so a **singleton pattern** is used to reuse the same instance across the entire application.

| Method       | Type  | Returns                                                                  |
| ------------ | ----- | ------------------------------------------------------------------------ |
| `create`     | Write | The created record (full object)                                         |
| `createMany` | Write | `{ count: N }`                                                           |
| `findUnique` | Read  | Single record or `null` — `where` must use `@id` or `@unique` field      |
| `findFirst`  | Read  | First match or `null` — accepts any field condition + `orderBy` + `skip` |
| `findMany`   | Read  | Array of matching records                                                |
| `update`     | Write | The updated record — throws if not found                                 |
| `updateMany` | Write | `{ count: N }`                                                           |
| `upsert`     | Write | Created or updated record                                                |
| `delete`     | Write | The deleted record — throws if not found                                 |
| `deleteMany` | Write | `{ count: N }`                                                           |
| `count`      | Read  | Number of matching records                                               |
| `aggregate`  | Read  | Computed stats (`_count`, `_sum`, `_avg`, `_min`, `_max`)                |
| `groupBy`    | Read  | Array of grouped result objects with accumulators                        |

**`findUnique` vs `findFirst`:**

- `findUnique` — the `where` clause must reference a `@unique` or `@id` field. Prisma can use a DB-level unique index, making it faster and safer for exact lookups.
- `findFirst` — accepts any field condition, plus `orderBy` and `skip`. Use when there is no unique constraint on the filter field.

#### Singleton Client

```js
// lib/prisma.js  — prevent multiple instances in development
const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });
}

const prisma = globalForPrisma.prisma;
module.exports = prisma;
```

#### Create

```js
const prisma = require("./lib/prisma");

// Create Alice with her profile (nested create)
const alice = await prisma.user.create({
  data: {
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@blog.com",
    password: "hashed_pw",
    role: "ADMIN",
    profile: {
      create: { bio: "Editor & founder", website: "alice.dev" },
    },
  },
  include: { profile: true },
});

// Create Bob
const bob = await prisma.user.create({
  data: {
    firstName: "Bob",
    lastName: "Jones",
    email: "bob@blog.com",
    password: "hashed_pw",
    role: "AUTHOR",
  },
});

// Create categories
const [js, mongo, node] = await Promise.all([
  prisma.category.create({ data: { name: "JavaScript", slug: "javascript" } }),
  prisma.category.create({ data: { name: "MongoDB", slug: "mongodb" } }),
  prisma.category.create({ data: { name: "Node.js", slug: "nodejs" } }),
]);

// Create post by Bob — connect to existing categories
const post1 = await prisma.post.create({
  data: {
    title: "Intro to Mongoose",
    slug: "intro-mongoose",
    content: "Mongoose is an ODM for MongoDB...",
    published: true,
    views: 340,
    authorId: bob.id,
    categories: {
      connect: [{ id: js.id }, { id: mongo.id }], // link existing Category rows
    },
  },
  include: { categories: true, author: { select: { firstName: true } } },
});

// Add comment
await prisma.comment.create({
  data: { body: "Great intro!", postId: post1.id, authorId: alice.id },
});
```

#### Read

```js
// All published posts
const all = await prisma.post.findMany({ where: { published: true } });

// Unique by slug (null if not found)
const post = await prisma.post.findUnique({
  where: { slug: "intro-mongoose" },
});

// First match (no uniqueness requirement)
const post = await prisma.post.findFirst({
  where: { authorId: bob.id, published: true },
  orderBy: { views: "desc" },
});

// Count
const count = await prisma.post.count({ where: { published: true } }); // → 2
```

#### Update

```js
// Atomic increment
const updated = await prisma.post.update({
  where: { slug: "intro-mongoose" },
  data: { views: { increment: 1 } },
});
// post1.views is now 341

// Publish a draft
await prisma.post.update({
  where: { id: post3.id },
  data: { published: true },
});

// Upsert — create profile if missing, update if exists
const profile = await prisma.profile.upsert({
  where: { userId: bob.id },
  update: { bio: "Senior JS developer" },
  create: { userId: bob.id, bio: "Senior JS developer", website: "bob.dev" },
});

// Update many: reset views on all unpublished posts
const result = await prisma.post.updateMany({
  where: { published: false },
  data: { views: 0 },
});
console.log(result.count); // number of rows updated
```

#### Delete

```js
// Delete one comment — returns the deleted record
const deleted = await prisma.comment.delete({ where: { id: comment1.id } });

// Delete all comments on post1
const result = await prisma.comment.deleteMany({ where: { postId: post1.id } });
console.log(result.count); // number deleted

// Delete post — cascades to comments (onDelete: Cascade in schema)
await prisma.post.delete({ where: { id: post1.id } });
```

---

### Filtering, Sorting & Pagination

**How Prisma filtering works:**
Every read and write method (`findMany`, `findFirst`, `update`, `delete`, `count`) accepts a `where` object. The shape of `where` mirrors your model — each field accepts either a direct value (equality) or an **operator object** for richer conditions.

**Scalar filter operators:**

| Operator              | Meaning                                          | Example                                              |
| --------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `equals`              | Exact match (default when passing a plain value) | `{ views: { equals: 100 } }`                         |
| `not`                 | Not equal                                        | `{ published: { not: false } }`                      |
| `in`                  | Value is in list                                 | `{ role: { in: ['ADMIN', 'AUTHOR'] } }`              |
| `notIn`               | Value is not in list                             | `{ role: { notIn: ['READER'] } }`                    |
| `lt / lte`            | Less than / less-than-or-equal                   | `{ views: { lt: 100 } }`                             |
| `gt / gte`            | Greater than / greater-than-or-equal             | `{ views: { gt: 500 } }`                             |
| `contains`            | String contains substring                        | `{ title: { contains: 'mongoose' } }`                |
| `startsWith`          | String starts with prefix                        | `{ slug: { startsWith: 'intro' } }`                  |
| `endsWith`            | String ends with suffix                          | `{ email: { endsWith: '@blog.com' } }`               |
| `mode: 'insensitive'` | Case-insensitive string matching                 | `{ title: { contains: 'js', mode: 'insensitive' } }` |

**Relation filter operators** (filter a parent by the state of its related records):

| Operator | Meaning                                             |
| -------- | --------------------------------------------------- |
| `some`   | At least one related record satisfies the condition |
| `every`  | All related records satisfy the condition           |
| `none`   | No related records satisfy the condition            |

**Logical combinators:** `AND`, `OR`, `NOT` — each accepts an array of `where` condition objects.

```mermaid
flowchart LR
    QUERY["prisma.post.findMany({ ... })"]
    W["where:
filter conditions"]
    O["orderBy:
field + direction"]
    SK["skip:
offset (for pagination)"]
    T["take:
limit"]
    S["select:
field projection"]
    I["include:
join related models"]
    RES["Result Array"]

    QUERY --> W --> O --> SK --> T --> S --> I --> RES
    style QUERY fill:#cce5ff,color:#000
    style RES   fill:#d4edda,color:#000
```

```js
// Top 5 most-viewed published posts — title, slug, views, author name
const topPosts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { views: "desc" },
  take: 5,
  select: {
    title: true,
    slug: true,
    views: true,
    author: { select: { firstName: true, lastName: true } },
  },
});
// [{ title: 'Prisma vs Mongoose', slug: 'prisma-mongoose', views: 820, author: { firstName: 'Bob', ... } }]

// Paginated list — page 2, 10 per page
const PAGE = 2,
  SIZE = 10;
const posts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: "desc" },
  skip: (PAGE - 1) * SIZE,
  take: SIZE,
});

// String filter (case-insensitive contains)
await prisma.post.findMany({
  where: { title: { contains: "mongoose", mode: "insensitive" } },
});

// Number and date filters
await prisma.post.findMany({
  where: {
    views: { gt: 300 },
    createdAt: { gte: new Date("2026-01-01") },
  },
});

// OR / AND / NOT
await prisma.post.findMany({
  where: {
    OR: [{ authorId: alice.id }, { views: { gt: 500 } }],
    NOT: { published: false },
  },
});

// Enum filter
await prisma.user.findMany({ where: { role: "ADMIN" } });
await prisma.user.findMany({ where: { role: { in: ["ADMIN", "AUTHOR"] } } });

// Null checks
await prisma.profile.findMany({ where: { bio: null } });
await prisma.profile.findMany({ where: { bio: { not: null } } });
```

---

### Relations & Include

**What is `include`?**
`include` tells Prisma to **eagerly load related records** in the same query — similar to Mongoose's `.populate()`. Under the hood, Prisma executes a JOIN (SQL) or a follow-up query (MongoDB) and returns the related data nested inside the result object.

**`include` vs `select`:**

| Option                                                 | What it does                                                                     |
| ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `include: { author: true }`                            | Load all fields of the related `author` model                                    |
| `include: { author: { select: { firstName: true } } }` | Load related model, but project only `firstName`                                 |
| `select: { title: true, author: true }`                | Return only `title` and the `author` relation — excludes all other scalar fields |

> `include` and `select` **cannot be combined at the same nesting level**. Use `select` on the top level with a nested `include` object if you need both projection and relations.

**Relation filters inside `where`:** You can filter parents by the state of their children using `some`, `every`, and `none` (see Filtering section).

**Nested `include`:** You can `include` relations inside an `include`, traversing as many levels deep as needed. Each level can have its own `where`, `orderBy`, `take`, and `skip`.

```mermaid
flowchart TD
    QUERY["prisma.post.findMany({ include: {...} })"]
    POST["Post
id, title, slug, views, published"]
    AUTHOR["author: User
firstName, lastName, email"]
    CATS["categories: Category[]
name, slug"]
    CMTS["comments: Comment[]
body, createdAt"]
    CAUTH["author: User
firstName"]

    QUERY --> POST
    POST --> AUTHOR
    POST --> CATS
    POST --> CMTS
    CMTS --> CAUTH

    style QUERY fill:#cce5ff,color:#000
    style POST  fill:#fff3cd,color:#000
    style AUTHOR fill:#d4edda,color:#000
    style CATS   fill:#d4edda,color:#000
    style CMTS   fill:#d4edda,color:#000
    style CAUTH  fill:#d4edda,color:#000
```

```js
// Fetch post with all related data in one query
const post = await prisma.post.findUnique({
  where: { slug: "intro-mongoose" },
  include: {
    author: { select: { firstName: true, lastName: true } },
    categories: { select: { name: true, slug: true } },
    comments: {
      where: { createdAt: { gte: new Date("2026-01-01") } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        author: { select: { firstName: true } }, // nested include
      },
    },
  },
});
// post.author.firstName       → "Bob"
// post.categories[0].name     → "JavaScript"
// post.comments[0].author.firstName → "Alice"

// Relation filters: users who wrote at least 1 published post
const activeAuthors = await prisma.user.findMany({
  where: { posts: { some: { published: true } } },
});

// Users with NO posts
const noPostUsers = await prisma.user.findMany({
  where: { posts: { none: {} } },
});

// Users whose ALL posts are published
const allPublishedAuthors = await prisma.user.findMany({
  where: { posts: { every: { published: true } } },
});

// Posts in JavaScript category
const jsPosts = await prisma.post.findMany({
  where: { categories: { some: { slug: "javascript" } } },
});

// Posts in BOTH javascript AND mongodb
const posts = await prisma.post.findMany({
  where: {
    AND: [
      { categories: { some: { slug: "javascript" } } },
      { categories: { some: { slug: "mongodb" } } },
    ],
  },
});
```

---

### Error Handling (Prisma)

**What errors does Prisma throw?**
Prisma uses a **typed error hierarchy** built around the `Prisma` namespace. Use `instanceof` checks to handle known database errors with precise, type-safe access to error codes and metadata — far more reliable than string-matching `err.message`.

**Prisma error classes:**

| Class                             | When thrown                                                       | Key properties                 |
| --------------------------------- | ----------------------------------------------------------------- | ------------------------------ |
| `PrismaClientKnownRequestError`   | A **known** DB-level error with a Prisma error code (P-code)      | `err.code`, `err.meta`         |
| `PrismaClientUnknownRequestError` | An unexpected DB error with no Prisma code                        | `err.message`                  |
| `PrismaClientValidationError`     | Wrong argument types or missing required fields passed to a query | `err.message`                  |
| `PrismaClientInitializationError` | PrismaClient could not connect to the DB at startup               | `err.message`, `err.errorCode` |

**Common P-codes (`PrismaClientKnownRequestError.code`):**

| Code    | Meaning                          | Blog Platform scenario                                         |
| ------- | -------------------------------- | -------------------------------------------------------------- |
| `P2002` | Unique constraint violation      | Duplicate `email` or `slug` on create                          |
| `P2003` | Foreign key constraint violation | Referencing a non-existent `authorId`                          |
| `P2014` | Required relation violation      | Trying to disconnect the only required relation                |
| `P2025` | Record not found                 | `update`, `delete`, or `findUniqueOrThrow` on a missing record |

```mermaid
flowchart TD
    OP(["Prisma query"])
    VE["PrismaClientValidationError
Wrong type passed
Required arg missing
Unknown field name"]
    KE["PrismaClientKnownRequestError
P2002 — unique constraint
P2025 — record not found
P2003 — FK violation"]
    OK["Success → plain JS object"]

    OP -->|"bad arguments"| VE
    OP -->|"DB rejects"| KE
    OP -->|"all pass"| OK

    style VE fill:#f8d7da,color:#000
    style KE fill:#f8d7da,color:#000
    style OK fill:#d4edda,color:#000
```

```js
const { Prisma } = require("@prisma/client");

// ─── Central Prisma error handler ─────────────────────────────────────────

function handlePrismaError(err, res) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        // err.meta.target = ['email'] or ['slug', 'authorId'] etc.
        const fields = err.meta?.target?.join(", ") ?? "unknown field";
        return res.status(409).json({
          error: `Duplicate value on unique field(s): ${fields}`,
        });
      }
      case "P2025":
        return res.status(404).json({ error: "Record not found" });

      case "P2003":
        return res.status(400).json({
          error: `Foreign key violation on field: ${err.meta?.field_name}`,
        });

      default:
        return res.status(400).json({ error: `Database error: ${err.code}` });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res
      .status(400)
      .json({ error: "Invalid query arguments", detail: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}

// ─── Route examples ───────────────────────────────────────────────────────

// POST /users — P2002 if email already exists
app.post("/users", async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).json(user);
  } catch (err) {
    handlePrismaError(err, res);
    // Duplicate email → 409 { error: "Duplicate value on unique field(s): email" }
  }
});

// DELETE /posts/:id — P2025 if record does not exist
app.delete("/posts/:id", async (req, res) => {
  try {
    const post = await prisma.post.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(post);
  } catch (err) {
    handlePrismaError(err, res);
    // Missing record → 404 { error: "Record not found" }
  }
});

// ─── findUniqueOrThrow / findFirstOrThrow ─────────────────────────────────
// These variants throw P2025 instead of returning null — convenient when
// you always expect the record to exist (e.g. inside a transaction)

const post = await prisma.post.findUniqueOrThrow({
  where: { slug: "intro-mongoose" },
});
// → throws PrismaClientKnownRequestError P2025 if no record matches

const user = await prisma.user.findFirstOrThrow({
  where: { email: "alice@blog.com" },
});
// → same behaviour for findFirstOrThrow
```

---

### Nested Writes

**What are nested writes?**
Nested writes let you **create, connect, update, or delete related records inside a single Prisma query** — without needing a separate transaction. Prisma executes all operations atomically so either everything succeeds or everything is rolled back.

**Why use nested writes?**

- Create a parent and its children in one call (e.g. `User` + `Profile` on sign-up).
- Link a new record to existing related records at creation time (e.g. `Post` + existing `Category` rows).
- Update a relation as part of the same mutation that updates the parent (e.g. replace all categories on a post).

| Operation    | Applies to                        | Effect                                                            |
| ------------ | --------------------------------- | ----------------------------------------------------------------- |
| `create`     | One-to-one, one-to-many           | Create new related record(s)                                      |
| `createMany` | One-to-many                       | Bulk-create related records                                       |
| `connect`    | Any relation                      | Link to an existing record by `@id` or `@unique` field            |
| `disconnect` | Optional one-to-one, many-to-many | Remove the link without deleting the record                       |
| `set`        | Many-to-many                      | Replace **all** current connections (disconnect old, connect new) |
| `upsert`     | Any relation                      | Create if the record does not exist, update if it does            |
| `update`     | One-to-one, one-to-many           | Update an already-linked record                                   |
| `delete`     | One-to-one                        | Delete the linked record                                          |
| `deleteMany` | One-to-many                       | Delete all (or filtered) related records                          |

Create, update, or delete related records inside a single query.

```js
// Create post + connect categories + create first comment — all in one query
const post2 = await prisma.post.create({
  data: {
    title: "Prisma vs Mongoose",
    slug: "prisma-mongoose",
    content: "A detailed comparison...",
    published: true,
    views: 820,
    authorId: bob.id,
    categories: {
      connect: [{ slug: "javascript" }, { slug: "nodejs" }],
    },
    comments: {
      create: [{ body: "Love the comparisons.", authorId: alice.id }],
    },
  },
  include: { categories: true, comments: true },
});

// Replace ALL categories of a post (set = disconnect old + connect new)
await prisma.post.update({
  where: { id: post2.id },
  data: {
    categories: {
      set: [{ slug: "javascript" }, { slug: "mongodb" }, { slug: "nodejs" }],
    },
  },
});

// Disconnect one specific category
await prisma.post.update({
  where: { id: post2.id },
  data: {
    categories: { disconnect: [{ slug: "nodejs" }] },
  },
});

// Update user + upsert their profile in one query
await prisma.user.update({
  where: { id: bob.id },
  data: {
    role: "ADMIN",
    profile: {
      upsert: {
        create: { bio: "Promoted to admin", website: "bob.dev" },
        update: { bio: "Promoted to admin" },
      },
    },
  },
});

// Delete all comments when deleting a post (besides the schema onDelete:Cascade)
await prisma.post.update({
  where: { id: post1.id },
  data: {
    comments: { deleteMany: {} }, // delete all comments on this post
  },
});
```

| Operation    | Effects                                     |
| ------------ | ------------------------------------------- |
| `create`     | Create new related record(s)                |
| `connect`    | Link to existing record(s)                  |
| `disconnect` | Remove link (for optionals or many-to-many) |
| `set`        | Replace all connections                     |
| `upsert`     | Create if missing, update if exists         |
| `update`     | Update linked record                        |
| `delete`     | Delete linked record                        |
| `deleteMany` | Delete all matching related records         |

---

### Transactions (Prisma)

**What are Prisma transactions?**
A transaction groups multiple database operations so they either **all succeed (commit)** or **all fail (rollback)**. Prisma provides two transaction styles:

| Style           | Syntax                                       | When to use                                                                                  |
| --------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Sequential**  | `prisma.$transaction([op1, op2, ...])`       | Independent operations that don't need results from each other — simpler and slightly faster |
| **Interactive** | `prisma.$transaction(async (tx) => { ... })` | When later steps depend on earlier results, or you need conditional logic (`if / throw`)     |

**Key rules:**

- Inside an interactive transaction, use the `tx` client — not `prisma` — for every query. Queries against `prisma` run _outside_ the transaction scope.
- Throwing any error (or rejecting a promise) inside the callback causes **automatic rollback**.
- Sequential transactions are wrapped in a single DB transaction automatically — no `tx` client needed.

```mermaid
flowchart TD
    NEED(["Operation needing atomicity"])
    T1["prisma.$transaction([ op1, op2 ])
Sequential — simpler, no cross-operation logic"]
    T2["prisma.$transaction(async tx => {...})
Interactive — supports if/else, throws, loops"]

    subgraph SEQ ["Sequential Transaction"]
        S1["deleteMany comments"]
        S2["delete post"]
    end

    subgraph INT ["Interactive Transaction"]
        I1["find post — throw if not found"]
        I2["delete comments"]
        I3["delete post"]
        I4["create audit log entry"]
    end

    NEED --> T1 --> SEQ -->|"all or nothing"| DB[("DB committed")]
    NEED --> T2 --> INT -->|"throw = automatic rollback"| RB["DB rolled back"]

    style DB fill:#d4edda,color:#000
    style RB fill:#f8d7da,color:#000
```

```js
// Sequential transaction — simpler for independent operations
const [deletedComments, deletedPost] = await prisma.$transaction([
  prisma.comment.deleteMany({ where: { postId: post1.id } }),
  prisma.post.delete({ where: { id: post1.id } }),
]);
console.log(
  `Removed ${deletedComments.count} comments and post "${deletedPost.title}"`
);

// Interactive transaction — for conditional logic
const result = await prisma.$transaction(async (tx) => {
  // All queries use 'tx' — scoped to this transaction
  const post = await tx.post.findUnique({ where: { id: post1.id } });
  if (!post) throw new Error("Post not found"); // auto rollback on throw

  await tx.comment.deleteMany({ where: { postId: post.id } });
  await tx.post.delete({ where: { id: post.id } });

  // Add audit log entry in same transaction
  await tx.auditLog.create({
    data: { action: "POST_DELETED", targetId: post.id, actorId: alice.id },
  });

  return { deletedTitle: post.title };
});
console.log(`Deleted: ${result.deletedTitle}`);
```

---

### Aggregations & Grouping

**What is `aggregate()`?**
`prisma.model.aggregate()` computes **scalar statistics** over all records matching a `where` condition. It is equivalent to SQL `SELECT COUNT(*), SUM(views), AVG(views) FROM Post WHERE published = true`. Results are returned as a single object with accumulator keys.

**What is `groupBy()`?**
`prisma.model.groupBy()` is equivalent to SQL `GROUP BY`. It splits records into groups by one or more fields, then computes accumulators per group. The optional `having` clause filters _groups_ after aggregation (SQL `HAVING`).

| Accumulator             | SQL equivalent | Example key         |
| ----------------------- | -------------- | ------------------- |
| `_count: { id: true }`  | `COUNT(id)`    | `result._count.id`  |
| `_sum: { views: true }` | `SUM(views)`   | `result._sum.views` |
| `_avg: { views: true }` | `AVG(views)`   | `result._avg.views` |
| `_min: { views: true }` | `MIN(views)`   | `result._min.views` |
| `_max: { views: true }` | `MAX(views)`   | `result._max.views` |

> **Note:** `groupBy()` does not support `include` or `select`. To combine grouped stats with related model data, use a raw query or a separate `findMany` with `where: { id: { in: groupedIds } }`.

```js
// Total and average views across published posts
const stats = await prisma.post.aggregate({
  where: { published: true },
  _count: { id: true }, // COUNT(id)
  _sum: { views: true }, // SUM(views)
  _avg: { views: true }, // AVG(views)
  _max: { views: true }, // MAX(views)
  _min: { views: true }, // MIN(views)
});
// { _count: { id: 2 }, _sum: { views: 1160 }, _avg: { views: 580 }, ... }

// Group posts by authorId — count and total views per author
const authorStats = await prisma.post.groupBy({
  by: ["authorId"],
  where: { published: true },
  _count: { id: true },
  _sum: { views: true },
  having: { views: { _sum: { gt: 100 } } }, // HAVING SUM(views) > 100
  orderBy: { _sum: { views: "desc" } },
});
/*
[
  { authorId: 2, _count: { id: 2 }, _sum: { views: 1160 } }
]
*/

// Count comments per post
const commentCounts = await prisma.comment.groupBy({
  by: ["postId"],
  _count: { id: true },
  orderBy: { _count: { id: "desc" } },
});
// [{ postId: 1, _count: { id: 2 } }, { postId: 2, _count: { id: 1 } }]
```

---

### Raw Queries

Use when Prisma's query API can't express what you need.
**Always use tagged template literals** — never string interpolation (SQL injection risk).

```js
const { Prisma } = require("@prisma/client");

// $queryRaw — returns array of result objects
const topAuthors = await prisma.$queryRaw`
  SELECT
    u.id,
    u."firstName" || ' ' || u."lastName" AS name,
    COUNT(p.id)::int  AS post_count,
    SUM(p.views)::int AS total_views
  FROM "User" u
  LEFT JOIN "Post" p
    ON p."authorId" = u.id AND p.published = true
  GROUP BY u.id
  ORDER BY total_views DESC
  LIMIT ${5}
`;

// $executeRaw — for INSERT/UPDATE/DELETE (returns row count)
const affected = await prisma.$executeRaw`
  UPDATE "Post"
  SET views = views + 1
  WHERE slug = ${post1.slug}
`;
console.log(affected); // 1

// NEVER do this — SQL injection vulnerability:
// await prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE email = '${userInput}'`)
```

---

### Middleware (Prisma)

**What is Prisma middleware?**
Prisma middleware is a function registered with `prisma.$use()` that intercepts **every query** before it reaches the database. Unlike Mongoose middleware (which is per-schema and tied to document lifecycle events), Prisma middleware is **global** — it runs for all models and all query types.

**The `params` object** (passed as the first argument to each middleware):

| Property                  | Type      | Description                                                                                               |
| ------------------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `params.model`            | `string`  | Model name, e.g. `'Post'`, `'User'`                                                                       |
| `params.action`           | `string`  | Query type: `'findMany'`, `'create'`, `'delete'`, `'update'`, etc.                                        |
| `params.args`             | `object`  | The original query arguments (`where`, `data`, `include`, etc.) — you can mutate this to change the query |
| `params.runInTransaction` | `boolean` | Whether this query runs inside a transaction                                                              |

**Common use-cases:**

- **Soft delete** — intercept `delete` / `deleteMany` and redirect to `update` setting `deletedAt`.
- **Query timing** — measure execution time and warn on slow queries.
- **Audit logging** — record who changed what and when.
- **Row-level security** — automatically inject `where: { tenantId }` for multi-tenant apps.

> Always call `return next(params)` at the end of your middleware — this passes control to the next middleware in the chain (or to the actual database query) and returns its result.

```js
const prisma = new PrismaClient();

// 1. Soft-delete middleware — convert delete to update
prisma.$use(async (params, next) => {
  const SOFT_DELETE_MODELS = ["Post", "Comment"];

  if (SOFT_DELETE_MODELS.includes(params.model)) {
    // Intercept deletes
    if (params.action === "delete") {
      params.action = "update";
      params.args.data = { deletedAt: new Date() };
    }
    if (params.action === "deleteMany") {
      params.action = "updateMany";
      params.args.data = { deletedAt: new Date() };
    }
    // Exclude soft-deleted from reads
    if (["findMany", "findFirst", "findUnique"].includes(params.action)) {
      params.args.where = { ...params.args.where, deletedAt: null };
    }
  }

  return next(params);
});

// 2. Query timing middleware — warn on slow queries
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const ms = Date.now() - start;
  if (ms > 100) {
    console.warn(`Slow query: ${params.model}.${params.action} (${ms}ms)`);
  }
  return result;
});

// Usage: soft-delete now works transparently
await prisma.post.delete({ where: { id: post1.id } });
// → actually does UPDATE "Post" SET "deletedAt" = now() WHERE id = 1

await prisma.post.findMany();
// → automatically appends WHERE "deletedAt" IS NULL
```

---

### Prisma with MongoDB

**Why use Prisma with MongoDB?**
Prisma supports MongoDB as a first-class database. The core query API (`prisma.model.findMany`, `create`, `update`, etc.) is **identical** to SQL databases — your application code looks the same regardless of the underlying database. The differences are mainly in the schema configuration and the migration workflow.

**Key differences from PostgreSQL / SQL databases:**

| Concept               | PostgreSQL / SQL                             | MongoDB                                              |
| --------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `@id` field type      | `Int @default(autoincrement())`              | `String @default(auto()) @map("_id") @db.ObjectId`   |
| Migrations            | `prisma migrate dev` → git-tracked SQL files | `prisma db push` only — no migration files           |
| Many-to-many          | Auto-created join/pivot table                | Embedded ID arrays in the owning model               |
| Embedded documents    | Not supported                                | `type` composite types (stored inline in parent doc) |
| Enum storage          | DB-level enum type                           | Stored as plain strings                              |
| Referential integrity | Enforced by DB foreign keys                  | App-level only — MongoDB has no FK enforcement       |

**When to choose Prisma + MongoDB over Mongoose:**

- You want first-class TypeScript types without extra boilerplate.
- Your team prefers a schema-first, declarative workflow.
- You want `prisma studio` for browsing and editing data.
- You are building a full-stack TypeScript app with Next.js or NestJS.

When using Prisma with MongoDB instead of PostgreSQL:

```prisma
// schema.prisma — MongoDB-specific configuration

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  firstName String
  lastName  String
  email     String    @unique
  role      Role      @default(READER)
  createdAt DateTime  @default(now())
  posts     Post[]
  comments  Comment[]
}

model Post {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  slug        String     @unique
  content     String
  published   Boolean    @default(false)
  views       Int        @default(0)
  authorId    String     @db.ObjectId
  author      User       @relation(fields: [authorId], references: [id])
  comments    Comment[]
  // MongoDB many-to-many: stored as embedded array of IDs
  categoryIds String[]   @db.ObjectId
  categories  Category[] @relation(fields: [categoryIds], references: [id])
}

// Embedded composite type — stored inside parent document, no separate collection
model Order {
  id      String  @id @default(auto()) @map("_id") @db.ObjectId
  address Address
  items   Item[]
}

type Address {
  street String
  city   String
  zip    String
}

type Item {
  productId String @db.ObjectId
  quantity  Int
  price     Float
}
```

**Key MongoDB differences:**

| Aspect        | PostgreSQL                      | MongoDB                                            |
| ------------- | ------------------------------- | -------------------------------------------------- |
| `@id` type    | `Int @default(autoincrement())` | `String @default(auto()) @db.ObjectId @map("_id")` |
| Migrations    | `prisma migrate dev`            | `prisma db push` only — no migration files         |
| Many-to-many  | Auto-created join table         | Embedded ID arrays in schema                       |
| Embedded docs | Not supported                   | `type` composite types                             |

```bash
# MongoDB: always use db push
npx prisma db push
```

---

### Prisma vs Mongoose

**Neither is universally better — each excels in a different context.** Use this section to pick the right tool for your project, or to understand the trade-offs when working with both.

- **Choose Mongoose** when your project is MongoDB-only, you need rich document-lifecycle hooks (`pre`/`post` save), virtual fields, discriminators, or maximum schema flexibility.
- **Choose Prisma** when you're working in TypeScript, need multiple database support, want declarative migrations, or value auto-generated fully-typed query clients with zero manual type setup.

```mermaid
flowchart LR
    subgraph MONGOOSE_BOX ["Mongoose (ODM)"]
        M1["Best for MongoDB-first Node.js
Rich middleware hooks (pre/post)
Virtual fields
Discriminators (single-collection inheritance)
Flexible dynamic/mixed types
Partial TypeScript (extra setup needed)
No built-in migrations
Returns Mongoose Docs (use .lean())"]
    end

    subgraph PRISMA_BOX ["Prisma (ORM)"]
        P1["Best for TypeScript full-stack
PostgreSQL, MySQL, SQLite, MongoDB + more
First-class TypeScript (fully typed client)
Declarative schema.prisma
Built-in migrations (SQL)
Intuitive relation queries + nested writes
No virtual fields
Middleware is global only"]
    end

    style MONGOOSE_BOX fill:#fff3cd,color:#000
    style PRISMA_BOX   fill:#cce5ff,color:#000
```

| Feature                | Mongoose                          | Prisma                                           |
| ---------------------- | --------------------------------- | ------------------------------------------------ |
| **Database**           | MongoDB only                      | PostgreSQL · MySQL · SQLite · MongoDB · more     |
| **TypeScript**         | Partial — needs extra types setup | First-class — fully typed auto-generated client  |
| **Schema**             | JS code (`new Schema({...})`)     | Declarative `schema.prisma` file                 |
| **Migrations**         | Not built-in                      | `migrate dev/deploy` (SQL) · `db push` (MongoDB) |
| **Middleware**         | Per-schema `pre`/`post` hooks     | Global `prisma.$use()`                           |
| **Virtual fields**     | Yes — computed, not stored        | No                                               |
| **Population / Joins** | `.populate('field')`              | `include: { field: true }`                       |
| **Raw queries**        | `.aggregate([...])`               | `$queryRaw` tagged templates                     |
| **Return type**        | Mongoose Document (use `.lean()`) | Plain JS object by default                       |
| **GUI**                | MongoDB Compass                   | `npx prisma studio`                              |
| **Best for**           | MongoDB-first Node.js apps        | TypeScript full-stack (Next.js, NestJS)          |

---

### Prisma — Summary

```mermaid
mindmap
  root((Prisma))
    Schema (schema.prisma)
      Models and fields
      Relations 1:1 1:N N:N
      Enums
      Indexes @@index @@unique
    Migrate
      migrate dev (SQL dev)
      migrate deploy (SQL prod)
      db push (MongoDB / prototype)
      db pull introspect
    Client
      Singleton pattern
      prisma.model.method
    CRUD
      create createMany
      findUnique findFirst findMany
      update updateMany upsert
      delete deleteMany
    Filtering
      where + gt lt contains in
      OR AND NOT
      Relation filters some every none
    Include and Select
      include = join populate
      select = projection
    Nested Writes
      create connect disconnect set
      upsert update delete deleteMany
    Transactions
      $transaction array sequential
      $transaction async tx interactive
    Aggregation
      aggregate _count _sum _avg
      groupBy + having
    Raw Queries
      $queryRaw safe tagged template
      $executeRaw for DML
    Middleware
      $use async params next
      soft-delete logging
```

| Concept      | One-line reminder                                                             |
| ------------ | ----------------------------------------------------------------------------- |
| Schema       | `schema.prisma` — models, relations, indexes in one place                     |
| Migrate      | `migrate dev` (dev SQL) · `db push` (MongoDB/proto) · `migrate deploy` (prod) |
| Client       | Singleton — `globalThis.prisma ??= new PrismaClient()`                        |
| `findUnique` | Requires `@unique` field; returns `null` if not found                         |
| `findFirst`  | Returns first match or `null`; no uniqueness requirement                      |
| `include`    | Join/populate related models                                                  |
| `select`     | Return only specified fields (always omit `password`!)                        |
| `upsert`     | Create-if-not-exists, update-if-exists in one query                           |
| Transactions | `$transaction([...])` sequential · `$transaction(async tx)` for logic         |
| `groupBy`    | SQL GROUP BY with `_count`, `_sum`, `_avg`, `having`                          |
| `$queryRaw`  | Always use tagged template literals — never string interpolation              |
| Middleware   | `$use()` runs for every model/action — check `params.model` to scope          |

> [Back to Index](#table-of-contents)
