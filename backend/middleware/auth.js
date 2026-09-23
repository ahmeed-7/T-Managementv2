import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer')) {
        return res.status(401).json({ error: "No token provided" })
    }
    const token = header.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = payload.userId
        next()
    } catch {
        return res.status(403).json({ error: "Invalid token" })
    }
}
