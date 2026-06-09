const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

//Middleware To Verify JWT Token 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.username = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

//Function To Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({username:user.username}, process.env.JWT_SECRET)
}

module.exports = {
    verifyToken,
    generateToken
}