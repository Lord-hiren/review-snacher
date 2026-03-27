const Sentiment = require("sentiment");

const sentiment = new Sentiment();

function getSentimentLabel(text) {
  const result = sentiment.analyze(text || "");

  if (result.score > 1) {
    return { label: "Positive", score: result.score };
  }

  if (result.score < -1) {
    return { label: "Negative", score: result.score };
  }

  return { label: "Neutral", score: result.score };
}

module.exports = {
  getSentimentLabel
};
