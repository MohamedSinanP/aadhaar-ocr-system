import express from 'express';
import upload from '../middlewares/upload';
import aadhaarController from '../controllers/aadhaar.controller';
const router = express.Router();

router.post(
  '/aadhaar',
  upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 }
  ]),
  aadhaarController.getAadhaarDetails.bind(aadhaarController)
);

export default router;