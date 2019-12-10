function validateHubId() {
    return (req, res, next) => {
        hubs.findById(req.params.id)
            .then(hub => {
                if (hub) {
                    req.hub = hub
                    next()
                } else {
                    res.status(404).json({ message: "Hub not found" })
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    message: "Error retrieving the hub",
                })
            }) 
    }
}