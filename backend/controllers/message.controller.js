import Message from "../models/mesasge.model";
import Chat from "../models/chat.model";
import User from "../models/user.model";


export const sendMessage=async(req,res)=>{
    const {content,chatId}=req.body;

    if (!content || !chatId) {
    return res.status(400).send("Missing content or chatId");
    }
    const newMessage={
      sender:req.user._id,
      content:content,
      chat:chatId
    };

    try{
      let message=await Message.create(newMessage);

      message=await message.populate("sender","name email");
      message = await message.populate("chat");
      message=await User.populate(message,{
        path: "chat.users",
        select: "name email",
      });

      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
      res.json(message);
    }catch(e){
      res.status(400).send(error.message);
    }
}


export const getMessage=async(req,res)=>{
  try{
    const messages=Message.find({chat:req.params.chatId})
      .populate("sender","name email")
      .populate("chat");
    
    res.json(messages);
  }
  catch(e){
    res.status(400).send(error.message);
  }
}