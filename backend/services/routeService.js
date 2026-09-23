const OSRM_URL = "https://router.project-osrm.org";

const isValidCoordinate = (lat, lon) => {
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

const getCoordinatesString = (points) => {
  console.log(
    "POINTS SENT TO OSRM:",
    JSON.stringify(points, null, 2)
  );

  const coordinates = points.map(
    (point, index) => {
      const latitude = Number(
        point.latitude
      );

      const longitude = Number(
        point.longitude
      );

      console.log(`POINT ${index}:`, {
        location: point.location,
        latitude: point.latitude,
        longitude: point.longitude,
        convertedLatitude: latitude,
        convertedLongitude: longitude,
      });

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new Error(
          `Invalid coordinates at point ${index}: ${JSON.stringify(
            point
          )}`
        );
      }

      return `${longitude},${latitude}`;
    }
  );

  const result = coordinates.join(";");

  console.log(
    "FINAL OSRM COORDINATES:",
    result
  );

  return result;
};

const getRoadMatrix = async (points) => {
  const coordinates = getCoordinatesString(points);

  console.log(
    "OSRM MATRIX COORDINATES:",
    coordinates
  );

  const url =
    `${OSRM_URL}/table/v1/driving/${encodeURIComponent(
      coordinates
    )}?annotations=duration,distance`;

  console.log("OSRM MATRIX URL:", url);

  const response = await fetch(url);

  const responseText = await response.text();

  console.log(
    "OSRM MATRIX STATUS:",
    response.status
  );

  console.log(
    "OSRM MATRIX RESPONSE:",
    responseText
  );

  if (!response.ok) {
    throw new Error(
      `OSRM table request failed: ${responseText}`
    );
  }

  const data = JSON.parse(responseText);

  if (data.code !== "Ok") {
    throw new Error(
      data.message ||
        `OSRM table error: ${data.code}`
    );
  }

  return data;
};

const getRoadRoute = async (points) => {
  const coordinates =
    getCoordinatesString(points);

  const url =
    `${OSRM_URL}/route/v1/driving/${coordinates}` +
    `?overview=full&geometries=geojson&steps=false`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `OSRM route request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  if (
    data.code !== "Ok" ||
    !data.routes?.length
  ) {
    throw new Error(
      data.message ||
        `OSRM route error: ${data.code}`
    );
  }

  return data.routes[0];
};

const optimizePickupOrder = (
  pickupPoints,
  destination,
  durations
) => {
  const n = pickupPoints.length;

  if (n === 0) {
    return [destination];
  }

  if (n === 1) {
    return [
      pickupPoints[0],
      destination,
    ];
  }

  const pickupCount = n - 1;

  if (pickupCount <= 10) {
    const dp = new Map();
    const parent = new Map();

    const getKey = (mask, last) =>
      `${mask}-${last}`;

    for (
      let i = 1;
      i < n;
      i++
    ) {
      const time = durations[0]?.[i];

      if (
        time === null ||
        time === undefined
      ) {
        continue;
      }

      const bit = 1 << (i - 1);
      const key = getKey(bit, i);

      dp.set(key, time);
      parent.set(key, null);
    }

    for (
      let mask = 1;
      mask < 1 << pickupCount;
      mask++
    ) {
      for (
        let last = 1;
        last < n;
        last++
      ) {
        const lastBit =
          1 << (last - 1);

        if (
          (mask & lastBit) === 0
        ) {
          continue;
        }

        const currentKey =
          getKey(mask, last);

        const currentCost =
          dp.get(currentKey);

        if (
          currentCost === undefined
        ) {
          continue;
        }

        for (
          let next = 1;
          next < n;
          next++
        ) {
          const nextBit =
            1 << (next - 1);

          if (mask & nextBit) {
            continue;
          }

          const travelTime =
            durations[last]?.[next];

          if (
            travelTime === null ||
            travelTime === undefined
          ) {
            continue;
          }

          const nextMask =
            mask | nextBit;

          const nextCost =
            currentCost + travelTime;

          const nextKey =
            getKey(
              nextMask,
              next
            );

          if (
            !dp.has(nextKey) ||
            nextCost <
              dp.get(nextKey)
          ) {
            dp.set(
              nextKey,
              nextCost
            );

            parent.set(
              nextKey,
              {
                mask,
                last,
              }
            );
          }
        }
      }
    }

    const fullMask =
      (1 << pickupCount) - 1;

    let bestLast = null;
    let bestCost = Infinity;

    for (
      let last = 1;
      last < n;
      last++
    ) {
      const key = getKey(
        fullMask,
        last
      );

      const cost = dp.get(key);

      const destinationTime =
        durations[last]?.[n];

      if (
        cost !== undefined &&
        destinationTime !== null &&
        destinationTime !== undefined &&
        cost + destinationTime <
          bestCost
      ) {
        bestCost =
          cost +
          destinationTime;

        bestLast = last;
      }
    }

    if (bestLast !== null) {
      const order = [];

      let mask = fullMask;
      let last = bestLast;

      while (last !== null) {
        order.push(last);

        const previous =
          parent.get(
            getKey(mask, last)
          );

        if (!previous) {
          break;
        }

        mask = previous.mask;
        last = previous.last;
      }

      order.reverse();

      return [
        pickupPoints[0],
        ...order.map(
          (index) =>
            pickupPoints[index]
        ),
        destination,
      ];
    }
  }

  const remaining = [];

  for (
    let i = 1;
    i < n;
    i++
  ) {
    remaining.push(i);
  }

  const order = [0];
  let current = 0;

  while (remaining.length > 0) {
    let bestIndex = -1;
    let bestTime = Infinity;

    for (
      let i = 0;
      i < remaining.length;
      i++
    ) {
      const next =
        remaining[i];

      const time =
        durations[current]?.[next];

      if (
        time !== null &&
        time !== undefined &&
        time < bestTime
      ) {
        bestTime = time;
        bestIndex = i;
      }
    }

    if (bestIndex === -1) {
      throw new Error(
        "No reachable next pickup point was found."
      );
    }

    const next =
      remaining.splice(
        bestIndex,
        1
      )[0];

    order.push(next);
    current = next;
  }

  return [
    ...order.map(
      (index) =>
        pickupPoints[index]
    ),
    destination,
  ];
};

const optimizeRoute = async (
  locations,
  destination
) => {
  if (!Array.isArray(locations)) {
    throw new Error(
      "Pickup points must be an array."
    );
  }

  if (
    !destination ||
    !isValidCoordinate(
      destination.latitude,
      destination.longitude
    )
  ) {
    throw new Error(
      "Invalid destination coordinates."
    );
  }

  const pickupPoints =
    locations.filter(
      (point) =>
        point &&
        isValidCoordinate(
          point.latitude,
          point.longitude
        )
    );

  if (pickupPoints.length === 0) {
    throw new Error(
      "No pickup point has valid coordinates."
    );
  }

  const uniquePickups = [];
  const seen = new Set();

  for (const point of pickupPoints) {
    const key =
      `${point.latitude},${point.longitude}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniquePickups.push(point);
    }
  }

  const pointsForMatrix = [
    ...uniquePickups,
    destination,
  ];

  const matrix =
    await getRoadMatrix(
      pointsForMatrix
    );

  if (
    !Array.isArray(matrix.durations)
  ) {
    throw new Error(
      "OSRM did not return road travel times."
    );
  }

  const optimizedRoute =
    optimizePickupOrder(
      uniquePickups,
      destination,
      matrix.durations
    );

  const roadRoute =
    await getRoadRoute(
      optimizedRoute
    );

  if (
    !roadRoute.geometry?.coordinates?.length
  ) {
    throw new Error(
      "OSRM did not return route geometry."
    );
  }

  return {
    route: optimizedRoute,

    geometry:
      roadRoute.geometry,

    totalDistanceKm: Number(
      (
        roadRoute.distance / 1000
      ).toFixed(2)
    ),

    durationMinutes: Number(
      (
        roadRoute.duration / 60
      ).toFixed(1)
    ),

    durationSeconds:
      Math.round(
        roadRoute.duration
      ),
  };
};

module.exports = {
  optimizeRoute,
};