import { createWorker, PSM } from 'tesseract.js';
import path from 'path';
import IOcrService from '../interfaces/services/ocr.service';
import { AadhaarData } from '../types/type';
import { HttpError } from '../utils/http.error';
import { validate } from 'verhoeff';

class OcrService implements IOcrService {
  private validateAadhaarNumber(aadhaar: string): boolean {
    const cleanedAadhaar = aadhaar.replace(/\s/g, '');
    if (!/^\d{12}$/.test(cleanedAadhaar)) {
      throw new HttpError(400, `Aadhaar number (${cleanedAadhaar}) must be exactly 12 digits.`);
    }

    const isValid = validate(cleanedAadhaar);
    if (!isValid) {
      const maskedAadhaar = `XXXX XXXX ${cleanedAadhaar.slice(-4)}`;
      throw new HttpError(400, `Invalid Aadhaar number (${maskedAadhaar}). Please provide a valid Aadhaar card.`);
    }
    return true;
  }

  private async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
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
      if (err.message?.includes('worker')) {
        throw new HttpError(500, 'OCR service is unavailable. Please try again later.');
      }
      throw new HttpError(500, 'OCR extraction failed. Please upload a clearer image or try again.');
    }
  }

  async extractAadhaarData(frontBuffer: Buffer, backBuffer: Buffer): Promise<AadhaarData> {
    try {
      if (!frontBuffer || !backBuffer) {
        throw new HttpError(400, 'Both front and back images are required.');
      }

      const frontText = await this.extractTextFromImage(frontBuffer);
      const backText = await this.extractTextFromImage(backBuffer);

      const aadhaarData = this.parseAadhaarText(frontText, backText);

      if (!aadhaarData.aadhaarNumber) {
        throw new HttpError(400, 'Aadhaar number not found. Please ensure the front image contains a valid Aadhaar number.');
      }

      this.validateAadhaarNumber(aadhaarData.aadhaarNumber);

      if (!aadhaarData.name) {
        throw new HttpError(400, 'Name not found. Please ensure the front image contains the name field.');
      }
      if (!aadhaarData.dob) {
        throw new HttpError(400, 'Date of Birth not found. Please ensure the front image contains the DOB field.');
      }

      return aadhaarData;
    } catch (error: any) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error('Extract Aadhaar data error:', error.message, error.stack);
      throw new HttpError(500, 'Failed to extract Aadhaar data. Please try again.');
    }
  }

  private parseAadhaarText(frontText: string, backText: string): AadhaarData {
    const clean = (text: string) => text
      .replace(/[|]/g, 'I')
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const cleanedFront = clean(frontText);
    const cleanedBack = clean(backText);

    console.log("log :  ", cleanedFront);

    const dobRegex = /(?:DOB|Date of Birth|DoB|D0B|Date)\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i;
    const genderRegex = /\b(Male|Female|MALE|FEMALE|Femal|M|F)\b/i;
    const aadhaarRegex = /\b(\d{4}\s\d{4}\s\d{4})\b/;
    const pincodeRegex = /\b\d{6}\b/;
    const nameRegexSpecific = /(?:RRR|wah)\s*([A-Za-z\s]+?)(?=\s*(?:DOB|Date of Birth|DoB|D0B|Date))/i;
    const nameRegexFallback = /\b[A-Za-z]+\s+([A-Za-z\s]+?)(?=\s*(?:DOB|Date of Birth|DoB|D0B|Date))/i;
    const addressRegex = /(?:Address[:\s]+|S\/O:)([\s\S]+?)Kerala/i;

    let nameMatch = cleanedFront.match(nameRegexSpecific);
    if (!nameMatch) {
      nameMatch = cleanedFront.match(nameRegexFallback);
    }

    const dobMatch = cleanedFront.match(dobRegex);
    const genderMatch = cleanedFront.match(genderRegex);
    const aadhaarMatch = cleanedFront.match(aadhaarRegex);
    const addressMatch = cleanedBack.match(addressRegex);
    const pincodeMatch = cleanedBack.match(pincodeRegex);

    console.log('Parsed Data:', nameMatch, dobMatch, genderMatch, aadhaarMatch, addressMatch, pincodeMatch);

    return {
      name: nameMatch ? clean(nameMatch[1]) : '',
      dob: dobMatch ? dobMatch[1] : '',
      gender: genderMatch ? (genderMatch[1].toLowerCase().startsWith('f') ? 'Female' : 'Male') : '',
      aadhaarNumber: aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, '') : '',
      address: addressMatch ? clean(addressMatch[0]) : '',
      pincode: pincodeMatch ? pincodeMatch[0] : '',
    };
  }
}

export default new OcrService();