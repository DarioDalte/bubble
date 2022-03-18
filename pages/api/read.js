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

    const result = await db
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
      .toArray(); //Tutti i prodotti

    //const result = await db.collection("products").count({brand: 'apple'});

    //const result = await findOneListingByName(client, nome);

    /*
        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });
        */
    console.log(result);
    res.status(200).json(result);
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
