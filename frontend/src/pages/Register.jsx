import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer",
    location: "",
    latitude: null,
    longitude: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const registerPageRef = useRef(null);
const cardRef = useRef(null);
const logoRef = useRef(null);
const subtitleRef = useRef(null);
const formRef = useRef(null);
const particleContainerRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // GET CURRENT LOCATION
  // ==========================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));

        setLocationLoading(false);
      },
      () => {
        setError(
          "Unable to get your location. Please allow location access or enter your location manually.",
        );

        setLocationLoading(false);
      },
    );
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await register(formData);

      if (data.user.role === "farmer") {
        navigate("/farmer");
      } else if (data.user.role === "buyer") {
        navigate("/buyer");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 45, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9 }
    )
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.5"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45 },
        "-=0.35"
      )
      .fromTo(
        formRef.current.children,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
        },
        "-=0.2"
      );
  }, registerPageRef);

  return () => ctx.revert();
}, []);

useEffect(() => {
  const container = particleContainerRef.current;
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0x10b981,
    size: 0.035,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const clock = new THREE.Clock();
  let frame;

  const animate = () => {
    frame = requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.025;
    particles.rotation.x = Math.sin(t * 0.2) * 0.03;

    renderer.render(scene, camera);
  };

  animate();

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", resize);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);

    geometry.dispose();
    material.dispose();
    renderer.dispose();

    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        {/* HEADER */}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">
            Join KisanDirect
          </h1>

          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
  ref={formRef}
  onSubmit={handleSubmit}
  className="space-y-5"
>
          {/* NAME */}

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* ACCOUNT TYPE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Account Type
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="buyer">Buyer</option>

              <option value="farmer">Farmer</option>
            </select>
          </div>

          {/* LOCATION */}

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bhagalpur"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="mt-2 text-sm text-green-600 font-medium hover:text-green-700 disabled:text-gray-400"
            >
              {locationLoading
                ? "Getting location..."
                : "📍 Use my current location"}
            </button>

            {formData.latitude && formData.longitude && (
              <p className="text-xs text-green-600 mt-2">
                ✓ GPS coordinates captured
              </p>
            )}
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN */}

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
