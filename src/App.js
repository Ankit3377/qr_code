import './App.css';
import QrCodeCustomizationPage from './Components/QrCodeCustomizationPage.tsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={
        <>
          <QrCodeCustomizationPage/>
        </>}
      />
      
    </Routes>
  </Router>
  );
}

export default App;
