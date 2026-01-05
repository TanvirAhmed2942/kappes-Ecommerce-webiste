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
  // Get the base URL without protocol
  const baseUrl = "10.10.7.103:7001";
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
