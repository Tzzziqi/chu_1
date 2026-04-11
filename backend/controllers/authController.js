// use controller to handle the logic of authentication
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//====== signup/ register ======
const signup = async (req, res) => {
    console.log('Debudding, Have you run this part?', req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
                error: 'Valudation_Error',
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered',
                error: 'Duplicate',
            });
        }
        const user = await User.create({ email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: { user: {id:user._id, email: user.email, role:user.role },
        token,},
        });
    } catch (error) {
        console.log('signup erro:', error);
        res.status(500).json({
            success: false, message: error.message, error: 'Server_Error',
        });
    }
};

//======== login / signin========
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
                error: 'Unauthorized',
            });
        }

        // +password because we need to see the password to compare
        const user = await User.findOne({ email }).select('+password');
        if (!user) {return res.status(401).json({
            success: false,
            message: 'Email or password is invalid',
            error: 'Unauthorized'
        });
    }
        // no ===, use isMatch because the password is encrpted, so we need the comparePassword method to do the work 
        const isMatch = await user.comparePassword(password);
        if (!isMatch) { return res.status(401).json({
            success: false,
            message: 'Email or password is invalid',
            error: 'Unauthorized'
        });
    }
        const token = generateToken(user._id);
        
        res.status(200).json({
            success: true,
            data: { user: {id:user._id, email: user.email, role:user.role },
        token,},
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error.message, error:'Server_Error',
        });
    }
};

// ====== update password ======
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old Password and New Password are Required',
        error: 'Validation_Error',
      });
    } 
    if (newPassword.length < 8 ) {
        return res.status(400).json({
            success: false,
            message: 'New Password has to be greater than 8 characters',
            error: 'Validation_Error',
        });
    }
    const user = await User.findById(req.user.id).select('+password');
    console.log('debug, Found User:', user);
    console.log('debug, has Password:', !!user.password);
    const isMatch = await user.comparePassword(oldPassword); 
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Old Password id Incorrect',
            error: 'Unauthorized'
        });
    }

    // set the new password and save it 
    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({
    success: true,
    data: { user: { id: user._id, email: user.email, role: user.role }, token },
    });

    }catch (error) {
        res.status(500).json({
            success: false, message: error.message, error:'Server_Error',
        });
    }
    };

    module.exports = { signup, signin, updatePassword }; //for router.post()