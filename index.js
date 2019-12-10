const express = require("express")
const helmet = require("helmet")
const logger = require("./middleware/logger")
// const morgan = require("morgan")
const hubRouter = require("./routers/hub")
const welcomeRouter = require("./routers/welcome")

const server = express()

server.use(helmet())
server.use(logger())
// server.use(morgan("short"))

server.use(express.json())

// Bring all our subroutes into the main application
// (Remember, subroutes can have more children routers)
server.use("/", welcomeRouter)
server.use("/api/hubs", hubRouter)

server.use((req, res) => {
  res.status(404).json({
    message: "Route was not found",
  })
})

server.listen(4000, () => {
  console.log("\n*** Server Running on http://localhost:4000 ***\n")
})
