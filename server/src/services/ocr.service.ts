import { createWorker, PSM } from 'tesseract.js';
import path from 'path';
import IOcrService from '../interfaces/services/ocr.service';
import { AadhaarData } from '../types/type';

class OcrService implements IOcrService {

  // OCR Extraction logic
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

      return text;
    } catch (err) {
      console.error('OCR extraction error:', err);
      throw err;
    }
  }

  // Master function to process full Aadhaar (front & back)
  async extractAadhaarData(frontBuffer: Buffer, backBuffer: Buffer): Promise<AadhaarData> {
    const frontText = await this.extractTextFromImage(frontBuffer);
    const backText = await this.extractTextFromImage(backBuffer);

    return this.parseAadhaarText(frontText, backText);
  }

  // Clean and parse the OCR output
  private parseAadhaarText(frontText: string, backText: string): AadhaarData {
    const clean = (text: string) => text
      .replace(/[|]/g, 'I')
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const cleanedFront = clean(frontText);
    const cleanedBack = clean(backText);

    // Regex extraction (stronger rules now)
    const dobRegex = /(?:DOB|Date of Birth|DoB|D0B|Date)\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i;
    const genderRegex = /\b(Male|Female|MALE|FEMALE|Femal|M|F)\b/i;
    const aadhaarRegex = /\b(\d{4}\s\d{4}\s\d{4})\b/;
    const pincodeRegex = /\b\d{6}\b/;
    const nameRegex = /RRR\s*([A-Za-z\s]+?)(?=\sDOB)/i;
    const addressRegex = /(?:Address[:\s]+|S\/O:)([\s\S]+?)Kerala/i;

    const nameMatch = cleanedFront.match(nameRegex);
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
