import multer from "multer";
import path from "path";

var fs = require("fs"),
  request = require("request");

export default async function handler(req, res) {
  const storage = multer.diskStorage({
    destination: "./public/",
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  });

  const uploadImage = multer({ storage }).single("photo");
  res.status(200).json("Prodotto aggiunto nel database");
}

/*


 request.head(
    "C:/Users/Arslan/OneDrive/Desktop/bubble/pages/api/public/upload",
    function (err, res, body) {
      console.log("content-type:", req.headers["content-type"]);
      console.log("content-length:", req.headers["content-length"]);

      request("C:/Users/Arslan/OneDrive/Immagini/Saved Pictures/msi.jpg")
        .pipe(fs.createWriteStream("scimmia.png"))
        .on("close");
    }
  );
  res.status(200).json("Prodotto aggiunto nel database");


  */
