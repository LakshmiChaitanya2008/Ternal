export const state = {
  user: null,
  isLoggedIn: false,
};

export function showTitle() {
  const title = "Welcome to Terminal Journal!";
  console.log("==============================");
  console.log(` ${title}  `);
  console.log("==============================");
}
