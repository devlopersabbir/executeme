// export const baseUri = "https://145.223.97.55:9292"

export const baseUri =
  process.env.NODE_ENV !== "development"
    ? process.env.NEXT_PUBLIC_SERVER_BASE_URL
    : process.env.NEXT_PUBLIC_SERVER_BASE_URL_LOCAL;
