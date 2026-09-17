const redisClient = require("../config/redis");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const salt = 10;

async function register(req, res) {
    const {username, password} = req.body;

    console.log(req.body)

    try {
        const userExists = await User.findOne({ where: { username }})
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, salt);
        await User.create({username, passwordHash});

        res.status(201).json({ msg: 'User registered successfully' });
    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: 'Error registering user', error });
    }
}

async function login(req, res) {
    const  { username, password } = req.body;

    try {
        const user = await User.findOne({where: { username }});
        if (!user || !(await bcrypt.compare(password, user.passwordHash))){
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        req.session.user = { id: user.id, username: user.username };
        res.json({ msg: 'Login successful', user: req.session.user });
    } catch(error) {
        res.status(500).json({ msg: 'Error logging in', error });
    }
}

function logout(req, res) {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({msg: "Logout failed"});
        }
        res.clearCookie('connect.sid');        
        res.json({msg: "logout succesful"})
    })
}
module.exports = { register, login, logout }