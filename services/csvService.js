const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

const exportDirectory = path.join(__dirname, "..", "exports");

function ensureExportDirectory() {
  if (!fs.existsSync(exportDirectory)) {
    fs.mkdirSync(exportDirectory, { recursive: true });
  }
}

function getCsvPath(fileName) {
  ensureExportDirectory();
  return path.join(exportDirectory, fileName);
}

function listSavedExports() {
  ensureExportDirectory();

  return fs
    .readdirSync(exportDirectory)
    .filter((fileName) => fileName.toLowerCase().endsWith(".csv"))
    .map((fileName) => {
      const fullPath = path.join(exportDirectory, fileName);
      const stats = fs.statSync(fullPath);

      return {
        fileName,
        fullPath,
        sizeKb: `${(stats.size / 1024).toFixed(1)} KB`,
        updatedAt: stats.mtime.toLocaleString("en-IN")
      };
    })
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
}

async function appendReviewsToCsv(fileName, reviews) {
  const csvPath = getCsvPath(fileName);
  const fileExists = fs.existsSync(csvPath);

  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: "appName", title: "appName" },
      { id: "reviewId", title: "reviewId" },
      { id: "reviewerName", title: "reviewerName" },
      { id: "rating", title: "rating" },
      { id: "reviewText", title: "reviewText" },
      { id: "reviewDate", title: "reviewDate" },
      { id: "appVersion", title: "appVersion" },
      { id: "replyText", title: "replyText" },
      { id: "replyDate", title: "replyDate" },
      { id: "sentiment", title: "sentiment" },
      { id: "sentimentScore", title: "sentimentScore" },
      { id: "tag", title: "tag" }
    ],
    append: fileExists
  });

  await csvWriter.writeRecords(reviews);
  return csvPath;
}

module.exports = {
  appendReviewsToCsv,
  getCsvPath,
  listSavedExports
};
