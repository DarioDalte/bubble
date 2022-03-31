import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";

const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {

    const client = await databaseConnection(); //Mi connetto al db
    try {
        
        const data = req.body;
        var {email, password} = data[0];
        email = email.toLowerCase();
        console.log(email);
        console.log(password);
        

        if (
            !email ||
            !email.includes('@') ||
            !password ||
            !password.trim().length > 7
        ){
            res.status(422).json({
                message :
                "Invalid input"
            });
            return;
        }

        await client.connect(); //istanza mongo client
        const db = client.db(); //db
        var result = await db.collection("users").find().toArray(); // inserisce nell'array le categorie
        const contatore = await db.collection("users").countDocuments(); //conta quanti record ci sono nella collection categorie
        for(var i = 0; i < contatore; i++)
        {
            if (result[i]["email"] == email)
            {
                res.status(422).json({
                    message :
                    "Ti sei gia registrato con questa mail"
                });
                return;
            }
        }



        console.log("email: ",email);
        console.log("password: ",password);
        var passcript = await hashPassowrd(password);
        console.log("password: ",passcript);
        var oggetto = {
            email : email,
            password : passcript
        };
        
        console.log(oggetto);
        const collection = db.collection("users"); //Seleziono la collection

        result = await collection.insertOne(oggetto); //Inserisco nella collection
        

        res.json({ message: "funzia!" });
    }
    finally {
    // Close the connection to the MongoDB cluster
        await client.close();
    }

}