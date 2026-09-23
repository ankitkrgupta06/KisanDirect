from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd
import joblib


# =========================
# 1. CREATE FLASK APP
# =========================

app = Flask(__name__)

CORS(app)


# =========================
# 2. LOAD MODEL
# =========================

model = joblib.load(
    "price_forecast_model.pkl"
)

preprocessor = joblib.load(
    "price_forecast_preprocessor.pkl"
)


# =========================
# 3. LOAD HISTORICAL DATA
# =========================

df = pd.read_csv(
    "forecast_dataset.csv"
)

df["Arrival_Date"] = pd.to_datetime(
    df["Arrival_Date"]
)

df = df.sort_values(
    [
        "Commodity",
        "Market",
        "Variety",
        "Arrival_Date"
    ]
).reset_index(drop=True)


# =========================
# 4. FEATURES
# =========================

features = [
    "Commodity",
    "Commodity_Code",
    "District",
    "Grade",
    "Market",
    "State",
    "Variety",
    "Year",
    "Month",
    "Day",
    "DayOfWeek",
    "Previous_Price",
    "Previous_Price_2",
    "Previous_Price_3",
    "Rolling_Mean_3",
    "Rolling_Mean_7",
]


# =========================
# 5. HEALTH CHECK
# =========================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "KisanDirect ML service is running"
    })


# =========================
# 6. PRICE PREDICTION
# =========================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        commodity = data.get("Commodity")
        market = data.get("Market", "Bhagalpur")
        variety = data.get("Variety")


        # -------------------------
        # Validate commodity
        # -------------------------

        if not commodity:

            return jsonify({
                "success": False,
                "message": "Commodity is required"
            }), 400


        # -------------------------
        # Filter historical data
        # -------------------------

        filtered = df[
            (df["Commodity"].str.lower() == commodity.lower()) &
            (df["Market"].str.lower() == market.lower())
        ]


        # -------------------------
        # Filter variety if supplied
        # -------------------------

        if variety:

            variety_filtered = filtered[
                filtered["Variety"].str.lower()
                == variety.lower()
            ]

            if len(variety_filtered) > 0:

                filtered = variety_filtered


        # -------------------------
        # Check history
        # -------------------------

        if len(filtered) < 3:

            return jsonify({
                "success": False,
                "message": "Not enough historical data for this commodity and market"
            }), 400


        # -------------------------
        # Get latest record
        # -------------------------

        filtered = filtered.sort_values(
            "Arrival_Date"
        )

        latest = filtered.iloc[-1]

        print("\n===== PREDICTION INPUT =====")

        print("Commodity:", latest["Commodity"])
        print("Market:", latest["Market"])
        print("Variety:", latest["Variety"])
        print("Latest historical date:", latest["Arrival_Date"])
        print("Latest historical price:", latest["Modal_Price"])


        # -------------------------
        # Create prediction input
        # -------------------------

        prediction_date = latest["Arrival_Date"] + pd.Timedelta(days=1)


        input_data = {

            "Commodity":
                latest["Commodity"],

            "Commodity_Code":
                latest["Commodity_Code"],

            "District":
                latest["District"],

            "Grade":
                latest["Grade"],

            "Market":
                latest["Market"],

            "State":
                latest["State"],

            "Variety":
                latest["Variety"],

            "Year":
                prediction_date.year,

            "Month":
                prediction_date.month,

            "Day":
                prediction_date.day,

            "DayOfWeek":
                prediction_date.dayofweek,

            "Previous_Price":
                latest["Previous_Price"],

            "Previous_Price_2":
                latest["Previous_Price_2"],

            "Previous_Price_3":
                latest["Previous_Price_3"],

            "Rolling_Mean_3":
                latest["Rolling_Mean_3"],

            "Rolling_Mean_7":
                latest["Rolling_Mean_7"],
        }


        X = pd.DataFrame(
            [input_data]
        )[features]


        # -------------------------
        # Encode
        # -------------------------

        X_encoded = preprocessor.transform(
            X
        )


        # -------------------------
        # Predict
        # -------------------------

        prediction = model.predict(
            X_encoded
        )[0]


        # -------------------------
        # Response
        # -------------------------

        return jsonify({

            "success": True,

            "commodity":
                latest["Commodity"],

            "market":
                latest["Market"],

            "variety":
                latest["Variety"],

            "lastRecordedPrice":
                float(latest["Modal_Price"]),

            "predictedPrice":
                round(
                    float(prediction),
                    2
                ),

            "predictionDate":
                prediction_date.strftime(
                    "%Y-%m-%d"
                )

        })


    except Exception as error:

        print(
            "Prediction error:",
            error
        )

        return jsonify({

            "success": False,

            "message": str(error)

        }), 500


# =========================
# 7. START SERVER
# =========================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=False
    )