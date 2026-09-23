import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  TrendingUp,
  IndianRupee,
  Boxes,
  ClipboardList,
  XCircle,
  Star,
  Upload,
  Image as ImageIcon,
  Send,
  Check,
  X,
} from "lucide-react";

import { getBuyerOrders } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import AgricultureParticles from "../../components/AgricultureParticles";

gsap.registerPlugin(ScrollTrigger);

const BuyerOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageRef = useRef(null);

  // ==============================================
  // FEEDBACK STATE
  // ==============================================

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [feedbackPhoto, setFeedbackPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Stores submitted feedback order IDs for the current page session
  const [submittedFeedback, setSubmittedFeedback] = useState(() => {
    try {
      const saved = localStorage.getItem("kisanDirectSubmittedFeedback");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ==============================================
  // LOAD ORDERS
  // ==============================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBuyerOrders(token);

        console.log("BUYER ORDERS RESPONSE:", data);

        setOrders(Array.isArray(data) ? data : data?.orders || []);
      } catch (err) {
        console.error(err);

        setError(err?.response?.data?.message || "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadOrders();
    }
  }, [token]);

  // ==============================================
  // GSAP PAGE ANIMATIONS
  // ==============================================

  useEffect(() => {
    if (loading) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          "[data-orders-header]",
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
          "[data-orders-hero]",
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
          "[data-order-stat]",
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

      gsap.utils.toArray("[data-orders-section]").forEach((section) => {
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
  }, [loading, orders.length]);

  // ==============================================
  // STATUS INFO
  // ==============================================

  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700",
          icon: Clock,
        };

      case "CONFIRMED":
        return {
          label: "Confirmed",
          className: "bg-blue-100 text-blue-700",
          icon: CheckCircle,
        };

      case "PICKED_UP":
        return {
          label: "Picked Up",
          className: "bg-purple-100 text-purple-700",
          icon: Package,
        };

      case "IN_TRANSIT":
        return {
          label: "In Transit",
          className: "bg-orange-100 text-orange-700",
          icon: Truck,
        };

      case "DELIVERED":
        return {
          label: "Delivered",
          className: "bg-green-100 text-green-700",
          icon: CheckCircle,
        };

      case "CANCELLED":
        return {
          label: "Cancelled",
          className: "bg-red-100 text-red-700",
          icon: AlertCircle,
        };

      default:
        return {
          label: status || "Pending",
          className: "bg-gray-100 text-gray-700",
          icon: Clock,
        };
    }
  };

  // ==============================================
  // ORDER SUMMARY
  // ==============================================

  const activeOrders = orders.filter(
    (order) => !["DELIVERED", "CANCELLED"].includes(order.status),
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;

  const inTransitOrders = orders.filter(
    (order) => order.status === "IN_TRANSIT",
  ).length;

  const totalSpend = orders.reduce(
    (total, order) => total + (Number(order.totalAmount) || 0),
    0,
  );

  // ==============================================
  // OPEN FEEDBACK MODAL
  // ==============================================

  const openFeedback = (order) => {
    setSelectedOrder(order);

    setRating(0);
    setHoverRating(0);
    setComment("");

    setFeedbackPhoto(null);
    setPhotoPreview("");

    setFeedbackError("");
    setFeedbackSuccess(false);

    setFeedbackOpen(true);
  };

  // ==============================================
  // CLOSE FEEDBACK MODAL
  // ==============================================

  const closeFeedback = () => {
    if (feedbackLoading) return;

    setFeedbackOpen(false);

    setSelectedOrder(null);
    setRating(0);
    setHoverRating(0);
    setComment("");

    setFeedbackPhoto(null);
    setPhotoPreview("");

    setFeedbackError("");
    setFeedbackSuccess(false);
  };

  // ==============================================
  // PHOTO SELECT
  // ==============================================

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setFeedbackError("Photo size must be less than 5 MB.");

      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedbackError("Please upload a valid image file.");

      return;
    }

    setFeedbackError("");

    setFeedbackPhoto(file);

    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
  };

  // ==============================================
  // REMOVE PHOTO
  // ==============================================

  const removePhoto = () => {
    setFeedbackPhoto(null);
    setPhotoPreview("");
  };

  // ==============================================
  // SUBMIT FEEDBACK
  // ==============================================

  const handleSubmitFeedback = async (event) => {
    event.preventDefault();

    if (!selectedOrder) {
      setFeedbackError("No order selected.");
      return;
    }

    if (rating === 0) {
      setFeedbackError("Please select a rating before submitting.");

      return;
    }

    if (!comment.trim()) {
      setFeedbackError("Please write a short review about your order.");

      return;
    }

    try {
      setFeedbackLoading(true);
      setFeedbackError("");

      const formData = new FormData();

      /*
       * These field names should match the backend
       * feedback controller.
       */

      formData.append("order", selectedOrder._id);

      formData.append("rating", String(rating));

      formData.append("comment", comment.trim());

      if (feedbackPhoto) {
        formData.append("photo", feedbackPhoto);
      }

      console.log("Submitting feedback for order:", selectedOrder._id);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/feedback`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit feedback.");
      }

      console.log("FEEDBACK RESPONSE:", data);

      // ============================================
      // MARK FEEDBACK AS SUBMITTED
      // ============================================

      const orderId = selectedOrder._id;

      const updatedSubmittedFeedback = [
        ...new Set([...submittedFeedback, orderId]),
      ];

      setSubmittedFeedback(updatedSubmittedFeedback);

      localStorage.setItem(
        "kisanDirectSubmittedFeedback",
        JSON.stringify(updatedSubmittedFeedback),
      );

      setFeedbackSuccess(true);

      // Automatically close after success
      setTimeout(() => {
        setFeedbackOpen(false);

        setSelectedOrder(null);
        setRating(0);
        setComment("");
        setFeedbackPhoto(null);
        setPhotoPreview("");
        setFeedbackSuccess(false);
      }, 1800);
    } catch (err) {
      console.error("FEEDBACK SUBMISSION ERROR:", err);

      setFeedbackError(
        err?.message || "Something went wrong while submitting feedback.",
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  // ==============================================
  // LOADING
  // ==============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f1] flex items-center justify-center p-6">
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
            Loading Your Orders
          </h2>

          <p className="text-gray-500 mt-2">
            Preparing your purchase information...
          </p>
        </div>
      </div>
    );
  }

  // ==============================================
  // ERROR
  // ==============================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f7f1] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-[32px] border border-red-100 shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle size={30} className="text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#173c24] mt-6">
            Unable to Load Orders
          </h1>

          <p className="text-gray-500 mt-3">{error}</p>

          <Link to="/marketplace">
            <motion.span
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 mt-7 bg-[#0b3d20] text-white px-5 py-3.5 rounded-2xl font-semibold cursor-pointer"
            >
              Go to Marketplace
              <ArrowRight size={18} />
            </motion.span>
          </Link>
        </div>
      </div>
    );
  }

  // ==============================================
  // MAIN PAGE
  // ==============================================

  return (
    <>
      <main
        ref={pageRef}
        className="min-h-screen bg-[#f4f7f1] relative overflow-hidden p-4 sm:p-6 lg:p-8"
      >
        <AgricultureParticles
          className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
          opacity={0.1}
        />

        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-lime-200/20 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-green-200/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* HEADER */}

          <div
            data-orders-header
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles size={16} />
                Purchase Management
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173c24] mt-5">
                My Orders
              </h1>

              <p className="text-gray-500 mt-3 max-w-xl">
                Track your agricultural purchases from farmers and monitor every
                step of your delivery journey.
              </p>
            </div>

            <Link to="/marketplace">
              <motion.span
                whileHover={{
                  y: -3,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="inline-flex items-center justify-center gap-3 bg-[#0b3d20] hover:bg-[#14532d] text-white px-6 py-4 rounded-2xl font-semibold shadow-xl shadow-green-900/15 cursor-pointer transition"
              >
                <ShoppingCart size={19} />
                Browse Marketplace
              </motion.span>
            </Link>
          </div>

          {/* HERO */}

          <section
            data-orders-hero
            className="relative overflow-hidden bg-[#0b3d20] rounded-[32px] p-7 sm:p-10 lg:p-12 text-white shadow-2xl shadow-green-950/10"
          >
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-lime-300/10 blur-3xl" />

            <div className="absolute left-1/3 bottom-0 w-64 h-64 rounded-full bg-green-400/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-lime-200 px-4 py-2 rounded-full text-sm">
                  <ClipboardList size={17} />
                  Your Purchase Overview
                </div>

                <p className="text-green-200 text-sm mt-7">Total Orders</p>

                <div className="flex items-end gap-4 mt-2">
                  <h2 className="text-6xl sm:text-7xl font-bold">
                    {orders.length}
                  </h2>

                  <p className="text-green-200 mb-3">orders placed</p>
                </div>

                <p className="text-green-100/80 leading-relaxed mt-6 max-w-xl">
                  Keep track of all your agricultural purchases from one place,
                  from order confirmation to final delivery.
                </p>

                <div className="flex flex-wrap gap-3 mt-7">
                  <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-green-200 text-xs">Active</p>

                    <p className="text-xl font-bold mt-1">{activeOrders}</p>
                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-green-200 text-xs">Delivered</p>

                    <p className="text-xl font-bold mt-1">{deliveredOrders}</p>
                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-green-200 text-xs">In Transit</p>

                    <p className="text-xl font-bold mt-1">{inTransitOrders}</p>
                  </div>
                </div>
              </div>

              {/* HERO CARD */}

              <div className="lg:col-span-5">
                <motion.div
                  whileHover={{
                    y: -7,
                  }}
                  className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center">
                      <IndianRupee size={27} />
                    </div>

                    <TrendingUp size={21} className="text-lime-200" />
                  </div>

                  <p className="text-green-200 text-sm mt-8">
                    Total Purchase Value
                  </p>

                  <h3 className="text-4xl sm:text-5xl font-bold mt-2">
                    ₹{totalSpend.toLocaleString("en-IN")}
                  </h3>

                  <p className="text-green-100/70 text-sm mt-2">
                    Based on your available order records
                  </p>

                  <div className="mt-7 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-green-200 text-sm">
                        Delivery Progress
                      </span>

                      <span className="text-lime-200 font-bold">
                        {orders.length > 0
                          ? Math.round((deliveredOrders / orders.length) * 100)
                          : 0}
                        %
                      </span>
                    </div>

                    <div className="mt-3 h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
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

          {/* STATS */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
            <OrderStat
              icon={<Boxes size={23} />}
              title="Total Orders"
              value={orders.length}
              description="All purchases placed"
              badge="Orders"
            />

            <OrderStat
              icon={<Clock size={23} />}
              title="Active Orders"
              value={activeOrders}
              description="Currently in progress"
              badge="Active"
            />

            <OrderStat
              icon={<Truck size={23} />}
              title="In Transit"
              value={inTransitOrders}
              description="On the way to delivery"
              badge="Shipping"
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

          {/* EMPTY STATE */}

          {orders.length === 0 ? (
            <section
              data-orders-section
              className="mt-8 bg-white rounded-[32px] border border-green-100 shadow-sm p-10 sm:p-16 text-center"
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
                Your marketplace purchases will appear here once you place an
                order with a farmer.
              </p>

              <Link to="/marketplace">
                <motion.span
                  whileHover={{
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="inline-flex items-center gap-3 mt-7 bg-[#0b3d20] text-white px-6 py-4 rounded-2xl font-semibold cursor-pointer"
                >
                  <ShoppingCart size={19} />
                  Explore Marketplace
                </motion.span>
              </Link>
            </section>
          ) : (
            <>
              {/* ORDER JOURNEY */}

              <section
                data-orders-section
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
                      Order Tracking
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
                      From the farm to your doorstep
                    </h2>

                    <p className="text-gray-500 leading-relaxed mt-3">
                      Follow every stage of your agricultural order, from
                      placement and confirmation to pickup, transit and
                      delivery.
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

              {/* ORDERS LIST */}

              <section data-orders-section className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-green-600 text-sm font-bold uppercase tracking-wider">
                      Purchase History
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
                      Your Orders
                    </h2>

                    <p className="text-gray-500 mt-2">
                      View products, delivery details and live order progress.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-white border border-green-100 rounded-xl px-4 py-3 text-sm text-gray-500">
                    <Package size={17} className="text-green-600" />
                    {orders.length} order
                    {orders.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="space-y-6">
                  {orders.map((order, orderIndex) => {
                    const statusInfo = getStatusInfo(order.status);

                    const StatusIcon = statusInfo.icon;

                    const hasSubmittedFeedback = submittedFeedback.includes(
                      order._id,
                    );

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
                        className="bg-white border border-green-100 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition overflow-hidden"
                      >
                        {/* ORDER TOP */}

                        <div className="relative overflow-hidden bg-[#f7faf5] p-6 sm:p-7">
                          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-lime-100/60" />

                          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-[#173c24] text-lime-200 flex items-center justify-center flex-shrink-0">
                                <Package size={25} />
                              </div>

                              <div>
                                <p className="text-green-600 text-xs font-bold uppercase tracking-wider">
                                  Agricultural Purchase
                                </p>

                                <h2 className="text-xl sm:text-2xl font-bold text-[#173c24] mt-1">
                                  Order Details
                                </h2>

                                <p className="text-gray-500 text-sm mt-2 break-all">
                                  Order ID: {order._id}
                                </p>
                              </div>
                            </div>

                            <motion.span
                              whileHover={{
                                scale: 1.05,
                              }}
                              className={`inline-flex self-start lg:self-auto items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold ${statusInfo.className}`}
                            >
                              <StatusIcon size={17} />

                              {statusInfo.label}
                            </motion.span>
                          </div>
                        </div>

                        <div className="p-6 sm:p-7">
                          {/* DETAILS */}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* PRODUCTS */}

                            <div className="rounded-2xl bg-[#f7faf5] p-5 border border-green-50">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Package size={16} className="text-green-600" />
                                Products
                              </div>

                              <div className="mt-4 space-y-2">
                                {order.items?.map((item, index) => (
                                  <motion.div
                                    key={index}
                                    whileHover={{
                                      x: 3,
                                    }}
                                    className="flex items-center justify-between gap-3"
                                  >
                                    <span className="font-semibold text-[#173c24]">
                                      {item.product?.cropName || "Product"}
                                    </span>

                                    <span className="text-sm text-green-700 bg-green-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                                      {item.quantity} kg
                                    </span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            {/* DELIVERY */}

                            <div className="rounded-2xl bg-[#f7faf5] p-5 border border-green-50">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <MapPin size={16} className="text-green-600" />
                                Delivery Location
                              </div>

                              <p className="font-semibold text-[#173c24] mt-4 flex items-start gap-2">
                                <MapPin
                                  size={17}
                                  className="text-green-600 flex-shrink-0 mt-0.5"
                                />

                                {order.deliveryLocation || "Not specified"}
                              </p>
                            </div>

                            {/* DATE */}

                            <div className="rounded-2xl bg-[#f7faf5] p-5 border border-green-50">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Clock size={16} className="text-green-600" />
                                Order Date
                              </div>

                              <p className="font-semibold text-[#173c24] mt-4 flex items-center gap-2">
                                <Clock size={17} className="text-green-600" />

                                {order.createdAt
                                  ? new Date(
                                      order.createdAt,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* TOTAL */}

                          {order.totalAmount !== undefined && (
                            <div className="mt-6 bg-lime-100 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <p className="text-[#52735a] text-sm">
                                  Total Amount
                                </p>

                                <p className="text-sm text-[#52735a] mt-1">
                                  Total value of this agricultural purchase
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-[#173c24] text-lime-200 flex items-center justify-center">
                                  <IndianRupee size={18} />
                                </div>

                                <span className="text-2xl font-bold text-[#173c24]">
                                  ₹
                                  {Number(order.totalAmount).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* ==========================================
                              FEEDBACK SECTION
                          ========================================== */}

                          {order.status === "DELIVERED" && (
                            <div className="mt-6 pt-6 border-t border-green-100">
                              {hasSubmittedFeedback ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-green-50 border border-green-100 rounded-2xl p-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-green-600 text-white flex items-center justify-center">
                                      <Check size={21} />
                                    </div>

                                    <div>
                                      <p className="font-bold text-[#173c24]">
                                        Feedback Submitted
                                      </p>

                                      <p className="text-sm text-green-700/70 mt-1">
                                        Thanks for helping us improve
                                        KisanDirect.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        size={17}
                                        fill="currentColor"
                                      />
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="relative overflow-hidden bg-gradient-to-r from-lime-50 to-green-50 border border-green-100 rounded-2xl p-5">
                                  <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-lime-200/40 blur-2xl" />

                                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                    <div className="flex items-start gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-[#173c24] text-lime-200 flex items-center justify-center flex-shrink-0">
                                        <Star size={22} fill="currentColor" />
                                      </div>

                                      <div>
                                        <p className="font-bold text-[#173c24]">
                                          How was your order?
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                          Tell us about the condition in which
                                          you received your produce.
                                        </p>
                                      </div>
                                    </div>

                                    <motion.button
                                      type="button"
                                      whileHover={{
                                        y: -3,
                                        scale: 1.02,
                                      }}
                                      whileTap={{
                                        scale: 0.97,
                                      }}
                                      onClick={() => openFeedback(order)}
                                      className="inline-flex items-center justify-center gap-2 bg-[#0b3d20] hover:bg-[#14532d] text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-green-900/10 transition"
                                    >
                                      <Star size={18} />
                                      Rate Your Order
                                    </motion.button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* CANCELLED ORDER */}

                          {order.status === "CANCELLED" ? (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                              <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 text-red-700">
                                <XCircle size={20} />

                                <div>
                                  <p className="font-semibold">
                                    Order Cancelled
                                  </p>

                                  <p className="text-sm text-red-600/80 mt-1">
                                    This order is no longer progressing through
                                    the delivery process.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* STATUS PROGRESS */

                            <div className="mt-7 pt-6 border-t border-gray-100">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                <div>
                                  <p className="text-sm font-bold text-[#173c24]">
                                    Order Progress
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    Track the current stage of your delivery.
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
                                  className="inline-flex items-center gap-2 text-sm text-green-700 font-semibold"
                                >
                                  <Truck size={17} />

                                  {statusInfo.label}
                                </motion.div>
                              </div>

                              <div className="overflow-x-auto pb-2">
                                <div className="flex items-center gap-2 min-w-max">
                                  <ProgressStep
                                    label="Placed"
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
                                    active={order.status === "DELIVERED"}
                                  />

                                  <ProgressStep
                                    label="Delivered"
                                    active={order.status === "DELIVERED"}
                                  />
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
            </>
          )}
        </div>
      </main>

      {/* =========================================================
          FEEDBACK MODAL
      ========================================================= */}

      <AnimatePresence>
        {feedbackOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeFeedback();
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 30,
                scale: 0.96,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-[30px] shadow-2xl"
            >
              {/* MODAL HEADER */}

              <div className="sticky top-0 z-20 bg-[#0b3d20] text-white p-6 sm:p-7 rounded-t-[30px]">
                <button
                  type="button"
                  onClick={closeFeedback}
                  disabled={feedbackLoading}
                  className="absolute right-5 top-5 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition disabled:opacity-50"
                >
                  <X size={19} />
                </button>

                <div className="flex items-center gap-4 pr-10">
                  <div className="w-12 h-12 rounded-xl bg-lime-300 text-[#173c24] flex items-center justify-center">
                    <Star size={24} fill="currentColor" />
                  </div>

                  <div>
                    <p className="text-lime-200 text-xs font-bold uppercase tracking-wider">
                      Order Feedback
                    </p>

                    <h2 className="text-2xl font-bold mt-1">
                      How was your delivery?
                    </h2>

                    <p className="text-green-100/70 text-sm mt-1">
                      Order ID: {selectedOrder._id}
                    </p>
                  </div>
                </div>
              </div>

              {/* MODAL CONTENT */}

              <form onSubmit={handleSubmitFeedback} className="p-6 sm:p-8">
                {/* SUCCESS */}

                {feedbackSuccess ? (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.12, 1],
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className="w-20 h-20 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center"
                    >
                      <Check size={38} />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-[#173c24] mt-6">
                      Thank You!
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Your feedback has been submitted successfully.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* RATING */}

                    <div>
                      <label className="block text-sm font-bold text-[#173c24]">
                        Rate your order
                      </label>

                      <p className="text-sm text-gray-500 mt-1">
                        How satisfied are you with the quality and condition of
                        your delivery?
                      </p>

                      <div className="flex items-center gap-2 mt-5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= (hoverRating || rating);

                          return (
                            <motion.button
                              key={star}
                              type="button"
                              whileHover={{
                                scale: 1.15,
                              }}
                              whileTap={{
                                scale: 0.9,
                              }}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setRating(star)}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                                active
                                  ? "bg-yellow-100 text-yellow-500"
                                  : "bg-gray-100 text-gray-300"
                              }`}
                            >
                              <Star
                                size={25}
                                fill={active ? "currentColor" : "none"}
                              />
                            </motion.button>
                          );
                        })}
                      </div>

                      {rating > 0 && (
                        <p className="text-sm text-green-700 font-semibold mt-3">
                          {rating === 1 && "Poor"}
                          {rating === 2 && "Needs improvement"}
                          {rating === 3 && "Average"}
                          {rating === 4 && "Good"}
                          {rating === 5 && "Excellent"}
                        </p>
                      )}
                    </div>

                    {/* COMMENT */}

                    <div className="mt-7">
                      <label
                        htmlFor="feedback-comment"
                        className="block text-sm font-bold text-[#173c24]"
                      >
                        Tell us about your experience
                      </label>

                      <p className="text-sm text-gray-500 mt-1">
                        Was the produce fresh? How was the packaging and overall
                        condition?
                      </p>

                      <textarea
                        id="feedback-comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Write your feedback here..."
                        rows={5}
                        maxLength={1000}
                        className="w-full mt-4 border border-green-100 rounded-2xl p-4 text-sm text-[#173c24] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                      />

                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-gray-400">
                          {comment.length}/1000
                        </span>
                      </div>
                    </div>

                    {/* PHOTO UPLOAD */}

                    <div className="mt-7">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <label className="block text-sm font-bold text-[#173c24]">
                            Upload received-order photo
                          </label>

                          <p className="text-sm text-gray-500 mt-1">
                            Show us the condition in which your order arrived.
                          </p>
                        </div>

                        <ImageIcon size={21} className="text-green-600" />
                      </div>

                      {!photoPreview ? (
                        <label
                          htmlFor="feedback-photo"
                          className="mt-4 flex flex-col items-center justify-center border-2 border-dashed border-green-200 hover:border-green-500 bg-[#f7faf5] hover:bg-green-50 rounded-2xl p-8 cursor-pointer transition"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                            <Upload size={25} />
                          </div>

                          <p className="font-semibold text-[#173c24] mt-4">
                            Upload a photo
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG or WEBP · Max 5 MB
                          </p>

                          <input
                            id="feedback-photo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="relative mt-4 rounded-2xl overflow-hidden border border-green-100 bg-[#f7faf5]">
                          <img
                            src={photoPreview}
                            alt="Order condition preview"
                            className="w-full max-h-72 object-contain bg-gray-50"
                          />

                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/90 shadow-lg text-red-600 flex items-center justify-center hover:bg-white transition"
                          >
                            <X size={19} />
                          </button>

                          <div className="p-3 bg-white flex items-center gap-2">
                            <Check size={16} className="text-green-600" />

                            <span className="text-sm text-gray-600 truncate">
                              {feedbackPhoto?.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ERROR */}

                    {feedbackError && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mt-6 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4"
                      >
                        <AlertCircle
                          size={19}
                          className="flex-shrink-0 mt-0.5"
                        />

                        <p className="text-sm font-medium">{feedbackError}</p>
                      </motion.div>
                    )}

                    {/* SUBMIT */}

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <button
                        type="button"
                        onClick={closeFeedback}
                        disabled={feedbackLoading}
                        className="sm:w-1/3 px-5 py-3.5 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <motion.button
                        type="submit"
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        disabled={feedbackLoading}
                        className="sm:flex-1 inline-flex items-center justify-center gap-2 bg-[#0b3d20] hover:bg-[#14532d] text-white px-5 py-3.5 rounded-2xl font-semibold shadow-lg shadow-green-900/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {feedbackLoading ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Submit Feedback
                          </>
                        )}
                      </motion.button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ==============================================
// ORDER STAT
// ==============================================

function OrderStat({ icon, title, value, description, badge, dark = false }) {
  return (
    <motion.div
      data-order-stat
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

// ==============================================
// PROGRESS STEP
// ==============================================

function ProgressStep({ label, active }) {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
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

export default BuyerOrders;
