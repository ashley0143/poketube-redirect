/*
  creates an basic express server 
*/
const express = require("express");
const path = require("node:path");
const fetch = require("node-fetch");

const app = express();

// parsing options

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

function getJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

const templateDir = path.resolve(`${process.cwd()}${path.sep}html`);

const renderTemplate = async (res, req, template, data = {}) => {
  res.render(
    path.resolve(`${templateDir}${path.sep}${template}`),
    Object.assign(data)
  );
};

app.get("/:r*?", async function (req, res) {
  const list = await fetch(`https://poketube.fun/api/instances.json`).then(
    (res) => res.text()
  );

  const t = getJson(list);

  let rendermainpage = () => {
    return renderTemplate(res, req, "index.ejs", {
      param: req.params.r,
      v: req.query.v,
      id: req.query.id,
      query: req.query.query,
      tab: req.query.tab,
      t,
    });
  };

  if (req.params.r) {
    return rendermainpage();
  } else {
    return res.redirect("https://poketube.fun");
  }
});

// listen :p
app.listen(3000, () => console.log("Listening on 0.0.0.0:3000"));
