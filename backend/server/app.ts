import express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { AuthRoutes } from './routers/auth';
import { AdminRoutes } from './routers/admin';
import { AllRoutes } from './routers/routes';
import mongoose from 'mongoose';
import { WSocketIO } from './socket';
import session from 'express-session';
import MongoDBSession from 'connect-mongodb-session';

const MongoDBStore = MongoDBSession(session);

const MONGODB_URI = 'mongodb+srv://WATN:123qwe123@cluster0-igf25.mongodb.net/shop';

export const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/images", express.static(path.join("server/images")));
app.use(
    session({
        secret: 'some secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    next();
});

app.use('/user', AuthRoutes);
app.use('/admin', AdminRoutes);
app.use('/all', AllRoutes);

mongoose
    .connect(
        MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(result => {
        const server = app.listen(port);
        const io = WSocketIO.init(server);
        io.on('connection', (socket: any) => {
            console.log('Server has been started...');
        });
    })
    .catch(err => {
        console.log(err);
    });
