import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req,res)=>res.send("🚀 NeuronWebOS Backend Live"));

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`🚀 Backend running on port ${port}`));
