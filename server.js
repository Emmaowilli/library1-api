const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const { connectDB } = require('./db/connect');

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());

/* =====================
   ROOT ROUTE (FIXES "Cannot GET /")
===================== */
app.get('/', (req, res) => {
  res.send('📚 Library API is running. Visit /api-docs for Swagger documentation.');
});

/* =====================
   SWAGGER DOCS
===================== */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* =====================
   API ROUTES
===================== */
app.use('/authors', require('./routes/authors'));
app.use('/books', require('./routes/books'));

/* =====================
   SERVER + DATABASE
===================== */
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error.message);
  });
