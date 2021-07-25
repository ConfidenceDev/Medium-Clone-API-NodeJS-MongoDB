const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, fiile, cb) => {
        cb(null, "./storage/")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || 
    file.mimetype === "image/jpg" || 
    file.mimetype === "image/png" || 
    file.mimetype === "image/gif"){
        cb(null, true)
    }else{
        cb({
            status: "error",
            msg: " Unsupported file format"
        }, false)
    }
}

const upload = multer({
    storage, 
    limits: {
        fileSize: (1024 * 1024 * 1024)
    },
    fileFilter
})

module.exports = upload