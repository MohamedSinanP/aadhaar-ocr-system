import { Request, Response } from "express";
import IAadhaarController from "../interfaces/controllers/aadhaar.controller";
import IOcrService from "../interfaces/services/ocr.service";
import ocrService from "../services/ocr.service";


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
        res.status(400).json({ message: "Both front and back images are required" });
        return;
      }

      const frontImageBuffer = files.img1[0].buffer;
      const backImageBuffer = files.img2[0].buffer;

      const result = await this._ocrService.extractAadhaarData(frontImageBuffer, backImageBuffer);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}

export default new AadhaarController(ocrService);