import express from "express";
import cors from "cors";
import * as cheerio from "cheerio";
import axios from "axios";

const PORT = 8080;
const app = express();

type ArticleType = {
  title: string,
  url: string,
  newspaperName?: string,
  base?: string
}
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
const articles: Array<ArticleType> = [];

newsPapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("climate")', html).each(() => {
        const title = $(this).text();
        const url = $(this).attr("href");

        if(!title || !url ) throw new Error("Unable to get data");

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


  const newspaper = newsPapers.filter((newspaper) => newspaper.name === newspaperId)[0];

  if (!newspaper) {
    return res.status(404).json({ error: "Newspaper not found" });
  }

  const newspaperAddress = newspaper.address;
  const base = newspaper.base;

  axios.get(newspaperAddress).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const specificArticles: Array<ArticleType> = [];

    $('a:contains("climate")', html)
      .each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        if(!title || !url ) throw new Error("Address is invalid");

        specificArticles.push({
          title,
          url,
          base,
        });
      });
    res.json(specificArticles);
  }).catch((err: any) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`connected to the server on port ${PORT}`);
});
