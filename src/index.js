import express from 'express';
import { port } from '../config';
import routes from './routes';

const app = express();
const server_port = port || 3000;

routes(app);

app.listen(server_port, () => console.log(`Server listening on port ${server_port}.`));