import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express/multer/multer.module";
import { UploadController } from "./upload.controller";
import { diskStorage } from "multer";

const storage = diskStorage({
    destination: './uploads'
})

@Module({
    imports: [
        MulterModule.register({
            storage
        })
    ],
    controllers: [UploadController]
})
export class UploadModule {}