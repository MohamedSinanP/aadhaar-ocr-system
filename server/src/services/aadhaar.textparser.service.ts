// services/AadhaarTextParser.ts
import { IAadhaarParser } from '../interfaces/services/aadhaar.textparser.service';
import { AadhaarData } from '../types/type';

export class AadhaarTextParser implements IAadhaarParser {
  private clean(text: string): string {
    return text
      .replace(/[|]/g, 'I')
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  parse(frontText: string, backText: string): AadhaarData {
    const cleanedFront = this.clean(frontText);
    const cleanedBack = this.clean(backText);

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

    return {
      name: nameMatch ? this.clean(nameMatch[1]) : '',
      dob: dobMatch ? dobMatch[1] : '',
      gender: genderMatch ? (genderMatch[1].toLowerCase().startsWith('f') ? 'Female' : 'Male') : '',
      aadhaarNumber: aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, '') : '',
      address: addressMatch ? this.clean(addressMatch[0]) : '',
      pincode: pincodeMatch ? pincodeMatch[0] : '',
    };
  }
}
