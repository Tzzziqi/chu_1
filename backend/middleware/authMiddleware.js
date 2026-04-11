const jwt = require('jsonwebtoken');
const User = require('../models/User'); // check users' info from DB

//====== auth Middleware ======
// it need put before the login === router.put. so valide the token > if it pass > then updatePassword
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        error: 'UNAUTHORIZED',
      });
    }

    // step2: abstract token. split the whitspace, get the second part of the string, which is the token
    const token = authHeader.split(' ')[1];
    // step3: check if tehe token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // step4: use the userId from token to check if the user is exist in the DB. 
    // for safty reason -- .select('-password')  -- do not return the password to the frontend, even if it is hashed.
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        error: 'UNAUTHORIZED',
      });
    }

    // step 5: if the user exist, attach the user info to the req object, so that the next middleware or route handler can access it.
    req.user = user;
    next(); // pass the control to the next middleware or route handler

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'UNAUTHORIZED',
    });
  }
};

module.exports = authMiddleware;