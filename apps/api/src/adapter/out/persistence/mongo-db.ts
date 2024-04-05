import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";
import type Account from "@/application/domain/model/account";
import type { Space, SpaceCard, Card } from "./mongo-schema";

export interface MongoCollections {
    spaceCardCollection: Collection<SpaceCard>;
    spaceCollection: Collection<Space>;
    cardCollection: Collection<Card>;
    accountCollection: Collection<Account>;
}


async function createMongoClientCollection(): Promise<MongoCollections> {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;

    if (!connectionString) {
        throw new Error("MONGODB_CONNECTION_STRING is not set");
    }

    const client = await MongoClient.connect(
        connectionString
    );

    const db = client.db("ziphus");
    const spaceCardCollection = db.collection<SpaceCard>("spaceCards");
    const spaceCollection = db.collection<Space>("spaces");
    const cardCollection = db.collection<Card>("cards");
    const accountCollection = db.collection<Account>("account");

    return {
        spaceCardCollection,
        spaceCollection,
        cardCollection,
        accountCollection
    };
}
export default createMongoClientCollection;