export interface ImageData {
  file: File;
  preview: string;
}

export interface DragOverState {
  front: boolean;
  back: boolean;
}

export interface OCRResults {
  name: string;
  dob: string;
  gender: string;
  aadhaarNumber: string;
  address: string;
  pincode: string;
}

export type ImageSide = 'front' | 'back';

export interface ResultsPageProps {
  ocrResults: OCRResults;
  onBackToHome: () => void;
}
