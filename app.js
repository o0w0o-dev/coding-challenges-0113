import express from "express";
import { router as imageRouter } from "./routes/imageRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";

const app = express();
const port = 4000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
