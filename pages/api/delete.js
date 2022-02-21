const { MongoClient } = require('mongodb');

async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    const uri = "mongodb+srv://marketplace:0W2iRdCWo1qqZqg8@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority";

    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

    
        await deleteListingByName(client, "Lovely Loft");
        // Check that the listing named "Cozy Cottage" no longer exists
     

        await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));
        // Check that the listing named "Ribeira Charming Duplex" still exists


    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

/**
 * Delete an Airbnb listing with the given name.
 * Note: If more than one listing has the same name, only the first listing the database finds will be deleted.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {string} nameOfListing The name of the listing you want to delete
 */
async function deleteListingByName(client, nameOfListing) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#deleteOne for the deleteOne() docs
    const result = await client.db("marketplace").collection("users").deleteOne({ name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

/**
 * Delete all listings that were last scraped prior to the given date
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Date} date The date to check the last_scraped property against
 */
async function deleteListingsScrapedBeforeDate(client, date) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#deleteMany for the deleteMany() docs
    const result = await client.db("marketplace").collection("users").deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}