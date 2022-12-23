const checkAuth = (req, res, next) => {
    if (req.isAuthenticated() || req.session.user) {
        next()
    } else {
        res.json({ status: 401, code: "invalid credentials" })
    }
}

const checkAuthAdmin = (req, res, next) => {
    if ((req.isAuthenticated() && req.user.role === "admin") || (req.session.user && req.session.user.role === "admin")) {
        next()
    } else {
        res.json({ status: 401, code: "invalid credentials" })
    }
}

export {checkAuth, checkAuthAdmin};