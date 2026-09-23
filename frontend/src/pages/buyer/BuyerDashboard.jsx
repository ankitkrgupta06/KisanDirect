import { useEffect, useRef } from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ShoppingCart,
  Package,
  IndianRupee,
  Truck,
  ArrowUpRight,
  ArrowRight,
  Leaf,
  Sparkles,
  Store,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  Search,
  MapPin,
  CheckCircle2,
  Boxes,
} from "lucide-react";

import AgricultureParticles from "../../components/AgricultureParticles";

gsap.registerPlugin(ScrollTrigger);

export default function BuyerDashboard() {
  const pageRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          "[data-buyer-header]",
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
          "[data-buyer-hero]",
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
          "[data-buyer-stat]",
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
          "-=0.35",
        );

      gsap.utils
        .toArray("[data-buyer-section]")
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
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-[#f4f7f1] relative overflow-hidden p-4 sm:p-6 lg:p-8"
    >
      {/* EXISTING THREE.JS AGRICULTURE PARTICLES */}

      <AgricultureParticles
        className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
        opacity={0.1}
      />

      {/* BACKGROUND DECORATION */}

      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-lime-200/20 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-green-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}

        <div
          data-buyer-header
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles size={16} />
              Direct Farm Marketplace
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173c24] mt-5">
              Buyer Dashboard
            </h1>

            <p className="text-gray-500 mt-3 max-w-xl">
              Source fresh agricultural produce directly from farmers and
              manage your purchases in one place.
            </p>
          </div>

          <Link to="/marketplace">
            <motion.button
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="inline-flex items-center justify-center gap-3 bg-[#0b3d20] hover:bg-[#14532d] text-white px-6 py-4 rounded-2xl font-semibold shadow-xl shadow-green-900/15 transition"
            >
              <Search size={19} />

              Browse Marketplace
            </motion.button>
          </Link>
        </div>

        {/* MAIN HERO */}

        <section
          data-buyer-hero
          className="relative overflow-hidden bg-[#0b3d20] rounded-[32px] p-7 sm:p-10 lg:p-12 shadow-2xl shadow-green-950/10"
        >
          {/* Decorative backgrounds */}

          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-green-400/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* LEFT CONTENT */}

            <div className="lg:col-span-7 text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-lime-200 px-4 py-2 rounded-full text-sm">
                <Leaf size={16} />

                Fresh. Direct. Reliable.
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-7">
                Fresh produce,
                <span className="block text-lime-300">
                  directly from farms.
                </span>
              </h2>

              <p className="text-green-100/80 text-base sm:text-lg leading-relaxed mt-6 max-w-2xl">
                Discover quality agricultural products, connect directly with
                farmers, and simplify your sourcing process with KisanDirect.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/marketplace">
                  <motion.span
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-lime-300 text-[#173c24] px-6 py-4 rounded-2xl font-bold cursor-pointer"
                  >
                    <Store size={19} />

                    Explore Produce

                    <ArrowRight size={18} />
                  </motion.span>
                </Link>

                <Link to="/buyer/orders">
                  <motion.span
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-white px-6 py-4 rounded-2xl font-semibold cursor-pointer"
                  >
                    <ClipboardList size={19} />

                    View Orders
                  </motion.span>
                </Link>
              </div>
            </div>

            {/* RIGHT BUYER CARD */}

            <div className="lg:col-span-5">
              <motion.div
                whileHover={{
                  y: -7,
                }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 sm:p-7 text-white"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center shadow-lg">
                    <ShoppingCart size={26} />
                  </div>

                  <ArrowUpRight
                    size={21}
                    className="text-lime-200"
                  />
                </div>

                <p className="text-green-200 text-sm mt-8">
                  Your Buying Activity
                </p>

                <h3 className="text-4xl sm:text-5xl font-bold mt-2">
                  12
                </h3>

                <p className="text-green-100/70 text-sm mt-2">
                  active orders currently being managed
                </p>

                <div className="grid grid-cols-2 gap-3 mt-7 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-green-200 text-xs">
                      Produce Ordered
                    </p>

                    <p className="font-bold text-lg mt-1">
                      4,850 kg
                    </p>
                  </div>

                  <div>
                    <p className="text-green-200 text-xs">
                      In Transit
                    </p>

                    <p className="font-bold text-lg mt-1">
                      3 Orders
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STAT CARDS */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
          <Stat
            icon={<ShoppingCart size={23} />}
            title="Active Orders"
            value="12"
            description="Orders currently active"
            badge="Live"
          />

          <Stat
            icon={<Package size={23} />}
            title="Produce Ordered"
            value="4,850 kg"
            description="Total agricultural produce"
            badge="Volume"
          />

          <Stat
            icon={<IndianRupee size={23} />}
            title="Total Spend"
            value="₹1.42L"
            description="Current purchasing value"
            badge="Spend"
          />

          <Stat
            icon={<Truck size={23} />}
            title="In Transit"
            value="3"
            description="Orders on the way"
            badge="Shipping"
          />
        </section>

        {/* QUICK ACTIONS */}

        <section
          data-buyer-section
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8"
        >
          {/* MARKETPLACE CARD */}

          <div className="lg:col-span-7 bg-white rounded-[32px] border border-green-100 p-7 sm:p-9 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <Store size={26} className="text-green-700" />
                </div>

                <p className="text-green-600 text-sm font-bold uppercase tracking-wider mt-7">
                  Marketplace
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
                  Need agricultural produce?
                </h2>

                <p className="text-gray-500 leading-relaxed mt-4 max-w-xl">
                  Browse directly available produce from farmers and FPOs.
                  Find fresh products and connect with agricultural suppliers.
                </p>
              </div>

              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="hidden sm:flex w-20 h-20 rounded-[26px] bg-[#f4f8f2] items-center justify-center"
              >
                <Leaf size={35} className="text-green-600" />
              </motion.div>
            </div>

            <Link to="/marketplace">
              <motion.span
                whileHover={{
                  x: 4,
                }}
                className="inline-flex items-center gap-2 mt-8 bg-[#0b3d20] hover:bg-[#14532d] text-white px-6 py-4 rounded-2xl font-semibold cursor-pointer transition"
              >
                Browse Marketplace

                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </div>

          {/* ORDERS CARD */}

          <div className="lg:col-span-5 bg-lime-200 rounded-[32px] p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/20 rounded-full" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#173c24] text-lime-200 flex items-center justify-center">
                <ClipboardList size={25} />
              </div>

              <p className="text-[#52735a] text-sm font-bold uppercase tracking-wider mt-7">
                Order Management
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
                Track your purchases.
              </h2>

              <p className="text-[#52735a] leading-relaxed mt-4">
                Keep track of your agricultural orders and manage your buying
                activity.
              </p>

              <Link to="/buyer/orders">
                <motion.span
                  whileHover={{
                    x: 4,
                  }}
                  className="inline-flex items-center gap-2 mt-7 text-[#173c24] font-bold cursor-pointer"
                >
                  Manage Orders

                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </div>
          </div>
        </section>

        {/* BUYER BENEFITS */}

        <section data-buyer-section className="mt-8">
          <div className="mb-6">
            <p className="text-green-600 text-sm font-bold uppercase tracking-wider">
              KisanDirect Benefits
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-2">
              Smarter agricultural sourcing
            </h2>

            <p className="text-gray-500 mt-2">
              Everything you need to source fresh produce efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <BenefitCard
              icon={<Search size={23} />}
              title="Discover Produce"
              description="Explore agricultural products directly available from farmers."
            />

            <BenefitCard
              icon={<TrendingUp size={23} />}
              title="Better Decisions"
              description="Use market information to make smarter sourcing decisions."
            />

            <BenefitCard
              icon={<ShieldCheck size={23} />}
              title="Direct Connection"
              description="Connect directly with agricultural producers and suppliers."
            />
          </div>
        </section>

        {/* ACTIVITY / INFORMATION SECTION */}

        <section
          data-buyer-section
          className="mt-8 mb-4 bg-white rounded-[32px] border border-green-100 shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* LEFT */}

            <div className="lg:col-span-7 p-7 sm:p-9">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                  <Boxes size={23} className="text-green-700" />
                </div>

                <div>
                  <p className="text-green-600 text-sm font-semibold">
                    Your Buying Journey
                  </p>

                  <h2 className="text-2xl font-bold text-[#173c24]">
                    Source with confidence
                  </h2>
                </div>
              </div>

              <div className="space-y-5 mt-8">
                <ActivityItem
                  icon={<CheckCircle2 size={18} />}
                  title="Browse available produce"
                  description="Explore products listed directly by farmers."
                />

                <ActivityItem
                  icon={<ShoppingCart size={18} />}
                  title="Place your order"
                  description="Select the agricultural produce you need."
                />

                <ActivityItem
                  icon={<Truck size={18} />}
                  title="Track your order"
                  description="Manage your purchases and order progress."
                />
              </div>
            </div>

            {/* RIGHT */}

            <div className="lg:col-span-5 bg-[#173c24] p-7 sm:p-9 text-white flex flex-col justify-center">
              <div className="w-14 h-14 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center">
                <MapPin size={25} />
              </div>

              <h3 className="text-3xl font-bold mt-7">
                From farm to your business.
              </h3>

              <p className="text-green-100/75 leading-relaxed mt-4">
                KisanDirect helps buyers discover fresh agricultural produce
                and connect more directly with the farming ecosystem.
              </p>

              <Link to="/marketplace">
                <motion.span
                  whileHover={{
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="inline-flex items-center justify-center gap-2 mt-7 bg-lime-300 text-[#173c24] px-5 py-3.5 rounded-2xl font-bold cursor-pointer"
                >
                  Start Exploring

                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ icon, title, value, description, badge }) {
  return (
    <motion.div
      data-buyer-stat
      whileHover={{
        y: -7,
        scale: 1.01,
      }}
      className="bg-white border border-green-50 rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
          {icon}
        </div>

        <span className="text-xs font-semibold bg-[#f4f8f2] text-green-700 px-3 py-1.5 rounded-full">
          {badge}
        </span>
      </div>

      <p className="text-gray-500 text-sm mt-8">
        {title}
      </p>

      <p className="text-3xl font-bold text-[#173c24] mt-2">
        {value}
      </p>

      <p className="text-gray-400 text-sm mt-2">
        {description}
      </p>
    </motion.div>
  );
}

function BenefitCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className="bg-white rounded-[28px] border border-green-100 p-6 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#f4f8f2] text-green-700 flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-[#173c24] mt-6">
        {title}
      </h3>

      <p className="text-gray-500 leading-relaxed text-sm mt-3">
        {description}
      </p>
    </motion.div>
  );
}

function ActivityItem({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{
        x: 4,
      }}
      className="flex items-start gap-4"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-lime-100 text-green-700 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-[#173c24]">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>
      </div>
    </motion.div>
  );
}