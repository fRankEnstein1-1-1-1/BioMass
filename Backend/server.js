const express = require("express")
const path = require("path");
const cors = require("cors")
const connectDB = require("./config/db")
const dotenv = require("dotenv")
dotenv.config()
const { authenticateWebODM , createProject , createTask } = require("./services/WebodmServices")
const uploadRoutes = require("./Routes/uploadRoutes")
const authRoutes = require("./Routes/auth")
const projectRoutes = require("./Routes/projectRoutes")
const {
    getTaskStatus
} = require("./services/WebodmServices");
const app = express()
app.use(cors())
app.use(express.json())
connectDB();
app.use("/api",uploadRoutes);
app.use("/api/auth",authRoutes);
app.use("/api",projectRoutes)

app.use("/assets", express.static(path.join(__dirname, "project-assets")));
app.listen(5000,()=>{
  
//    (async () => {

//     const result =
//         await getTaskStatus(

//             "39",

//             "7236698d-77df-4e20-8549-dd06abb40160"
//         );

//     console.log(result);

// })();
console.log("Server is running !")
})