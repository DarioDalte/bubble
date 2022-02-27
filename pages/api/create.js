const databaseConnection = require('./middlewares/database.js')



export default async function handler(req, res) {

    const client = await databaseConnection(); //Mi connetto al db

    try {

        await client.connect();
        
        let data = req.body; //Prendo il body della http request
        data = JSON.parse(data);
        console.log(data);

     
  
        const db = client.db(); //Boh

        const collection = db.collection("users"); //Seleziono la collection
        const result = await collection.insertMany(data); //Inserisco nella collection
        console.log("info inserite");

     
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
        res.status(201).json({message: 'funzia!'})
    }


}

handler().catch(console.error);
