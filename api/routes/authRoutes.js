import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
//import tokenVerifyMiddleware from '../middleware/verifyTokenMiddleware.js';
import { verifyToken } from '../middleware/verifyTokenMiddleware.js';
const route = express.Router();

//Register
route.post('/addUser', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword
    });
    const users = await user.save();
    !users && res.status(404).send('Not Created');
    res.status(201).send('User has been Created');
  } catch (err) {
    res.status(400).send('Error:Not Created');
  }
});

const accessTkn = (id) => {
  return jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30s'
  });
};

//Login
route.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json('User not found');

    const compPass = await bcrypt.compare(req.body.password, user.password);
    !compPass && res.status(400).json('Wrong Password');

    /*
    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30s'
      }
    );
    */
    const token = accessTkn(user._id);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

route.get('/home', verifyToken, (req, res) => {
  //res.status(200).json(req.user.userId + 'Welcome to Homepage');
  res.status(200).json('Welcome to Homepage');
});

export default route;
