import { AadhaarData } from "../../types/type";

export default interface IOcrService {
  extractAadhaarData(frontBuffer: Buffer, backBuffer: Buffer): Promise<AadhaarData>;
}
