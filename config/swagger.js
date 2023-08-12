// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Ecommerce Api Documentation', // Specify your API name
      version: '1.0.0', // Specify your API version
      description: 'Your API description',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development server',
        },
      ],
  },
  apis: ['./routes/*.js'], // Specify the paths to your route files
};

const specs = swaggerJsDoc(options);
module.exports = specs;
