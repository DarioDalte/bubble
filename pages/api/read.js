const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://marketplace:0W2iRdCWo1qqZqg8@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        await findOneListingByName(client, "Infinite Views");


        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

/**
 * Print an Airbnb listing with the given name
 * Note: If more than one listing has the same name, only the first listing the database finds will be printed.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {String} nameOfListing The name of the listing you want to find
 */
async function findOneListingByName(client, nameOfListing) {

    const result = await client.db("marketplace").collection("users").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

/**
 * Print Airbnb listings with a minimum number of bedrooms and bathrooms.
 * Results will be limited to the designated maximum number of results.
 * Results will be sorted by the date of the last review in descending order.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {object} queryParams The query params object
 * @param {number} queryParams.minimumNumberOfBedrooms The minimum number of bedrooms
 * @param {number} queryParams.minimumNumberOfBathrooms The minimum number of bathrooms
 * @param {number} queryParams.maximumNumberOfResults The maximum number of Airbnb listings to be printed
 */
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {

    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
    const cursor = client.db("marketplace").collection("users")
        .find({
            bedrooms: { $gte: minimumNumberOfBedrooms },
            bathrooms: { $gte: minimumNumberOfBathrooms }
        }
        )
        .sort({ last_review: -1 })
        .limit(maximumNumberOfResults);

    // Store the results in an array
    const results = await cursor.toArray();

    // Print the results
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
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
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}