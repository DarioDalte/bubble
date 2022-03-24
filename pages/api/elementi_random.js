const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect(); //istanza mongo client

    const db = client.db(); //db

    var array_categorie = await db.collection("categories").find().toArray();
    const contatore_categorie = await db.collection("categories").countDocuments(); //conta quanti record ci sono nella collection orders


    console.log("Il numero di categorie è: " + contatore_categorie + " e sono: ");
    console.log(array_categorie);
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    var temp =  getRandomInt(contatore_categorie);
    
    var array_numeri_random = [temp];
    console.log(array_numeri_random);
    var a = 0;
    for(var i = 0; i < 2; i++){
        temp = getRandomInt(contatore_categorie);
        console.log("il numero generato è: " + temp);
        console.log(temp);
        for(var x = 0; x < array_numeri_random.length; x++){
            if(temp == array_numeri_random[x]){
                i = i - 1;
                a = 1;
            }
        }

        if(a == 0)
        {
            array_numeri_random.push(temp);
        }else{
            console.log("numeri uguali cazzo: reinserire!!!");
            a = 0;
        }
        console.log(array_numeri_random);
    }

    console.log(array_numeri_random);

    var array_con_id_categoria = [];
    for(var i = 0; i < array_categorie.length; i++)
    {
        var fa = array_categorie[i]["_id"];
        console.log("id: " + fa);
        console.log("posizione: " + i);

        
        for(var z = 0; z < array_numeri_random.length; z++)
        {
            console.log(array_numeri_random[z]);
            if(i == array_numeri_random[z]){
                console.log("Aggiunto");
                array_con_id_categoria.push(fa);
            }
        }
    }
    console.log(array_con_id_categoria);
    var array_prodotti = [];


    for(var i = 0; i < array_con_id_categoria.length; i++)
    {
        console.log("ID categoria: " + array_con_id_categoria[i]);
        var temp = await db.collection("products").find().toArray();
        console.log(temp);
    }

    console.log(array_prodotti);





     










    res.status(200).json("ciao"); //response
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
