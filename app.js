import express from "express"
import morgan from "morgan"
import connectDB from "./db/connect.js"
import userRoutes from "./routes/user.routes.js"
import lottoTicketRoutes from "./routes/lottoTicket.routes.js"
import "dotenv/config"
import cors from "cors"
import { errorHandler, notFoundHandler } from './middleware/errorHandling.js'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://not-so-lucky-client.vercel.app'],
  })
);

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

app.use("/auth", userRoutes)

app.use("/games/lotto-6of49/tickets", lottoTicketRoutes)

app.use(notFoundHandler);
app.use(errorHandler);

await connectDB();

app.listen(process.env.PORT, () => {
    console.clear()
    console.log("Server running on port " + process.env.PORT)
})