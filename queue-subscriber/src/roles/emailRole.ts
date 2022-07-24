import { Db, MongoClient } from "mongodb";
import { delay } from "../utils/delay";

import { Role } from "./role";

export class EmailRole implements Role {
    public readonly name = 'email';
    private readonly client: MongoClient;
    private readonly databaseName: string;
    private readonly collectionName: string;

    constructor(client: MongoClient) {
        this.client = client;
        this.collectionName = this.name;
        this.databaseName = `${this.name}-database`;
    }

    public static async create(): Promise<EmailRole> {
        const mongoUri: string = process.env.MONGODB_URL as string;
        let retryCount: number = 0;
        const RETRY_LIMIT_COUNT = 10;
        const RECONNECT_DELAY_SECONDS = 5;
        while (retryCount < RETRY_LIMIT_COUNT) {
            try {
                let client = await new MongoClient(mongoUri).connect();
                return new EmailRole(client);
            } catch (err: any) {
                retryCount++;
                console.error(err);
                console.log(`retrying database connection...`);
            }

            await delay(RECONNECT_DELAY_SECONDS);
        }

        throw new Error(`${retryCount} failed attempts to connect to database- aborting creation...`);
    }

    public async execute(message: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.client.db(this.databaseName)
                    .collection(this.collectionName).insertOne({ message });

                console.log('message inserted.');
                resolve();
            } catch (err: any) {
                reject(err);
            }
        });
    }
}