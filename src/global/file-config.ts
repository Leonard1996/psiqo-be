import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";
import * as crypto from "crypto";

const multerConfig = {
    storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = "./files";
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
            cb(null, `${uuid()}${extname(file.originalname)}`);
        },
    })
}

function uuid() {
    return crypto.randomUUID()
}

const global = {
    multerConfig,
}

export default global
