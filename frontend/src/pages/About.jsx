import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sprout,
  Brain,
  TrendingUp,
  Truck,
  Users,
  ShieldCheck,
  Leaf,
  Target,
  ArrowUpRight,
  CheckCircle2,
  BarChart3,
  Handshake,
  Globe2,
  Lightbulb,
} from "lucide-react";
import AgricultureParticles from "../components/AgricultureParticles";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-about-hero]",
        {
          opacity: 0,
          y: -35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        "[data-about-card]",
        {
          opacity: 0,
          y: 35,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        },
      );

      gsap.utils.toArray("[data-about-section]").forEach((section) => {
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
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      text: "Use intelligent predictions and market insights to make better agricultural decisions.",
    },
    {
      icon: TrendingUp,
      title: "Demand Forecasting",
      text: "Understand upcoming demand trends and plan production according to market signals.",
    },
    {
      icon: BarChart3,
      title: "Market Price Prediction",
      text: "Get data-driven estimates of agricultural market prices using historical market data.",
    },
    {
      icon: Truck,
      title: "Smart Logistics",
      text: "Optimize delivery routes and connect agricultural supply with buyers more efficiently.",
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Farmer First",
      text: "Technology should simplify decisions for farmers instead of making them more complicated.",
    },
    {
      icon: ShieldCheck,
      title: "Trust & Transparency",
      text: "We believe agricultural decisions should be supported by understandable and reliable data.",
    },
    {
      icon: Leaf,
      title: "Sustainable Growth",
      text: "Better forecasting and logistics can help reduce unnecessary production and resource wastage.",
    },
    {
      icon: Handshake,
      title: "Connected Ecosystem",
      text: "Farmers, buyers and logistics providers should work together through one connected platform.",
    },
  ];

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#f4f7f1] relative overflow-hidden p-4 sm:p-6 lg:p-8"
    >
      <AgricultureParticles
        className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
        opacity={0.1}
      />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-200/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-green-200/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO */}
        <div
          data-about-hero
          className="relative overflow-hidden rounded-[32px] bg-[#0b3d20] text-white p-7 sm:p-10 lg:p-14 mb-7 shadow-xl shadow-green-950/10"
        >
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="absolute right-32 bottom-0 w-56 h-56 rounded-full bg-green-400/10 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-lime-200 px-4 py-2 rounded-full text-sm font-semibold">
                <Sprout size={16} />
                Building the Future of Agriculture
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-6">
                Agriculture
                <span className="block text-lime-300">Made Smarter.</span>
              </h1>

              <p className="text-green-100/80 text-base sm:text-lg leading-relaxed mt-6 max-w-2xl">
                KisanDirect is an intelligent agricultural platform designed to
                connect farmers, buyers and logistics through data, technology
                and AI-powered insights.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <Brain size={18} className="text-lime-300" />
                  <span className="text-sm font-medium">AI Intelligence</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <Leaf size={18} className="text-lime-300" />
                  <span className="text-sm font-medium">
                    Sustainable Agriculture
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <Truck size={18} className="text-lime-300" />
                  <span className="text-sm font-medium">Smart Logistics</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-lime-300 text-[#173c24] rounded-[32px] p-7 shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#173c24] text-lime-300 flex items-center justify-center">
                  <Sprout size={28} />
                </div>

                <p className="text-sm font-semibold uppercase tracking-wider mt-7">
                  Our Vision
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-2 leading-tight">
                  A smarter ecosystem for every farmer.
                </h2>

                <p className="text-[#31543b] text-sm leading-relaxed mt-4">
                  Turning agricultural data into meaningful decisions, stronger
                  connections and better opportunities.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* INTRO */}
        <div
          data-about-section
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-7"
        >
          <div className="lg:col-span-7 bg-white rounded-[30px] border border-green-100 p-7 sm:p-9 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-lime-100 flex items-center justify-center flex-shrink-0">
                <Target size={27} className="text-green-700" />
              </div>

              <div>
                <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
                  Why KisanDirect
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-1">
                  Solving real agricultural challenges
                </h2>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mt-6">
              Agriculture depends on countless decisions — what to grow, how
              much to produce, where to sell and how to deliver it. KisanDirect
              brings these decisions together in one intelligent platform.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              By combining agricultural data, AI-powered forecasting, market
              intelligence and logistics optimization, the platform aims to make
              the agricultural supply chain more connected, efficient and
              data-driven.
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#173c24] text-white rounded-[30px] p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-52 h-52 rounded-full bg-lime-300/10 blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center">
                <Globe2 size={27} />
              </div>

              <p className="text-green-200 text-sm mt-7">Our Mission</p>

              <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                Connect the entire agricultural journey.
              </h3>

              <div className="mt-7 space-y-4">
                {[
                  "Better production decisions",
                  "Smarter market understanding",
                  "Efficient buyer connections",
                  "Optimized deliveries",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-lime-300 flex-shrink-0"
                    />
                    <span className="text-green-100/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* WHAT WE DO */}
        <div
          data-about-section
          className="bg-white rounded-[30px] border border-green-100 p-7 sm:p-9 shadow-sm mb-7"
        >
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
              What We Do
            </p>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173c24] mt-2">
              Technology that works for agriculture
            </h2>

            <p className="text-gray-500 mt-3 leading-relaxed">
              From predicting demand to optimizing deliveries, KisanDirect
              combines multiple capabilities into one agricultural intelligence
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-9">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  data-about-card
                  whileHover={{
                    y: -7,
                    scale: 1.01,
                  }}
                  className="bg-[#f4f7f1] border border-green-100 rounded-[26px] p-6 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-lime-200 text-[#173c24] flex items-center justify-center">
                      <Icon size={23} />
                    </div>

                    <ArrowUpRight size={19} className="text-green-600" />
                  </div>

                  <h3 className="text-lg font-bold text-[#173c24] mt-7">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mt-3">
                    {feature.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div
          data-about-section
          className="relative overflow-hidden bg-[#0b3d20] rounded-[30px] text-white p-7 sm:p-9 lg:p-10 mb-7"
        >
          <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="relative z-10">
            <div className="max-w-2xl">
              <p className="text-lime-300 text-sm font-semibold uppercase tracking-wider">
                How KisanDirect Works
              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
                From farm to market, intelligently connected.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-9">
              {[
                {
                  number: "01",
                  icon: BarChart3,
                  title: "Understand",
                  text: "Analyze demand, market prices and agricultural trends.",
                },
                {
                  number: "02",
                  icon: Brain,
                  title: "Predict",
                  text: "Use AI-powered models to generate actionable forecasts.",
                },
                {
                  number: "03",
                  icon: Truck,
                  title: "Deliver",
                  text: "Connect supply with buyers and optimize logistics.",
                },
              ].map((step) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.number}
                    whileHover={{ y: -6 }}
                    className="bg-white/10 border border-white/10 rounded-[26px] p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-lime-300 text-[#173c24] flex items-center justify-center">
                        <Icon size={22} />
                      </div>

                      <span className="text-lime-300 font-bold text-sm">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mt-7">{step.title}</h3>

                    <p className="text-green-100/70 text-sm leading-relaxed mt-3">
                      {step.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* VALUES */}
        <div data-about-section className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <p className="text-green-600 text-sm font-semibold uppercase tracking-wider">
                What Drives Us
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#173c24] mt-1">
                Our Core Values
              </h2>
            </div>

            <p className="text-gray-500 text-sm max-w-md">
              The principles behind how we design technology for the
              agricultural ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[28px] border border-green-100 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-green-950/5 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={22} className="text-green-700" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#173c24]">
                        {value.title}
                      </h3>

                      <p className="text-sm text-gray-500 leading-relaxed mt-2">
                        {value.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FINAL CTA */}
        <div
          data-about-section
          className="relative overflow-hidden bg-lime-200 rounded-[32px] p-7 sm:p-10 lg:p-12 mb-5"
        >
          <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-white/30 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#173c24] text-lime-300 px-4 py-2 rounded-full text-sm font-semibold">
                <Lightbulb size={16} />
                The Future is Data-Driven
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#173c24] mt-5">
                Better data.
                <span className="block">Better decisions.</span>
              </h2>

              <p className="text-[#52735a] leading-relaxed mt-4 max-w-xl">
                KisanDirect is building a smarter way for agricultural
                communities to understand markets, plan supply and move products
                efficiently.
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
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-[#173c24] text-lime-300 flex items-center justify-center shadow-xl"
            >
              <Sprout size={42} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
