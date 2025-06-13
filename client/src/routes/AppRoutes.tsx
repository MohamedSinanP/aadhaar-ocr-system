import { Routes, Route } from "react-router-dom";
import AadhaarOCRHomePage from "../pages/HomePage";
const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AadhaarOCRHomePage />} />
      </Routes >
    </>
  )
}

export default AppRoutes