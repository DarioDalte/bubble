
const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();

    const data = req.body; //Prendo il body della http request

    // var nome = data[0]["name"];

    const db = client.db(); //Boh

    //const result = await db.collection("products").find({}).toArray(); //Tutti i prodotti

    // const result = await db.collection("products").aggregate([
    //   {$match: {_id: {$in }}},
    //   {$group: {_id: "$name"}}
    // ]).toArray() //Tutti i prodotti


    var prova = await db.collection("orders").find().toArray();
    const contatore = await db.collection("orders").countDocuments();


    var i = 0;
    var array = [];

    while (i < contatore) {
      console.log("ordine nuemro: " + i);
      console.log("ordine: " + prova[i]);
      var prova_1 = prova[i]["cod_prodotti"];
      console.log("codici prodotti ordinati: " + prova_1);
      for (var d = 0; d < prova_1.length; d++)
      {
         console.log("posizione array: " + d);
         console.log("codice che sta per essere aggiunto: " + prova_1[d]);
         array.push(prova_1[d]);
      }
      i++;

      console.log("   ");
      console.log("   ");
      console.log("   ");
      console.log("   ");
    }

    console.log(contatore);
    console.log(array);

    /*
    console.log("entro nell'array");
    for (var i = 0; i < array.length; i++)
    {
        var temp = array[i];
        for (var i = d + 1; i < array.length; i++)
        {
            if(array[i] == temp)
            {

            }
        } 
    }
    */


    

    function count_duplicate(a){
    let counts = {}

     for(let i =0; i < a.length; i++){ 
         if (counts[a[i]]){
         counts[a[i]] += 1
         } else {
         counts[a[i]] = 1
         }
        }  
        for (let prop in counts){
            if (counts[prop] >= 2){
                console.log(prop + " counted: " + counts[prop] + " times.")
            }
        }
      return counts;
    }
    
    var best_seller = count_duplicate(array);
    console.log(best_seller);
    console.log(Object.keys(best_seller));

    console.log("sortato");

  const sortable = Object.entries(best_seller)
      .sort(([,a],[,b]) => a-b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  
  console.log(sortable);
  var array_5_bestseller = [];
  for(var i = 1; i < 6; i++)
  {
    var last = Object.keys(sortable)[Object.keys(sortable).length-i];
    array_5_bestseller.push(last);
  }
  console.log(array_5_bestseller);




    // → '{"a":"baz","b":"foo","c":"bar"}'



    //var i = 0;
    //while (i < contatore) {
    //  array.push(prova[i]["cod_prodotti"]);
    //  i++;
    //}
  
    //console.log(array);
    

    /*const result = await db
      .collection("products")
      .aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id", // field in the products collection
            foreignField: "products", // field in the orders collection
            as: "fromItems",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { fromItems: 0 } }
      ])
      .toArray();
      
      */
      
      
     /* const provaaa = db.orders.aggregate([
        { $group: { cod_prodotti: , total: { $sum: "$amount" } } },
        { $sort: { total: -1 } }
      ])

      console.log("stiamo facendo una prova");
      console.log(prova);
      
      
      */
      
      
      
      
      
      //Tutti i prodotti

    //const result = await db.collection("products").count({brand: 'apple'});

    //const result = await findOneListingByName(client, nome);

    /*
        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });
        */
    //console.log(result);
    res.status(200).json(array_5_bestseller);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}



async function findOneListingByName(client, nameOfListing) {
  const result = await client
    .db("marketplace")
    .collection("users")
    .findOne({ name: nameOfListing });

  if (result) {
    console.log(
      `Found a listing in the collection with the name '${nameOfListing}':`
    );
    console.log(result);
  } else {
    console.log(`No listings found with the name '${nameOfListing}'`);
  }
}

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(
  client,
  {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER,
  } = {}
) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
  const cursor = client
    .db("marketplace")
    .collection("users")
    .find({
      bedrooms: { $gte: minimumNumberOfBedrooms },
      bathrooms: { $gte: minimumNumberOfBathrooms },
    })
    .sort({ last_review: -1 })
    .limit(maximumNumberOfResults);

  // Store the results in an array
  const results = await cursor.toArray();

  // Print the results
  if (results.length > 0) {
    console.log(
      `Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`
    );
    results.forEach((result, i) => {
      const date = new Date(result.last_review).toDateString();

      console.log();
      console.log(`${i + 1}. name: ${result.name}`);
      console.log(`   _id: ${result._id}`);
      console.log(`   bedrooms: ${result.bedrooms}`);
      console.log(`   bathrooms: ${result.bathrooms}`);
      console.log(`   most recent review date: ${date}`);
    });
  } else {
    console.log(
      `No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`
    );
  }
}
