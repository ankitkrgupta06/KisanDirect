import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Sparkles,
  RefreshCw,
  CloudSun,
  ChartNoAxesCombined,
  Target,
  Brain,
  ArrowUpRight,
  Leaf,
  BarChart3,
  Activity,
  CheckCircle2,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getForecast, seedForecast, predictMarketPrice } from "../services/api";
import AgricultureParticles from "../components/AgricultureParticles";

gsap.registerPlugin(ScrollTrigger);

const Forecast = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);

  const [pricePrediction, setPricePrediction] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState("");

  const pageRef = useRef(null);

  useEffect(() => {
    const loadForecast = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getForecast();

        const forecastData = data?.forecast?.forecast || [];

        setForecast(forecastData);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message || "Failed to load demand forecast.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, []);

  /*
   * GSAP + ScrollTrigger animations
   */

  useEffect(() => {
    if (loading) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          "[data-forecast-hero]",
          {
            opacity: 0,
            y: -35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
        )
        .fromTo(
          "[data-forecast-stat]",
          {
            opacity: 0,
            y: 35,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.4",
        );

      gsap.utils.toArray("[data-forecast-section]").forEach((section) => {
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
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    }, pageRef);

    return () => context.revert();
  }, [loading, forecast.length]);

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
      return "text-green-700 bg-green-100";
    }

    if (trend === "DOWN") {
      return "text-red-700 bg-red-100";
    }

    return "text-gray-600 bg-gray-100";
  };

  const getTrendLabel = (trend) => {
    if (trend === "UP") {
      return "Demand Rising";
    }

    if (trend === "DOWN") {
      return "Demand Falling";
    }

    return "Demand Stable";
  };

  const handleSeedForecast = async () => {
    try {
      setSeeding(true);
      setError("");

      await seedForecast();

      const data = await getForecast();

      const forecastData = data?.forecast?.forecast || [];

      setForecast(forecastData);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Failed to generate forecast data.",
      );
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div
        ref={pageRef}
        className="min-h-screen bg-[#f4f7f1] relative overflow-hidden flex items-center justify-center p-6"
      >
        <AgricultureParticles
          className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
          opacity={0.12}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-white rounded-[32px] p-10 sm:p-14 shadow-xl shadow-green-950/10 text-center max-w-md w-full border border-green-100"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-16 h-16 mx-auto rounded-3xl border-4 border-green-100 border-t-green-600"
          />

          <div className="mt-7">
            <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
              KisanDirect Intelligence
            </p>

            <h1 className="text-2xl font-bold text-[#173c24] mt-2">
              Loading Forecast
            </h1>

            <p className="text-gray-500 mt-3">
              Analyzing agricultural demand data...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const chartData = forecast.map((item) => ({
    name: item.date,
    demand: item.predictedDemand,
  }));

  const latestForecast =
    forecast.length > 0 ? forecast[forecast.length - 1] : null;

  const highestDemand =
    forecast.length > 0
      ? Math.max(...forecast.map((item) => item.predictedDemand || 0))
      : 0;

  const averageDemand =
    forecast.length > 0
      ? Math.round(
          forecast.reduce((sum, item) => sum + (item.predictedDemand || 0), 0) /
            forecast.length,
        )
      : 0;

  const confidence =
    forecast.length > 0
      ? Math.min(95, Math.max(70, 85 + (forecast.length > 5 ? 5 : 0)))
      : 0;

  const recommendedSupply =
    highestDemand > 0 ? Math.ceil(highestDemand * 1.1) : 0;

  const getCurrentDate = () => {
    const today = new Date();

    return today.toLocaleDateString("en-CA");
  };

  const handlePricePrediction = async () => {
    try {
      setPriceLoading(true);
      setPriceError("");
      setPricePrediction(null);

      const data = await predictMarketPrice("Tomato", "Bhagalpur", "Deshi");

      setPricePrediction({
        ...data,
        predictionDate: getCurrentDate(),
      });
    } catch (err) {
      console.error(err);
      setPriceError(
        err?.response?.data?.message || "Failed to get ML price prediction.",
      );
    } finally {
      setPriceLoading(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#f4f7f1] relative overflow-hidden p-4 sm:p-6 lg:p-8"
    >
      {/* EXISTING THREE.JS AGRICULTURE PARTICLES */}

      <AgricultureParticles
        className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
        opacity={0.1}
      />

      {/* BACKGROUND DECORATIONS */}

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-200/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-green-200/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO */}

        <div
          data-forecast-hero
          className="relative overflow-hidden rounded-[32px] bg-[#0b3d20] text-white p-6 sm:p-8 lg:p-10 mb-7 shadow-xl shadow-green-950/10"
        >
          {/* Decorative circles */}

          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="absolute right-20 bottom-0 w-48 h-48 rounded-full bg-green-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* LEFT HERO CONTENT */}

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-lime-200 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles size={16} />
                AI-Powered Market Intelligence
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-6">
                Demand
                <span className="block text-lime-300">Forecast.</span>
              </h1>

              <p className="text-green-100/80 text-base sm:text-lg leading-relaxed mt-5 max-w-xl">
                Understand upcoming agricultural demand and make smarter
                decisions about your production, inventory, and supply.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <Brain size={18} className="text-lime-300" />

                  <span className="text-sm font-medium">Smart Predictions</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <Activity size={18} className="text-lime-300" />

                  <span className="text-sm font-medium">Market Trends</span>
                </div>
              </div>
            </div>

            {/* HERO RIGHT */}

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[220px]">
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-lime-300 text-[#173c24] rounded-[26px] p-5 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <CloudSun size={24} />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Latest Trend
                  </span>
                </div>

                <p className="text-3xl font-bold mt-6">
                  {latestForecast?.trend || "STABLE"}
                </p>

                <p className="text-sm text-[#31543b] mt-1">
                  Current market direction
                </p>
              </motion.div>

              <motion.button
                onClick={handleSeedForecast}
                disabled={seeding}
                whileHover={!seeding ? { y: -3, scale: 1.02 } : {}}
                whileTap={!seeding ? { scale: 0.97 } : {}}
                className="inline-flex items-center justify-center gap-3 bg-white text-[#173c24] hover:bg-green-50 rounded-2xl px-5 py-4 font-semibold shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <motion.div
                  animate={seeding ? { rotate: 360 } : {}}
                  transition={{
                    duration: 1,
                    repeat: seeding ? Infinity : 0,
                    ease: "linear",
                  }}
                >
                  <RefreshCw size={19} />
                </motion.div>

                {seeding ? "Generating..." : "Generate Forecast"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-start gap-3"
          >
            <AlertCircle size={21} className="mt-0.5 flex-shrink-0" />

            <div>
              <p className="font-semibold">Unable to load forecast</p>

              <p className="text-sm mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {/* EMPTY STATE */}

        {forecast.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-green-100 rounded-[32px] p-10 sm:p-16 text-center shadow-xl shadow-green-950/5"
          >
            <div className="w-20 h-20 mx-auto rounded-[28px] bg-lime-100 flex items-center justify-center">
              <ChartNoAxesCombined size={36} className="text-green-700" />
            </div>

            <p className="text-green-600 text-sm font-semibold uppercase tracking-wider mt-7">
              Market Intelligence
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
              No forecast data available
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mt-3">
              Generate forecast data to see AI-powered demand predictions and
              market insights for agricultural products.
            </p>

            <motion.button
              onClick={handleSeedForecast}
              disabled={seeding}
              whileHover={!seeding ? { y: -3 } : {}}
              whileTap={!seeding ? { scale: 0.97 } : {}}
              className="inline-flex items-center gap-2 mt-7 bg-[#0b3d20] hover:bg-[#14532d] text-white px-6 py-3.5 rounded-2xl font-semibold transition disabled:opacity-60"
            >
              <RefreshCw size={19} className={seeding ? "animate-spin" : ""} />

              {seeding ? "Generating..." : "Generate Forecast"}
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* STATISTICS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
              {/* AVERAGE */}

              <motion.div
                data-forecast-stat
                whileHover={{ y: -6 }}
                className="bg-white rounded-[28px] border border-green-50 p-6 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <BarChart3 size={23} className="text-green-700" />
                  </div>

                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    Average
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-gray-500 text-sm">Average Demand</p>

                  <p className="text-4xl font-bold text-[#173c24] mt-2">
                    {averageDemand}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">units predicted</p>
                </div>
              </motion.div>

              {/* PEAK */}

              <motion.div
                data-forecast-stat
                whileHover={{ y: -6 }}
                className="bg-lime-200 rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#173c24] text-lime-200 flex items-center justify-center">
                    <Target size={23} />
                  </div>

                  <ArrowUpRight size={20} className="text-[#31543b]" />
                </div>

                <div className="mt-7">
                  <p className="text-[#52735a] text-sm font-medium">
                    Peak Demand
                  </p>

                  <p className="text-4xl font-bold text-[#173c24] mt-2">
                    {highestDemand}
                  </p>

                  <p className="text-sm text-[#52735a] mt-2">
                    maximum expected demand
                  </p>
                </div>
              </motion.div>

              {/* TREND */}

              <motion.div
                data-forecast-stat
                whileHover={{ y: -6 }}
                className="bg-white rounded-[28px] border border-green-50 p-6 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    {getTrendIcon(latestForecast?.trend)}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getTrendClass(
                      latestForecast?.trend,
                    )}`}
                  >
                    {getTrendIcon(latestForecast?.trend)}

                    {latestForecast?.trend || "STABLE"}
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-gray-500 text-sm">Latest Trend</p>

                  <p className="text-2xl font-bold text-[#173c24] mt-3">
                    {getTrendLabel(latestForecast?.trend)}
                  </p>

                  <p className="text-sm text-gray-400 mt-3">
                    Based on latest prediction
                  </p>
                </div>
              </motion.div>

              {/* CONFIDENCE */}

              <motion.div
                data-forecast-stat
                whileHover={{ y: -6 }}
                className="bg-[#173c24] text-white rounded-[28px] p-6 shadow-xl shadow-green-950/10"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <CheckCircle2 size={23} className="text-lime-300" />
                  </div>

                  <span className="text-xs font-semibold text-lime-300">
                    AI Score
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-green-200 text-sm">Forecast Confidence</p>

                  <p className="text-4xl font-bold mt-2">{confidence}%</p>

                  <div className="mt-5 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{
                        duration: 1.2,
                        delay: 0.5,
                      }}
                      className="h-full bg-lime-300 rounded-full"
                    />
                  </div>

                  <p className="text-xs text-green-200 mt-3">
                    prediction reliability
                  </p>
                </div>
              </motion.div>
            </div>

            {/* AI INSIGHT */}

            <div
              data-forecast-section
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-7"
            >
              <div className="lg:col-span-8 bg-white rounded-[30px] border border-green-100 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <motion.div
                    animate={{
                      rotate: [0, 4, -4, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-14 h-14 rounded-2xl bg-lime-100 flex items-center justify-center flex-shrink-0"
                  >
                    <Brain size={27} className="text-green-700" />
                  </motion.div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
                          Smart Recommendation
                        </p>

                        <h2 className="text-2xl font-bold text-[#173c24] mt-1">
                          AI Demand Insight
                        </h2>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed mt-5">
                      {latestForecast?.trend === "UP"
                        ? "Demand is expected to increase. Farmers can consider increasing supply to meet upcoming market demand."
                        : latestForecast?.trend === "DOWN"
                          ? "Demand is expected to decrease. Farmers should avoid overproduction and plan inventory carefully."
                          : "Demand is expected to remain stable. Maintain regular production and inventory levels."}
                    </p>

                    {recommendedSupply > 0 && (
                      <div className="inline-flex items-center gap-3 mt-6 bg-green-50 border border-green-100 rounded-2xl px-5 py-4">
                        <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center">
                          <Leaf size={19} />
                        </div>

                        <div>
                          <p className="text-xs text-green-600 font-semibold">
                            RECOMMENDED SUPPLY
                          </p>

                          <p className="text-lg font-bold text-[#173c24]">
                            {recommendedSupply} units
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SIDE SUMMARY */}

              <div className="lg:col-span-4 bg-[#0b3d20] text-white rounded-[30px] p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-lime-300/10 blur-2xl" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center">
                    <Activity size={23} />
                  </div>

                  <p className="text-green-200 text-sm mt-7">Forecast Period</p>

                  <h3 className="text-3xl font-bold mt-2">
                    {forecast.length} Days
                  </h3>

                  <p className="text-green-100/70 text-sm mt-3">
                    AI predictions available for upcoming agricultural demand.
                  </p>

                  <div className="mt-7 pt-5 border-t border-white/10">
                    <p className="text-xs text-green-300 uppercase tracking-wider">
                      Current Direction
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-lime-300 font-semibold">
                      {getTrendIcon(latestForecast?.trend)}

                      {latestForecast?.trend || "STABLE"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI MARKET PRICE PREDICTION */}

            <div
              data-forecast-section
              className="relative overflow-hidden bg-white rounded-[30px] border border-green-100 p-6 sm:p-8 lg:p-9 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition mb-7"
            >
              {/* Background decoration */}
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-lime-100/60 blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-24 w-56 h-56 rounded-full bg-green-100/50 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      className="w-14 h-14 rounded-2xl bg-[#0b3d20] text-lime-300 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-950/10"
                    >
                      <ChartNoAxesCombined size={27} />
                    </motion.div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
                          AI Market Intelligence
                        </p>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-green-700 text-xs font-semibold">
                          <Sparkles size={13} />
                          ML Powered
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-1">
                        Predict Market Price
                      </h2>

                      <p className="text-gray-500 text-sm mt-2 max-w-xl">
                        Get an AI-based estimate of the upcoming market price
                        using historical agricultural market data.
                      </p>
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="flex items-center gap-3 bg-[#f4f7f1] border border-green-100 rounded-2xl px-4 py-3">
                    <div className="w-10 h-10 rounded-xl bg-lime-200 flex items-center justify-center text-[#173c24]">
                      <Leaf size={19} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Prediction For</p>
                      <p className="text-sm font-bold text-[#173c24]">
                        Tomato • Bhagalpur
                      </p>
                    </div>
                  </div>
                </div>

                {/* PREDICT BUTTON */}
                <div className="mt-7">
                  <motion.button
                    onClick={handlePricePrediction}
                    disabled={priceLoading}
                    whileHover={!priceLoading ? { y: -2, scale: 1.01 } : {}}
                    whileTap={!priceLoading ? { scale: 0.98 } : {}}
                    className="inline-flex items-center justify-center gap-3 bg-[#0b3d20] hover:bg-[#14532d] text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-green-950/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {priceLoading ? (
                      <>
                        <RefreshCw size={19} className="animate-spin" />
                        Predicting Market Price...
                      </>
                    ) : (
                      <>
                        <Brain size={19} />
                        Predict Market Price
                        <ArrowUpRight size={18} />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* ERROR */}
                {priceError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4"
                  >
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />

                    <div>
                      <p className="font-semibold text-sm">
                        Unable to generate prediction
                      </p>

                      <p className="text-sm mt-1">{priceError}</p>
                    </div>
                  </motion.div>
                )}

                {/* RESULTS */}
                {pricePrediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-7"
                  >
                    {/* Result heading */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-green-600 text-xs font-semibold uppercase tracking-wider">
                          Prediction Result
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Latest AI-generated market estimate
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-xs font-semibold">
                        <CheckCircle2 size={15} />
                        Prediction Ready
                      </div>
                    </div>

                    {/* RESULT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* LAST PRICE */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-[#f4f7f1] border border-green-100 rounded-[24px] p-5 transition shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-green-700 shadow-sm">
                            <BarChart3 size={21} />
                          </div>

                          <span className="text-xs font-semibold text-gray-400">
                            Historical
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-6">
                          Last Recorded Price
                        </p>

                        <p className="text-3xl font-bold text-[#173c24] mt-2">
                          ₹{pricePrediction.lastRecordedPrice}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          per quintal
                        </p>
                      </motion.div>

                      {/* PREDICTED PRICE */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="relative overflow-hidden bg-[#0b3d20] text-white rounded-[24px] p-5 shadow-lg shadow-green-950/10"
                      >
                        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-lime-300/10 blur-2xl" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between">
                            <div className="w-11 h-11 rounded-xl bg-lime-300 text-[#173c24] flex items-center justify-center">
                              <TrendingUp size={21} />
                            </div>

                            <span className="text-xs font-semibold text-lime-300">
                              AI Prediction
                            </span>
                          </div>

                          <p className="text-green-200 text-sm mt-6">
                            Predicted Market Price
                          </p>

                          <p className="text-3xl font-bold text-lime-300 mt-2">
                            ₹{pricePrediction.predictedPrice}
                          </p>

                          <p className="text-xs text-green-200/70 mt-1">
                            per quintal
                          </p>
                        </div>
                      </motion.div>

                      {/* DATE */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-lime-100 border border-lime-200 rounded-[24px] p-5 transition shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-11 h-11 rounded-xl bg-[#173c24] text-lime-200 flex items-center justify-center">
                            <Target size={21} />
                          </div>

                          <span className="text-xs font-semibold text-green-700">
                            Forecast
                          </span>
                        </div>

                        <p className="text-sm text-green-700/70 mt-6">
                          Prediction Date
                        </p>

                        <p className="text-xl sm:text-2xl font-bold text-[#173c24] mt-2">
                          {pricePrediction.predictionDate}
                        </p>

                        <p className="text-xs text-green-700/60 mt-1">
                          based on historical market data
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            {/* CHART */}

            <div
              data-forecast-section
              className="bg-white rounded-[30px] border border-green-100 p-6 sm:p-8 shadow-sm mb-7"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
                <div>
                  <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
                    Demand Analytics
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-1">
                    Predicted Demand
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    Track how agricultural demand is expected to change.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-lime-100 rounded-2xl px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-[#173c24] text-lime-200 flex items-center justify-center">
                    <TrendingUp size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-[#52735a]">Peak Forecast</p>

                    <p className="font-bold text-[#173c24]">
                      {highestDemand} units
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-[320px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#dfe9dc" />

                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #dcfce7",
                        boxShadow: "0 10px 30px rgba(20, 83, 45, 0.10)",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="demand"
                      stroke="#15803d"
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        fill: "#bef264",
                        stroke: "#15803d",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* FORECAST CARDS */}

            <div data-forecast-section>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
                <div>
                  <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
                    Daily Predictions
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-1">
                    Forecast Timeline
                  </h2>
                </div>

                <p className="text-gray-500 text-sm">
                  {forecast.length} predictions available
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {forecast.map((item, index) => (
                  <motion.div
                    key={item.date}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                    }}
                    whileHover={{
                      y: -7,
                      scale: 1.01,
                    }}
                    className="relative overflow-hidden bg-white border border-green-100 rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-lime-100/50 rounded-full blur-2xl" />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                          Forecast Date
                        </p>

                        <h2 className="text-xl font-bold text-[#173c24] mt-2">
                          {item.date}
                        </h2>
                      </div>

                      <motion.div
                        animate={
                          item.trend === "UP"
                            ? {
                                y: [0, -3, 0],
                              }
                            : {}
                        }
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold ${getTrendClass(
                          item.trend,
                        )}`}
                      >
                        {getTrendIcon(item.trend)}

                        <span>{item.trend || "STABLE"}</span>
                      </motion.div>
                    </div>

                    <div className="relative z-10 mt-8">
                      <p className="text-sm text-gray-500">Predicted Demand</p>

                      <p className="text-4xl font-bold text-[#173c24] mt-2">
                        {item.predictedDemand}
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        units expected
                      </p>
                    </div>

                    <div className="relative z-10 mt-7 pt-5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Market signal
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          item.trend === "UP"
                            ? "text-green-600"
                            : item.trend === "DOWN"
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {getTrendLabel(item.trend)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Forecast;
