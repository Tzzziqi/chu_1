// for adim user only, check if the user is admin, if not, return 403 forbidden

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Admin access required',
            error: 'Forbidden'
        });
    }
};
module.exports = adminMiddleware; 