import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import RefreshTokenModel from '../models/RefreshTokenModel.js';
import { verifyToken } from '../middleware/verifyTokenMiddleware.js';
const route = express.Router();

//let refresh_token_array = [];

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

const refreshTkn = (id) => {
  return jwt.sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET);
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
    const refresh_token = refreshTkn(user._id);
    const find_token_in_Schema = await RefreshTokenModel.findOne({
      user: user._id
    });

    if (!find_token_in_Schema) {
      const refreshTokenModel = new RefreshTokenModel({
        token: refresh_token,
        user: user._id
      });
      await refreshTokenModel.save();
    } else {
      let new_token = await RefreshTokenModel.findOneAndUpdate(
        { user: user._id },
        { token: refresh_token },
        { new: true }
      );
    }

    //refresh_token_array.push(refresh_token);
    res.status(200).json({ user, token, refresh_token });
  } catch (err) {
    res.status(500).json(err);
  }
});

route.get('/home', verifyToken, (req, res) => {
  //res.status(200).json(req.user.userId + 'Welcome to Homepage');
  res.status(200).json('Welcome to Homepage');
});

route.post('/getNewTokenUsingRefresh', async (req, res) => {
  const refreshTkn_v = req.body.refresh_token;
  if (!refreshTkn_v) {
    return res.status(401).json('Token Required');
  }
  const decode = jwt.verify(refreshTkn_v, process.env.REFRESH_TOKEN_SECRET);
  if (!decode) {
    return res.status(403).json('Invalid token');
  }

  /*
  const find_token = refresh_token_array.find(
    (token) => token === refreshTkn_v
  );
  */

  const user_id = decode.userId;
  //console.log(user_id);

  const find_token = await RefreshTokenModel.findOne({ token: refreshTkn_v });

  if (!find_token) {
    return res.status(403).json('Token has been expired. Sign in again');
  } else {
    /*
    refresh_token_array = refresh_token_array.filter(
      (token) => token !== refreshTkn_v
    );
    */
    const token = accessTkn(user_id);
    const refresh_token = refreshTkn(user_id);
    let new_token = await RefreshTokenModel.findOneAndUpdate(
      { token: refreshTkn_v },
      { token: refresh_token },
      { new: true }
    );

    //refresh_token_array.push(refresh_token);
    return res.status(200).json({ token, refresh_token });
  }
});

export default route;
