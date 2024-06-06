const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://anwarfarhan339:wCrxAzIrPo0gtehh@cluster0.v2n8ocr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const postCollection = client.db('database').collection('posts');
    const userCollection = client.db('database').collection('users');

    app.delete('/posts/:postId', async (req, res) => {
      const postId = req.params.postId;
      console.log(postId)
      try {
          const result = await postCollection.deleteOne({ _id: new ObjectId(postId) }); // Delete the post by _id
          if (result.deletedCount === 1) {
              res.status(200).json({ message: 'Post deleted successfully' }); // Send success message if post is deleted
          } else {
              res.status(404).json({ error: 'Post not found' }); // Send error message if post is not found
          }
      } catch (error) {
          console.error('Error deleting post:', error);
          res.status(500).json({ error: 'Internal server error' }); // Send internal server error message for other errors
      }
  });
    
    
      

    app.get('/post', async (req, res) => {
      const post = await postCollection.find().toArray();
      res.send(post);
    });

    app.get('/loggodInUser', async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.find({ email: email }).toArray();
      res.send(user);
    })

    app.get('/userPost', async (req, res) => {
      const email = req.query.email;
      const post = await postCollection.find({ email: email }).toArray();
      res.send(post);
    })

    app.get('/user', async (req, res) => {
      const user = await post.find().toArray();
      res.send(user);
    });

    app.post('/post', async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });

    app.post('/register', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    

    app.patch('/userUpdates/:email', async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.get('/', (req, res) => {
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
