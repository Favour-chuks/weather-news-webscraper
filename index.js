import express from "express";
import cors from "cors";
import * as cheerio from "cheerio";
import axios from "axios";

const PORT = 8000;
const app = express();

// app.use(cors());
const newsPapers = [
  {
    name: "cityam",
    address:
      "https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/environment/climate-change",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/international/section/climate",
    base: "",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/environment",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "un",
    address: "https://www.un.org/climatechange",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    base: "",
  },
  {
    name: "dm",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    base: "",
  },
  {
    name: "nyp",
    address: "https://www.nypost.com/tag/climate-change/",
    base: "",
  },
];
const articles = [];

newsPapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("climate")', html).each(() => {
        const title = $(this).text();
        const url = $(this).attr("href");

        articles.push({
          title,
          url: newspaper.base + url,
          newspaperName: newspaper.name,
        });
      });
    })
    .catch((err) => console.log(err));
});

app.get("/", (req, res) => {
  res.json("welcome to my api");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newsPapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  const base = newsPapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;

  axios.get(newspaperAddress).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const specificArticles = [];

    $('a:contains("climate")', html)
      .each(() => {
        const title = $(this).text();
        const url = $(this).attr("href");

        specificArticles.push({
          title,
          url,
          base,
        });
        res.json(specificArticles);
      })
      .catch((err) => console.log(err));
  });
});

app.listen(PORT, () => {
  console.log(`connected to the server on port ${PORT}`);
});
