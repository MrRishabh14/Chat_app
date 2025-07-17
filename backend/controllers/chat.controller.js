import Chat from "../models/chat.model";
import User from "../models/user.model";

export const accessChat=async(req,res)=>{
  const {userId}=req.body;
  if (!userId) {
    return res.status(400).send("UserId param not sent with request");
  }

  let isChat=await Chat.find({
    isGroupChat:false,
    $and:[
      {users:{$elemMatch:{$eq: req.user._id}}},
      {users:{$elemMatch:{$eq: userId}}},
    ],
  }).populate("users","-passowrd")
  .populate("latestMessage");

  isChat=await User.populate(isChat,{
    path:"latestMessage.sender",
    select:"name email"
  });

  if(isChat){
    res.send(isChat);
  }
  else{
    const chatData={
      chatName:"sender",
      isGroupChat:false,
      users: [req.user._id, userId], 
    }

  };

  try{
    const createChat=await Chat.create(chatData);
    const fullChat=await Chat.findOne({_id:createChat._id }).populate("users","-password");
    res.status(200).send(fullChat);
  }
  catch(e){
    res.status(400).send(e.message);
  }
};

export const getAllchats=async(req,res)=>{
  try{
    const chats=await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
      .populate('users','-password')
      .populate('groupAdmin','-password')
      .populate('latestMesssage')
      .sort({updatedAt:-1});
    
    
    const fullChats=await User.populate(chats,{
       path: 'latestMessage.sender',
       select: 'name email',
    });

    res.status(200).send(fullChats);
  }
  catch(e){
    res.status(400).send({ message: e.message });
  }
};

