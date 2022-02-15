module.exports=async(bot,msg)=>{
    
     for (let i=msg+1;i>0;i--) {
         await bot.deleteMessage("384042079", i).catch(er=>{return});
     }
   
     
 }