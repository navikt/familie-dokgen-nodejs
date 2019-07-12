import express from 'express';
import bodyparser from 'body-parser';
import morgan from 'morgan';
import { port } from '../config';
import routes from './routes';
import path from 'path';

const app = express();
const server_port = port || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/../public')));
routes(app);

app.listen(server_port, () => console.log(`Server listening on port ${server_port}.`));
