import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  Navigation,
  AlertCircle,
  Route,
  Sparkles,
  CheckCircle2,
  Boxes,
  ArrowRight,
  CircleDot,
  Map,
  Gauge,
} from "lucide-react";
import RouteMap from "../components/RouteMap";
import { optimizeRoute, getBuyerOrders } from "../services/api";
import { useAuth } from "../context/AuthContext";

gsap.registerPlugin(ScrollTrigger);

export default function Logistics() {
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [route, setRoute] = useState(null);
  const [error, setError] = useState("");
  const [routeOptimized, setRouteOptimized] = useState(false);

  const { token, loading: authLoading } = useAuth();

  const pageRef = useRef(null);

  // ==========================================
  // LOAD BUYER ORDERS
  // ==========================================

  useEffect(() => {
    if (authLoading) return;

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        setError("");

        if (!token) {
          setOrdersLoading(false);
          setError("Please log in to view logistics.");
          return;
        }

        const data = await getBuyerOrders(token);

        console.log("BUYER ORDERS RESPONSE:", data);

        const fetchedOrders = data?.orders || [];

        console.log("ORDERS TO SET:", fetchedOrders);

        setOrders(fetchedOrders);

        if (fetchedOrders.length > 0) {
          setSelectedOrderId(fetchedOrders[0]._id);
        }
      } catch (err) {
        console.error("BUYER ORDERS ERROR:", err);

        setError(err?.response?.data?.message || "Failed to load orders.");
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [token, authLoading]);

  // ==========================================
  // GSAP PAGE ANIMATIONS
  // ==========================================

  useEffect(() => {
    if (ordersLoading || authLoading) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          "[data-logistics-header]",
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
          "[data-logistics-hero]",
          {
            opacity: 0,
            y: 45,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .fromTo(
          "[data-logistics-stat]",
          {
            opacity: 0,
            y: 30,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.35",
        );

      gsap.utils.toArray("[data-logistics-section]").forEach((section) => {
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
  }, [ordersLoading, authLoading, orders.length]);

  // ==========================================
  // OPTIMIZE ROUTE
  // ==========================================

  const handleOptimize = async () => {
    try {
      setLoading(true);
      setError("");

      if (!orders.length) {
        setError("No buyer orders available for route optimization.");
        return;
      }

      if (!token) {
        setError("Please log in to optimize the route.");
        return;
      }

      const order =
        orders.find((item) => item._id === selectedOrderId) || orders[0];

      if (!order?._id) {
        setError("Unable to identify the selected order.");
        return;
      }

      const orderId = order._id;

      console.log("LOGISTICS ORDER:", order);
      console.log("LOGISTICS ORDER ID:", orderId);

      // Backend now gets the actual farmer
      // and delivery coordinates directly
      // from the order.
      //
      // No frontend fallback coordinates are used.
      const data = await optimizeRoute(orderId, token);

      console.log("OPTIMIZED ROUTE RESPONSE:", data);

      if (!data?.success) {
        throw new Error(data?.message || "Route optimization failed.");
      }

      setRoute(data);
      setRouteOptimized(true);
    } catch (err) {
      console.error("ROUTE OPTIMIZATION ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to optimize the delivery route.",
      );

      setRoute(null);
      setRouteOptimized(false);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE ORDER SELECTION
  // ==========================================

  const handleOrderChange = (event) => {
    const orderId = event.target.value;

    setSelectedOrderId(orderId);

    setRoute(null);
    setRouteOptimized(false);
    setError("");
  };

  // ==========================================
  // ROUTE DATA
  // ==========================================

  const routePoints = route?.route || [];

  const totalDistanceKm =
    route?.totalDistanceKm ?? route?.data?.totalDistanceKm ?? null;

  const durationMinutes =
    route?.durationMinutes ?? route?.data?.durationMinutes ?? null;

  const formatDuration = (minutes) => {
    if (
      minutes === null ||
      minutes === undefined ||
      Number.isNaN(Number(minutes))
    ) {
      return "—";
    }

    const totalMinutes = Math.round(Number(minutes));

    const hours = Math.floor(totalMinutes / 60);

    const mins = totalMinutes % 60;

    if (hours === 0) {
      return `${mins} min`;
    }

    if (mins === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${mins} min`;
  };

  const estimatedTime =
    durationMinutes !== null ? formatDuration(durationMinutes) : null;

  console.log("DISTANCE:", totalDistanceKm);

  console.log("ROAD TRAVEL TIME:", durationMinutes);

  // ==========================================
  // CURRENT ORDER
  // ==========================================

  const currentOrder =
    orders.find((order) => order._id === selectedOrderId) || orders[0];

  const shipmentCount = orders.length;

  const activeShipments = orders.filter((order) =>
    ["CONFIRMED", "PICKED_UP", "IN_TRANSIT"].includes(order.status),
  ).length;

  const deliveredShipments = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (ordersLoading || authLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f1] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-4 border-green-100 border-t-[#173c24]"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <Truck size={27} className="text-green-600" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#173c24] mt-6">
            Loading Logistics
          </h2>

          <p className="text-gray-500 mt-2">
            Preparing your delivery network...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-[#f4f7f1] relative overflow-hidden p-4 sm:p-6 lg:p-8"
    >
      {/* BACKGROUND DECORATION */}

      <div className="absolute -top-40 -right-40 w-[550px] h-[550px] bg-lime-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -left-40 w-[550px] h-[550px] bg-green-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* ROAD-LIKE BACKGROUND DECORATION */}

      <div className="absolute top-1/3 -right-20 w-[500px] h-[120px] border-t-[3px] border-dashed border-green-200/40 rotate-[-20deg] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ======================================
            HEADER
        ====================================== */}

        <div
          data-logistics-header
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles size={16} />
              Smart Logistics Network
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173c24] mt-5">
              Delivery Intelligence
            </h1>

            <p className="text-gray-500 mt-3 max-w-xl">
              Optimize agricultural deliveries, reduce transportation distance,
              and move every shipment efficiently from farm to destination.
            </p>
          </div>

          <motion.button
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleOptimize}
            disabled={loading || ordersLoading || !orders.length}
            className="inline-flex items-center justify-center gap-3 bg-[#173c24] hover:bg-[#14532d] disabled:bg-gray-400 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl shadow-green-950/10 transition"
          >
            <motion.div
              animate={
                loading
                  ? {
                      rotate: 360,
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: loading ? Infinity : 0,
                ease: "linear",
              }}
            >
              <Navigation size={20} />
            </motion.div>

            {loading
              ? "Optimizing Route..."
              : routeOptimized
                ? "Route Optimized ✓"
                : "Optimize Route"}
          </motion.button>
        </div>

        {/* ======================================
            HERO
        ====================================== */}

        <section
          data-logistics-hero
          className="relative overflow-hidden bg-[#173c24] rounded-[32px] p-7 sm:p-10 lg:p-12 shadow-2xl shadow-green-950/10"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-lime-300/10 rounded-full blur-3xl" />

          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* LEFT */}

            <div className="lg:col-span-7 text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-lime-200 px-4 py-2 rounded-full text-sm">
                <Route size={16} />
                AI-Assisted Route Planning
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-7">
                Smarter routes.
                <span className="block text-lime-300">Faster deliveries.</span>
              </h2>

              <p className="text-green-100/80 text-base sm:text-lg leading-relaxed mt-6 max-w-2xl">
                Select a shipment and let KisanDirect optimize the journey
                between pickup and delivery points for a more efficient
                agricultural supply chain.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <HeroMetric title="Shipments" value={shipmentCount} />

                <HeroMetric title="Active" value={activeShipments} />

                <HeroMetric title="Delivered" value={deliveredShipments} />
              </div>
            </div>

            {/* RIGHT */}

            <div className="lg:col-span-5">
              <motion.div
                whileHover={{
                  y: -8,
                }}
                className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-7 overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-lime-300/10 rounded-full" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center shadow-lg">
                      <Truck size={28} />
                    </div>

                    <motion.div
                      animate={{
                        x: [0, 6, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="text-lime-200" />
                    </motion.div>
                  </div>

                  <p className="text-green-200 text-sm mt-8">
                    Logistics Status
                  </p>

                  <h3 className="text-3xl sm:text-4xl text-white font-bold mt-2">
                    {routeOptimized ? "Route Ready" : "Ready to Plan"}
                  </h3>

                  <p className="text-green-100/70 text-sm mt-3">
                    {routeOptimized
                      ? "Your optimized route is ready to review."
                      : "Choose a shipment and optimize its delivery path."}
                  </p>

                  <div className="mt-7 pt-6 border-t border-white/10 grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-green-200 text-xs">Distance</p>

                      <p className="text-xl font-bold text-white mt-1">
                        {totalDistanceKm !== null
                          ? `${totalDistanceKm} km`
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-green-200 text-xs">Estimated Time</p>

                      <p className="text-xl font-bold text-white mt-1">
                        {estimatedTime || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-7 flex items-start gap-4 bg-red-50 border border-red-100 text-red-700 px-5 py-5 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} />
            </div>

            <div>
              <p className="font-bold">Logistics Alert</p>

              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {/* ======================================
            CURRENT SHIPMENT
        ====================================== */}

        <section
          data-logistics-section
          className="mt-8 bg-white rounded-[32px] border border-green-100 shadow-sm p-6 sm:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-7">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-lime-100 text-green-700 flex items-center justify-center">
                  <Package size={23} />
                </div>

                <div>
                  <p className="text-green-600 text-xs font-bold uppercase tracking-wider">
                    Shipment Control
                  </p>

                  <h2 className="text-2xl font-bold text-[#173c24]">
                    Current Shipment
                  </h2>
                </div>
              </div>

              <p className="text-gray-500 mt-4 max-w-xl">
                Select a buyer order to analyze pickup points and optimize the
                delivery route.
              </p>
            </div>

            {currentOrder && <StatusBadge status={currentOrder.status} />}
          </div>

          {ordersLoading ? (
            <div className="mt-8 text-gray-500">Loading orders...</div>
          ) : !currentOrder ? (
            <div className="mt-8 text-center bg-[#f7faf5] rounded-3xl p-12">
              <Package size={38} className="mx-auto text-green-600" />

              <p className="font-bold text-[#173c24] mt-5">
                No orders available
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Buyer shipments will appear here when orders are available.
              </p>
            </div>
          ) : (
            <>
              {/* SHIPMENT SELECTOR */}

              {orders.length > 1 && (
                <div className="mt-8">
                  <label className="block text-sm font-semibold text-[#173c24] mb-3">
                    Select Shipment
                  </label>

                  <div className="relative">
                    <Package
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none"
                    />

                    <select
                      value={selectedOrderId}
                      onChange={handleOrderChange}
                      className="w-full appearance-none border border-green-100 rounded-2xl pl-12 pr-5 py-4 bg-[#f9fbf7] text-[#173c24] font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {orders.map((order) => (
                        <option key={order._id} value={order._id}>
                          Order #{order._id?.slice(-6).toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* SHIPMENT DETAILS */}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mt-8">
                <ShipmentDetail
                  icon={Package}
                  label="Order ID"
                  value={`#${currentOrder._id?.slice(-8)}`}
                />

                <ShipmentDetail
                  icon={Boxes}
                  label="Product"
                  value={
                    currentOrder.items?.[0]?.product?.cropName ||
                    currentOrder.cropName ||
                    "Agricultural Product"
                  }
                />

                <ShipmentDetail
                  icon={Gauge}
                  label="Quantity"
                  value={
                    currentOrder.items?.reduce(
                      (total, item) => total + (item.quantity || 0),
                      0,
                    ) ||
                    currentOrder.quantity ||
                    0
                  }
                />

                <ShipmentDetail
                  icon={MapPin}
                  label="Destination"
                  value={currentOrder.deliveryLocation || "Delivery Location"}
                />

                <ShipmentDetail
                  icon={Truck}
                  label="Status"
                  value={currentOrder.status || "PENDING"}
                />
              </div>
            </>
          )}
        </section>

        {/* ======================================
            STAT CARDS
        ====================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
          <StatCard
            icon={MapPin}
            title="Total Distance"
            value={totalDistanceKm !== null ? `${totalDistanceKm} km` : "—"}
            description="Optimized road distance"
          />

          <StatCard
            icon={Clock}
            title="Estimated Time"
            value={estimatedTime || "—"}
            description="Actual road travel duration"
          />

          <StatCard
            icon={Truck}
            title="Active Shipments"
            value={activeShipments}
            description="Currently in fulfillment"
          />

          <StatCard
            icon={Package}
            title="Total Shipments"
            value={`${shipmentCount}`}
            description="Buyer orders available"
            dark
          />
        </section>

        {/* ======================================
            ROUTE MANAGEMENT
        ====================================== */}

        <section data-logistics-section className="mt-8">
          <div className="mb-6">
            <p className="text-green-600 text-sm font-bold uppercase tracking-wider">
              Route Intelligence
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
              Plan the Journey
            </h2>

            <p className="text-gray-500 mt-2">
              Review optimized stops and visualize the complete delivery route.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* ====================================
                ROUTE STOPS
            ==================================== */}

            <div className="xl:col-span-2 bg-white rounded-[32px] border border-green-100 shadow-sm p-6 sm:p-7 min-h-[520px]">
              <div className="flex items-center justify-between gap-4 mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                    <Route size={21} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#173c24]">
                      Optimized Route
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                      Delivery stop sequence
                    </p>
                  </div>
                </div>

                {routeOptimized && (
                  <motion.div
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center"
                  >
                    <CheckCircle2 size={20} />
                  </motion.div>
                )}
              </div>

              {/* ROUTE SUMMARY */}

              {routeOptimized && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="grid grid-cols-2 gap-4 mb-7"
                >
                  <div className="bg-[#f4f8f2] rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <MapPin size={16} />

                      <span className="text-xs font-semibold">Distance</span>
                    </div>

                    <p className="text-xl font-bold text-[#173c24] mt-3">
                      {totalDistanceKm ?? 0} km
                    </p>
                  </div>

                  <div className="bg-[#f4f8f2] rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <Clock size={16} />

                      <span className="text-xs font-semibold">Time</span>
                    </div>

                    <p className="text-xl font-bold text-[#173c24] mt-3">
                      {estimatedTime || "—"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* EMPTY ROUTE */}

              {routePoints.length === 0 ? (
                <div className="flex items-center justify-center min-h-[350px]">
                  <div className="text-center max-w-xs">
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mx-auto w-20 h-20 bg-lime-100 rounded-[28px] flex items-center justify-center"
                    >
                      <Navigation size={32} className="text-green-700" />
                    </motion.div>

                    <h3 className="font-bold text-[#173c24] text-lg mt-6">
                      Ready to optimize
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mt-3">
                      Select a shipment and generate an optimized route to see
                      the complete delivery journey.
                    </p>

                    <motion.button
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={handleOptimize}
                      disabled={loading || !orders.length}
                      className="mt-6 inline-flex items-center gap-2 bg-[#173c24] text-white px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                      <Navigation size={17} />
                      Optimize Now
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {routePoints.map((point, index) => (
                    <motion.div
                      key={`${point.latitude}-${point.longitude}-${index}`}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.12,
                      }}
                      className="flex items-stretch gap-4"
                    >
                      {/* TIMELINE */}

                      <div className="flex flex-col items-center">
                        <motion.div
                          whileHover={{
                            scale: 1.12,
                          }}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-green-700 text-white"
                              : index === routePoints.length - 1
                                ? "bg-lime-300 text-[#173c24]"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {index + 1}
                        </motion.div>

                        {index < routePoints.length - 1 && (
                          <div className="w-0.5 flex-1 min-h-[48px] bg-green-100 my-2" />
                        )}
                      </div>

                      {/* STOP */}

                      <motion.div
                        whileHover={{
                          x: 4,
                        }}
                        className="flex-1 pb-6 pt-1"
                      >
                        <div className="bg-[#f8faf7] border border-green-50 rounded-2xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-bold text-[#173c24]">
                                {point.location || "Route Stop"}
                              </p>

                              <p className="text-sm text-gray-500 mt-2">
                                {index === 0
                                  ? "Pickup Point"
                                  : index === routePoints.length - 1
                                    ? "Final Delivery"
                                    : `Transit Stop ${index}`}
                              </p>
                            </div>

                            <CircleDot size={18} className="text-green-600" />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* ====================================
                MAP
            ==================================== */}

            <div className="xl:col-span-3 bg-white rounded-[32px] border border-green-100 shadow-sm overflow-hidden min-h-[520px] relative">
              <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-md border border-green-100 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lime-100 text-green-700 flex items-center justify-center">
                  <Map size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#173c24]">Route Map</p>

                  <p className="text-xs text-gray-500">
                    Live road route visualization
                  </p>
                </div>
              </div>

              {!routeOptimized && (
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center bg-[#f4f7f1]/40">
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className="bg-white/90 backdrop-blur-xl border border-green-100 rounded-3xl p-6 text-center shadow-xl"
                  >
                    <Truck size={30} className="mx-auto text-green-600" />

                    <p className="font-bold text-[#173c24] mt-3">
                      Awaiting Route Optimization
                    </p>

                    <p className="text-gray-500 text-sm mt-2">
                      Your optimized journey will appear here.
                    </p>
                  </motion.div>
                </div>
              )}

              <RouteMap route={routePoints} geometry={route?.geometry} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// ==============================================
// HERO METRIC
// ==============================================

function HeroMetric({ title, value }) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 min-w-[110px]"
    >
      <p className="text-green-200 text-xs">{title}</p>

      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </motion.div>
  );
}

// ==============================================
// SHIPMENT DETAIL
// ==============================================

function ShipmentDetail({ icon: Icon, label, value }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="bg-[#f8faf7] border border-green-50 rounded-2xl p-5"
    >
      <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
        <Icon size={19} />
      </div>

      <p className="text-xs text-gray-500 mt-5">{label}</p>

      <p className="font-bold text-[#173c24] mt-2 break-words">{value}</p>
    </motion.div>
  );
}

// ==============================================
// STATUS BADGE
// ==============================================

function StatusBadge({ status }) {
  const config = {
    DELIVERED: {
      label: "Delivered",
      className: "bg-green-100 text-green-700",
    },

    IN_TRANSIT: {
      label: "In Transit",
      className: "bg-blue-100 text-blue-700",
    },

    PICKED_UP: {
      label: "Picked Up",
      className: "bg-purple-100 text-purple-700",
    },

    CONFIRMED: {
      label: "Confirmed",
      className: "bg-yellow-100 text-yellow-700",
    },

    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700",
    },

    PENDING: {
      label: "Pending",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const current = config[status] || {
    label: status || "PENDING",
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.04,
      }}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold ${current.className}`}
    >
      <CircleDot size={16} />
      {current.label}
    </motion.div>
  );
}

// ==============================================
// STAT CARD COMPONENT
// ==============================================

function StatCard({ icon: Icon, title, value, description, dark = false }) {
  return (
    <motion.div
      data-logistics-stat
      whileHover={{
        y: -7,
        scale: 1.01,
      }}
      className={
        dark
          ? "bg-[#173c24] rounded-[28px] p-6 text-white shadow-xl shadow-green-950/10"
          : "bg-white border border-green-50 rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
      }
    >
      <div className="flex items-start justify-between">
        <div
          className={
            dark
              ? "w-12 h-12 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center"
              : "w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"
          }
        >
          <Icon size={22} />
        </div>

        <Truck
          size={18}
          className={dark ? "text-lime-200" : "text-green-300"}
        />
      </div>

      <p
        className={
          dark ? "text-green-200 text-sm mt-8" : "text-gray-500 text-sm mt-8"
        }
      >
        {title}
      </p>

      <p
        className={
          dark
            ? "text-4xl font-bold mt-2"
            : "text-4xl font-bold text-[#173c24] mt-2"
        }
      >
        {value}
      </p>

      <p
        className={
          dark ? "text-green-200/70 text-sm mt-2" : "text-gray-400 text-sm mt-2"
        }
      >
        {description}
      </p>
    </motion.div>
  );
}
