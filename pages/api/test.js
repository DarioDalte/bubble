
const databaseConnection = require('./middlewares/database.js')

export default async function handler(req, res) {
    const data = req.body; //Prendo il body della http request


    const client = await databaseConnection(); //Mi connetto al db

    const db = client.db(); //Boh

    const meetupsCollection = db.collection("meetups"); //Seleziono la collection
    const result = await meetupsCollection.insertOne(data); //Inserisco nella collection

    client.close();
    res.status(201).json({message: 'Meetup inserted!'})


}
