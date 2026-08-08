import express from "express"
import morgan from "morgan"
import connectDB from "./db/connect.js"
import userRoutes from "./routes/user.routes.js"
import "dotenv/config"

const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.get("/health", (req, res) => {
    try {
        res.status(200).json({message: "Server is working"})
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
})

//routes
app.use("/auth", userRoutes)

app.listen(process.env.PORT, () => {
    console.clear()
    console.log("Server running on port " + process.env.PORT)
    connectDB()
})