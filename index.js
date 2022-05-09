const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


//middleware 

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rsw8e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const collection = client.db("furnitureWarehouse").collection("products");
        //console.log('db connect')


        //load all products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = collection.find(query);
            const products = await cursor.toArray(cursor);
            res.send(products);
        })

        //single product by id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await collection.findOne(query);
            res.send(result);
        })

        //update product quantity
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const updatequantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updatequantity.quantity,
                }
            };
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        //update product by delivered

        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const quantity = req.body.quantitys;
            console.log(req.body.quantitys)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: quantity
                },
            };
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // Add a single product
        app.post('/addfurniture', async (req, res) => {
            const newfurniture = req.body;
            const { product_name, quantity } = newfurniture;
            console.log('adding a new user', newfurniture);
            const result = await collection.insertOne(newfurniture);
            res.send(result)

        })

        //
        app.get('/mycollections', async (req, res) => {
            const query = { senduser: senduser };
            const cursor = collection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Warehouse-furniture sunning on server!')
})

app.listen(port, () => {
    console.log('Warehouse is running on port', port)
})

