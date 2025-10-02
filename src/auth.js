import { input, password, select } from "@inquirer/prompts";
import supabase from "./utils/supabase.js";
import db from "./utils/db.js";
import { state } from "./state.js";
import { start } from "../index.js";
import home from "./home.js";
import { fetchEntriesFromCloud } from "./entries.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const login = async function () {
  console.clear();

  const email = await input({ message: "Enter email:" });

  const psw = await password({
    message: "Enter Password:",
    mask: "#",
  });

  if (!psw) {
    console.log("Enter Valid Password!");
    return login();
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: psw,
  });

  if (error) {
    console.log("Login failed: Invalid email/password", error.message);
    await input({
      message: "Press enter...",
    });
    return start();
  }

  db.prepare("DELETE FROM session").run();
  db.prepare(`INSERT INTO session (user_id) VALUES ('${data.user.id}')`).run();
  state.user = data.user.id;
  console.log("Login successful!");

  const offlineEntries = db
    .prepare(`SELECT * FROM entries WHERE user_id IS NULL`)
    .all();

  if (offlineEntries.length > 0) {
    const choice = await select({
      message: "Merge Offline Entries?",
      choices: [
        { name: "Yes", value: "yes" },
        { name: "No", value: "no" },
      ],
    });

    if (choice === "yes") {
      db.prepare(`UPDATE entries SET user_id = ? WHERE user_id IS NULL`).run(
        state.user
      );
      console.log("Offline entries are merged with your account.");
    }
  }

  fetchEntriesFromCloud();

  start();
};

export const signUp = async function () {
  console.clear();
  const name = await input({ message: "Enter username:" });
  if (!name) {
    console.log("Enter Proper Username!");
    return signUp();
  }
  const email = await input({ message: "Enter email:" });
  if (!emailRegex.test(email)) {
    console.log("Enter Proper Email!");
    return login();
  }
  const psw = await password({
    message: "Enter Password:",
    mask: "#",
  });

  if (!psw) {
    console.log("Enter Valid Password!");
    return signUp();
  }

  let cpsw = await password({
    message: "Confirm Password:",
    mask: "#",
  });

  if (psw !== cpsw) {
    console.log("Passwords do not match!");
    return signUp();
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password: psw,
  });

  if (error) {
    console.log("Sign Up failed:", error.message);
    return signUp();
  }

  console.log("Sign Up Successfull! Please Login...");
  await login();
};

export const logOut = async function () {
  db.prepare(`DELETE FROM session`).run();
  state.user = null;
  state.isLoggedIn = false;
  console.log("Logged out!");
  start();
};
