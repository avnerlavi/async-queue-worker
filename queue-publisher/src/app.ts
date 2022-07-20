import express from 'express';
import cors from 'cors';

import { ProducerController } from './producerController';


require('dotenv').config({path: __dirname + '/../.env'});

const app = express();
app.set('port', process.env.PORT || 3000);

const crossOrigin = cors();
app.use(crossOrigin);

const rabbitProducer = new ProducerController();
app.get('/:queueName', rabbitProducer.produce);

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get("port")}...`);
})