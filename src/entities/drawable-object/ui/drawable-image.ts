import { nearestNeighbourImpl } from "../../../shared/lib";
import { DrawableObject } from "./types";

export class DrawableImage implements DrawableObject {
  private imageFile: File | Blob;
  private imageData: ImageData | null = null;
  private origImageData: ImageData | null = null;
  private loadedImage: HTMLImageElement | null = null;

  constructor(file: File | Blob) {
    this.imageFile = file;

    this.getImageData().then((imageData) => {
      this.origImageData = imageData;
    });
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

  public async draw(
    x: number,
    y: number,
    context: CanvasRenderingContext2D
  ): Promise<void> {
    const imageData = await this.getImageData();

    context.putImageData(imageData, x, y);
  }

  public async getSize() {
    const imageData = await this.getImageData();

    return {
      width: imageData.width,
      height: imageData.height,
    };
  }

  public resize(scaleX: number, scaleY: number, dependsOnOrig = true): void {
    if (!this.imageData || !this.origImageData) {
      throw new Error(
        "Before getting resizable image you should set image data"
      );
    }

    const {
      data,
      width: currentImageDataWidth,
      height: currentImageDataHeight,
    } = dependsOnOrig ? this.origImageData : this.imageData;

    const grouppedImageData = data.reduce<number[][][]>((acc, val, index) => {
      const rowIndex = Math.floor(index / 4 / currentImageDataWidth);
      const groupIndex = Math.floor(index / 4) % currentImageDataWidth;
      if (!acc[rowIndex]) acc[rowIndex] = [];
      if (!acc[rowIndex][groupIndex]) acc[rowIndex][groupIndex] = [];
      acc[rowIndex][groupIndex].push(val);
      return acc;
    }, []);

    const resizedImageData = nearestNeighbourImpl(
      grouppedImageData,
      scaleX,
      scaleY
    );

    const newImageWidth = Math.floor(currentImageDataWidth * scaleX);
    const newImageHeight = Math.floor(currentImageDataHeight * scaleY);

    const context = this.createTemporaryCanvas(newImageWidth, newImageHeight);

    const newImageData = context.createImageData(newImageWidth, newImageHeight);

    for (let i = 0; i < newImageData.data.length; i++) {
      const rowIndex = Math.floor(i / 4 / newImageWidth);
      const groupIndex = Math.floor(i / 4) % newImageWidth;
      newImageData.data[i] = resizedImageData[rowIndex][groupIndex][i % 4];
    }

    this.imageData = newImageData;
  }

  private loadImage(): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(this.imageFile);

      img.onload = () => {
        resolve(img);
      };
    });
  }

  private async getImageData(): Promise<ImageData> {
    if (this.imageData) return this.imageData;

    if (!this.loadedImage) {
      this.loadedImage = await this.loadImage();
    }
    const context = this.createTemporaryCanvas(
      this.loadedImage.width,
      this.loadedImage.height
    );
    context.drawImage(this.loadedImage, 0, 0);

    this.imageData = context.getImageData(
      0,
      0,
      this.loadedImage.width,
      this.loadedImage.height
    );
    return this.imageData;
  }

  private createTemporaryCanvas(
    width: number,
    height: number
  ): CanvasRenderingContext2D {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Context is null for temporary canvas");
    }

    return context;
  }
}
