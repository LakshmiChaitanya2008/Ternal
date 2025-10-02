import { select } from "@inquirer/prompts";
import { addNewEntry, showStats, syncToCloud, viewEntries } from "./entries.js";
import { showTitle, state } from "./state.js";
import { logOut } from "./auth.js";
import chalk from "chalk";

export default async function () {
  console.clear();
  showTitle();
  console.log();

  const choices = [
    { name: "Add New Entry", value: "new_entry" },
    { name: "View Entries", value: "view_entries" },
    { name: "Stats", value: "stats" },
  ];

  if (state.isLoggedIn) {
    console.log(
      chalk.yellowBright("Logged in as " + chalk.underline(state.email))
    );
    console.log();
    choices.push(
      { name: "Sync to Cloud", value: "sync" },
      { name: "Logout", value: "logout" }
    );
  }

  choices.push({ name: "Exit", value: "exit" });

  const action = await select({
    message: "Choose an action:",
    choices,
  });

  switch (action) {
    case "new_entry":
      addNewEntry();
      break;
    case "view_entries":
      viewEntries();
      break;
    case "search":
      viewEntries();
      break;
    case "stats":
      showStats();
      break;
    case "sync":
      syncToCloud();
      break;
    case "logout":
      logOut();
      break;
    case "exit":
      process.exit(0);
  }
}
