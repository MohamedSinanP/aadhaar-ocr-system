export interface IAadhaarValidator {
  validate(aadhaar: string): boolean;
}