import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express/multer/multer.module";
import { UploadController } from "./upload.controller";
import { diskStorage } from "multer";

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const filenameWithoutSpaces = file.originalname.replace(/\s/g, '_');
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
        cb(null, filenameWithoutSpaces);
    }
});

@Module({
    imports: [
        MulterModule.register({
            storage: storage,
            fileFilter: (req, file, cb) => {
                console.log(file.mimetype.match(/^(image|audio|video)\/(mp3|wav|jpeg|png)$/) ? 'true' : 'false');
                if (file.mimetype.match(/^(image|audio|video)\/(mp3|wav|jpeg|png)$/)) {
                    cb(null, true);
                } else {
                    cb(new Error('Not a valid file'), false);
                }
            }
        })
    ],
    controllers: [UploadController]
})
export class UploadModule {}