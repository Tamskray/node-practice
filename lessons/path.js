const { writeFile, readFile } = require("fs/promises");
const path = require("path");

console.log(path.join("first", "second"));

//--------

const siteURL = "http://localhost:8080/users?id=2525";
const url = new URL(siteURL);

console.log(url);

const text = process.env.TEXT || "";

writeFile(path.resolve(__dirname, "text.txt"), text)
  .then(() => readFile(path.resolve(__dirname, "text.txt")))
  .then((data) => data.split(" ").length)
  .then((count) =>
    writeFile(path.resolve(__dirname, `count.txt"), "Words count: ${count}`))
  );
