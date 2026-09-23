import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AddProduct from "./pages/farmer/AddProduct";
import FarmerOrders from "./pages/farmer/FarmerOrders";

import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import Marketplace from "./pages/buyer/Marketplace";
import BuyerOrders from "./pages/buyer/BuyerOrders";

import Forecast from "./pages/Forecast";
import Logistics from "./pages/Logistics";
import AdminDashboard from "./pages/AdminDashboard";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Farmer */}
        <Route path="/farmer" element={<FarmerDashboard />} />

        <Route path="/farmer/add-product" element={<AddProduct />} />

        <Route path="/farmer/orders" element={<FarmerOrders />} />

        {/* Buyer */}
        <Route path="/buyer" element={<BuyerDashboard />} />

        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/buyer/orders" element={<BuyerOrders />} />

        {/* AI Forecast */}
        <Route path="/forecast" element={<Forecast />} />

        {/* Logistics */}
        <Route path="/logistics" element={<Logistics />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/government-schemes" element={<GovernmentSchemes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
