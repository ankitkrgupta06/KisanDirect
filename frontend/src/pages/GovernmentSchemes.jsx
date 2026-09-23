import React from "react";
import {
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Droplets,
  Sprout,
  Tractor,
  Landmark,
  BarChart3,
  Wheat,
  FlaskConical,
  Store,
  HandCoins,
} from "lucide-react";

const schemes = [
  {
    id: 1,
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    description:
      "Provides income support to eligible landholding farmer families through direct benefit transfers to their bank accounts.",
    benefit:
      "Income support of ₹6,000 per year in three equal installments, subject to eligibility and scheme guidelines.",
    icon: HandCoins,
    category: "Financial Support",
    link: "https://www.pmkisan.gov.in/",
  },
  {
    id: 2,
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    description:
      "A crop insurance scheme designed to provide financial protection to farmers against eligible crop losses caused by notified risks.",
    benefit:
      "Crop insurance coverage and support for eligible losses according to applicable scheme and state guidelines.",
    icon: ShieldCheck,
    category: "Crop Insurance",
    link: "https://pmfby.gov.in/",
  },
  {
    id: 3,
    name: "PMKSY",
    fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
    description:
      "Aims to improve irrigation access and promote efficient use of water in agriculture.",
    benefit:
      "Supports irrigation development and more efficient water management for agriculture.",
    icon: Droplets,
    category: "Irrigation",
    link: "https://pmksy.gov.in/",
  },
  {
    id: 4,
    name: "e-NAM",
    fullName: "National Agriculture Market",
    description:
      "A pan-India electronic trading platform connecting agricultural markets and helping improve price discovery.",
    benefit:
      "Provides a digital marketplace for agricultural commodities and supports transparent price discovery.",
    icon: Store,
    category: "Market Access",
    link: "https://enam.gov.in/",
  },
  {
    id: 5,
    name: "Soil Health Card",
    fullName: "Soil Health Card Scheme",
    description:
      "Provides farmers with information about the nutrient status of their soil along with recommendations for appropriate nutrient management.",
    benefit:
      "Helps farmers understand soil nutrient conditions and make informed fertilizer and soil-management decisions.",
    icon: FlaskConical,
    category: "Soil Management",
    link: "https://soilhealth.dac.gov.in/",
  },
  {
    id: 6,
    name: "KCC",
    fullName: "Kisan Credit Card",
    description:
      "Provides eligible farmers access to institutional agricultural credit for cultivation and related agricultural needs.",
    benefit:
      "Helps eligible farmers access timely agricultural credit through participating financial institutions.",
    icon: Landmark,
    category: "Agricultural Credit",
    link: "https://www.pmkisan.gov.in/",
  },
  {
    id: 7,
    name: "RKVY",
    fullName: "Rashtriya Krishi Vikas Yojana",
    description:
      "Supports agricultural development through projects and initiatives implemented by states for strengthening the agriculture sector.",
    benefit:
      "Supports state-level agricultural development and infrastructure-oriented initiatives.",
    icon: Sprout,
    category: "Agriculture Development",
    link: "https://rkvy.da.gov.in/",
  },
  {
    id: 8,
    name: "Agriculture Infrastructure Fund",
    fullName: "Agriculture Infrastructure Fund",
    description:
      "Supports investment in agricultural infrastructure, particularly post-harvest management and community farming assets.",
    benefit:
      "Provides financing support for eligible agriculture infrastructure projects.",
    icon: Tractor,
    category: "Infrastructure",
    link: "https://agriinfra.dac.gov.in/",
  },
  {
    id: 9,
    name: "Agmarknet",
    fullName: "Agricultural Marketing Information Network",
    description:
      "Provides agricultural market-related information including commodity and market information through a digital platform.",
    benefit:
      "Helps users access agricultural market information and mandi-related data.",
    icon: BarChart3,
    category: "Market Information",
    link: "https://agmarknet.gov.in/",
  },
  {
    id: 10,
    name: "National Food Security Mission",
    fullName: "NFSM",
    description:
      "Supports efforts to increase production and productivity of important food crops through various interventions.",
    benefit:
      "Promotes improved agricultural productivity through crop-focused interventions.",
    icon: Wheat,
    category: "Crop Productivity",
    link: "https://nfsm.gov.in/",
  },
];

const GovernmentSchemes = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f1] text-[#173c24] relative overflow-hidden">
      {/* BACKGROUND DECORATIONS */}
      <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-lime-200/20 blur-3xl translate-x-1/3 -translate-y-1/3" />

      <div className="pointer-events-none absolute bottom-[10%] left-0 h-[450px] w-[450px] rounded-full bg-green-200/20 blur-3xl -translate-x-1/3" />

      <div className="relative z-10">
        {/* HERO */}
        <section className="px-5 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0b3d20] px-6 py-10 text-white shadow-xl shadow-green-950/10 sm:px-8 lg:px-10 lg:py-12">
              {/* HERO DECORATIONS */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />

              <div className="pointer-events-none absolute bottom-0 right-24 h-48 w-48 rounded-full bg-green-400/10 blur-2xl" />

              <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-lime-300/5 blur-3xl" />

              <div className="relative z-10">
                {/* BADGE */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-lime-200">
                  <Sprout size={16} />
                  Government Support for Farmers
                </div>

                {/* HEADING */}
                <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  Government
                  <span className="block text-lime-300">
                    Schemes for Farmers.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-green-100/80 sm:text-lg">
                  Discover important government schemes designed to support
                  farmers with financial assistance, crop insurance, irrigation,
                  market access, infrastructure and better agricultural
                  practices.
                </p>

                {/* STATS */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-3xl font-bold text-lime-300">10+</p>

                    <p className="mt-1 text-sm text-green-100/70">
                      Government Schemes
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-3xl font-bold text-lime-300">24×7</p>

                    <p className="mt-1 text-sm text-green-100/70">
                      Online Information
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-3xl font-bold text-lime-300">Official</p>

                    <p className="mt-1 text-sm text-green-100/70">
                      Government Resources
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCHEMES */}
        <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            {/* SECTION HEADER */}
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
                  Explore Support
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-[#173c24] sm:text-4xl">
                  Schemes that can
                  <span className="text-[#0b3d20]"> help farmers grow</span>
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-gray-500">
                Explore government initiatives, understand their benefits and
                access the official portals directly.
              </p>
            </div>

            {/* CARDS */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {schemes.map((scheme) => {
                const Icon = scheme.icon;

                return (
                  <article
                    key={scheme.id}
                    className="group relative flex min-h-[440px] flex-col overflow-hidden rounded-[28px] border border-green-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-950/5"
                  >
                    {/* DECORATIVE CIRCLE */}
                    <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-lime-100/60 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                    {/* NUMBER */}
                    <div className="absolute right-6 top-4 text-6xl font-bold text-green-50 transition-colors duration-300 group-hover:text-lime-50">
                      {String(scheme.id).padStart(2, "0")}
                    </div>

                    {/* ICON */}
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b3d20] text-lime-300 transition-transform duration-300 group-hover:scale-105">
                      <Icon size={25} strokeWidth={1.8} />
                    </div>

                    {/* CATEGORY */}
                    <div className="relative z-10 mt-6">
                      <span className="inline-flex rounded-full bg-lime-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                        {scheme.category}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10 mt-5">
                      <h3 className="text-2xl font-bold tracking-tight text-[#173c24]">
                        {scheme.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {scheme.fullName}
                      </p>

                      <p className="mt-5 text-sm leading-6 text-gray-600">
                        {scheme.description}
                      </p>
                    </div>

                    {/* BENEFIT */}
                    <div className="relative z-10 mt-5 rounded-2xl border border-green-100 bg-[#f4f7f1] p-4">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-green-600">
                        What it offers
                      </p>

                      <p className="text-sm leading-5 text-[#31543b]">
                        {scheme.benefit}
                      </p>
                    </div>

                    {/* BUTTON */}
                    <div className="relative z-10 mt-auto pt-6">
                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl bg-[#0b3d20] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#14532d]"
                      >
                        <span>Visit Official Website</span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 transition-transform duration-300 group-hover:rotate-45">
                          <ArrowUpRight size={17} />
                        </span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* INFORMATION SECTION */}
        <section className="px-5 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[30px] bg-[#0b3d20] px-7 py-10 text-white shadow-xl shadow-green-950/10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-3xl">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-green-200">
                    Important
                  </p>

                  <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                    Always verify eligibility and application requirements
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-green-100/75 sm:text-base">
                    Scheme eligibility, application procedures, benefits and
                    required documents can vary. KisanDirect provides this page
                    as an information hub. Always check the official government
                    portal for the latest rules and application details.
                  </p>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-[#173c24] lg:h-20 lg:w-20">
                  <ExternalLink size={28} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="border-t border-green-100 bg-[#f4f7f1] px-5 py-7 text-center text-sm text-gray-500">
          Information is provided for awareness and easy access to official
          government resources.
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
