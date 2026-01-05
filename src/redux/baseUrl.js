export const getBaseUrl = () => {
  return "http://10.10.7.103:7001/api/v1";
  // return "https://asif7001.binarybards.online/api/v1";
  // return "https://api.thecanuckmall.ca/api/v1";
};

export const getSocketUrl = () => {
  // return "http://10.10.7.103:7001";
  // return "https://asif7001.binarybards.online";
  return "http://35.183.138.114:7001";
};

export const getImageUrl = () => {
  // Extract domain and port from getBaseUrl() (remove protocol and /api/v1)
  const fullBaseUrl = getBaseUrl();
  // Remove protocol (http:// or https://) and /api/v1 path
  const baseUrlWithoutProtocol = fullBaseUrl
    .replace(/^https?:\/\//, "") // Remove http:// or https://
    .replace(/\/api\/v1$/, ""); // Remove /api/v1

  const baseUrl = baseUrlWithoutProtocol || "10.10.7.103:7001";
  // const baseUrl = "asif7001.binarybards.online";
  // const baseUrl = "api.thecanuckmall.ca";

  // Detect protocol: use current page protocol if in browser, otherwise default to http
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    return `${protocol}//${baseUrl}/`;
  }

  // Server-side or default: use http
  return `http://${baseUrl}/`;
};
