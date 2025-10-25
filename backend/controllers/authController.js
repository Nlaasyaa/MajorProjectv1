const User = require('../models/User');
const jwt = require('jsonwebtoken');

function signToken(user){
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

exports.register = async (req,res) => {
  try{
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ error: 'User exists' });
    const user = new User({ name, email, password });
    await user.save();
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name:user.name, email:user.email } });
  }catch(e){
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req,res) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id:user._id, name:user.name, email:user.email } });
  }catch(e){
    res.status(500).json({ error: e.message });
  }
};

exports.me = async (req,res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json({ user });
};
