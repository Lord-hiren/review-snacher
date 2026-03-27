const express = require("express");
const path = require("path");
const hbs = require("hbs");

const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));
hbs.registerHelper("eq", (left, right) => left === right);
hbs.registerHelper("formatNumber", (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("en-IN") : value;
});
hbs.registerHelper("formatScore", (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : value;
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", reviewRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("home", {
    title: "Review Snacher",
    error: error.message || "Something went wrong."
  });
});

app.listen(port, () => {
  console.log(`Review Snacher running at http://localhost:${port}`);
});
