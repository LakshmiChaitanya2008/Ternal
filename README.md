# Terminal Journal CLI

A personal journaling app that runs entirely in your terminal!  
Supports **offline and online modes**, AES-encrypted entries, and cloud sync with Supabase.

---

## Features

- **Offline mode**: Add, view, and manage journal entries locally using SQLite.
- **User authentication**: Sign up and login with email/password.
- **AES-encrypted entries**: All text, mood, and tags are encrypted using your password as the key.
- **Sync to cloud**: Upload your personal entries to Supabase securely.
- **View entries**: List and read entries with mood, tags, and timestamps.
- **Stats**: See mood distribution and yearly statistics.
- **CRUD support**: Add, view, edit, and delete entries.
- **Terminal-friendly UI**: Clean and simple menu using Inquirer.js.

---

## Demo

## [![asciicast](https://asciinema.org/a/746101.svg)](https://asciinema.org/a/746101)

## Installation

**Globally via npm:**

```bash
npm install -g ternal-cli
```

**Run the app**:

```bash
ternal
```

## Encryption

All journal entries (text, mood, tags) are encrypted using your password as the secret key.

Offline entries remain encrypted in your local SQLite database until synced.
