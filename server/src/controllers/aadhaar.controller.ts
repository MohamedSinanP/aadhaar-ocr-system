import { Request, Response } from "express";
import IAadhaarController from "../interfaces/controllers/aadhaar.controller";
import IOcrService from "../interfaces/services/ocr.service";
import ocrService from "../services/ocr.service";
import { HttpError } from '../utils/http.error';

class AadhaarController implements IAadhaarController {
  constructor(private _ocrService: IOcrService) { }

  async getAadhaarDetails(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as {
        img1?: Express.Multer.File[];
        img2?: Express.Multer.File[];
      };
      console.log("images : ", files);

      if (!files?.img1?.length || !files?.img2?.length) {
        throw new HttpError(400, "Both front and back images are required.");
      }

      const frontImageBuffer = files.img1[0].buffer;
      const backImageBuffer = files.img2[0].buffer;

      const result = await this._ocrService.extractAadhaarData(frontImageBuffer, backImageBuffer);
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Controller error:', error.message, error.stack);
        res.status(500).json({ message: "An unexpected server error occurred. Please try again later." });
      }
    }
  }
}

export default new AadhaarController(ocrService);