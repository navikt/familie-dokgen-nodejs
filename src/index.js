import express from 'express';
import bodyparser from 'body-parser';
import { port } from '../config';
import routes from './routes';

const app = express();
const server_port = port || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
routes(app);

app.listen(server_port, () => console.log(`Server listening on port ${server_port}.`));
