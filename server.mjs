import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

import "./db.mjs"
import HomepageRouter from "./routes/customerFacing/homepage.mjs";
import AdminNewsRouter from "./routes/admin/adminPage.mjs"

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.set("view engines", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));

app.use(["/", "/home"], HomepageRouter)
app.use("/admin", AdminNewsRouter)

app.listen(PORT, () => {
    console.log(`Application started at ${PORT}`)
})