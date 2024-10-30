const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// app.use(cors());
app.use(express.json());

// Middleware to log incoming origin for debugging
app.use((req, res, next) => {
  console.log("Incoming origin:", req.headers.origin);
  next();
});

// Define allowed origins
const allowedOrigins = [
  /^https:\/\/.*\.netlify\.app$/, // Matches any Netlify subdomain
  "http://localhost:3000", // Local development
  "https://abs-plaza.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.some((pattern) =>
          pattern instanceof RegExp ? pattern.test(origin) : pattern === origin
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Ensures cookies and auth headers are handled properly
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  console.log("CORS headers set for origin:", req.headers.origin);
  next();
});

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const postCollection = client.db("database").collection("posts");
    const userCollection = client.db("database").collection("users");

    app.delete("/posts/:postId", async (req, res) => {
      const postId = req.params.postId;
      console.log(postId);
      try {
        const result = await postCollection.deleteOne({
          _id: new ObjectId(postId),
        });
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Post deleted successfully" });
        } else {
          res.status(404).json({ error: "Post not found" });
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/post", async (req, res) => {
      const post = await postCollection.find().toArray();
      res.send(post);
    });

    app.get("/loggodInUser/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.find({ email: email }).toArray();
      console.log(user);
      res.send(user);
    });

    app.get("/userPost", async (req, res) => {
      const email = req.query.email;
      const post = await postCollection.find({ email: email }).toArray();
      res.send(post);
    });

    app.get("/user", async (req, res) => {
      const user = await post.find().toArray();
      res.send(user);
    });

    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.patch("/userUpdates/:email", async (req, res) => {
      const filter = req.params;
      const pro = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.get("/", (req, res) => {
  console.log("Hello From Twitter");
  res.send(`Hello World! I am a server`);
});

app.listen(port, async () => {
  try {
    await run();
    console.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
});
