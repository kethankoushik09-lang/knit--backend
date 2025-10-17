const api_url =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://knite-web.vercel.app";

export default api_url;