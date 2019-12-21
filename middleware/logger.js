module.exports = () => (req, res, next) => {
    console.log(`${req.ip} ${req.protocol} ${req.method} ${req.url} ${req.get("User-Agent")}`)
    next()
}

//Custom middleware function