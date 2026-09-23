import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Sparkles,
  Boxes,
  TrendingUp,
  IndianRupee,
  ClipboardList,
  ArrowRight,
  Leaf,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getFarmerOrders, updateOrderStatus } from "../../services/api";

import AgricultureParticles from "../../components/AgricultureParticles";

gsap.registerPlugin(ScrollTrigger);

export default function FarmerOrders() {
  const { token, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const pageRef = useRef(null);

  // ==============================================
  // LOAD ORDERS
  // Existing backend functionality preserved
  // ==============================================

  useEffect(() => {
    if (authLoading) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          setError("Please log in to view your orders.");
          return;
        }

        const data = await getFarmerOrders(token);

        console.log("FARMER ORDERS RESPONSE:", data);

        setOrders(data?.orders || []);
      } catch (err) {
        console.error("FARMER ORDERS ERROR:", err);

        setError(
          err?.response?.data?.message || "Failed to load farmer orders.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, authLoading]);

  // ==============================================
  // GSAP ANIMATIONS
  // ==============================================

  useEffect(() => {
    if (loading || authLoading) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          "[data-farmer-orders-header]",
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
          "[data-farmer-orders-hero]",
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
          "[data-farmer-order-stat]",
          {
            opacity: 0,
            y: 30,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.35",
        );

      gsap.utils
        .toArray("[data-farmer-orders-section]")
        .forEach((section) => {
          gsap.fromTo(
            section,
            {
              opacity: 0,
              y: 50,
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
  }, [loading, authLoading, orders.length]);

  // ==============================================
  // UPDATE ORDER STATUS
  // Existing backend functionality preserved
  // ==============================================

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);
      setError("");

      const data = await updateOrderStatus(orderId, status, token);

      console.log("STATUS UPDATE RESPONSE:", data);

      // Update the order directly in the UI
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status,
              }
            : order,
        ),
      );
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);

      setError(
        err?.response?.data?.message || "Failed to update order status.",
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ==============================================
  // ORDER STATISTICS
  // Calculated only from existing orders data
  // ==============================================

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      ["CONFIRMED", "PICKED_UP", "IN_TRANSIT"].includes(order.status),
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;

  const totalOrderValue = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0,
  );

  // ==============================================
  // LOADING
  // ==============================================

  if (loading || authLoading) {
    return (
      <main className="min-h-screen bg-[#f4f7f1] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-4 border-green-100 border-t-[#0b3d20]"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={25} className="text-green-600" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#173c24] mt-6">
            Loading Farmer Orders
          </h2>

          <p className="text-gray-500 mt-2">
            Preparing your incoming orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-[#f4f7f1] relative overflow-hidden p-4 sm:p-6 lg:p-8"
    >
      {/* THREE.JS BACKGROUND */}

      <AgricultureParticles
        className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
        opacity={0.1}
      />

      {/* BACKGROUND DECORATION */}

      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-lime-200/20 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-green-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div
          data-farmer-orders-header
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles size={16} />

              Farmer Order Management
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173c24] mt-5">
              Manage Your Orders
            </h1>

            <p className="text-gray-500 mt-3 max-w-xl">
              Track incoming buyer orders, manage deliveries, and keep your
              agricultural business moving forward.
            </p>
          </div>

          <motion.div
            whileHover={{
              y: -3,
            }}
            className="inline-flex items-center gap-3 bg-white border border-green-100 px-5 py-4 rounded-2xl shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-lime-100 text-green-700 flex items-center justify-center">
              <Boxes size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Incoming Orders
              </p>

              <p className="font-bold text-[#173c24]">
                {orders.length} Total
              </p>
            </div>
          </motion.div>
        </div>

        {/* ========================================= */}
        {/* HERO */}
        {/* ========================================= */}

        <section
          data-farmer-orders-hero
          className="relative overflow-hidden bg-[#0b3d20] rounded-[32px] p-7 sm:p-10 lg:p-12 shadow-2xl shadow-green-950/10"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-green-400/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* HERO LEFT */}

            <div className="lg:col-span-7 text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-lime-200 px-4 py-2 rounded-full text-sm">
                <Leaf size={16} />

                Your Farm Business
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-7">
                Every order is
                <span className="block text-lime-300">
                  an opportunity to grow.
                </span>
              </h2>

              <p className="text-green-100/80 text-base sm:text-lg leading-relaxed mt-6 max-w-2xl">
                Manage your buyer orders efficiently, prepare agricultural
                produce, and update delivery progress from one place.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                  <p className="text-green-200 text-xs">
                    Pending
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {pendingOrders}
                  </p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                  <p className="text-green-200 text-xs">
                    Active
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {activeOrders}
                  </p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                  <p className="text-green-200 text-xs">
                    Delivered
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {deliveredOrders}
                  </p>
                </div>
              </div>
            </div>

            {/* HERO RIGHT */}

            <div className="lg:col-span-5">
              <motion.div
                whileHover={{
                  y: -7,
                }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 sm:p-7 text-white"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center shadow-lg">
                    <IndianRupee size={27} />
                  </div>

                  <TrendingUp
                    size={21}
                    className="text-lime-200"
                  />
                </div>

                <p className="text-green-200 text-sm mt-8">
                  Total Order Value
                </p>

                <h3 className="text-4xl sm:text-5xl font-bold mt-2">
                  ₹{totalOrderValue.toLocaleString("en-IN")}
                </h3>

                <p className="text-green-100/70 text-sm mt-2">
                  Based on your current incoming orders
                </p>

                <div className="mt-7 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-green-200 text-sm">
                      Order Completion
                    </span>

                    <span className="text-lime-200 font-bold">
                      {orders.length > 0
                        ? Math.round(
                            (deliveredOrders / orders.length) * 100,
                          )
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="mt-3 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${
                          orders.length > 0
                            ? (deliveredOrders / orders.length) * 100
                            : 0
                        }%`,
                      }}
                      transition={{
                        duration: 1.2,
                        ease: "easeOut",
                      }}
                      className="h-full bg-lime-300 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* STATISTICS */}
        {/* ========================================= */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
          <OrderStat
            icon={<Boxes size={23} />}
            title="Total Orders"
            value={orders.length}
            description="All buyer orders"
            badge="Orders"
          />

          <OrderStat
            icon={<Clock size={23} />}
            title="Pending Orders"
            value={pendingOrders}
            description="Waiting for confirmation"
            badge="Action"
          />

          <OrderStat
            icon={<Truck size={23} />}
            title="Active Orders"
            value={activeOrders}
            description="Currently being fulfilled"
            badge="Active"
          />

          <OrderStat
            icon={<CheckCircle size={23} />}
            title="Delivered"
            value={deliveredOrders}
            description="Successfully completed"
            badge="Complete"
            dark
          />
        </section>

        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

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
            className="mt-8 flex items-start gap-4 bg-red-50 border border-red-100 text-red-700 p-5 rounded-2xl"
          >
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle size={20} />
            </div>

            <div>
              <p className="font-bold">
                Something went wrong
              </p>

              <p className="text-red-600/80 text-sm mt-1">
                {error}
              </p>
            </div>
          </motion.div>
        )}

        {/* ========================================= */}
        {/* NO ORDERS */}
        {/* ========================================= */}

        {!error && orders.length === 0 && (
          <section
            data-farmer-orders-section
            className="mt-8 bg-white rounded-[32px] border border-green-100 p-10 sm:p-16 text-center shadow-sm"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 mx-auto rounded-[28px] bg-lime-100 flex items-center justify-center"
            >
              <Package size={38} className="text-green-700" />
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-7">
              No orders yet
            </h2>

            <p className="text-gray-500 max-w-lg mx-auto mt-3">
              Orders containing your agricultural products will appear here
              when buyers start purchasing from you.
            </p>
          </section>
        )}

        {/* ========================================= */}
        {/* ORDER MANAGEMENT INTRO */}
        {/* ========================================= */}

        {!error && orders.length > 0 && (
          <section
            data-farmer-orders-section
            className="mt-8 bg-white rounded-[32px] border border-green-100 shadow-sm p-7 sm:p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-7">

              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 flex-shrink-0 rounded-[22px] bg-lime-100 flex items-center justify-center"
              >
                <Truck size={30} className="text-green-700" />
              </motion.div>

              <div className="flex-1">
                <p className="text-green-600 text-sm font-bold uppercase tracking-wider">
                  Fulfillment Process
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
                  Manage every order from farm to delivery
                </h2>

                <p className="text-gray-500 leading-relaxed mt-3">
                  Confirm incoming orders, prepare your produce, update pickup
                  information, and mark deliveries as completed.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-2 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-semibold">
                  Pending
                </span>

                <span className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold">
                  Confirmed
                </span>

                <span className="px-3 py-2 rounded-xl bg-orange-50 text-orange-700 text-sm font-semibold">
                  In Transit
                </span>

                <span className="px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-semibold">
                  Delivered
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ========================================= */}
        {/* ORDERS */}
        {/* ========================================= */}

        {!error && orders.length > 0 && (
          <section
            data-farmer-orders-section
            className="mt-8 mb-6"
          >
            <div className="mb-6">
              <p className="text-green-600 text-sm font-bold uppercase tracking-wider">
                Incoming Buyer Orders
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
                Orders to Manage
              </h2>

              <p className="text-gray-500 mt-2">
                Update order progress as you prepare and deliver your
                agricultural products.
              </p>
            </div>

            <div className="space-y-6">
              {orders.map((order, orderIndex) => {
                const totalQuantity =
                  order.items?.reduce(
                    (total, item) => total + (item.quantity || 0),
                    0,
                  ) || 0;

                const farmerItems =
                  order.items?.filter((item) => item.farmer) || [];

                return (
                  <motion.div
                    key={order._id}
                    initial={{
                      opacity: 0,
                      y: 35,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: orderIndex * 0.06,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    className="bg-white rounded-[32px] border border-green-100 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition overflow-hidden"
                  >
                    {/* ORDER HEADER */}

                    <div className="relative overflow-hidden bg-[#f7faf5] p-6 sm:p-7">
                      <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-lime-100/60" />

                      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#173c24] text-lime-200 flex items-center justify-center flex-shrink-0">
                            <Package size={25} />
                          </div>

                          <div>
                            <p className="text-xs text-green-600 font-bold uppercase tracking-wider">
                              Buyer Purchase
                            </p>

                            <h2 className="text-xl sm:text-2xl font-bold text-[#173c24] mt-1">
                              Order #{order._id?.slice(-8)}
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                              Manage your agricultural product delivery.
                            </p>
                          </div>
                        </div>

                        <motion.div
                          whileHover={{
                            scale: 1.05,
                          }}
                        >
                          <StatusBadge status={order.status} />
                        </motion.div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">

                      {/* ORDER DETAILS */}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* PRODUCTS */}

                        <div className="rounded-2xl bg-[#f7faf5] border border-green-50 p-5">
                          <div className="flex items-center gap-2">
                            <Package
                              size={18}
                              className="text-green-600"
                            />

                            <p className="text-sm text-gray-500">
                              Products
                            </p>
                          </div>

                          <div className="mt-4 space-y-2">
                            {farmerItems.length > 0 ? (
                              farmerItems.map((item, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{
                                    x: 3,
                                  }}
                                  className="flex items-center justify-between gap-3"
                                >
                                  <p className="font-semibold text-[#173c24]">
                                    {item.product?.cropName ||
                                      "Agricultural Product"}
                                  </p>

                                  <span className="text-sm bg-green-100 text-green-700 px-2.5 py-1 rounded-lg whitespace-nowrap">
                                    × {item.quantity}
                                  </span>
                                </motion.div>
                              ))
                            ) : (
                              <p className="font-semibold text-[#173c24]">
                                {totalQuantity} units
                              </p>
                            )}
                          </div>
                        </div>

                        {/* DELIVERY LOCATION */}

                        <div className="rounded-2xl bg-[#f7faf5] border border-green-50 p-5">
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={18}
                              className="text-green-600"
                            />

                            <p className="text-sm text-gray-500">
                              Delivery Location
                            </p>
                          </div>

                          <p className="font-semibold text-[#173c24] mt-4 flex items-start gap-2">
                            <MapPin
                              size={17}
                              className="text-green-600 flex-shrink-0 mt-0.5"
                            />

                            {order.deliveryLocation || "Not specified"}
                          </p>
                        </div>

                        {/* ORDER DATE */}

                        <div className="rounded-2xl bg-[#f7faf5] border border-green-50 p-5">
                          <div className="flex items-center gap-2">
                            <Clock
                              size={18}
                              className="text-green-600"
                            />

                            <p className="text-sm text-gray-500">
                              Order Date
                            </p>
                          </div>

                          <p className="font-semibold text-[#173c24] mt-4 flex items-center gap-2">
                            <Clock
                              size={17}
                              className="text-green-600"
                            />

                            {order.createdAt
                              ? new Date(
                                  order.createdAt,
                                ).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                      </div>

                      {/* ORDER VALUE + ACTION */}

                      <div className="border-t border-green-50 mt-6 pt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        {/* VALUE */}

                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-lime-100 text-green-700 flex items-center justify-center">
                            <IndianRupee size={22} />
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Order Value
                            </p>

                            <p className="text-2xl font-bold text-[#173c24]">
                              ₹
                              {Number(
                                order.totalAmount || 0,
                              ).toLocaleString("en-IN")}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {order.items?.length || 0} product
                              {order.items?.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>

                        {/* STATUS ACTIONS */}

                        <div className="flex flex-wrap gap-3">

                          {order.status === "PENDING" && (
                            <motion.button
                              whileHover={{
                                y: -3,
                                scale: 1.02,
                              }}
                              whileTap={{
                                scale: 0.97,
                              }}
                              onClick={() =>
                                handleStatusUpdate(
                                  order._id,
                                  "CONFIRMED",
                                )
                              }
                              disabled={
                                updatingOrder === order._id
                              }
                              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#173c24] text-white font-semibold hover:bg-[#14532d] disabled:opacity-50 transition"
                            >
                              {updatingOrder === order._id ? (
                                <>
                                  <Clock size={18} />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={18} />
                                  Confirm Order
                                </>
                              )}
                            </motion.button>
                          )}

                          {order.status === "CONFIRMED" && (
                            <motion.button
                              whileHover={{
                                y: -3,
                                scale: 1.02,
                              }}
                              whileTap={{
                                scale: 0.97,
                              }}
                              onClick={() =>
                                handleStatusUpdate(
                                  order._id,
                                  "PICKED_UP",
                                )
                              }
                              disabled={
                                updatingOrder === order._id
                              }
                              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#173c24] text-white font-semibold hover:bg-[#14532d] disabled:opacity-50 transition"
                            >
                              {updatingOrder === order._id ? (
                                <>
                                  <Clock size={18} />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Package size={18} />
                                  Mark Picked Up
                                </>
                              )}
                            </motion.button>
                          )}

                          {order.status === "PICKED_UP" && (
                            <motion.button
                              whileHover={{
                                y: -3,
                                scale: 1.02,
                              }}
                              whileTap={{
                                scale: 0.97,
                              }}
                              onClick={() =>
                                handleStatusUpdate(
                                  order._id,
                                  "IN_TRANSIT",
                                )
                              }
                              disabled={
                                updatingOrder === order._id
                              }
                              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#173c24] text-white font-semibold hover:bg-[#14532d] disabled:opacity-50 transition"
                            >
                              {updatingOrder === order._id ? (
                                <>
                                  <Clock size={18} />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Truck size={18} />
                                  Start Delivery
                                </>
                              )}
                            </motion.button>
                          )}

                          {order.status === "IN_TRANSIT" && (
                            <motion.button
                              whileHover={{
                                y: -3,
                                scale: 1.02,
                              }}
                              whileTap={{
                                scale: 0.97,
                              }}
                              onClick={() =>
                                handleStatusUpdate(
                                  order._id,
                                  "DELIVERED",
                                )
                              }
                              disabled={
                                updatingOrder === order._id
                              }
                              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-lime-300 text-[#173c24] font-bold hover:bg-lime-200 disabled:opacity-50 transition"
                            >
                              {updatingOrder === order._id ? (
                                <>
                                  <Clock size={18} />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={18} />
                                  Mark Delivered
                                </>
                              )}
                            </motion.button>
                          )}

                          {order.status === "DELIVERED" && (
                            <div className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-green-50 text-green-700 font-semibold">
                              <CheckCircle size={18} />

                              Order Completed
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PROGRESS TIMELINE */}

                      {order.status !== "CANCELLED" && (
                        <div className="border-t border-green-50 mt-6 pt-6">
                          <div className="flex items-center justify-between gap-4 mb-5">
                            <div>
                              <p className="font-bold text-[#173c24]">
                                Fulfillment Progress
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                Update each stage as the order moves forward.
                              </p>
                            </div>

                            <motion.div
                              animate={
                                order.status === "IN_TRANSIT"
                                  ? {
                                      x: [0, 4, 0],
                                    }
                                  : {}
                              }
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                              className="hidden sm:flex items-center gap-2 text-green-700 text-sm font-semibold"
                            >
                              <ArrowRight size={17} />

                              {order.status}
                            </motion.div>
                          </div>

                          <div className="overflow-x-auto pb-2">
                            <div className="flex items-center gap-2 min-w-max">

                              <ProgressStep
                                label="Pending"
                                active={[
                                  "PENDING",
                                  "CONFIRMED",
                                  "PICKED_UP",
                                  "IN_TRANSIT",
                                  "DELIVERED",
                                ].includes(order.status)}
                              />

                              <ProgressLine
                                active={[
                                  "CONFIRMED",
                                  "PICKED_UP",
                                  "IN_TRANSIT",
                                  "DELIVERED",
                                ].includes(order.status)}
                              />

                              <ProgressStep
                                label="Confirmed"
                                active={[
                                  "CONFIRMED",
                                  "PICKED_UP",
                                  "IN_TRANSIT",
                                  "DELIVERED",
                                ].includes(order.status)}
                              />

                              <ProgressLine
                                active={[
                                  "PICKED_UP",
                                  "IN_TRANSIT",
                                  "DELIVERED",
                                ].includes(order.status)}
                              />

                              <ProgressStep
                                label="Picked Up"
                                active={[
                                  "PICKED_UP",
                                  "IN_TRANSIT",
                                  "DELIVERED",
                                ].includes(order.status)}
                              />

                              <ProgressLine
                                active={[
                                  "IN_TRANSIT",
                                  "DELIVERED",
                                ].includes(order.status)}
                              />

                              <ProgressStep
                                label="In Transit"
                                active={[
                                  "IN_TRANSIT",
                                  "DELIVERED",
                                ].includes(order.status)}
                              />

                              <ProgressLine
                                active={
                                  order.status === "DELIVERED"
                                }
                              />

                              <ProgressStep
                                label="Delivered"
                                active={
                                  order.status === "DELIVERED"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CANCELLED STATE */}

                      {order.status === "CANCELLED" && (
                        <div className="mt-6 pt-6 border-t border-red-100">
                          <div className="flex items-start gap-4 bg-red-50 border border-red-100 rounded-2xl p-4">
                            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                              <AlertCircle size={20} />
                            </div>

                            <div>
                              <p className="font-bold text-red-700">
                                Order Cancelled
                              </p>

                              <p className="text-sm text-red-600/80 mt-1">
                                This order is no longer active in the
                                fulfillment process.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ==============================================
// ORDER STAT
// ==============================================

function OrderStat({
  icon,
  title,
  value,
  description,
  badge,
  dark = false,
}) {
  return (
    <motion.div
      data-farmer-order-stat
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
          {icon}
        </div>

        <span
          className={
            dark
              ? "text-xs font-semibold text-lime-200"
              : "text-xs font-semibold bg-[#f4f8f2] text-green-700 px-3 py-1.5 rounded-full"
          }
        >
          {badge}
        </span>
      </div>

      <p
        className={
          dark
            ? "text-green-200 text-sm mt-8"
            : "text-gray-500 text-sm mt-8"
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
          dark
            ? "text-green-200/70 text-sm mt-2"
            : "text-gray-400 text-sm mt-2"
        }
      >
        {description}
      </p>
    </motion.div>
  );
}

// ==============================================
// PROGRESS STEP
// ==============================================

function ProgressStep({ label, active }) {
  return (
    <motion.div
      initial={{
        opacity: 0.6,
      }}
      animate={{
        opacity: active ? 1 : 0.6,
        scale: active ? 1 : 0.96,
      }}
      className="flex items-center gap-2 whitespace-nowrap"
    >
      <motion.div
        animate={
          active
            ? {
                scale: [1, 1.18, 1],
              }
            : {}
        }
        transition={{
          duration: 1.8,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
        className={`w-3 h-3 rounded-full ${
          active ? "bg-green-600" : "bg-gray-300"
        }`}
      />

      <span
        className={`text-xs font-medium ${
          active ? "text-green-700" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ==============================================
// PROGRESS LINE
// ==============================================

function ProgressLine({ active }) {
  return (
    <motion.div
      initial={{
        scaleX: 0.7,
        opacity: 0.5,
      }}
      animate={{
        scaleX: active ? 1 : 0.7,
        opacity: active ? 1 : 0.5,
      }}
      transition={{
        duration: 0.5,
      }}
      className={`w-8 h-0.5 origin-left ${
        active ? "bg-green-500" : "bg-gray-300"
      }`}
    />
  );
}

// ==============================================
// STATUS BADGE
// Existing component preserved
// ==============================================

function StatusBadge({ status }) {
  const config = {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    },

    CONFIRMED: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-700",
      icon: CheckCircle,
    },

    PICKED_UP: {
      label: "Picked Up",
      className: "bg-purple-100 text-purple-700",
      icon: Package,
    },

    IN_TRANSIT: {
      label: "In Transit",
      className: "bg-orange-100 text-orange-700",
      icon: Truck,
    },

    DELIVERED: {
      label: "Delivered",
      className: "bg-green-100 text-green-700",
      icon: CheckCircle,
    },

    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700",
      icon: AlertCircle,
    },
  };

  const current = config[status] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-700",
    icon: Clock,
  };

  const Icon = current.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold ${current.className}`}
    >
      <Icon size={16} />

      {current.label}
    </div>
  );
}