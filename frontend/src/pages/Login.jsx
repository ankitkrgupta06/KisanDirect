import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Animation references */
  const loginPageRef = useRef(null);
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const particleContainerRef = useRef(null);

  /* =========================================================
     GSAP LOGIN ENTRANCE ANIMATION
     ========================================================= */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 45,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
        },
      )
        .fromTo(
          logoRef.current,
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.45",
        )
        .fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 10,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.3",
        )
        .fromTo(
          formRef.current.children,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
          },
          "-=0.2",
        );
    }, loginPageRef);

    return () => ctx.revert();
  }, []);

  /* =========================================================
     THREE.JS BACKGROUND PARTICLES
     ========================================================= */
  useEffect(() => {
    const container = particleContainerRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );

    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(
      window.innerWidth,
      window.innerHeight,
    );

    container.appendChild(renderer.domElement);

    /* Particle geometry */
    const particleCount = 180;

    const positions = new Float32Array(
      particleCount * 3,
    );

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] =
        (Math.random() - 0.5) * 12;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 8;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) * 5;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3,
      ),
    );

    const material = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });

    const particles = new THREE.Points(
      geometry,
      material,
    );

    scene.add(particles);

    /* Floating organic movement */
    const clock = new THREE.Clock();

    let animationFrame;

    const animate = () => {
      animationFrame = requestAnimationFrame(
        animate,
      );

      const elapsed = clock.getElapsedTime();

      particles.rotation.y =
        elapsed * 0.025;

      particles.rotation.x =
        Math.sin(elapsed * 0.15) * 0.025;

      const positionAttribute =
        geometry.attributes.position;

      for (
        let i = 0;
        i < particleCount;
        i++
      ) {
        const originalY =
          positions[i * 3 + 1];

        positionAttribute.array[
          i * 3 + 1
        ] =
          originalY +
          Math.sin(
            elapsed * 0.45 + i,
          ) *
            0.015;
      }

      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    /* Resize */
    const handleResize = () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight,
      );
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    /* Cleanup */
    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "resize",
        handleResize,
      );

      geometry.dispose();
      material.dispose();

      renderer.dispose();

      if (
        container.contains(
          renderer.domElement,
        )
      ) {
        container.removeChild(
          renderer.domElement,
        );
      }
    };
  }, []);

  /* =========================================================
     EXISTING LOGIN LOGIC — PRESERVED
     ========================================================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(
        formData.email,
        formData.password,
      );

      if (data.user.role === "farmer") {
        navigate("/farmer");
      } else if (data.user.role === "buyer") {
        navigate("/buyer");
      } else if (data.user.role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={loginPageRef}
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
    >
      {/* Three.js background */}
      <div
  ref={particleContainerRef}
  aria-hidden="true"
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  }}
/>

      {/* Login card */}
      <div
  ref={cardRef}
  className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
  style={{
    position: "relative",
    zIndex: 2,
  }}
>
        <div className="text-center mb-8">
          <h1
            ref={logoRef}
            className="text-3xl font-bold text-green-700"
          >
            KisanDirect
          </h1>

          <p
            ref={subtitleRef}
            className="text-gray-500 mt-2"
          >
            Welcome back to direct farming
          </p>
        </div>

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <motion.input
              whileFocus={{
                scale: 1.01,
              }}
              transition={{
                duration: 0.2,
              }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <motion.input
              whileFocus={{
                scale: 1.01,
              }}
              transition={{
                duration: 0.2,
              }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              y: -2,
              scale: 1.01,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </motion.button>
        </form>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.1,
            duration: 0.5,
          }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-semibold"
          >
            Register
          </Link>
        </motion.p>
      </div>
    </div>
  );
};

export default Login;