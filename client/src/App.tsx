import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position='top-right' autoClose={2000} />
      <AppRoutes />
    </>
  )
}

export default App
