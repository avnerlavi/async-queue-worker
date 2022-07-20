import { MongoClient } from "mongodb";

import { ConsumerStrategy } from "./consumerStrategy";

export class EmailConsumerStrategy implements ConsumerStrategy {
    public readonly role = 'email';
    private readonly mongoClient: MongoClient;
    private readonly collectionName: string;

    constructor() {
        const mongoUri = `mongodb://${process.env.MONGODB_HOST}:27017`;
        this.mongoClient = new MongoClient(mongoUri);
        this.collectionName = this.role;
    }

    public async execute(message: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.mongoClient.connect();
                await this.mongoClient.db(process.env.MONGODB_DB_NAME)
                    .collection(this.collectionName).insertOne({ message });

                console.log('inserted message...');
                resolve();
            } catch (err: any) {
                reject(err);
            }
        });

        // let waitTime: number = 0;
        // console.log(`Opening email: ${message}`);
        // for (let i = 0; i < message.length; i++) {
        //     if (message.charAt(i) === '.') waitTime++;
        // }

        // return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         console.log(`Opened email: ${message}`);
        //         resolve();
        //     }, waitTime * 1000);
        // });
    }
}