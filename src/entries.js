import { editor, input, search, select } from "@inquirer/prompts";
import db from "./utils/db.js";
import home from "./home.js";
import { state } from "./state.js";
import supabase from "./utils/supabase.js";
import { v4 as uuid } from "uuid";
import { decrypt, encrypt } from "./utils/crypto.js";

export const addNewEntry = async function () {
  const entry = await editor({
    message: "Enter your journal: ",
  });

  if (!entry) {
    console.log("Cannot be empty!");
    return addNewEntry();
  }

  const mood = await select({
    message: "Select your mood:",
    choices: [
      {
        name: "Happy",
        value: "happy",
      },
      {
        name: "Okay",
        value: "okay",
      },
      {
        name: "Sad",
        value: "sad",
      },
      {
        name: "Bad",
        value: "bad",
      },
    ],
  });

  const tags = await input({ message: "Add tags(comma separated):" });
  const date = new Date().toISOString();
  const userId = state.user;
  const id = uuid();

  db.prepare(
    `INSERT INTO entries (id, date, text, mood, tags, user_id, isSynced)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, date, entry, mood, tags, userId, 0);
  console.log("Entry saved locally!");
  home();
};

const viewSingleEntry = async function (e) {
  console.clear();
  console.log(`Entry #${e.id}`);
  console.log(`Date: ${new Date(e.date).toLocaleString()}`);
  console.log(`Mood: ${e.mood}`);
  console.log(`Tags: ${e.tags}`);
  console.log("Content:");
  console.log(e.text);
  await input({
    message: "Press enter to go back...",
    choices: [{ name: "Back", value: "back" }],
  });
  viewEntries();
};

export const viewEntries = async function () {
  console.clear();

  let entries;
  if (state.isLoggedIn) {
    entries = db
      .prepare(`SELECT * FROM entries WHERE user_id = ?`)
      .all(state.user);
  } else {
    entries = db.prepare(`SELECT * FROM entries WHERE user_id IS NULL`).all();
  }

  if (!entries.length) {
    console.log("No entries!");
    await input({ message: "Press enter to go back..." });
    return home();
  }

  const choices = entries.map((e) => {
    const date = new Date(e.date).toLocaleString().slice(0, 16);
    const tags = e.tags ? e.tags : "—";
    const isSynced = e.isSynced ? "Synced" : "Not Synced";

    return {
      name: `${date} | ${e.mood.padEnd(10, " ")} | ${tags.padEnd(
        20,
        " "
      )} | ${isSynced}`,
      value: e.id,
    };
  });

  choices.push({ name: "Back", value: "back" });
  const selected = await select({
    message: "Search an entry:",
    choices,
  });

  if (selected === "back") return home();

  const e = entries.find((e) => e.id === selected);
  viewSingleEntry(e);
};

const barLength = 30;

export const showStats = async function () {
  console.clear();

  let entries;
  if (state.isLoggedIn) {
    entries = db
      .prepare(`SELECT * FROM entries WHERE user_id = ?`)
      .all(state.user);
  } else {
    entries = db.prepare(`SELECT * FROM entries WHERE user_id IS NULL`).all();
  }
  if (!entries.length) {
    console.log("No entries found!");
    return;
  }

  const len = entries.length;

  const moodCounts = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});
  console.log(`Total entries: ${len}`);

  console.log("Mood Chart:");
  console.log(" ");

  const maxMood = Math.max(...Object.values(moodCounts));

  for (const mood of ["happy", "okay", "sad", "bad"]) {
    const count = moodCounts[mood] || 0;
    const barLen =
      maxMood === 0 ? 0 : Math.round((count / maxMood) * barLength);
    const bar = "█".repeat(barLen);
    console.log(`${mood.padEnd(6)} : ${bar} ${count}`);
    console.log(" ");
  }

  const monthCounts = new Array(12).fill(0);
  entries.forEach((e) => {
    const month = new Date(e.date).getMonth();
    monthCounts[month]++;
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const maxMonth = Math.max(...monthCounts);
  console.log("Yearly Entries:");
  console.log(" ");

  for (let i = 0; i < 12; i++) {
    const count = monthCounts[i];
    const barLen =
      maxMonth === 0 ? 0 : Math.round((count / maxMonth) * barLength);
    const bar = "█".repeat(barLen);
    console.log(`${months[i].padEnd(9)} : ${bar} ${count}`);
  }
  await input({
    message: "Press enter to go back...",
    choices: [{ name: "Back", value: "back" }],
  });
  home();
};

export const syncToCloud = async function () {
  let entries = db
    .prepare(`SELECT * FROM entries WHERE user_id = ?`)
    .all(state.user);

  if (!entries.length) {
    console.log("No entries!");
    return;
  }

  entries = db
    .prepare(`SELECT * FROM entries WHERE user_id = ? AND isSynced = 0`)
    .all(state.user);

  if (entries.length === 0) {
    console.log("All entries are synced!");
    return;
  }

  const { data, error } = await supabase.from("entries").insert(
    entries.map((e) => ({
      id: e.id,
      text: encrypt(e.text),
      mood: encrypt(e.mood),
      tags: encrypt(e.tags),
      date: encrypt(e.date),
      user_id: e.user_id,
    }))
  );

  if (error) {
    console.log("Error syncing entries:", error.message);
    return;
  }

  db.prepare(
    `UPDATE entries SET isSynced = 1 WHERE id IN (${entries
      .map(() => "?")
      .join(",")}) AND user_id = ?`
  ).run(...entries.map((e) => e.id), state.user);

  console.log(`Synced ${entries.length} entries to the cloud.`);

  await input({
    message: "Press enter to go back...",
    choices: [{ name: "Back", value: "back" }],
  });
  home();
};

export const fetchEntriesFromCloud = async function () {
  const { data: cloudEntries, error: fetchError } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", state.user);

  if (fetchError) {
    console.log("Error fetching cloud entries:", fetchError.message);
    return;
  }

  for (const e of cloudEntries) {
    const dText = decrypt(e.text, SECRET_KEY);
    const dMood = decrypt(e.mood, SECRET_KEY);
    const dTags = decrypt(e.tags, SECRET_KEY);
    const dDate = decrypt(e.date, SECRET_KEY);

    const exists = db.prepare("SELECT id FROM entries WHERE id = ?").get(e.id);

    if (!exists) {
      db.prepare(
        `INSERT INTO entries (id, text, mood, tags, date, user_id, isSynced)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(e.id, dText, dMood, dTags, dDate, e.user_id, 1);
    }
  }

  console.log(`\n Synced ${cloudEntries.length} entries from cloud.`);
};
