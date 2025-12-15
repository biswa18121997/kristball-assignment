import express from "express";
import "dotenv/config";
import cors from "cors";
import Routes from "./Routes.js";
import prisma from "./utils/prisma.js";
const PORT = process.env.PORT || 8086;
const app = express();
const allowedOrigins = [
    "http://localhost:5173", //ye wala frontend
    "http://localhost:5555" // ye wala prisma studion for seeing the database..
];
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
Routes(app);
async function startServer() {
    try {
        await prisma.$connect();
        console.log("Database connected sucessfully..!");
        app.listen(PORT, () => {
            console.log(`Server running on port -->${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect..", error);
        process.exit(1);
    }
}
try {
    await startServer();
}
catch (err) {
    console.log(err);
}
process.on("SIGINT", async () => {
    console.log("🔻 Shutting down server...");
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map