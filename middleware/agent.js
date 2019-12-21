module.exports = (requiredAgent) => (req, res, next) => {
    const userAgent = req.get("User-Agent").toLowerCase()

    if (!userAgent.includes(requiredAgent)) {
        // return res.status(500).json({ message: `Must be using ${requiredAgent}` })
        // this error handler is used for the programmer, not the user.
        return next(new Error(`Must be using ${requiredAgent}`))
    }

    next()
}

// error handler is like .catch