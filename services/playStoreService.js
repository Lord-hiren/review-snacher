const scraperModule = require("google-play-scraper");
const gplay = scraperModule.default || scraperModule;

function parsePlayStoreUrl(appUrl) {
  if (!appUrl) {
    throw new Error("Please enter a Google Play Store URL.");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(appUrl);
  } catch (error) {
    throw new Error("Please enter a valid URL.");
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (!host.includes("play.google.com")) {
    throw new Error("Only Google Play Store URLs are supported.");
  }

  return parsedUrl;
}

async function resolveAppId(appUrl) {
  const parsedUrl = parsePlayStoreUrl(appUrl);
  const directAppId = parsedUrl.searchParams.get("id");

  if (directAppId) {
    return directAppId;
  }

  const isSearchUrl = parsedUrl.pathname.includes("/store/search");
  const query = parsedUrl.searchParams.get("q");

  if (!isSearchUrl || !query) {
    throw new Error("Please use a Google Play app URL or a Play Store search URL with a search term.");
  }

  const results = await gplay.search({
    term: query,
    num: 1
  });

  if (!results.length || !results[0].appId) {
    throw new Error(`No app found for search term: ${query}`);
  }

  return results[0].appId;
}

async function getAppDetails(appId) {
  return gplay.app({ appId });
}

async function getReviews(appId, limit) {
  const normalizedLimit = Number(limit);
  const count = Number.isFinite(normalizedLimit) && normalizedLimit > 0 ? normalizedLimit : null;

  if (count) {
    return gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      num: count
    });
  }

  let allReviews = [];
  let nextPaginationToken = null;

  do {
    const page = await gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      paginate: true,
      nextPaginationToken
    });

    allReviews = allReviews.concat(page.data || []);
    nextPaginationToken = page.nextPaginationToken || null;
  } while (nextPaginationToken);

  return { data: allReviews };
}

module.exports = {
  resolveAppId,
  getAppDetails,
  getReviews
};
