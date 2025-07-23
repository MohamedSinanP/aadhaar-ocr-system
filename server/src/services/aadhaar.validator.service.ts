// AadhaarValidator.ts
import { IAadhaarValidator } from '../interfaces/services/aadhaar.validator.service';
import { HttpError } from '../utils/http.error';

export class AadhaarValidator implements IAadhaarValidator {
  private static d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  private static p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  private static inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

  private verhoeffValidate(aadhaar: string): boolean {
    let c = 0;
    const reversed = aadhaar.split('').reverse().map(Number);

    for (let i = 0; i < reversed.length; i++) {
      c = AadhaarValidator.d[c][AadhaarValidator.p[i % 8][reversed[i]]];
    }

    return c === 0;
  }

  validate(aadhaar: string): boolean {
    const cleaned = aadhaar.replace(/\s/g, '');

    if (!/^\d{12}$/.test(cleaned)) {
      throw new HttpError(400, `Aadhaar number (${cleaned}) must be exactly 12 digits.`);
    }

    const isValid = this.verhoeffValidate(cleaned);
    if (!isValid) {
      const masked = `XXXX XXXX ${cleaned.slice(-4)}`;
      throw new HttpError(400, `Invalid Aadhaar number (${masked}). Please provide a valid Aadhaar card.`);
    }

    return true;
  }
}
