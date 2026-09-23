import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Package,
  Plus,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Minus,
  Sprout,
  ArrowRight,
  MapPin,
  CloudSun,
  Boxes,
  Leaf,
  CircleDollarSign,
} from "lucide-react";

import { getMyProducts, getForecast } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import AgricultureParticles from "../../components/AgricultureParticles";

gsap.registerPlugin(ScrollTrigger);

const FarmerDashboard = () => {
  const { token, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dashboardRef = useRef(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProducts(token);
        const farmerProducts = data?.products || [];

        setProducts(farmerProducts);

        /*
         * Get forecast for each crop listed by the farmer.
         */
        try {
          const availableCrops = [
            ...new Set(
              farmerProducts
                .filter((product) => Number(product?.quantity || 0) > 0)
                .map((product) => product?.cropName)
                .filter(Boolean),
            ),
          ];

          const forecastResults = await Promise.all(
            availableCrops.map((crop) =>
              getForecast(crop, user?.location || "Bhagalpur", 7),
            ),
          );

          const allForecasts = forecastResults.flatMap(
            (result) => result?.forecast?.forecast || [],
          );

          setForecast(allForecasts);
        } catch (forecastError) {
          console.error("FORECAST LOAD ERROR:", forecastError);

          setForecast([]);
        }
      } catch (error) {
        setError(
          error?.response?.data?.message || "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadDashboard();
    }
  }, [token, user]);

  /*
   * GSAP dashboard animations
   */

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-dashboard-header]",
        {
          opacity: 0,
          y: -30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        "[data-dashboard-stat]",
        {
          opacity: 0,
          y: 35,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.15,
          ease: "power3.out",
        },
      );

      gsap.utils.toArray("[data-dashboard-section]").forEach((section) => {
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true,
            },
          },
        );
      });
    }, dashboardRef);

    return () => context.revert();
  }, [loading, products.length, forecast.length]);

  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (sum, product) => sum + Number(product?.quantity || 0),
    0,
  );

  const availableProducts = products.filter(
    (product) => product?.status === "AVAILABLE",
  ).length;

  /*
   * Get the latest forecast item from all crop forecasts.
   */
  const latestForecast =
    forecast.length > 0
      ? forecast.reduce((latest, item) =>
          new Date(item?.date) > new Date(latest?.date) ? item : latest,
        )
      : null;

  const nextDemand = latestForecast?.predictedDemand || 0;

  const nextTrend = latestForecast?.trend || "STABLE";

  /*
   * Match each farmer crop with its actual forecast
   * using cropName instead of array position.
   */
  const cropInsights = products
    .filter((product) => Number(product?.quantity || 0) > 0)
    .slice(0, 4)
    .map((product) => {
      const cropForecasts = forecast.filter(
        (item) =>
          item?.cropName?.toLowerCase() === product?.cropName?.toLowerCase(),
      );

      const latestCropForecast =
        cropForecasts.length > 0
          ? cropForecasts.reduce((latest, item) =>
              new Date(item?.date) > new Date(latest?.date) ? item : latest,
            )
          : null;

      return {
        cropName: product?.cropName,
        quantity: product?.quantity,
        unit: product?.unit,
        predictedDemand: latestCropForecast?.predictedDemand || 0,
        trend: latestCropForecast?.trend || "STABLE",
        date: latestCropForecast?.date || "No forecast",
      };
    });

  const getTrendIcon = (trend) => {
    if (trend === "UP") {
      return <TrendingUp size={18} />;
    }

    if (trend === "DOWN") {
      return <TrendingDown size={18} />;
    }

    return <Minus size={18} />;
  };

  const getTrendClass = (trend) => {
    if (trend === "UP") {
      return "bg-green-100 text-green-700";
    }

    if (trend === "DOWN") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen bg-[#f4f7f1] p-4 sm:p-6 lg:p-8 overflow-hidden"
    >
      {/* THREE.JS BACKGROUND */}

      <div className="fixed inset-0 pointer-events-none opacity-40">
        <AgricultureParticles className="absolute inset-0 w-full h-full" opacity={0.12} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}

        <div
          data-dashboard-header
          className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Leaf size={15} />
              Farmer Dashboard
            </div>

            <p className="text-gray-500 text-sm sm:text-base">
              Welcome back,
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#123d20] mt-1">
              {user?.name || "Farmer"}
            </h1>

            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <MapPin size={16} className="text-green-600" />

              <span>{user?.location || "Your Farm Location"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/forecast"
                className="inline-flex items-center justify-center gap-2 bg-white border border-green-100 text-[#14532d] px-5 py-3 rounded-2xl font-semibold shadow-sm hover:shadow-md transition"
              >
                <CloudSun size={19} />
                Forecast
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/farmer/add-product"
                className="inline-flex items-center justify-center gap-2 bg-[#0b3d20] hover:bg-[#14532d] text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-green-900/10 transition"
              >
                <Plus size={20} />
                Add Product
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl"
          >
            {error}
          </motion.div>
        )}

        {/* TOP DASHBOARD GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-8">

          {/* MAIN FARM SUMMARY */}

          <div
            data-dashboard-stat
            className="xl:col-span-5 relative overflow-hidden rounded-[28px] bg-[#0b3d20] text-white p-7 sm:p-8 min-h-[260px] shadow-xl shadow-green-950/10"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-lime-300/10 blur-3xl" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-lime-300 text-[#0b3d20] flex items-center justify-center">
                    <Sprout size={25} />
                  </div>

                  <span className="text-xs font-semibold tracking-wider text-green-200 uppercase">
                    KisanDirect
                  </span>
                </div>

                <p className="text-green-200 text-sm mt-8">
                  Your farm inventory
                </p>

                <h2 className="text-5xl sm:text-6xl font-bold mt-2">
                  {totalQuantity}
                </h2>

                <p className="text-green-100 mt-2">
                  Total available quantity across your listings
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 mt-8">
                <div>
                  <p className="text-green-300 text-xs uppercase tracking-wider">
                    Active Listings
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {availableProducts}
                  </p>
                </div>

                <Link
                  to="/farmer/orders"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-2xl transition"
                >
                  Orders
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>

          {/* TOTAL PRODUCTS */}

          <motion.div
            data-dashboard-stat
            whileHover={{ y: -6 }}
            className="xl:col-span-3 bg-white rounded-[28px] p-6 border border-green-50 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-green-100 rounded-2xl">
                <Package className="text-green-600" size={24} />
              </div>

              <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                Products
              </span>
            </div>

            <div className="mt-8">
              <p className="text-gray-500 text-sm">
                Total Products
              </p>

              <h2 className="text-4xl font-bold text-[#173c24] mt-2">
                {totalProducts}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Listed on KisanDirect
              </p>
            </div>
          </motion.div>

          {/* ACTIVE LISTINGS */}

          <motion.div
            data-dashboard-stat
            whileHover={{ y: -6 }}
            className="xl:col-span-4 bg-lime-200 rounded-[28px] p-6 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-[#173c24] text-lime-200 rounded-2xl">
                <Boxes size={24} />
              </div>

              <div className="w-2 h-2 rounded-full bg-[#173c24] mt-2 animate-pulse" />
            </div>

            <div className="mt-8">
              <p className="text-[#31543b] text-sm font-medium">
                Active Listings
              </p>

              <h2 className="text-4xl font-bold text-[#173c24] mt-2">
                {availableProducts}
              </h2>

              <p className="text-sm text-[#52735a] mt-2">
                Products currently available for buyers
              </p>
            </div>
          </motion.div>
        </div>

        {/* DEMAND + QUICK ACTIONS */}

        <div
          data-dashboard-section
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8"
        >
          {/* FORECAST SUMMARY */}

          <div className="lg:col-span-7 bg-white rounded-[28px] border border-green-50 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-green-100">
                    <TrendingUp className="text-green-600" size={23} />
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">
                      Upcoming Demand
                    </p>

                    <h2 className="text-2xl font-bold text-[#173c24]">
                      Market Intelligence
                    </h2>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-5xl font-bold text-[#173c24]">
                    {nextDemand}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Predicted market demand
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-4">
                <motion.div
                  animate={{
                    scale: nextTrend === "UP" ? [1, 1.04, 1] : 1,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                  }}
                >
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getTrendClass(
                      nextTrend,
                    )}`}
                  >
                    {getTrendIcon(nextTrend)}

                    {nextTrend === "UP"
                      ? "Demand Increasing"
                      : nextTrend === "DOWN"
                        ? "Demand Decreasing"
                        : "Demand Stable"}
                  </span>
                </motion.div>

                <Link
                  to="/forecast"
                  className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition"
                >
                  View detailed forecast
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  AI-powered crop demand analysis
                </span>

                <CircleDollarSign size={20} className="text-lime-600" />
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div className="lg:col-span-5 bg-[#173c24] rounded-[28px] p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-lime-300/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <p className="text-lime-200 text-sm font-semibold uppercase tracking-wider">
                Quick Actions
              </p>

              <h2 className="text-2xl font-bold mt-2">
                Manage your farm
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
                <Link
                  to="/farmer/add-product"
                  className="group bg-white/10 hover:bg-lime-300 hover:text-[#173c24] border border-white/10 rounded-2xl p-4 transition"
                >
                  <Plus size={21} />

                  <p className="font-semibold mt-4">
                    Add Product
                  </p>

                  <p className="text-xs text-green-200 group-hover:text-[#31543b] mt-1">
                    Create a new listing
                  </p>
                </Link>

                <Link
                  to="/farmer/orders"
                  className="group bg-white/10 hover:bg-white hover:text-[#173c24] border border-white/10 rounded-2xl p-4 transition"
                >
                  <ShoppingCart size={21} />

                  <p className="font-semibold mt-4">
                    My Orders
                  </p>

                  <p className="text-xs text-green-200 group-hover:text-gray-500 mt-1">
                    Manage buyer orders
                  </p>
                </Link>

                <Link
                  to="/forecast"
                  className="group bg-white/10 hover:bg-white hover:text-[#173c24] border border-white/10 rounded-2xl p-4 transition"
                >
                  <CloudSun size={21} />

                  <p className="font-semibold mt-4">
                    Forecast
                  </p>

                  <p className="text-xs text-green-200 group-hover:text-gray-500 mt-1">
                    Check market demand
                  </p>
                </Link>

                <Link
                  to="/marketplace"
                  className="group bg-white/10 hover:bg-lime-300 hover:text-[#173c24] border border-white/10 rounded-2xl p-4 transition"
                >
                  <Sprout size={21} />

                  <p className="font-semibold mt-4">
                    Marketplace
                  </p>

                  <p className="text-xs text-green-200 group-hover:text-[#31543b] mt-1">
                    Explore the platform
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CROP DEMAND INSIGHTS */}

        <div
          data-dashboard-section
          className="bg-white rounded-[28px] border border-green-50 shadow-sm mb-8 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 border-b border-gray-100">
            <div>
              <p className="text-green-600 text-sm font-semibold">
                MARKET INSIGHTS
              </p>

              <h2 className="text-2xl font-bold text-[#173c24] mt-1">
                Crop Demand Insights
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Demand trends to help you plan your upcoming supply.
              </p>
            </div>

            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-lime-100 items-center justify-center">
              <TrendingUp className="text-green-700" size={23} />
            </div>
          </div>

          {cropInsights.length === 0 ? (
            <div className="p-10 sm:p-14 text-center">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-green-50 flex items-center justify-center mb-5">
                <Package size={30} className="text-green-500" />
              </div>

              <p className="text-gray-500">
                Add a product with available quantity to see demand insights.
              </p>

              <Link
                to="/farmer/add-product"
                className="inline-flex items-center gap-2 mt-5 bg-[#0b3d20] text-white px-5 py-3 rounded-2xl font-semibold hover:bg-[#14532d] transition"
              >
                Add Product
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 p-6 sm:p-8">
              {cropInsights.map((item, index) => (
                <motion.div
                  key={`${item?.cropName}-${index}`}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                  }}
                  className="border border-green-50 rounded-3xl p-5 bg-[#fbfdf9] hover:bg-white hover:shadow-xl hover:shadow-green-900/5 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider">
                        Your Crop
                      </p>

                      <h3 className="text-xl font-bold text-[#173c24] mt-2">
                        {item?.cropName}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${getTrendClass(
                        item?.trend,
                      )}`}
                    >
                      {getTrendIcon(item?.trend)}
                      {item?.trend}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-white rounded-2xl p-4 border border-gray-100">
                      <p className="text-gray-400 text-xs">
                        Your Supply
                      </p>

                      <p className="text-lg font-bold text-[#173c24] mt-2">
                        {item?.quantity} {item?.unit}
                      </p>
                    </div>

                    <div className="bg-lime-100 rounded-2xl p-4">
                      <p className="text-[#52735a] text-xs">
                        Demand
                      </p>

                      <p className="text-lg font-bold text-[#173c24] mt-2">
                        {item?.predictedDemand}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs mt-5">
                    Forecast date: {item?.date}
                  </p>

                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-sm font-semibold text-[#173c24]">
                      AI Recommendation
                    </p>

                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {item?.trend === "UP"
                        ? `Demand for ${item?.cropName} is increasing. Consider increasing your supply.`
                        : item?.trend === "DOWN"
                          ? `Demand for ${item?.cropName} is decreasing. Avoid overproduction and monitor inventory.`
                          : `Demand for ${item?.cropName} is stable. Maintain your current supply level.`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCTS TABLE */}

        <div
          data-dashboard-section
          className="bg-white rounded-[28px] border border-green-50 shadow-sm overflow-hidden mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 border-b border-gray-100">
            <div>
              <p className="text-green-600 text-sm font-semibold">
                INVENTORY
              </p>

              <h2 className="text-2xl font-bold text-[#173c24] mt-1">
                My Products
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Products listed on KisanDirect
              </p>
            </div>

            <Link
              to="/farmer/add-product"
              className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition"
            >
              Add new product
              <Plus size={18} />
            </Link>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="p-14 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-12 h-12 mx-auto border-4 border-green-100 border-t-green-600 rounded-full"
              />

              <p className="text-gray-500 mt-5">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            /* NO PRODUCTS */

            <div className="p-12 sm:p-16 text-center">
              <div className="w-20 h-20 mx-auto bg-lime-100 rounded-[28px] flex items-center justify-center mb-5">
                <Package size={36} className="text-green-600" />
              </div>

              <h3 className="text-xl font-bold text-[#173c24]">
                Your inventory is empty
              </h3>

              <p className="text-gray-500 mt-2">
                You haven't added any products yet.
              </p>

              <Link
                to="/farmer/add-product"
                className="inline-flex items-center gap-2 mt-6 bg-[#0b3d20] text-white px-5 py-3 rounded-2xl font-semibold hover:bg-[#14532d] transition"
              >
                Add your first product
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            /* PRODUCT TABLE */

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead className="bg-[#f8fbf6]">
                  <tr>
                    <th className="text-left px-6 sm:px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Crop
                    </th>

                    <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>

                    <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>

                    <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Location
                    </th>

                    <th className="text-left px-6 sm:px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product?._id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.04,
                      }}
                      className="border-t border-gray-100 hover:bg-[#fbfdf9] transition"
                    >
                      <td className="px-6 sm:px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <Sprout size={18} className="text-green-700" />
                          </div>

                          <span className="font-semibold text-[#173c24]">
                            {product?.cropName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        {product?.quantity} {product?.unit}
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#173c24]">
                        ₹{product?.pricePerUnit}
                      </td>

                      <td className="px-6 py-5 text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-green-600" />
                          {product?.location}
                        </div>
                      </td>

                      <td className="px-6 sm:px-8 py-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            product?.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : product?.status === "SOLD"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {product?.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;