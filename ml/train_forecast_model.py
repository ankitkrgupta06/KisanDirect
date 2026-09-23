import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# =========================
# 1. LOAD DATA
# =========================

df = pd.read_csv("forecast_dataset.csv")

df["Arrival_Date"] = pd.to_datetime(df["Arrival_Date"])

df = df.sort_values("Arrival_Date").reset_index(drop=True)

print("Total records:", len(df))


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

X = df[features]
y = df[target]


# =========================
# 3. CHRONOLOGICAL SPLIT
# =========================

split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]


print("\n===== TRAIN / TEST SPLIT =====")

print("Training records:", len(X_train))
print("Testing records:", len(X_test))

print("\nTraining period:")
print(
    df.iloc[:split_index]["Arrival_Date"].min(),
    "to",
    df.iloc[:split_index]["Arrival_Date"].max()
)

print("\nTesting period:")
print(
    df.iloc[split_index:]["Arrival_Date"].min(),
    "to",
    df.iloc[split_index:]["Arrival_Date"].max()
)


# =========================
# 4. FEATURE TYPES
# =========================

categorical_features = [
    "Commodity",
    "District",
    "Grade",
    "Market",
    "State",
    "Variety",
]

numeric_features = [
    "Commodity_Code",
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
# 5. PREPROCESSOR
# =========================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            ),
            categorical_features,
        ),
        (
            "numeric",
            "passthrough",
            numeric_features,
        ),
    ]
)


# =========================
# 6. ENCODE
# =========================

X_train_encoded = preprocessor.fit_transform(X_train)
X_test_encoded = preprocessor.transform(X_test)

print("\n===== ENCODING =====")

print("Training shape:", X_train_encoded.shape)
print("Testing shape:", X_test_encoded.shape)


# =========================
# 7. CREATE MODEL
# =========================

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)


# =========================
# 8. TRAIN
# =========================

print("\n===== TRAINING MODEL =====")

model.fit(
    X_train_encoded,
    y_train
)

print("Training completed!")


# =========================
# 9. PREDICT
# =========================

y_pred = model.predict(X_test_encoded)


# =========================
# 10. EVALUATE
# =========================

mae = mean_absolute_error(
    y_test,
    y_pred
)

rmse = mean_squared_error(
    y_test,
    y_pred
) ** 0.5

r2 = r2_score(
    y_test,
    y_pred
)


print("\n===== MODEL PERFORMANCE =====")

print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.4f}")


# =========================
# 11. SAMPLE PREDICTIONS
# =========================

results = pd.DataFrame({
    "Date": df.iloc[split_index:]["Arrival_Date"].values,
    "Commodity": df.iloc[split_index:]["Commodity"].values,
    "Actual": y_test.values,
    "Predicted": y_pred
})

print("\n===== SAMPLE PREDICTIONS =====")

print(
    results.head(15).to_string(index=False)
)


# =========================
# 12. SAVE MODEL
# =========================

joblib.dump(
    model,
    "price_forecast_model.pkl"
)

joblib.dump(
    preprocessor,
    "price_forecast_preprocessor.pkl"
)


print("\n===== MODEL SAVED =====")

print("price_forecast_model.pkl")
print("price_forecast_preprocessor.pkl")