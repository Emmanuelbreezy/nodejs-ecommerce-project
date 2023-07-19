
const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoute = require('./routes/auth.route.js');
const { errorHandler,notFound } = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 3001;
const cookieParser = require('cookie-parser');
dbConnect();
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser);

app.use('/api/user', authRoute);

app.use(notFound);
app.use(errorHandler);



app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}!`);
})