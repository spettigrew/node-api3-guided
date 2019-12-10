const express = require("express")
const messageRouter = require("./message")
const hubs = require("../hubs/hubs-model.js")

// Creates a new router, or "sub-application" within our app
// Routers can have their own endpoints, middleware, etc.
const router = express.Router()

// We can nest routers within routers, as deep as we want
router.use("/:id/messages", messageRouter)

// The endpoint is built off of the parent router's endpoint.
// So this endpoint is accessed at /api/hubs/:id
router.get("/", (req, res) => {
  const opts = {
    // These values all comes from the URL's query string
    // (everthing after the question mark)
    limit: req.query.limit,
    sortby: req.query.sortby,
    sortdir: req.query.sortdir,
  }

  hubs.find(opts)
    .then(hubs => {
      res.status(200).json(hubs)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "Error retrieving the hubs",
      })
    })
})

router.get("/:id", (req, res) => {
 res.json(req.hub)
})

router.post("/", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Missing hub name" })
  }

  hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "Error adding the hub",
      })
    })
})

router.put("/:id", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Missing hub name" })
  }

  hubs.update(req.params.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub)
      } else {
        res.status(404).json({ message: "The hub could not be found" })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "Error updating the hub",
      })
    })
})

router.delete("/:id", (req, res) => {
  hubs.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The hub has been nuked" })
      } else {
        res.status(404).json({ message: "The hub could not be found" })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "Error removing the hub",
      })
    })
})

module.exports = router