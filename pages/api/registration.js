import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {

    const client = await databaseConnection();  //Calls the function databaseConnection

    try {
        
        const data = req.body;  //Inserts the request data into the variable data
        var {email, password} = data[0];    //takes email and password from data
        email = email.toLowerCase();    //Changes email to lowercase

    
        if (
            !email ||   //Email not null
            !email.includes('@') || //Email must contain the "@" sign
            !password ||    //Email not null
            !password.trim().length > 7 //the password must contain at least 7 characters
        ){
            res.status(422).json({  //message if wrong credentials
                message :
                "Invalid input"
            });
            return;
        }

        await client.connect(); //Connect to our cluster
        const db = client.db(); //Inserts db into the variable db
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