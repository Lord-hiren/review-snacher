# Review Snacher

Small local Node.js app to fetch Google Play Store reviews, preview them in the browser, and save them as CSV files by app name.

## About Project

This project is made for a simple use case:

- Paste a Google Play app URL or Play Store search URL
- Fetch reviews from Google Play
- Preview reviews inside the app
- Analyze basic sentiment
- Save reviews into CSV files like `instagram.csv`
- Download saved CSV files later from the home page

This is not a full production SaaS app. It is a lightweight local project for collecting and exporting app reviews quickly.

## Features

- Google Play Store review fetching
- Supports app detail URLs and Play Store search URLs
- Review preview page
- Basic analytics summary
- Basic sentiment labels: Positive, Neutral, Negative
- Auto-generated review tags
- CSV export to local `exports/` folder
- Saved export list on home page
- CSV download links for saved files

## Tech Stack

- Node.js
- Express.js
- HBS
- google-play-scraper
- csv-writer
- sentiment

## Project Structure

```txt
reviewSnacher/
  app.js
  package.json
  routes/
  services/
  views/
  public/
  exports/
  README.md
  LICENSE.md
  .gitignore
```

## Requirements

- Node.js 18 or later recommended
- npm

## How To Setup

1. Clone or download the project.
2. Open terminal in the project folder.
3. Install dependencies.
4. Start the server.

```powershell
npm install
npm start
```

After that open:

```txt
http://localhost:3000
```

## Development Setup

If you want auto-restart during development:

```powershell
npm install
npm run dev
```

## Environment Setup

This project does not require any environment variables right now.

You can run it without a `.env` file.

If you want to add environment variables later, create a `.env` file in the project root.

Example:

```env
PORT=3000
```

Important:

- `.env` is ignored by git
- `.csv` export files are ignored by git
- `node_modules` is ignored by git

## How To Use

1. Start the app
2. Open `http://localhost:3000`
3. Paste a Google Play app URL or search URL
4. Add an optional review limit
5. Click `Fetch Reviews`
6. Preview reviews in the browser
7. Click `Append Reviews To CSV`
8. Download saved CSV from the review page or home page

## Example URLs

Direct app URL:

```txt
https://play.google.com/store/apps/details?id=com.instagram.android
```

Search URL:

```txt
https://play.google.com/store/search?q=instagram&c=apps
```

## Notes

- If you export the same app multiple times, reviews will be appended again
- Duplicate review protection is not added yet
- The app stores files locally in the `exports/` folder

## License

This project is licensed under the MIT License.
See [LICENSE.md](/E:/hiren/projects/reviewSnacher/LICENSE.md).
