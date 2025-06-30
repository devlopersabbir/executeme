export const baseUri =
  process.env.NODE_ENV !== "development"
    ? process.env.SERVER_BASE_URL
    : process.env.SERVER_BASE_URL_LOCAL;
