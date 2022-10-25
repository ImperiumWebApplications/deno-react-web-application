import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";

let db: Database;

const connect = async () => {
  const client = new MongoClient();

  // Connect using srv url
  await client.connect(
    "mongodb+srv://admin:tiktik123@cluster0.yz6eyqz.mongodb.net/?authMechanism=SCRAM-SHA-1"
  );
  db = client.database("todo-app");
};

const getDB = () => {
  return db;
};

// Export the functions
export { connect, getDB };

// const users = db.collection<UserSchema>("users");
