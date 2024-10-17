import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors());

app.get("/scrape", async (req, res) => {
  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the manga page
    await page.goto("https://manhuafast.net/manga/number-one-beast-master/", {
      waitUntil: "domcontentloaded",
    });

    // Extract the chapter list with titles and links
    const chapters = await page.$$eval(
      "li.wp-manga-chapter a",
      (chapterLinks) =>
        chapterLinks.map((chapter) => ({
          title: chapter.textContent.trim(), // Extract the chapter title
          link: chapter.href, // Extract the chapter link
        }))
    );

    // Close Puppeteer
    await browser.close();

    // Log the chapters to Node.js console
    console.log("Chapters:", chapters);

    // Send the list of chapters as JSON
    res.json({ chapters });
  } catch (error) {
    console.error("Error scraping the website:", error);
    res.status(500).send("Error scraping the website");
  }
});

app.listen(3080, () => {
  console.log("Server running on http://localhost:3080");
});
