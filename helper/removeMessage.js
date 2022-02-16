module.exports=async(chat_id,bot,msg)=>{
    
     for (let i=msg+1;i>0;i--) {
         await bot.deleteMessage(chat_id, i).catch(er=>{return});
     }
   
     
 }