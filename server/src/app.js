import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://market-place-ten-rho.vercel.app'
    ];
    
    // Allow Vercel preview deployments (*.vercel.app)
    if (!origin || allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "🚀 Student Marketplace API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
