import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import apiRouter from "./routes/api.js";
import viewRouter from "./routes/view.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", apiRouter);
app.use("/", viewRouter);

const port = 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
} );
