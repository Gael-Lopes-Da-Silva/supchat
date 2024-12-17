import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
    response.sendFile("index.html", { root: "public" });
});

export default app;