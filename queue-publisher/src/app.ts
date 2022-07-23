import express from 'express';
import cors from 'cors';

import { PublisherController } from './publisherController';
import { PublisherFactory } from './publishers/publisherFactory';
import { Publisher } from './publishers/publisher';

require('dotenv').config({ path: __dirname + '/../.env' });

const app = express();
app.set('port', process.env.PORT || 3000);

const crossOrigin = cors();
app.use(crossOrigin);

const queueType = process.env.QUEUE_TYPE;
if (!queueType) throw new Error('queue type not provided as environment variable!');
PublisherFactory.createPublisher(queueType).then((publisher: Publisher) => {
    console.log(`created publisher for queue of type ${queueType}.`);
    const publisherController = new PublisherController(publisher);

    app.get('/favicon.ico', (req, res) => res.status(204));
    app.get('/:queueName', (req, res) => { publisherController.publish(req, res); });

    app.listen(app.get('port'), () => {
        console.log(`app listening on port ${app.get("port")}.`);
    });
}).catch((err: any) => {
    console.error(err);
    process.exit(1);
});