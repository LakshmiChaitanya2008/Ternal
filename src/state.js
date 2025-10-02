import { summer } from "gradient-string";

export const state = {
  user: null,
  email: null,
  isLoggedIn: false,
  SECRET_KEY: null,
};

export function showTitle() {
  const title = "Welcome to Terminal Journal!";
  console.log("==============================");
  console.log(summer("TERMINAL JOURNAL".padStart(24)));
  console.log("==============================");
}
