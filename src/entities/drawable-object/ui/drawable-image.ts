import { DrawableObject } from "./types";

export class DrawableImage implements DrawableObject {
  private imageFile: File | Blob;
  private loadedImage: HTMLImageElement | null = null;

  constructor(file: File | Blob) {
    this.imageFile = file;
  }

  public static async fromUrl(url: string): Promise<DrawableImage> {
    const result = await fetch(url);

    if (!result.ok) {
      throw new Error("Result is not ok");
    }
    const buffers = await result.arrayBuffer();

    const blob = new Blob([buffers], {
      type: "application/octet-stream",
    });

    return new DrawableImage(blob);
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
