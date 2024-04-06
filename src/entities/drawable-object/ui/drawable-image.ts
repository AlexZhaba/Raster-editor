import { DrawableObject } from "./types";

export class DrawableImage implements DrawableObject {
  private imageFile: File;
  private loadedImage: HTMLImageElement | null = null;

  constructor(file: File) {
    this.imageFile = file;
  }

  public static fromUrl(url: string) {
    console.log(url);
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    const img = this.loadedImage ?? (await this.loadImage());

    context.drawImage(img, 0, 0);
  }

  public async getSize() {
    this.loadedImage = await this.loadImage();

    return {
      width: this.loadedImage.width,
      height: this.loadedImage.height,
    };
  }

  private loadImage() {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(this.imageFile);

      img.onload = () => {
        resolve(img);
      };
    });
  }
}
