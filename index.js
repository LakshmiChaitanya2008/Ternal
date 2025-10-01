#!/usr/bin/env node
import chalk from "chalk";
import blessed from "blessed";
//import inquirer from "@inquirer/prompts";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { select, Separator, input, password } from "@inquirer/prompts";

const signUp = async function () {
  console.clear();
  const username = await input({ message: "Enter username:" });
  const email = await input({ message: "Enter email:" });
  const psw = await password({
    message: "Enter Password:",
    mask: "#",
  });
  const cnPsw = await password({
    message: "Confirm Password:",
    mask: "#",
  });

  console.log(username, email, psw, cnPsw);
};

const login = async function () {
  console.clear();
  const id = await input({ message: "Enter username / email:" });
  const psw = await password({
    message: "Enter Password:",
    mask: "#",
  });

  console.log(id, psw);
  home();
};

const addNewEntry = async function () {};
const home = async function () {
  console.clear();
  showTitle();

  const action = await select({
    message: "Choose an action:",
    choices: [
      {
        name: "Add New Entry",
        value: "new_entry",
      },
      {
        name: "View Entries",
        value: "view_entries",
      },
      {
        name: "Search",
        value: "search",
      },
      {
        name: "Stats",
        value: "stats",
      },
      {
        name: "Sync to Cloud",
        value: "sync",
      },
      {
        name: "Logout",
        value: "logout",
      },
      {
        name: "exit",
        value: "exit",
      },
    ],
  });

  switch (action) {
    case "new_entry":
      addNewEntry();
      break;
    case "view_entries":
      console.log("view entries");
      break;
    case "search":
      console.log("search");
      break;
    case "stats":
      console.log("Stats");
      break;
    case "sync":
      console.log("sync to cloud");
      break;
    case "logout":
      console.log("logout");
      break;
    case "exit":
      process.exit(0);
  }
};

const start = async function () {
  showTitle();

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
      console.log("Offline Mode!");
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
};

start();
function showTitle() {
  const title = "Welcome to Terminal Journal!";
  console.log("==============================");
  console.log(` ${title}  `);
  console.log("==============================");
}
