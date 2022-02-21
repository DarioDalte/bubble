const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://marketplace:0W2iRdCWo1qqZqg8@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        
        await client.connect();

        

        await updateListingByName(client, "Infinite Views", { bedrooms: 6, beds: 8 });
        // Print the updated Infinite Views listing


        await upsertListingByName(client, "Cozy Cottage", { name: "Cozy Cottage", bedrooms: 2, bathrooms: 2 });
        // Print the details of the Cozy Cottage listing

    
        // UPDATE MANY
        // Update all listings so they have a property type
        await updateAllListingsToHavePropertyType(client);
        // Print the details of the Cozy Cottage listing that should now have a property type
    

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

/**
 * Update an Airbnb listing with the given name
 * Note: If more than one listing has the same name, only the first listing the database finds will be updated.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {string} nameOfListing The name of the listing you want to update
 * @param {object} updatedListing An object containing all of the properties to be updated for the given listing
 */
async function updateListingByName(client, nameOfListing, updatedListing) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne for the updateOne() docs
    const result = await client.db("marketplace").collection("users").updateOne({ name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

/**
 * Upsert an Airbnb listing with the given name. 
 * If a listing with the given name exists, it will be updated.
 * If a listing with the given name does not exist, it will be inserted.
 * Note: If more than one listing has the same name, only the first listing the database finds will be updated.
 * Note: For educational purposes, we have split the update and upsert functionality into separate functions.
 *       Another option is to have a single function where a boolean param indicates if the update should be an upsert. 
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {string} nameOfListing The name of the listing you want to upsert
 * @param {object} updatedListing An object containing all of the properties to be upserted for the given listing
 */
async function upsertListingByName(client, nameOfListing, updatedListing) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne for the updateOne() docs
    const result = await client.db("marketplace").collection("users").updateOne({ name: nameOfListing }, { $set: updatedListing }, { upsert: true });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

/**
 * Update all Airbnb listings that do not have a property type so they have property_type 'Unknown'
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 */
async function updateAllListingsToHavePropertyType(client) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateMany for the updateMany() docs
    const result = await client.db("marketplace").collection("users").updateMany({ property_type: { $exists: false } }, { $set: { property_type: "Unknown" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

