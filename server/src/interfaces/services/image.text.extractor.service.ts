export interface IOcrEngine {
  extractText(image: Buffer): Promise<string>;
}
