import multer from "multer";
//copying of disk storage fn from github readme of multer :https://github.com/expressjs/multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ storage: storage })