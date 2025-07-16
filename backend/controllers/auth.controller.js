import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const registerUser=async(req,res)=>{
  const {name,email,password}=req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try{

    /// checking if the user exists or not 
    const existUser=await User.findOne({email});
    if(existUser){
      return res.status(409).json({ message: 'Email already in use' });
    }

    // here we are hasing the password from tthe user
    const salt=await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(password,salt);

    //creating new user 
    const newUser=await User.create({
      name,
      email,
      password:hashPassword,
    });

    /// generrating tokenn
    const token=jwt.sign(
      {id:newUser._id},
      process.env.JWT_SECRET,
      {expiresIn:'7d'}
    );

    // sending the response upon sucessfull signup
    res.send(201).json({
      message:"User registered succesfully",
      user:{
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  }
  catch(e){
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}


export const loginUser=async(req,res)=>{
  const {email,password}=req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try{
    const findUser=await User.findOne({email});
    if(!findUser){
      return res.status(401).json({ message: 'Invalid credentials' });
    } 

    const isMatch=await bcrypt.compare(password,findUser.password);
    if(!isMatch){
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token=jwt.sign(
      {id:findUser._id},
      process.env.JWT_SECRET,
      {expiresIn:'7d'}
    );

    res.send(200).json({
      message:"User logged-in succesfully",
      findUser:{
        id:findUser._id,
        name:findUser.name,
        email:findUser.email
      },
      token,
    })

  }
  catch(e){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

