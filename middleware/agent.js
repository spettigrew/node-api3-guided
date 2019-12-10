module.exports = (requiredAgent) => (req, res, next) => {
    const userAgent = req.get("User-Agent").toLowerCase()

    if (!userAgent.includes(requiredAgent)) {
        return res.status(500).json({ message: `Must be using ${requiredAgent}` })
    }

    next()
}