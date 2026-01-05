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

  // Always use http:// for image URLs since backend images are served over HTTP
  // Even if the frontend is served over HTTPS (like on Vercel), images use HTTP
  return `http://${baseUrl}/`;
};
