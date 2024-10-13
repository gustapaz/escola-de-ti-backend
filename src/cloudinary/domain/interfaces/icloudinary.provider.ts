export abstract class ICloudinaryProvider {
    abstract uploadImage(file: Express.Multer.File): Promise<string>;
}
