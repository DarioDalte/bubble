  const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {},
});

const singleUpload = upload.single("image");

export default async function handler(req, res) {
  console.log(req.file);

  /*
  const storage = multer.diskStorage({
    destination: "./public/",
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  });

  const uploadImage = multer({ storage }).single("photo");
  */
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
