import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY;

export const encrypt = function (str) {
  if (!str) return null;
  return CryptoJS.AES.encrypt(String(str), SECRET_KEY).toString();
};

export const decrypt = function (str) {
  if (!str) return "";
  const bytes = CryptoJS.AES.decrypt(str, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
