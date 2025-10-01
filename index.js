#!/usr/bin/env node

import { editor } from "@inquirer/prompts";
import { select, input } from "@inquirer/prompts";
import { login, signUp } from "./src/auth.js";
import db, { startSession } from "./src/utils/db.js";
import { showTitle, state } from "./src/state.js";
import home from "./src/home.js";

export const start = async function () {
  showTitle();
  startSession();
  const session = db.prepare("SELECT * FROM session LIMIT 1").get();

  if (session) {
    state.user = session.user_id;
    state.isLoggedIn = true;
    console.log("Logged in as ", state.user.email + "!");
  }

  if (state.isLoggedIn) {
    home();
  } else {
    const nextPage = await select({
      message: "Choose an option:",
      choices: [
        {
          name: "Continue Offline",
          value: "offline",
        },
        {
          name: "Login",
          value: "login",
        },
        {
          name: "Sign Up",
          value: "signup",
        },
        {
          name: "Exit",
          value: "exit",
        },
      ],
    });

    switch (nextPage) {
      case "offline":
        home();
        break;
      case "login":
        login();
        break;
      case "signup":
        signUp();
        break;
      case "exit":
        process.exit(0);
    }
  }
};

start();
