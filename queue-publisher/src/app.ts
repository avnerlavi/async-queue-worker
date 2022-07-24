import express from 'express';
import cors from 'cors';

import { PublisherController } from './publisherController';
import { PublisherFactory } from './publishers/publisherFactory';
import { Publisher } from './publishers/publisher';

require('dotenv').config({ path: __dirname + '/../.env' });

async function startWebServer(): Promise<void> {
    try {
        const queueType = process.env.QUEUE_TYPE;
        if (!queueType) throw new Error('queue type not provided as environment variable!');
        const publisher: Publisher = await PublisherFactory.createPublisher(queueType);
        console.log(`created publisher for queue of type ${queueType}.`);
        const publisherController = new PublisherController(publisher);
        configureWebServer(publisherController);
    } catch (err: any) {
        console.error(err);
        process.exit(1);
    };
}

startWebServer();

function configureWebServer(publisherController: PublisherController) {
    const app = express();
    app.set('port', 3000);

    const crossOrigin = cors();
    app.use(crossOrigin);

    app.get('/favicon.ico', (req, res) => res.status(204));
    app.get('/:queueName', (req, res) => { publisherController.publish(req, res); });

    app.listen(3000, () => {
        console.log(`app listening on port 3000.`);
    });
}
