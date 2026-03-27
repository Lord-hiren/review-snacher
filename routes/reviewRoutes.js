const express = require("express");

const {
  fetchReviewsForUrl,
  buildReviewSummary,
  writeReviewsToCsv
} = require("../services/reviewWorkflow");
const { getCsvPath, listSavedExports } = require("../services/csvService");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", {
    title: "Review Snacher",
    defaultLimit: "",
    savedExports: listSavedExports()
  });
});

router.get("/downloads/:fileName", (req, res, next) => {
  try {
    const fileName = req.params.fileName;

    if (!fileName || fileName.includes("..") || !fileName.toLowerCase().endsWith(".csv")) {
      throw new Error("Invalid file request.");
    }

    const csvPath = getCsvPath(fileName);
    res.download(csvPath, fileName);
  } catch (error) {
    next(error);
  }
});

router.post("/reviews", async (req, res, next) => {
  try {
    const { appUrl, limit } = req.body;
    const result = await fetchReviewsForUrl(appUrl, limit);
    const summary = buildReviewSummary(result.reviews);

    res.render("reviews", {
      title: "Fetched Reviews",
      bodyClass: "review-page",
      appUrl,
      limit: result.limitInput,
      appName: result.appName,
      fileName: result.fileName,
      packageName: result.packageName,
      csvPath: result.csvPath,
      totalReviews: result.reviews.length,
      summary,
      reviews: result.reviews
    });
  } catch (error) {
    next(error);
  }
});

router.post("/reviews/export", async (req, res, next) => {
  try {
    const { appUrl, limit } = req.body;
    const result = await fetchReviewsForUrl(appUrl, limit);
    const exportedCount = await writeReviewsToCsv(result.fileName, result.reviews);
    const summary = buildReviewSummary(result.reviews);

    res.render("reviews", {
      title: "Fetched Reviews",
      bodyClass: "review-page",
      appUrl,
      limit: result.limitInput,
      appName: result.appName,
      fileName: result.fileName,
      packageName: result.packageName,
      csvPath: result.csvPath,
      totalReviews: result.reviews.length,
      exportedCount,
      summary,
      reviews: result.reviews,
      success: `${exportedCount} reviews appended to ${result.fileName}.`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
