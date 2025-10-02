import CryptoJS from "crypto-js";
import { state } from "../state.js";
import crypto from "crypto";
export const encrypt = function (str) {
  if (!str) return null;
  return CryptoJS.AES.encrypt(String(str), state.SECRET_KEY).toString();
};

export const decrypt = function (str) {
  if (!str) return "";
  const bytes = CryptoJS.AES.decrypt(str, state.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export function generateKey(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}
