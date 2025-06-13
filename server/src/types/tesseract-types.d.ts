import 'tesseract.js';

declare module 'tesseract.js' {
  interface RecognizeOptions {
    lang?: string;
    tessedit_pageseg_mode?: string;
    tessedit_ocr_engine_mode?: string;
    preserve_interword_spaces?: string;
    tessedit_char_whitelist?: string;
  }
}