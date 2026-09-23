import pandas as pd


# =========================
# 1. LOAD DATA
# =========================

df = pd.read_csv("cleaned_dataset.csv")

df["Arrival_Date"] = pd.to_datetime(df["Arrival_Date"])


# =========================
# 2. SORT DATA
# =========================

group_columns = [
    "Commodity",
    "Market",
    "Variety"
]

df = df.sort_values(
    group_columns + ["Arrival_Date"]
).reset_index(drop=True)


# =========================
# 3. CREATE LAG FEATURES
# =========================

df["Previous_Price"] = (
    df.groupby(group_columns)["Modal_Price"]
    .shift(1)
)

df["Previous_Price_2"] = (
    df.groupby(group_columns)["Modal_Price"]
    .shift(2)
)

df["Previous_Price_3"] = (
    df.groupby(group_columns)["Modal_Price"]
    .shift(3)
)


# =========================
# 4. CREATE ROLLING FEATURES
# =========================

df["Rolling_Mean_3"] = (
    df.groupby(group_columns)["Modal_Price"]
    .transform(
        lambda x: x.shift(1).rolling(3).mean()
    )
)

df["Rolling_Mean_7"] = (
    df.groupby(group_columns)["Modal_Price"]
    .transform(
        lambda x: x.shift(1).rolling(7).mean()
    )
)


# =========================
# 5. REMOVE ROWS WITHOUT
#    ENOUGH HISTORY
# =========================

before = len(df)

df = df.dropna(
    subset=[
        "Previous_Price",
        "Previous_Price_2",
        "Previous_Price_3",
        "Rolling_Mean_3",
        "Rolling_Mean_7"
    ]
).copy()

after = len(df)


# =========================
# 6. SORT BY DATE
# =========================

df = df.sort_values(
    "Arrival_Date"
).reset_index(drop=True)


# =========================
# 7. DISPLAY RESULTS
# =========================

print("\n===== FORECAST FEATURES =====")

print("Rows before:", before)
print("Rows after:", after)

print("\n===== SAMPLE FORECAST FEATURES =====")

print(
    df[
        [
            "Arrival_Date",
            "Commodity",
            "Market",
            "Variety",
            "Modal_Price",
            "Previous_Price",
            "Previous_Price_2",
            "Previous_Price_3",
            "Rolling_Mean_3",
            "Rolling_Mean_7"
        ]
    ].head(20).to_string(index=False)
)


# =========================
# 8. SAVE DATASET
# =========================

df.to_csv(
    "forecast_dataset.csv",
    index=False
)

print("\nSaved as: forecast_dataset.csv")