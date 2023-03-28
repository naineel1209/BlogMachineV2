require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require('./connections/connectDB');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const notFound = require('./middleware/not-found');

//logger middleware
app.use(morgan('dev'));

//set views to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//middlewares defined!
app.use(express.static(path.join(__dirname, '/public'))); //static files
app.use(express.json()); //json files
app.use(express.urlencoded({ extended: true })); //form data parser
app.use(cookieParser()); //cookie parser

//towards router
app.use('/', authRouter);
app.use('/', userRouter);

//notFound
app.use(notFound);
// app.use(errorHandler);
async function start() {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to MONGO DB');

        app.listen(PORT, () => {
            console.log("Server listening on port " + PORT);
        });

    } catch (err) {
        console.log(err.message + err.stack);
    }
}

start();