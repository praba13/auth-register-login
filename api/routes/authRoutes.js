import express from 'express';
import User from '../models/UserModel.js';
const route = express.Router();

route.post('/addUser', async (req, res) => {
  try {
    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    const users = await user.save();
    !users && res.status(404).send('Not Created');
    res.status(201).send('User has been Created');
  } catch (err) {
    res.status(400).send('Error:Not Created');
  }
});

export default route;
