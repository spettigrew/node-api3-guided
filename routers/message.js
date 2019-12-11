const express = require("express")
const hubs = require("../hubs/hubs-model.js")

const router = express.Router({
	// This allows us to pull in the hub ID from
	// the parent router's url parameters.
	// Otherwise we can't get the hub id from the
	// child router.
	mergeParams: true,
})

router.get("/", (req, res) => {
	// req.params.id is the Hub ID, inherited from the parent router
	hubs.findHubMessages(req.params.id)
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			// res.status(500).json({
			// 	message: "Could not get hub messages",
			// })
			next(err)
		})
})

// The endpoint is built off of the parent router's endpoint.
// So this endpoint is accessed at /api/hubs/:id/messages/:messageId
router.get("/:messageId", (req, res) => {
	// We have to use "messageId" instead of "id", since
	// the parent router already uses "id" for the hubId
	hubs.findHubMessageById(req.params.id, req.params.messageId)
		.then(data => {
			// Make sure our resource exists for the hub before returning it
			if (data) {
				res.json(data)
			} else {
				res.status(404).json({
					message: "Message was not found",
				})
			}
		})
		.catch(err => {
			// res.status(500).json({
			// 	message: "Could not get hub message",
			// })
			next(err)
		})
})

router.post("/", (req, res) => {
	// Validate our data
	if (!req.body.sender || !req.body.text) {
		return res.status(400).json({
			message: "Need sender and text values",
		})
	}

	// Create a payload that will get saved to the db.
	// We create this "whitelist" instead of sending
	// req.body directly, so we control what values go
	// to the database. Otherwise the client could try
	// to set the message ID, which is auto-generated.
	const payload = {
		sender: req.body.sender,
		text: req.body.text,
	}

	hubs.addHubMessage(req.params.id, payload)
		.then(data => {
			res.status(201).json(data)
		})
		.catch(err => {
			// res.status(500).json({
			// 	message: "Could not create hub message",
			// })
			next(err)
		})
})

module.exports = router