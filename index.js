
const express = require('express');
const colors = require('colors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');
const specs = require('./config/swagger.js'); 
const authRoute = require('./routes/auth.route.js');
const productRoute = require('./routes/product.route.js');
const blogRoute = require('./routes/blog.route.js');
const categoryRoute = require('./routes/category.route.js');
const couponRoute = require('./routes/coupon.route.js');
const brandRoute = require('./routes/brand.route.js');
const { errorHandler,notFound } = require('./middlewares/errorHandler');
const app = express();
require('dotenv').config();
dbConnect();



// const batchAdd = async () => {
// 	await Category.create({
// 		name: 'Electronics', // Replace with the desired category name
// 	  });
// 	  await Category.create({
// 		name: 'Watch', // Replace with the desired category name
// 	  });
// 	  await Category.create({
// 		name: 'Mobile Phones', // Replace with the desired category name
// 	  });
// 	  await Category.create({
// 		name: 'Fashion', // Replace with the desired category name
// 	  });
// }

// batchAdd();

const PORT = process.env.PORT || 5000;
//app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Use Helmet middleware
app.use(helmet());
// Serve Swagger UI at /api-docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute);
app.use('/api/category', categoryRoute);
app.use('/api/brand', brandRoute);
app.use('/api/coupon', couponRoute);


app.use(notFound);
app.use(errorHandler);



app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}!`);
})