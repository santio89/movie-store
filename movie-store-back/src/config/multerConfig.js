import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/uploads")
    },
    filename: function(req, file, cb){
        cb(null, "avatar-"+req.body.email+".jpg")
    }
})

const upload = multer({storage})

export default upload;