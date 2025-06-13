import { Request, Response } from "express";

export default interface IAadhaarController {
  getAadhaarDetails(req: Request, res: Response): Promise<void>;
}

