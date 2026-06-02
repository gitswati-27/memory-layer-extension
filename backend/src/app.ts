import express from "express";
import cors from "cors";
import memoryRoutes from "./routes/memoryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/memory", memoryRoutes);

app.get("/", (_, res) => {
  res.send("AI Web Memory Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});