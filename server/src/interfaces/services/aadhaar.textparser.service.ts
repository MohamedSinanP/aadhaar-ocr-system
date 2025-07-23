// interfaces/IAadhaarParser.ts
import { AadhaarData } from '../../types/type';

export interface IAadhaarParser {
  parse(frontText: string, backText: string): AadhaarData;
}
