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

  // Detect protocol from getBaseUrl() (http:// or https://)
  const protocolMatch = fullBaseUrl.match(/^(https?):\/\//);
  const protocol = protocolMatch ? protocolMatch[1] : "http"; // Default to http if not found

  // Remove protocol (http:// or https://) and /api/v1 path
  const baseUrlWithoutProtocol = fullBaseUrl
    .replace(/^https?:\/\//, "") // Remove http:// or https://
    .replace(/\/api\/v1$/, ""); // Remove /api/v1

  const baseUrl = baseUrlWithoutProtocol || "10.10.7.103:7001";
  // const baseUrl = "asif7001.binarybards.online";
  // const baseUrl = "api.thecanuckmall.ca";

  // Use the same protocol as getBaseUrl() (http:// or https://)
  // This ensures images use the same protocol as the API backend
  return `${protocol}://${baseUrl}/`;
};
