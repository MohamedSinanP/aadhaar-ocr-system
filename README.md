# Aadhaar OCR Platform

An end-to-end Aadhaar OCR platform that extracts personal data from Aadhaar card images using Tesseract.js.  
This platform includes:

- Frontend (React + Vite + Axios)
- Backend (Node.js + Express + Tesseract.js)
- Deployment: Vercel (Frontend), Render (Backend)

---

## Deployed Application

[https://aadhaar-ocr-system-two.vercel.app](https://aadhaar-ocr-system-two.vercel.app)

## Features

- Upload Aadhaar front and back images
- Client-side image preprocessing for better OCR accuracy
- Server-side OCR extraction using Tesseract.js
- Auto extraction of Name, DOB, Gender, Aadhaar Number, Address, Pincode

---

## Tech Stack

- React.js (Frontend)
- Node.js + Express (Backend)
- Tesseract.js (OCR engine)
- Axios (HTTP client)
- Vercel (Frontend deployment)
- Render (Backend deployment)

---

## Folder Structure

```bash
root
├── client (React)
└── server (Node.js, Express, Tesseract.js)
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v18+ recommended)
- NPM / Yarn
- Vercel & Render accounts (for deployment)

### 2. Clone the Repository

```bash
git clone https://github.com/MohamedSinanP/aadhaar-ocr-system.git
cd aadhaar-ocr-system
```

### 3. Setup Backend

```bash
cd server
npm install
```

#### Create a .env file in the server/ directory and add your environment variables:

```ini
PORT=3001
CLIENT_URL=http://localhost:5173
```

#### Start the backend server:

```bash
npm run dev
```

- Backend will run at http://localhost:3001

### 4. Setup Frontend

```bash
cd ../client
npm install
```

#### Create a .env file in the client/ directory and add your environment variable:

```ini
VITE_BASE_API=http://localhost:5001/api
```

#### Start the frontend server:

```bash
npm run dev
```

- Frontend will run at http://localhost:5173

## Deployment

### Frontend Deployment (Vercel)

- Push your frontend code to GitHub.
- Connect your repository to Vercel.
- Set VITE_BASE_API as an environment variable in Vercel settings (your actual render backend domain name).
- Vercel will automatically build and deploy.
- You can see your website on the vercel provided domain name

### Backend Deployment (Render)

- Push your backend code to GitHub.
- Create a new Web Service in Render.
- Set environment variables (PORT,CLIENT_URL ) in Render settings(the CLIENT_URL must be your actual vercel domain name).
- Render will automatically build and deploy your backend.

## Testing

### Local Testing

- Upload Aadhaar front & back images via frontend form.
- Verify extracted data displayed in frontend.
- Monitor backend logs for OCR extraction output.

### Production Testing

- Use your live Vercel frontend domain.
- Ensure Render backend is accessible with proper CORS configuration.

---

## License

MIT License

---

## Author

Created by Mohamed Sinan P
