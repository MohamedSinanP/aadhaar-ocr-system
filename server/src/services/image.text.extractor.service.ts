// services/ImageTextExtractor.ts
import { createWorker, PSM } from 'tesseract.js';
import path from 'path';
import { HttpError } from '../utils/http.error';
import { IOcrEngine } from '../interfaces/services/image.text.extractor.service';

export class ImageTextExtractor implements IOcrEngine {
  async extractText(imageBuffer: Buffer): Promise<string> {
    try {
      process.env.TESSDATA_PREFIX = path.resolve(__dirname, '../tessdata');
      const worker = await createWorker('eng');
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SPARSE_TEXT,
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/:,.- ()',
      });

      const { data: { text } } = await worker.recognize(imageBuffer);
      await worker.terminate();

      if (!text || text.trim().length < 10) {
        throw new HttpError(400, 'Image quality is too low or text is not readable. Please upload a clearer image.');
      }

      return text;
    } catch (err: any) {
      console.error('OCR extraction error:', err.message, err.stack);
      throw new HttpError(500, 'OCR service is unavailable. Please try again later.');
    }
  }
}
