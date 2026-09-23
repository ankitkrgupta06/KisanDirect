import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# =========================
# 1. LOAD DATA
# =========================

df = pd.read_csv("cleaned_dataset.csv")

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


# =========================
# 4. CATEGORICAL FEATURES
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
# 6. ENCODE DATA
# =========================

X_train_encoded = preprocessor.fit_transform(X_train)
X_test_encoded = preprocessor.transform(X_test)


print("\n===== DATA ENCODED =====")
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
# 8. TRAIN MODEL
# =========================

print("\n===== TRAINING MODEL =====")

model.fit(X_train_encoded, y_train)

print("Training completed!")


# =========================
# 9. PREDICTIONS
# =========================

y_pred = model.predict(X_test_encoded)


# =========================
# 10. EVALUATION
# =========================

mae = mean_absolute_error(y_test, y_pred)

rmse = mean_squared_error(
    y_test,
    y_pred
) ** 0.5

r2 = r2_score(y_test, y_pred)


print("\n===== MODEL PERFORMANCE =====")

print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.4f}")


# =========================
# 11. SAMPLE PREDICTIONS
# =========================

results = pd.DataFrame({
    "Actual": y_test.values,
    "Predicted": y_pred
})

print("\n===== SAMPLE PREDICTIONS =====")
print(results.head(10))


# =========================
# 12. SAVE MODEL
# =========================

joblib.dump(model, "price_model.pkl")

joblib.dump(
    preprocessor,
    "preprocessor.pkl"
)

print("\n===== MODEL SAVED =====")
print("price_model.pkl")
print("preprocessor.pkl")