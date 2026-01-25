import express from 'express';
import cors from 'cors';
import { registerPlatformRoutes } from './routes/platforms';
import crmRouter from './routes/crm'; 
import conversationsRouter from './routes/conversations'; // Import the new router
import whatsappRouter from './routes/whatsapp';

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Register API Routes
app.use("/api/crm", crmRouter);
app.use("/api/conversations", conversationsRouter); // Use the new router
app.use("/api/whatsapp", whatsappRouter); // Add this line
registerPlatformRoutes(app); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});