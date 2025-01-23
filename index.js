/*
Name: Joe Duong
Date: 12/22/24
Note: This test took me over 3 hours to do and a lot of Googling, StackOverflow and reading Playwright docs. 
I have the idea on how to test this but looking up the syntax was what took up the majority of the time. 
I leave more comments than usual to explain my thought process. 

I am a little rusty on writing code since I have been mostly working on manual QA for the past 
year or so. However, I am sure I can catch up to speed with the right guidance. I am very passionate about
this position and I hope you could give me feedback on my code. I want to be better and I will work hard
to get there.
*/

// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Added some try catch for error checks
  try {
    // Go to Hacker News
    const url = "https://news.ycombinator.com/newest";
    await page.goto(url);

    /* 
      Pre-code prblem solving ideas:
      For this assignment, we want the published dates for the top 100 articles on the website.
      Then we can do a sort function to check if they are in order.

      I will also pull in some data like article ids and titles for debugging
      and to make it easier to validate the result.
    */

    // I used the browser console log to find the class names and what we need
    const ids = await page.$$eval(".athing.submission", (elements) =>
      elements.map((el) => el.id)
    ); // This should grab what we see on the page, so 30 article ids.

    const publishedDate = await page.$$eval(".age", (elements) =>
      elements.map((el) => el.title)
    ); // 30 dates

    const titles = await page.$$eval(
      '.titleline a[rel="nofollow"]',
      (elements) => elements.map((el) => el.textContent.trim())
    ); // 30 titles

    // Ensure exactly 100 articles are returned.
    while (ids.length < 100) {
      await page.click(".morelink");

      const idsNew = await page.$$eval(
        ".athing.submission",
        (elements, ids) => {
          return elements.slice(0, 100 - ids.length).map((el) => el.id);
        },
        ids
      ); // Passed the external 'ids' variable as an argument.
      // This took me awhile to fix because ids was out of scope for $$eval

      const publishedDateNew = await page.$$eval(
        ".age",
        (elements, ids) => {
          return elements.slice(0, 100 - ids.length).map((el) => el.title);
        },
        ids
      );

      const titleseNew = await page.$$eval(
        '.titleline a[rel="nofollow"]',
        (elements, ids) => {
          return elements
            .slice(0, 100 - ids.length)
            .map((el) => el.textContent.trim());
        },
        ids
      );

      ids.push(...idsNew);
      publishedDate.push(...publishedDateNew);
      titles.push(...titleseNew);
    }

    // We have the top 100 articles' published dates here.
    // We can loop through the array to find if they are out of order.
    async function areArticlesSorted() {
      let sorted = true;
      for (let i = 1; i < publishedDate.length; i++) {
        if (Date(publishedDate[i]) < Date(publishedDate[i + 1])) {
          sorted = false;
        }
        return sorted;
      }
    }

    console.log("Articles count:", publishedDate.length); // Now we have exactly 100 articles

    console.log("Published Dates:", publishedDate);
    console.log("IDs:", ids);
    console.log("Titles:", titles);

    if (areArticlesSorted()) {
      console.log("The artiles are sorted. Test success.");
    } else console.log("The artiles are not sorted. Test failed.");
  } catch (error) {
    console.error(`Error: ${error}`);
  } finally {
    //await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
