const express = require("express")
const messageRouter = require("./message")
const hubs = require("../hubs/hubs-model.js")
const { validateHubId } = require("../middleware/validate")

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
    // (everything after the question mark)
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
      next(error)
      // res.status(500).json({
      //   message: "Error retrieving the hubs",
      // })
    })
})

router.get("/:id", validateHubId(), (req, res) => {
 res.json(req.hub)
})

// router.post("/", validateHubData(), (req, res) => {
//   if (!req.body.name) {
//     return res.status(400).json({ message: "Missing hub name" })
//   }

//   hubs.add(req.body)
//     .then(hub => {
//       res.status(201).json(hub)
//     })
//     .catch(error => {
//       console.log(error)
//       next(error)
//       // res.status(500).json({
//       //   message: "Error adding the hub",
//       // })
//     })
// })

router.post("/", validateHubData(), async (req, res) => {
  try {
    const hub = await hubs.add(req.body)
    res.status(201).json(hub)
  } catch (err) {
    next(err)
  }
})

router.put("/:id", validateHubId(), (req, res) => {
  hubs.update(req.hub.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub)
      } 
    })
    .catch(error => {
      console.log(error)
      next(error)
      // res.status(500).json({
      //   message: "Error updating the hub",
      // })
    })
})

// router.delete("/:id", validateHubId(), (req, res) => {
//   hubs.remove(req.hub.id)
//     .then(count => {
//       if (count > 0) {
//         res.status(200).json({ message: "The hub has been nuked" })
//       } 
//     })
//     .catch(error => {
//       console.log(error)
//       next(error)
//       // res.status(500).json({
//       //   message: "Error removing the hub",
//       // })
//     })
// })


router.delete("/:id", validateHubId(), (req, res) => {
  hubs.remove(req.hub.id)
    .then(() => {
      res.status(200).json({ message: "The hub has been nuked" })
    })
    .catch(error => {
      next(error)
    })
})

module.exports = router