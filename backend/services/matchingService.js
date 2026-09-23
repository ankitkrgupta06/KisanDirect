const Product = require("../models/Product");

const matchProducts = async (
  cropName,
  requiredQuantity
) => {
  const products = await Product.find({
    cropName: {
      $regex: `^${cropName}$`,
      $options: "i",
    },

    status: "AVAILABLE",

    quantity: {
      $gt: 0,
    },
  })
    .populate(
      "farmer",
      "name location latitude longitude"
    )
    .sort({
      pricePerUnit: 1,
    });

  let remainingQuantity =
    Number(requiredQuantity);

  const matches = [];

  for (const product of products) {
    if (remainingQuantity <= 0) {
      break;
    }

    const allocatedQuantity = Math.min(
      product.quantity,
      remainingQuantity
    );

    matches.push({
      productId: product._id,

      farmer: {
        id: product.farmer._id,
        name: product.farmer.name,
        location: product.farmer.location,
        latitude: product.farmer.latitude,
        longitude: product.farmer.longitude,
      },

      cropName: product.cropName,

      quantityAvailable:
        product.quantity,

      allocatedQuantity,

      pricePerUnit:
        product.pricePerUnit,

      subtotal:
        allocatedQuantity *
        product.pricePerUnit,
    });

    remainingQuantity -=
      allocatedQuantity;
  }

  const matchedQuantity =
    Number(requiredQuantity) -
    remainingQuantity;

  return {
    requestedQuantity:
      Number(requiredQuantity),

    matchedQuantity,

    remainingQuantity,

    fullyMatched:
      remainingQuantity <= 0,

    matches,
  };
};

module.exports = {
  matchProducts,
};