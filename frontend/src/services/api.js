import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
});

// ===============================
// AUTH
// ===============================

// Login
export const loginUser = async (
  email,
  password
) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

// Register
export const registerUser = async (
  userData
) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

// Get current logged-in user
export const getMe = async (
  token
) => {
  const response = await api.get(
    "/auth/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ===============================
// PRODUCTS
// ===============================

// Get all available products
export const getProducts = async () => {
  const response = await api.get(
    "/products"
  );

  return response.data;
};

// Get products belonging to
// the currently logged-in farmer
export const getMyProducts = async (
  token
) => {
  const response = await api.get(
    "/products/mine",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Create a new product
export const createProduct = async (
  productData,
  token
) => {
  const response = await api.post(
    "/products",
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ===============================
// ORDERS
// ===============================

// Create a new buyer order
export const createOrder = async (
  orderData,
  token
) => {
  const response = await api.post(
    "/orders",
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getBuyerOrders = async (token) => {
  console.log("BUYER ORDERS TOKEN:", token);

  const response = await api.get("/orders/buyer", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("BUYER ORDERS RESPONSE:", response.data);

  return response.data;
};

export const getFarmerOrders = async (token) => {
  console.log("FARMER ORDERS TOKEN:", token);

  const response = await api.get("/orders/farmer", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(
    "FARMER ORDERS RESPONSE:",
    response.data
  );

  return response.data;
};

export const updateOrderStatus = async (
  orderId,
  status,
  token
) => {
  console.log("UPDATING ORDER STATUS:", {
    orderId,
    status,
  });

  const response = await api.put(
    `/orders/${orderId}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "UPDATED ORDER:",
    response.data
  );

  return response.data;
};

export const getForecast = async (
  crop = "Tomato",
  location = "Bhagalpur",
  days = 7
) => {
  const response = await api.get("/forecast", {
    params: {
      crop,
      location,
      days,
    },
  });

  return response.data;
};

export const seedForecast = async () => {
  const response = await api.post("/forecast/seed");
  return response.data;
};

export const optimizeRoute = async (
  orderId,
  token
) => {
  const response = await api.post(
    "/logistics/optimize",
    {
      orderId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const predictMarketPrice = async (
  commodity,
  market = "Bhagalpur",
  variety = ""
) => {
  const response = await api.post("/forecast/price", {
    commodity,
    market,
    variety,
  });

  return response.data;
};
export default api;