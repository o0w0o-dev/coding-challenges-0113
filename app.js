import express from "express";
import mongoose from "mongoose";
import { globalErrorHandler } from "./controllers/errorController.js";
import { router as imageRouter } from "./routes/imageRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import swaggerDocs from "./utils/swagger.js";

const app = express();
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
swaggerDocs(app, PORT);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({ root: true });
});

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
