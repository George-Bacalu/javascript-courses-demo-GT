const express = require("express");
const mongoose = require("mongoose");
const Course = require("./models/course");
const ejs = require("ejs");
const morgan = require("morgan");
const methodOverride = require("method-override");

const courseRouter = require("./routes/courses");

const app = express();
const port = process.env.PORT || 3000;

const dbURL = "mongodb+srv://admin-george:$7u7BM_taHn5x$h@javascript-courses.ni9g1.mongodb.net/courses?retryWrites=true&w=majority";
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(data => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
    console.log("Successfully connected to mongodb database");
  })
  .catch(error => console.error("Connection to mongodb database failed", error));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(methodOverride("_method"));

app.use("/courses", courseRouter);

app.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.render("index", { courses });
  } catch (err) {
    console.error(err);
    res.sendStatus(404);
  }
});

app.use((req, res) => res.status(404).render("404", { message: "404 - Page Not Found!" }));
