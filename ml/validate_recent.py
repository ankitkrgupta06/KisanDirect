import pandas as pd
import joblib

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# =========================
# 1. LOAD DATA
# =========================

df = pd.read_csv("forecast_dataset.csv")

df["Arrival_Date"] = pd.to_datetime(df["Arrival_Date"])

df = df.sort_values("Arrival_Date").reset_index(drop=True)


# =========================
# 2. FEATURES
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

target = "Modal_Price"


# =========================
# 3. USE LAST 20% DATA
# =========================

split_index = int(len(df) * 0.8)

recent_data = df.iloc[split_index:].copy()

X_recent = recent_data[features]
y_recent = recent_data[target]


# =========================
# 4. LOAD MODEL
# =========================

model = joblib.load(
    "price_forecast_model.pkl"
)

preprocessor = joblib.load(
    "price_forecast_preprocessor.pkl"
)


# =========================
# 5. TRANSFORM DATA
# =========================

X_recent_encoded = preprocessor.transform(
    X_recent
)


# =========================
# 6. PREDICT
# =========================

predictions = model.predict(
    X_recent_encoded
)


# =========================
# 7. EVALUATE
# =========================

mae = mean_absolute_error(
    y_recent,
    predictions
)

rmse = mean_squared_error(
    y_recent,
    predictions
) ** 0.5

r2 = r2_score(
    y_recent,
    predictions
)


# =========================
# 8. RESULTS
# =========================

print("\n===== RECENT DATA VALIDATION =====")

print(
    "Validation period:"
)

print(
    recent_data["Arrival_Date"].min(),
    "to",
    recent_data["Arrival_Date"].max()
)

print(
    "\nRecords:",
    len(recent_data)
)

print(
    "\nMAE  :",
    round(mae, 2)
)

print(
    "RMSE :",
    round(rmse, 2)
)

print(
    "R²   :",
    round(r2, 4)
)


# =========================
# 9. SAMPLE PREDICTIONS
# =========================

results = pd.DataFrame({
    "Date": recent_data["Arrival_Date"].values,
    "Commodity": recent_data["Commodity"].values,
    "Actual": y_recent.values,
    "Predicted": predictions
})

print("\n===== RECENT PREDICTIONS =====")

print(
    results.tail(15).to_string(index=False)
)