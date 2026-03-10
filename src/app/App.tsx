import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FidelityPage } from "./components/FidelityPage";
import { NotFound } from "./components/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/f/:responsavelId" element={<FidelityPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
