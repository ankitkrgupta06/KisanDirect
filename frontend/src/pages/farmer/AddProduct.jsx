import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ArrowLeft,
  CheckCircle2,
  CalendarDays,
  IndianRupee,
  Leaf,
  MapPin,
  Package,
  Plus,
  Sprout,
  Tractor,
  Weight,
} from "lucide-react";

import { createProduct } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import AgricultureParticles from "../../components/AgricultureParticles";

gsap.registerPlugin(ScrollTrigger);

const AddProduct = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const pageRef = useRef(null);

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    location: "",
    harvestDate: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          "[data-add-product-left]",
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
          },
        )
        .fromTo(
          "[data-add-product-card]",
          {
            opacity: 0,
            y: 45,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.55",
        )
        .fromTo(
          "[data-form-field]",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.35",
        );

      gsap.fromTo(
        "[data-add-product-bottom]",
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-add-product-bottom]",
            start: "top 90%",
            once: true,
          },
        },
      );
    }, pageRef);

    return () => context.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const productData = {
        cropName: formData.cropName,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        pricePerUnit: Number(formData.pricePerUnit),
        location: formData.location,
        harvestDate: formData.harvestDate || undefined,
      };

      await createProduct(productData, token);

      setSuccess("Product added successfully!");

      setFormData({
        cropName: "",
        quantity: "",
        unit: "kg",
        pricePerUnit: "",
        location: "",
        harvestDate: "",
      });

      setTimeout(() => {
        navigate("/farmer");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#f4f7f1] relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      {/* EXISTING THREE.JS AGRICULTURE PARTICLES */}

      <AgricultureParticles
        className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
        opacity={0.12}
      />

      {/* BACKGROUND DECORATION */}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-lime-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="absolute right-0 bottom-0 w-[450px] h-[450px] bg-green-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* TOP NAVIGATION */}

        <motion.button
          type="button"
          onClick={() => navigate("/farmer")}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 text-[#31543b] hover:text-[#0b3d20] font-semibold mb-6 transition"
        >
          <ArrowLeft size={19} />
          Back to Dashboard
        </motion.button>

        {/* MAIN CARD */}

        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-green-950/10 border border-green-100">

          {/* LEFT GREEN PANEL */}

          <div
            data-add-product-left
            className="lg:col-span-5 relative bg-[#0b3d20] text-white p-8 sm:p-10 lg:p-12 overflow-hidden min-h-[420px] lg:min-h-full"
          >
            {/* Decorative elements */}

            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-lime-300/10 blur-2xl" />

            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-green-400/10 blur-3xl" />

            <div className="relative z-10 flex flex-col h-full">

              {/* Brand */}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-lime-300 text-[#0b3d20] flex items-center justify-center shadow-lg">
                  <Sprout size={25} />
                </div>

                <div>
                  <p className="font-bold text-lg">KisanDirect</p>

                  <p className="text-green-300 text-xs">
                    Farmer Marketplace
                  </p>
                </div>
              </motion.div>

              {/* Main text */}

              <div className="mt-12 lg:mt-20">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-lime-200">
                  <Leaf size={16} />
                  Grow your business
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold leading-tight mt-6">
                  Add your
                  <span className="block text-lime-300">
                    fresh produce.
                  </span>
                </h1>

                <p className="text-green-100/80 text-base sm:text-lg leading-relaxed mt-6 max-w-md">
                  List your agricultural products and connect directly with
                  buyers through KisanDirect.
                </p>
              </div>

              {/* Feature cards */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto pt-10">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-lime-300/20 text-lime-300 flex items-center justify-center">
                    <Package size={20} />
                  </div>

                  <p className="font-semibold mt-4">
                    Easy Listing
                  </p>

                  <p className="text-green-200 text-xs mt-1">
                    Add your produce quickly.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-lime-300/20 text-lime-300 flex items-center justify-center">
                    <Tractor size={20} />
                  </div>

                  <p className="font-semibold mt-4">
                    Direct Selling
                  </p>

                  <p className="text-green-200 text-xs mt-1">
                    Connect with buyers.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM SECTION */}

          <div
            data-add-product-card
            className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12"
          >
            {/* Heading */}

            <div className="mb-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
                    Product Details
                  </p>

                  <h2 className="text-3xl sm:text-4xl font-bold text-[#173c24] mt-2">
                    Add New Product
                  </h2>
                </div>

                <motion.div
                  animate={{
                    rotate: [0, 4, -4, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="hidden sm:flex w-14 h-14 rounded-2xl bg-lime-100 items-center justify-center"
                >
                  <Plus size={27} className="text-green-700" />
                </motion.div>
              </div>

              <p className="text-gray-500 mt-3">
                Enter your produce details to make it available on
                KisanDirect.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* SUCCESS */}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 rounded-2xl bg-green-50 border border-green-200 px-5 py-4 text-green-700 flex items-center gap-3"
              >
                <CheckCircle2 size={20} />

                <span>{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* CROP NAME */}

              <div data-form-field>
                <label className="block text-sm font-semibold text-[#31543b] mb-2">
                  Crop Name
                </label>

                <div className="relative">
                  <Sprout
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  />

                  <input
                    type="text"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleChange}
                    placeholder="e.g. Tomato"
                    required
                    className="w-full bg-[#f4f8f2] border border-green-100 rounded-2xl pl-12 pr-4 py-3.5 text-[#173c24] outline-none transition focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* QUANTITY + UNIT */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div data-form-field>
                  <label className="block text-sm font-semibold text-[#31543b] mb-2">
                    Quantity
                  </label>

                  <div className="relative">
                    <Weight
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                    />

                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      min="1"
                      required
                      className="w-full bg-[#f4f8f2] border border-green-100 rounded-2xl pl-12 pr-4 py-3.5 text-[#173c24] outline-none transition focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div data-form-field>
                  <label className="block text-sm font-semibold text-[#31543b] mb-2">
                    Unit
                  </label>

                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full bg-[#f4f8f2] border border-green-100 rounded-2xl px-4 py-3.5 text-[#173c24] outline-none transition focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  >
                    <option value="kg">Kilogram (kg)</option>

                    <option value="quintal">Quintal</option>

                    <option value="ton">Ton</option>
                  </select>
                </div>
              </div>

              {/* PRICE */}

              <div data-form-field>
                <label className="block text-sm font-semibold text-[#31543b] mb-2">
                  Price per {formData.unit}
                </label>

                <div className="relative">
                  <IndianRupee
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  />

                  <input
                    type="number"
                    name="pricePerUnit"
                    value={formData.pricePerUnit}
                    onChange={handleChange}
                    placeholder="e.g. 40"
                    min="0"
                    required
                    className="w-full bg-[#f4f8f2] border border-green-100 rounded-2xl pl-12 pr-4 py-3.5 text-[#173c24] outline-none transition focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* LOCATION */}

              <div data-form-field>
                <label className="block text-sm font-semibold text-[#31543b] mb-2">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bhagalpur"
                    required
                    className="w-full bg-[#f4f8f2] border border-green-100 rounded-2xl pl-12 pr-4 py-3.5 text-[#173c24] outline-none transition focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* HARVEST DATE */}

              <div data-form-field>
                <label className="block text-sm font-semibold text-[#31543b] mb-2">
                  Harvest Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none"
                  />

                  <input
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="w-full bg-[#f4f8f2] border border-green-100 rounded-2xl pl-12 pr-4 py-3.5 text-[#173c24] outline-none transition focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* BUTTONS */}

              <div
                data-form-field
                className="flex flex-col-reverse sm:flex-row gap-3 pt-4"
              >
                <motion.button
                  type="button"
                  onClick={() => navigate("/farmer")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="sm:w-auto px-7 py-3.5 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { y: -3, scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0b3d20] hover:bg-[#14532d] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-green-900/15 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />

                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Add Product
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* BOTTOM INFORMATION CARDS */}

        <div
          data-add-product-bottom
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Sprout size={20} className="text-green-700" />
            </div>

            <p className="font-semibold text-[#173c24] mt-4">
              Fresh Produce
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Add accurate crop information.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center">
              <IndianRupee size={20} className="text-green-700" />
            </div>

            <p className="font-semibold text-[#173c24] mt-4">
              Set Your Price
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Define the price per unit.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <MapPin size={20} className="text-green-700" />
            </div>

            <p className="font-semibold text-[#173c24] mt-4">
              Add Location
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Help buyers find your produce.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;