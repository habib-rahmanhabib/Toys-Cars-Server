const express = require('express')
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.TOYS_NAME}:${process.env.TOYS_PASS}@cluster0.8efoi6h.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    const toysCollection = client.db('ToyCars').collection('Toys')

    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(query)
      res.send(result)
    })

    app.post('/Toys', async (req, res) => {
      const newToys = req.body;
      console.log(newToys)
      const result = await toysCollection.insertOne(newToys);
      res.send(result)
    })

    app.delete('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      const query ={ _id: new ObjectId(id)}
      const result = await toysCollection.deleteOne(query)
      res.send(result)
    })

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('toys server is running')
})

app.listen(port, () => {
  console.log(`toy is all here ${port}`)
})