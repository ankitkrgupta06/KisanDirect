const Order = require("../models/Order");
const { optimizeRoute } = require("../services/routeService");

const isValidCoordinate = (lat, lon) => {
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat !== 0 &&
    lon !== 0 &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

const optimizeOrderRoute = async (req, res) => {
  try {
    const { orderId, pickupPoints, destination } = req.body;

    console.log(
      "LOGISTICS REQUEST BODY:",
      JSON.stringify(req.body, null, 2)
    );

    let finalPickupPoints = pickupPoints;
    let finalDestination = destination;

    if (orderId) {
      const order = await Order.findById(orderId)
        .populate(
          "items.farmer",
          "name location latitude longitude"
        )
        .populate("items.product");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      console.log(
        "ORDER ITEMS:",
        JSON.stringify(order.items, null, 2)
      );

      finalPickupPoints = order.items
        .filter((item) => {
          if (!item.farmer) {
            return false;
          }

          const farmerLatitude = Number(item.farmer.latitude);
          const farmerLongitude = Number(item.farmer.longitude);

          return isValidCoordinate(
            farmerLatitude,
            farmerLongitude
          );
        })
        .map((item) => {
          const farmerLatitude = Number(item.farmer.latitude);
          const farmerLongitude = Number(item.farmer.longitude);

          return {
            location:
              item.farmer.location ||
              item.farmer.name ||
              "Pickup Point",

            latitude: farmerLatitude,
            longitude: farmerLongitude,
          };
        });

      let deliveryLatitude = Number(order.deliveryLatitude);
      let deliveryLongitude = Number(order.deliveryLongitude);

      if (
        !Number.isFinite(deliveryLatitude) ||
        !Number.isFinite(deliveryLongitude) ||
        (deliveryLatitude === 0 && deliveryLongitude === 0)
      ) {
        if (
          order.deliveryLocation &&
          order.deliveryLocation.toLowerCase().includes("bhagalpur")
        ) {
          deliveryLatitude = 25.2425;
          deliveryLongitude = 86.9842;
        }
      }

      finalDestination = {
        location: order.deliveryLocation || "Delivery Point",
        latitude: deliveryLatitude,
        longitude: deliveryLongitude,
      };

      console.log(
        "FINAL PICKUP POINTS:",
        JSON.stringify(finalPickupPoints, null, 2)
      );

      console.log(
        "FINAL DESTINATION:",
        JSON.stringify(finalDestination, null, 2)
      );
    }

    if (
      !finalPickupPoints ||
      !finalPickupPoints.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No pickup point with valid coordinates was found.",
      });
    }

    if (
      !finalDestination ||
      !isValidCoordinate(
        Number(finalDestination.latitude),
        Number(finalDestination.longitude)
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid delivery coordinates are required.",
      });
    }

    const optimized = await optimizeRoute(
      finalPickupPoints,
      finalDestination
    );

    if (orderId) {
      const order = await Order.findById(orderId);

      if (order) {
        order.route = optimized.route.map((point) => ({
          location: point.location,
          latitude: point.latitude,
          longitude: point.longitude,
        }));

        await order.save();
      }
    }

    return res.json({
      success: true,
      route: optimized.route,
      geometry: optimized.geometry,
      totalDistanceKm: optimized.totalDistanceKm,
      durationMinutes: optimized.durationMinutes,
      durationSeconds: optimized.durationSeconds,
    });
  } catch (error) {
    console.error(
      "Route optimization error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to optimize route.",
    });
  }
};

const getOrderRoute = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.json({
      success: true,
      route: order.route,
      deliveryLocation: order.deliveryLocation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  optimizeOrderRoute,
  getOrderRoute,
};