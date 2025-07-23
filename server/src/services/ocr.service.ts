// services/OcrService.ts
import { AadhaarData } from '../types/type';
import { HttpError } from '../utils/http.error';
import { ImageTextExtractor } from './image.text.extractor.service';
import { AadhaarTextParser } from './aadhaar.textparser.service';
import { AadhaarValidator } from './aadhaar.validator.service';
import IOcrService from '../interfaces/services/ocr.service';
import { IOcrEngine } from '../interfaces/services/image.text.extractor.service';
import { IAadhaarParser } from '../interfaces/services/aadhaar.textparser.service';
import { IAadhaarValidator } from '../interfaces/services/aadhaar.validator.service';

class OcrService implements IOcrService {
  constructor(
    private _extractor: IOcrEngine,
    private _parser: IAadhaarParser,
    private _validator: IAadhaarValidator) { }

  async extractAadhaarData(frontBuffer: Buffer, backBuffer: Buffer): Promise<AadhaarData> {
    if (!frontBuffer || !backBuffer) {
      throw new HttpError(400, 'Both front and back images are required.');
    }

    const frontText = await this._extractor.extractText(frontBuffer);
    const backText = await this._extractor.extractText(backBuffer);

    const data = this._parser.parse(frontText, backText);

    if (!data.aadhaarNumber) {
      throw new HttpError(400, 'Aadhaar number not found in front image.');
    }
    if (!data.name) {
      throw new HttpError(400, 'Name not found.');
    }
    if (!data.dob) {
      throw new HttpError(400, 'Date of Birth not found.');
    }

    this._validator.validate(data.aadhaarNumber);

    return data;
  }
}

export default new OcrService(
  new ImageTextExtractor(),
  new AadhaarTextParser(),
  new AadhaarValidator()
);
