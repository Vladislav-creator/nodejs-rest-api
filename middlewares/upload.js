const multer = require("multer");
const path = require("path");
const crypto = require("node:crypto");
const tempDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        // file.originalname: TrevorPhilips-GTAV.png
        const {_id} = req.user;
            
        const extname = path.extname(file.originalname); // .png
        const basename = path.basename(file.originalname, extname); // TrevorPhilips-GTAV
        const suffix = crypto.randomUUID();
        cb(null, `${_id}_${basename}-${suffix}${extname}`);

        // const extname = path.extname(file.originalname); // .png
        // cb(null, `${_id}${extname}`);
      },
      limits: {
        fileSize: 2048
      }
});

const upload = multer({
    storage: multerConfig
})

module.exports = upload;