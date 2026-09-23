import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AgricultureParticles({
  className = "",
  opacity = 0.28,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.8)
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    container.appendChild(renderer.domElement);

    const particleCount = 450;

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(
      particleCount * 3
    );

    const sizes = new Float32Array(
      particleCount
    );

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] =
        (Math.random() - 0.5) * 16;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 9;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) * 8;

      sizes[i] =
        Math.random() * 0.035 + 0.015;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    geometry.setAttribute(
      "size",
      new THREE.BufferAttribute(
        sizes,
        1
      )
    );

    const material =
      new THREE.PointsMaterial({
        color: 0xcdd58e,
        size: 0.055,
        transparent: true,
        opacity,
        depthWrite: false,
      });

    const particles =
      new THREE.Points(
        geometry,
        material
      );

    scene.add(particles);

    let animationFrame;

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed =
        clock.getElapsedTime();

      particles.rotation.y =
        elapsed * 0.018;

      particles.rotation.x =
        Math.sin(elapsed * 0.12) * 0.025;

      particles.position.y =
        Math.sin(elapsed * 0.25) * 0.08;

      renderer.render(
        scene,
        camera
      );

      animationFrame =
        requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;

      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (
        renderer.domElement.parentNode
      ) {
        renderer.domElement.parentNode.removeChild(
          renderer.domElement
        );
      }
    };
  }, [opacity]);

  return (
    <div
      ref={containerRef}
      className={`three-agriculture-bg ${className}`}
      aria-hidden="true"
    />
  );
}