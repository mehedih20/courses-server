import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.databaseUrl as string);

    server = app.listen(config.port, () => {
      console.log(`App running on port ${config.port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();

// Gracefully handling unhandledRejection error
process.on("unhandledRejection", () => {
  console.log("unhandledRejection detected, shutting down server.");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

// Gracefully handling uncoughtException error
process.on("uncaughtException", () => {
  console.log("uncaughtException detected, shutting down server.");
  process.exit();
});
