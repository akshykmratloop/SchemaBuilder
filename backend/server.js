import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { initializeDatabase } from './utils/db.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// app.use('/', (req, res) => {
//   res.send('Hello World!');
// })
// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});



const startServer = async () => {
  console.log('Initializing database...');
  await initializeDatabase();
  console.log('Starting server...');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
startServer();