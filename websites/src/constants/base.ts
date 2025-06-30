export const baseUri =
  process.env.NODE_ENV !== "development"
    ? process.env.SERVER_BASE_URL
    : "http://localhost:6000";
// export const baseUri = "http://145.223.97.55:6000";
