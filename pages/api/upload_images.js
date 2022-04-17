var http = require("http");
var formidable = require("formidable");
var fs = require("fs");

export default async function handler(req, res) {
  console.log("soonoq ui");
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var newpath =
      "C:/Users/Arslan/OneDrive/Desktop/bubble/pages/api/public/upload" +
      files.filetoupload.originalFilename;
    fs.rename(newpath, function (err) {
      if (err) throw err;
      res.write("File uploaded and moved!");
      res.end();
    });
  });
  res.status(200).json("Prodotto aggiunto nel database");
}
