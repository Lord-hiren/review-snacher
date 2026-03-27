const { resolveAppId, getAppDetails, getReviews } = require("./playStoreService");
const { getSentimentLabel } = require("./sentimentService");
const { appendReviewsToCsv, getCsvPath } = require("./csvService");

function slugifyAppName(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "reviews";
}

function buildSuggestedTag(reviewText = "", score = 0) {
  const text = reviewText.toLowerCase();

  if (text.includes("bug") || text.includes("crash") || text.includes("error")) {
    return "Bug";
  }

  if (text.includes("feature") || text.includes("option") || text.includes("add")) {
    return "Feature Request";
  }

  if (score < 0) {
    return "Complaint";
  }

  if (score > 0) {
    return "Praise";
  }

  return "General";
}

function normalizeReview(appName, review) {
  const sentiment = getSentimentLabel(review.text);

  return {
    appName,
    reviewId: review.id || "",
    reviewerName: review.userName || "Anonymous",
    rating: review.score || "",
    reviewText: review.text || "",
    reviewDate: review.date ? new Date(review.date).toLocaleString("en-IN") : "",
    appVersion: review.version || "",
    replyText: review.replyText || "",
    replyDate: review.replyDate ? new Date(review.replyDate).toLocaleString("en-IN") : "",
    sentiment: sentiment.label,
    sentimentScore: sentiment.score,
    tag: buildSuggestedTag(review.text, sentiment.score)
  };
}

async function fetchReviewsForUrl(appUrl, limit) {
  const packageName = await resolveAppId(appUrl);
  const appDetails = await getAppDetails(packageName);
  const appName = appDetails.title || packageName;
  const fileName = `${slugifyAppName(appName)}.csv`;
  const response = await getReviews(packageName, limit);
  const reviews = (response.data || []).map((review) => normalizeReview(appName, review));

  return {
    appName,
    packageName,
    reviews,
    fileName,
    csvPath: getCsvPath(fileName),
    limitInput: limit || ""
  };
}

function buildReviewSummary(reviews) {
  const total = reviews.length;
  const ratingSum = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  const sentimentCounts = reviews.reduce(
    (accumulator, review) => {
      accumulator[review.sentiment] += 1;
      return accumulator;
    },
    { Positive: 0, Neutral: 0, Negative: 0 }
  );

  const tagCounts = reviews.reduce((accumulator, review) => {
    accumulator[review.tag] = (accumulator[review.tag] || 0) + 1;
    return accumulator;
  }, {});

  return {
    averageRating: total ? ratingSum / total : 0,
    positiveCount: sentimentCounts.Positive,
    neutralCount: sentimentCounts.Neutral,
    negativeCount: sentimentCounts.Negative,
    topTags: Object.entries(tagCounts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([tag, count]) => ({ tag, count }))
  };
}

async function writeReviewsToCsv(fileName, reviews) {
  await appendReviewsToCsv(fileName, reviews);
  return reviews.length;
}

module.exports = {
  fetchReviewsForUrl,
  buildReviewSummary,
  writeReviewsToCsv
};
