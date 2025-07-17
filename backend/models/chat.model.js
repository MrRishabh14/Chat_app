import mongoose from 'mongoose'

const chatSchema=new mongoose.Schema({
  isGroupChat:{
    type:Boolean,
    default: false,
  },
  chatName:{
    type:String,
    trim:true
  },
  participants:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  ],
  latestMessage:{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', // 
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},
{timestamps:true});

const Chat=mongoose.model('Chat',chatSchema);
export default Chat;