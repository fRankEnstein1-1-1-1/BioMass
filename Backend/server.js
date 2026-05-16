const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const dotenv = require("dotenv")
dotenv.config()
const { authenticateWebODM , createProject , createTask } = require("./services/WebodmServices")
const uploadRoutes = require("./Routes/uploadRoutes")
const authRoutes = require("./Routes/auth")
const projectRoutes = require("./Routes/projectRoutes")
const app = express()
app.use(cors())
app.use(express.json())
connectDB();
app.use("/api",uploadRoutes);
app.use("/api/auth",authRoutes);
app.use("/api",projectRoutes)
app.listen(5000,()=>{
    console.log("server is running !")
})