const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MiniCRM API',
      version: '1.0.0',
      description: 'Müşteri ve Sipariş Yönetim Sistemi API Dokümantasyonu',
      contact: {
        name: 'Geliştirici Ekibi'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Yerel Geliştirme Sunucusu'
      }
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          required: ['firstName'],
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            isActive: { type: 'boolean' }
          }
        },
        Order: {
          type: 'object',
          required: ['customerId', 'items'],
          properties: {
            id: { type: 'integer' },
            customerId: { type: 'integer' },
            status: { type: 'string' },
            totalAmount: { type: 'number' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'integer' },
                  quantity: { type: 'integer' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
