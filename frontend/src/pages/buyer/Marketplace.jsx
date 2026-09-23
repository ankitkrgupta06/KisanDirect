import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  X,
  Search,
  MapPin,
  Package,
  Leaf,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { getProducts, createOrder } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Marketplace() {
  const { token, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const marketplaceRef = useRef(null);
  const heroRef = useRef(null);
  const productsRef = useRef(null);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data?.products || []);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================================
  // GSAP ANIMATION
  // =====================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          heroRef.current,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          }
        )
        .fromTo(
          productsRef.current,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.35"
        );
    }, marketplaceRef);

    return () => ctx.revert();
  }, []);

  // =====================================================
  // BUY PRODUCT
  // =====================================================
  const handleBuy = (product) => {
    setSelectedProduct(product);
    setQuantity("");
    setDeliveryLocation(user?.location || "");
    setOrderMessage("");
    setError("");
  };

  // =====================================================
  // CLOSE ORDER FORM
  // =====================================================
  const closeOrderForm = () => {
    if (ordering) return;

    setSelectedProduct(null);
    setQuantity("");
    setDeliveryLocation("");
    setOrderMessage("");
  };

  // =====================================================
  // SUBMIT ORDER
  // =====================================================
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) return;

    if (user?.role !== "buyer") {
      setError(
        "Please login with a buyer account to place an order."
      );
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (Number(quantity) > selectedProduct.quantity) {
      setError(
        `Only ${selectedProduct.quantity} ${
          selectedProduct.unit || "kg"
        } available.`
      );
      return;
    }

    if (!deliveryLocation.trim()) {
      setError("Please enter a delivery location.");
      return;
    }

    try {
      setOrdering(true);
      setError("");
      setOrderMessage("");

      const orderData = {
        cropName: selectedProduct.cropName,
        quantity: Number(quantity),
        deliveryLocation: deliveryLocation.trim(),
        deliveryLatitude: null,
        deliveryLongitude: null,
      };

      const data = await createOrder(orderData, token);

      setOrderMessage(
        data?.message || "Order created successfully!"
      );

      setProducts((currentProducts) =>
        currentProducts
          .map((product) => {
            if (product._id === selectedProduct._id) {
              const remaining =
                product.quantity - Number(quantity);

              return {
                ...product,
                quantity: remaining,
                status:
                  remaining <= 0
                    ? "SOLD"
                    : "RESERVED",
              };
            }

            return product;
          })
          .filter(
            (product) =>
              product.quantity > 0 &&
              product.status !== "SOLD"
          )
      );

      setTimeout(() => {
        setSelectedProduct(null);
        setQuantity("");
        setDeliveryLocation("");
        setOrderMessage("");
      }, 1500);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Failed to create order."
      );
    } finally {
      setOrdering(false);
    }
  };

  // =====================================================
  // SEARCH / FILTER
  // =====================================================
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    return (
      product?.cropName
        ?.toLowerCase()
        .includes(search) ||
      product?.location
        ?.toLowerCase()
        .includes(search) ||
      product?.farmer?.name
        ?.toLowerCase()
        .includes(search) ||
      product?.unit
        ?.toLowerCase()
        .includes(search)
    );
  });

  return (
    <main
      ref={marketplaceRef}
      className="min-h-screen bg-gray-50 p-6 md:p-10"
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* =====================================================
            HERO / HEADER
        ====================================================== */}

        <motion.div
          ref={heroRef}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "42px 42px 38px",
            borderRadius: "34px",
            background:
              "linear-gradient(135deg, #33413f 0%, #3f5c48 100%)",
            boxShadow:
              "0 24px 55px rgba(51,65,63,0.18)",
            marginBottom: "32px",
          }}
        >
          {/* Decorative circles */}

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              right: "-35px",
              top: "-65px",
              background: "#6e8b70",
              opacity: 0.45,
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              right: "65px",
              top: "15px",
              background: "#a7b995",
              opacity: 0.9,
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "95px",
              height: "95px",
              borderRadius: "50%",
              right: "82px",
              top: "32px",
              background: "#33413f",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "720px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "18px",
                color: "#00c98b",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              <Leaf size={17} />
              Fresh from the farm
            </div>

            <h1
              className="text-3xl font-bold"
              style={{
                color: "#ffffff",
                fontSize:
                  "clamp(2.1rem, 5vw, 4.2rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.055em",
                margin: 0,
              }}
            >
              Marketplace
            </h1>

            <p
              className="text-gray-500 mt-2"
              style={{
                color: "rgba(255,255,255,0.72)",
                maxWidth: "540px",
                fontSize: "1.02rem",
                lineHeight: 1.65,
                marginTop: "18px",
              }}
            >
              Fresh produce, directly from farmers
              and FPOs to your doorstep.
            </p>
          </div>
        </motion.div>

        {/* =====================================================
            MARKETPLACE TOOLBAR
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.6,
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "15px",
                display: "grid",
                placeItems: "center",
                background: "#dfeadd",
                color: "#33413f",
              }}
            >
              <Package size={21} />
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "#829087",
                  textTransform: "uppercase",
                }}
              >
                Our produce
              </p>

              <p
                style={{
                  margin: "3px 0 0",
                  fontWeight: 700,
                  color: "#33413f",
                }}
              >
                Direct farmer marketplace
              </p>
            </div>
          </div>

          {/* SEARCH INPUT */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 17px",
              borderRadius: "999px",
              background: "#ffffff",
              border:
                "1px solid rgba(51,65,63,0.08)",
              color: "#64736c",
              fontSize: "0.86rem",
              boxShadow:
                "0 8px 24px rgba(51,65,63,0.06)",
              minWidth: "280px",
            }}
          >
            <Search size={16} />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Browse fresh produce"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
                color: "#33413f",
              }}
            />
          </div>
        </motion.div>

        {/* =====================================================
            ERROR
        ====================================================== */}

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
            className="mt-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl"
            style={{
              marginBottom: "25px",
            }}
          >
            {error}
          </motion.div>
        )}

        {/* =====================================================
            SUCCESS
        ====================================================== */}

        {orderMessage && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="mt-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl"
          >
            {orderMessage}
          </motion.div>
        )}

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        {loading ? (
          <div
            className="text-center py-16 text-gray-500"
            style={{
              padding: "100px 20px",
            }}
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: "45px",
                height: "45px",
                margin: "0 auto 20px",
                borderRadius: "50%",
                border: "3px solid #dfeadd",
                borderTopColor: "#00c98b",
              }}
            />

            Loading products...
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center py-16"
            style={{
              padding: "80px 20px",
              borderRadius: "30px",
              background: "#ffffff",
              border:
                "1px solid rgba(51,65,63,0.07)",
            }}
          >
            <div
              className="text-6xl mb-4"
              style={{
                fontSize: "4rem",
              }}
            >
              🌱
            </div>

            <h2 className="text-xl font-semibold text-gray-700">
              No products available
            </h2>

            <p className="text-gray-500 mt-2">
              Farmers haven't listed any
              products yet.
            </p>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center py-16"
            style={{
              padding: "80px 20px",
              borderRadius: "30px",
              background: "#ffffff",
              border:
                "1px solid rgba(51,65,63,0.07)",
            }}
          >
            <div
              style={{
                fontSize: "3.5rem",
                marginBottom: "15px",
              }}
            >
              🔎
            </div>

            <h2 className="text-xl font-semibold text-gray-700">
              No matching products
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching for another crop,
              location, or farmer.
            </p>
          </motion.div>
        ) : (
          <>
            {/* ===================================================
                PRODUCT HEADER
            ==================================================== */}

            <motion.div
              ref={productsRef}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "25px 0 18px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#33413f",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                  }}
                >
                  Fresh Produce
                </p>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#829087",
                    fontSize: "0.82rem",
                  }}
                >
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "product"
                    : "products"}{" "}
                  available
                </p>
              </div>
            </motion.div>

            {/* ===================================================
                PRODUCT GRID
            ==================================================== */}

            <div
              className="grid md:grid-cols-3 gap-6 mt-8"
              style={{
                marginTop: "0",
                gap: "28px",
              }}
            >
              {filteredProducts.map(
                (product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{
                      opacity: 0,
                      y: 35,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.08 * index,
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -7,
                    }}
                    className="bg-white border rounded-2xl overflow-hidden"
                    style={{
                      border: "none",
                      borderRadius: "30px",
                      background: "#ffffff",
                      boxShadow:
                        "0 16px 40px rgba(51,65,63,0.08)",
                      overflow: "visible",
                      position: "relative",
                    }}
                  >
                    {/* PRODUCT VISUAL */}

                    <motion.div
                      whileHover={{
                        scale: 1.035,
                        rotate: -1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                      className="h-44 bg-green-100 flex items-center justify-center text-7xl"
                      style={{
                        height: "205px",
                        margin: "14px 14px 0",
                        borderRadius: "24px",
                        background:
                          "linear-gradient(145deg, #dce8d5, #a7b995)",
                        fontSize: "7rem",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow:
                          "inset 0 -25px 50px rgba(51,65,63,0.08)",
                      }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          width: "110px",
                          height: "110px",
                          borderRadius: "50%",
                          right: "-30px",
                          top: "-30px",
                          background: "#ffffff",
                          opacity: 0.25,
                        }}
                      />

                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          width: "75px",
                          height: "75px",
                          borderRadius: "50%",
                          left: "-25px",
                          bottom: "-25px",
                          background: "#00c98b",
                          opacity: 0.14,
                        }}
                      />

                      <span
                        style={{
                          position: "relative",
                          zIndex: 2,
                          filter:
                            "drop-shadow(0 12px 10px rgba(51,65,63,0.18))",
                        }}
                      >
                        {getCropEmoji(
                          product.cropName
                        )}
                      </span>
                    </motion.div>

                    {/* PRODUCT INFORMATION */}

                    <div
                      className="p-5"
                      style={{
                        padding:
                          "23px 22px 22px",
                      }}
                    >
                      <div
                        className="flex justify-between items-start"
                        style={{
                          gap: "14px",
                        }}
                      >
                        <div>
                          <h2
                            className="text-xl font-bold"
                            style={{
                              color: "#33413f",
                              fontSize: "1.3rem",
                              letterSpacing:
                                "-0.025em",
                            }}
                          >
                            {product.cropName}
                          </h2>

                          <p
                            className="text-gray-500 text-sm"
                            style={{
                              marginTop: "6px",
                              color: "#829087",
                            }}
                          >
                            {product.farmer?.name ||
                              "Farmer"}
                          </p>
                        </div>

                        <p
                          className="text-green-700 font-bold"
                          style={{
                            margin: 0,
                            padding: "8px 11px",
                            borderRadius: "12px",
                            background: "#e7f2e4",
                            color: "#23764e",
                            fontSize: "0.86rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ₹
                          {product.pricePerUnit}

                          <span
                            style={{
                              fontWeight: 500,
                              color: "#718078",
                            }}
                          >
                            /
                            {product.unit ||
                              "kg"}
                          </span>
                        </p>
                      </div>

                      <div
                        className="mt-5 space-y-2 text-sm text-gray-600"
                        style={{
                          marginTop: "18px",
                          display: "grid",
                          gap: "9px",
                        }}
                      >
                        <p
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "8px",
                            margin: 0,
                            color: "#65736c",
                          }}
                        >
                          <Package
                            size={15}
                            color="#00a875"
                          />

                          Available:

                          <strong
                            style={{
                              color: "#33413f",
                            }}
                          >
                            {product.quantity}{" "}
                            {product.unit ||
                              "kg"}
                          </strong>
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "8px",
                            margin: 0,
                            color: "#65736c",
                          }}
                        >
                          <MapPin
                            size={15}
                            color="#00a875"
                          />

                          {product.location}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() =>
                          handleBuy(product)
                        }
                        className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700"
                        style={{
                          marginTop: "20px",
                          minHeight: "52px",
                          border: "none",
                          borderRadius: "15px",
                          background:
                            "#00a875",
                          boxShadow:
                            "0 10px 22px rgba(0,168,117,0.18)",
                        }}
                      >
                        <ShoppingCart
                          size={18}
                        />

                        Buy Now

                        <ArrowUpRight
                          size={17}
                          style={{
                            marginLeft:
                              "auto",
                          }}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          ORDER MODAL
      ====================================================== */}

      {selectedProduct && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          style={{
            backdropFilter: "blur(7px)",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
            }}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6"
            style={{
              borderRadius: "28px",
              padding: "28px",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.22)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div
                  style={{
                    color: "#00a875",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    textTransform:
                      "uppercase",
                    marginBottom: "7px",
                  }}
                >
                  New order
                </div>

                <h2 className="text-xl font-bold">
                  Place Order
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedProduct.cropName}
                </p>
              </div>

              <motion.button
                whileHover={{
                  rotate: 90,
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                onClick={closeOrderForm}
                disabled={ordering}
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{
                  border: "none",
                  background: "#eef3ed",
                  color: "#33413f",
                }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <div
              className="bg-green-50 rounded-xl p-4 mb-6"
              style={{
                background:
                  "linear-gradient(145deg, #e8f1e4, #f3f6ef)",
                borderRadius: "20px",
                border:
                  "1px solid #dce8d5",
              }}
            >
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Farmer
                </span>

                <span className="font-medium">
                  {selectedProduct.farmer?.name ||
                    "Farmer"}
                </span>
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-gray-600">
                  Price
                </span>

                <span className="font-semibold text-green-700">
                  ₹
                  {
                    selectedProduct.pricePerUnit
                  }
                  /
                  {selectedProduct.unit ||
                    "kg"}
                </span>
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-gray-600">
                  Available
                </span>

                <span className="font-medium">
                  {selectedProduct.quantity}{" "}
                  {selectedProduct.unit ||
                    "kg"}
                </span>
              </div>
            </div>

            <form
              onSubmit={handleOrderSubmit}
              className="space-y-5"
            >
              {/* QUANTITY */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  max={selectedProduct.quantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                  placeholder={`Enter quantity in ${
                    selectedProduct.unit ||
                    "kg"
                  }`}
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  style={{
                    borderRadius: "14px",
                    border:
                      "1px solid #dce6df",
                  }}
                />
              </div>

              {/* DELIVERY LOCATION */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Location
                </label>

                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) =>
                    setDeliveryLocation(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Bhagalpur"
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  style={{
                    borderRadius: "14px",
                    border:
                      "1px solid #dce6df",
                  }}
                />
              </div>

              {/* TOTAL */}

              {quantity &&
                Number(quantity) > 0 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                    style={{
                      background: "#33413f",
                      color: "#ffffff",
                      borderRadius: "17px",
                    }}
                  >
                    <span
                      className="font-medium"
                      style={{
                        color:
                          "rgba(255,255,255,0.7)",
                      }}
                    >
                      Estimated Total
                    </span>

                    <span
                      className="text-xl font-bold text-green-700"
                      style={{
                        color: "#00c98b",
                      }}
                    >
                      ₹
                      {(
                        Number(quantity) *
                        Number(
                          selectedProduct.pricePerUnit
                        )
                      ).toLocaleString("en-IN")}
                    </span>
                  </motion.div>
                )}

              <motion.button
                type="submit"
                disabled={ordering}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60"
                style={{
                  minHeight: "53px",
                  borderRadius: "15px",
                  border: "none",
                  background: "#00a875",
                }}
              >
                {ordering
                  ? "Placing Order..."
                  : "Confirm Order"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}

function getCropEmoji(crop) {
  const emojis = {
    Tomato: "🍅",
    Potato: "🥔",
    Onion: "🧅",
    Rice: "🌾",
    Wheat: "🌾",
    Cauliflower: "🥦",
  };

  return emojis[crop] || "🌱";
}