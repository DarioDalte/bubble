const {MongoClient} = require('mongodb');

async function main(){

    const uri = "mongodb+srv://marketplace:0W2iRdCWo1qqZqg8@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority";
   

    const client = new MongoClient(uri);

    try {
        
        await client.connect();

        await createListing(client,
            {
                name: "Lovely Loft",
                summary: "A charming loft in Paris",
                bedrooms: 1,
                bathrooms: 1
            }
        );
  
        // Create 3 new listings
        await createMultipleListings(client, [
            {
                name: "Infinite Views",
                summary: "Modern home with infinite views from the infinity pool",
                property_type: "House",
                bedrooms: 5,
                bathrooms: 4.5,
                beds: 5
            },
            {
                name: "Private room in London",
                property_type: "Apartment",
                bedrooms: 1,
                bathroom: 1
            },
            {
                name: "Beautiful Beach House",
                summary: "Enjoy relaxed beach living in this house with a private beach",
                bedrooms: 4,
                bathrooms: 2.5,
                beds: 7,
                last_review: new Date()
            }
        ]);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

/**
 * Create a new Airbnb listing
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Object} newListing The new listing to be added
 */
async function createListing(client, newListing){
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne for the insertOne() docs
    const result = await client.db("marketplace").collection("users").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

/**
 * Create multiple Airbnb listings
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Object[]} newListings The new listings to be added
 */
async function createMultipleListings(client, newListings){

    const result = await client.db("marketplace").collection("users").insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}












/*
const { create } = require('domain');
const {MongoClient} = require('mongodb');

async function main(){
     
    const uri = "mongodb+srv://marketplace:0W2iRdCWo1qqZqg8@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        console.log("sono qui");
        createListing(client, {
            name:"Arslan",
            summary:"BOh",
            bedroom:1
        });

 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);


async function createListing(client,newListing)
{
    console.log("sono qui");
    const result = await client.db("Sample_airbnb").collection("ListingAndReviews").insertOne(newListing);
    console.log("sono qui");
    console.log(`New listing created with following id: ${result.insertedId}`);
}







async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 

*/