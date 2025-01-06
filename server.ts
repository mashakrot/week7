import express, {Express} from "express"
import path from "path"
import router from "./src/routes/index"
import userRouter from "./src/routes/user"
import morgan from "morgan"
import mongoose, { Connection } from 'mongoose'
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3001

const mongoDB: string = "mongodb://127.0.0.1:27017/imagedb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

// // maybe not needed
// db.user.getIndexes();
// db.user.dropIndex("username_1");


// MongoDB connection URI
// Function to connect to MongoDB and fix indexes
async function fixIndexes(): Promise<void> {
  try {
    // Connect to the MongoDB database
    const mongooseInstance = await mongoose.connect(mongoDB);
    const connection = mongooseInstance.connection;
    console.log("Connected to MongoDB.");

    // Reference the `users` collection
    const usersCollection = connection.collection("users");

    // List all indexes in the `users` collection
    const indexes = await usersCollection.indexes();
    console.log("Current indexes on 'users' collection:", indexes);

    // Find and drop the problematic `username` index if it exists
    const problematicIndex = indexes.find(
        (index: mongoose.mongo.IndexDescription) => index.name === "username_1"
    );

    if (problematicIndex) {
        console.log("Dropping problematic index:", problematicIndex.name);
        if(problematicIndex.name){
            await usersCollection.dropIndex(problematicIndex.name);
        }
        console.log("Dropped index:", problematicIndex.name);
    } else {
      console.log("No problematic index found.");
    }

    // Ensure the correct unique index on the `email` field
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log("Ensured unique index on 'email' field.");
  } catch (error) {
    console.error("Error during index fixing:", error);
  }
//   } finally {
//     // Disconnect from the database
//     await mongoose.disconnect();
//     console.log("Disconnected from MongoDB.");
//   }
}

// Run the index fix function
fixIndexes().catch((error) => {
  console.error("Error during execution:", error);
});








db.on("error", console.error.bind(console, "MongoDB connection error"))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))


app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)
app.use("/user", userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)

})