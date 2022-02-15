//підключення бота
const TOKKEN="5187338885:AAFvQmAg38G0fpLAvcYPrneZbWY-tkHtXU0";
const TelegramApi=require("node-telegram-bot-api");
const bot= new TelegramApi(TOKKEN,{polling:true});
const express = require('express')
const app = express()
const port = 3002
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
//масив для id повідомлень(потрібен для очистки)
let messageId=0;
const removeAllMessage=require("./helper/removeMessage")//приймає обєкт бот та масив ід повідомлень(bot,messageId)

//бібліотека для https запитів
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


//масив для навігації.
const nav=[]//елементами масиву будуть обєкти з полями останнє повідомлення та останнє клавіатура;

// обєкт стану бота
const state={
    app:{
        activeApp:[],
        confirmApp:[],
        inuseApp:[],
        hideApp:[],
        banApp:[],
        penndingApp:[],
        chekGoogle:[]
    },
    mode:"",
    user:{
        first_name:"",
        last_name:""
    },
    keyboard_confirm_app:[],
    keyboard_active_app:[],
    keyboard_inUse_app:[],
    keyboard_inUse_app_local:[],
    keyboard_hideApp:[],
    keyboard_banApp:[],
    keyboard_pendingApp:[],
    keyboard_checkGoogle:[],
    control:{
        idApp:"",
        mode:""
    }

}

//обєкт констант навігації режиму роботи бота.
const bot_const_menu=require("./helper/modeApp");


//місце підключення додаткових функції API

const getActiveApp=require("./requestApi/getActiveApp")//отримати всі прілки із бд повертає масив або false якщо немає пріл.
const addApp=require("./requestApi/addApp")
const getConfirmApp=require("./requestApi/getConfirmApp")
const setApproveApp=require("./requestApi/setAproveApp")
const getUser=require("./requestApi/getUser")
const cancelApproveApp=require("./requestApi/cancelApproveApp")
const hideApp=require("./requestApi/hideApp")
const shareAppToUsers=require("./requestApi/shareAppToUser")
const deleteApp=require("./requestApi/deleteApp")
const getAppsInUse=require("./requestApi/getSoldApp")
const setRedirectUrl=require("./requestApi/setRedirectUrl")
const setRedirectPrecent=require("./requestApi/setRedirectPercent")
const findUser=require("./requestApi/findUser")
const setUserConfirmApp=require("./requestApi/setUserConfirmApp")
const getHideApp=require("./requestApi/getHideApp")
const showApp=require("./requestApi/showApp")
const changeAppStatus=require("./requestApi/changeAppStatus")
const getBanApp=require("./requestApi/getBanApp")
const getPenndingApp=require("./requestApi/getPenndingApp")
const setImageUrl=require("./requestApi/setImageUrl")
const getStateApp=require("./requestApi/getStateApp")
const setUrl=require("./requestApi/setURL")
const setNaming=require("./requestApi/setNaming")
//.................._........................

//підключення клавіатури



const home_keyboard=require("./keyboard/home_keyboard") 
const nav_keyboard=require("./keyboard/nav_keyboard")
const aprove_keyoard=require("./keyboard/aprove_keyboard");
const { get } = require("request");
const shareAppToUser = require("./requestApi/shareAppToUser");
const setRedirectGeo = require("./requestApi/setRedirectGeo");
const setPrice = require("./requestApi/setPrice");
const checkGooglePlay = require("./requestApi/checkGooglePlay");
const setURL = require("./requestApi/setURL");
//перевірка пріл якщо пройшли модерку
async function  checkAllPrills(){
  

    const stateApp=await getStateApp();
    state.app.activeApp=stateApp.activeApp;
    state.app.banApp=stateApp.banApp;
    state.app.confirmApp=stateApp.confirmApp;
    state.app.hideApp=stateApp.hideApp; 
    state.app.inuseApp=stateApp.inuseApp;
    state.app.penndingApp=stateApp.pendingApp;
       
      
     await   checkGooglePlay(state.app.penndingApp,state.app.chekGoogle)
      
}
//
//.................._........................ 
bot.on("message",msg=>{
    messageId=msg.message_id;
})
//запуск бота 
bot.onText(/\/start/, async msg=>{
   
    const {id}=msg.chat;
     messageId=msg.message_id;
     const stateApp=await getStateApp();
    state.app.activeApp=stateApp.activeApp;
    state.app.banApp=stateApp.banApp;
    state.app.confirmApp=stateApp.confirmApp;
    state.app.hideApp=stateApp.hideApp;
    state.app.inuseApp=stateApp.inuseApp;
    state.app.penndingApp=stateApp.pendingApp;
     await checkAllPrills()

    setTimeout(el=>{
setInterval(() => {
    checkAllPrills() 
}, 1800000);
    },6000)
    state.user.first_name=msg.from.first_name;
    state.user.last_name=msg.from.last_name;
   
    nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:await home_keyboard(state)},{message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})
    
    removeAllMessage(bot,messageId)
    bot.sendMessage(id,`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,{
        reply_markup:{inline_keyboard:home_keyboard(state)}
    })
    })

//перший рівень навігації
bot.on("callback_query",async query=>{
    const id=query.message.chat.id; 
    const data=query.data;
    messageId=query.message.message_id;
    
    switch (data){

     //додати прілку
        case bot_const_menu.addApp: 
        removeAllMessage(bot,messageId)
        nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})

        state.mode=bot_const_menu.addApp
        bot.sendMessage(id,"Введите информацию о приложении в формате:\nBit Vegas*\n400*\ngambling*\nbundle*",{
            reply_markup:{
                inline_keyboard:nav_keyboard
            }
        }) 
         break;
    //___________________________________________________________________________________//
    
      
        //підьвердити прілку
        case bot_const_menu.awaConfirm:
            removeAllMessage(bot,messageId);
            nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})

            state.mode=bot_const_menu.awaConfirm;
          
            state.app.confirmApp=await getConfirmApp();

            if(state.app.confirmApp.length>0){
                state.keyboard_confirm_app=state.app.confirmApp.map(el=>{
                    return  [
                        {
                            text:`${el.name}`,callback_data:`aw_confirm|${el.bundle}`
                        }
                    ]
                })
             
                // nav.push({message:"Ожидают подтверждения",keyboard:[...keyboard_confirm_app,...nav_keyboard]})
                bot.sendMessage(id,"Ожидают подтверждения",{
                    reply_markup:{
                        inline_keyboard:[...state.keyboard_confirm_app,nav_keyboard[1]]
                    }
                })
            }else{
                bot.sendMessage(id,"нет прил для подтверждения оплаты",{
                    reply_markup:{
                        inline_keyboard:[nav_keyboard[1]]
                    }
                })
            }




            
        
        break;
//___________________________________________________________________________________//

//активні пріли початок
        case bot_const_menu.activeApp:
            removeAllMessage(bot,messageId);
            nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.activeApp;
            state.app.activeApp=await getActiveApp();
            if(state.app.activeApp.length>0){
                state.keyboard_active_app=state.app.activeApp.map(el=>{
                    return  [
                        {
                            text:`${el.name}`,callback_data:`act_app|${el.bundle}`
                        }
                    ]
                })
                
             
                bot.sendMessage(id,"Активные прилы",{
                    reply_markup:{
                        inline_keyboard:[...state.keyboard_active_app,nav_keyboard[1]]
                    }
                })
            }else{
                bot.sendMessage(id,"нет активных",{
                    reply_markup:{
                        inline_keyboard:[nav_keyboard[1]]
                    }
                })
            }


        break;

//...............................................................................................    

//початок обробки пріл використовуються
        case bot_const_menu.inUse: 
        removeAllMessage(bot,messageId);
        nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})
        state.mode=bot_const_menu.inUse;
        state.app.inuseApp=await getAppsInUse();

          if(state.app.inuseApp.length>0){
                state.keyboard_inUse_app=state.app.inuseApp.map(el=>{
                    return  [
                        {
                            text:`${el.name}`,callback_data:`in_use|${el.bundle}`
                        }
                    ]
                })
                
             
                bot.sendMessage(id,"Прилы которые используются",{
                    reply_markup:{
                        inline_keyboard:[...state.keyboard_inUse_app,nav_keyboard[1]]
                    }
                })
            }else{
                bot.sendMessage(id,"нет активных",{
                    reply_markup:{
                        inline_keyboard:nav_keyboard[1]
                    }
                })
            }


        break; 

//............................................................................................... 
        case bot_const_menu.hideApp:
            //скриті прілки
            //getHideApp
          
            removeAllMessage(bot,messageId);
            nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.hideApp;
            state.app.hideApp=await getHideApp();
            if(state.app.hideApp.lengt!=0){
                state.keyboard_hideApp=state.app.hideApp.map(el=>{
                    return  [
                        {
                            text:`${el.name}`,callback_data:`hide_app|${el.bundle}`
                        }
                    ] 
                })
                
             
                bot.sendMessage(id,"Скрытые прилы",{
                    reply_markup:{
                        inline_keyboard:[...state?.keyboard_hideApp,nav_keyboard[1]]
                    }
                })
            }else{
                bot.sendMessage(id,"нет cкрытыхприл",{
                    reply_markup:{
                        inline_keyboard:nav_keyboard[1]
                    }
                })
            }
            //...................
            
        break;

        case bot_const_menu.banApp:
            
            removeAllMessage(bot,messageId);
            nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.banApp;
            state.app.banApp=await getBanApp();
            console.log("Ban App");
              if(state.app.banApp.length!=0){
                    state.keyboard_banApp=state.app.banApp.map(el=>{
                        return  [
                            {
                                text:`${el.name}`,callback_data:`ban_app|${el.bundle}`
                            }
                        ]
                    })
                    
                 
                    bot.sendMessage(id,"Забаненные прилы",{
                        reply_markup:{
                            inline_keyboard:[...state.keyboard_banApp,nav_keyboard[1]]
                        }
                    })
                }else{
                    bot.sendMessage(id,"нет забаненныех прил ",{
                        reply_markup:{
                            inline_keyboard:[nav_keyboard[1] ] 
                        }
                    })
                }
    

        
        break;

        //пріли в розробці
        case bot_const_menu.penndingApp:
            
            removeAllMessage(bot,messageId);
            nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.penndingApp;
            state.app.penndingApp=await getPenndingApp();
            
              if(state.app.penndingApp.length!=0){
                    state.keyboard_pendingApp=state.app.penndingApp.map(el=>{
                        return  [
                            {
                                text:`${el.name}`,callback_data:`pendding_app|${el.bundle}`
                            }
                        ]
                    })
                    
                 
                    bot.sendMessage(id,"Прилы в разработке",{
                        reply_markup:{
                            inline_keyboard:[...state.keyboard_pendingApp,nav_keyboard[1]]
                        }
                    })
                }else{
                    bot.sendMessage(id,"нет Прил в разработке",{
                        reply_markup:{
                            inline_keyboard:[nav_keyboard[1] ] 
                        }
                    })
                }
        
        
        break;
        ///.........................................
        //пройшли перевірку google play
        case bot_const_menu.chekGooglePlay:
            
            removeAllMessage(bot,messageId);
            nav.push({message:`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.chekGooglePlay;
            
              if(state.app.chekGoogle.length!=0){
                    state.keyboard_checkGoogle=state.app.chekGoogle.map(el=>{
                        return  [
                            {
                                text:`${el.name}`,callback_data:`chekGooglePlay|${el.bundle}`
                            }
                        ]
                    })
                    
                 
                    bot.sendMessage(id,"Прилы проверено Google play",{
                        reply_markup:{
                            inline_keyboard:[...state.keyboard_checkGoogle,nav_keyboard[1]]
                        }
                    })
                }else{
                    bot.sendMessage(id,"нет проверених прил",{
                        reply_markup:{
                            inline_keyboard:[nav_keyboard[1] ] 
                        }
                    })
                }
        
        
        
        break;
        case bot_const_menu.home: 
            removeAllMessage(bot,messageId);
            state.mode="";
            const homeState={...nav[0]}
            nav.splice(1,nav.length)
            
            bot.sendMessage(id,`Привет, Робин Гуд.\n${state.user.first_name} \n ${state.user.last_name}\n\nВсе прилы Шервудского леса под твоим контролем.`,{
                reply_markup:{
                    inline_keyboard:home_keyboard(state) 
                }
            })
            
        break;
        case bot_const_menu.back: 
        removeAllMessage(bot,messageId);
        const lastState=nav.pop(); 
      //  state.mode=""; 
        bot.sendMessage(id,lastState?.message,{
            reply_markup:{ 
                inline_keyboard:lastState?.keyboard 
            }
        })
        break;
        
    }
    })


    //додати прілку зчитування даних
    bot.on("message",msg=>{
        messageId=msg.message_id;
     
    
        const {id}=msg.chat; 
        
        if(state.mode===bot_const_menu.addApp){
           const text=msg.text.split("*");
           const app={ 
            name:text[0]||"empty name",
            price:text[1]||400,
            type:text[2]||"",
            bundle:text[3]||"test.bundle",
            url:"",
            redirect_traff_url:"",
            redirect_traff_percent:3


        }
        if(addApp(app)){
            bot.sendMessage(id,"прилу добавлено",{
                reply_markup:{
                    inline_keyboard:nav_keyboard
                }
            })
        } else {
            bot.sendMessage(id,"прилу не добавлено",{
                reply_markup:{
                    inline_keyboard:nav_keyboard
                }
            })
        }
        }


        
        
    })
 
    //...........................................

    //обробка підтвердити прілку


bot.on("callback_query",async query=>{
    const id=query.message.chat.id; 
    const data=query.data;
    messageId=query.message.message_id;

    if(data.indexOf("aw_confirm|")!=-1){
        removeAllMessage(bot,messageId)
    
        nav.push({message:"Ожидают подтверждения",keyboard:[...state.keyboard_confirm_app,...nav_keyboard]});
        const choseApp=state.app.confirmApp.find(el=>{return el.bundle===data.split("|")[1]});
        const approvePay= [[
            {
                text:`Подтвердить оплату`,callback_data:`approvePay|${data.split("|")[1]}`
            }
        ],  [
            {
                text:`Контакт покупателя`,callback_data:`contact_user|${choseApp.user_confirm}`
            }
        ], [
            {
                text:`Отклонить`,callback_data:`cancel_pay|${data.split("|")[1]}|${choseApp.user_confirm}`
            }
        ],] 
       
        bot.sendMessage(id,`${choseApp.name} (${choseApp.price})-hiden\n Google Play:{google.com}\n 10.09.2019`,{
            reply_markup:{
                inline_keyboard:[...approvePay,nav_keyboard[1]] 
            }
        })

    }
    if(data.indexOf("approvePay")!=-1){
        const bundle=data.split("|")[1];
        if(setApproveApp({
            bundle:bundle
        })){
            let arr=state.app.confirmApp.find(el=>el.bundle!=bundle);
           state.app.confirmApp=arr;

            removeAllMessage(bot,messageId);
            bot.sendMessage(id,"оплата подтверждена",{//коли буде готова бот для користувачів потрібно буде надіслати їм смс про що оплата підтверджена
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]] 
                }
            })

        }

    }
    if((bot_const_menu.contactUser===data.split("|")[0])&&((state.mode==="aw_confirm"))){
        removeAllMessage(bot,messageId)
        console.log("Aw");
         const user=await getUser(data.split("|")[1])
         bot.sendMessage(id,`Контакт покупателя:${user.userName}\n IdTelegram:${user.userIdTelegram}\nNikName@${user.userTelegram_nik}`,{
             reply_markup:{
                 inline_keyboard:nav_keyboard
                 
             }
         });

    }
    if(bot_const_menu.cancelPay===data.split("|")[0]){ 
        const bundle=data.split("|")[1];
        const userIdtelegram=data.split("|")[2];
        if(cancelApproveApp({
            bundle:bundle
        })){
            bot.sendMessage(id,`отказано в оплате, прила возвращена в общий доступ:`,{//повідомити користувача
                reply_markup:{
                    inline_keyboard:nav_keyboard
                }
            });
 
        }

    }
    
})

    //....................................

    //обробка активні прілки
    
    bot.on("callback_query",async query=>{
        const id=query.message.chat.id; 
        const data=query.data; 
        messageId=query.message.message_id;
    if(data.indexOf("act_app|")!=-1){
        removeAllMessage(bot,messageId)
        nav.push({message:"Активные прилы",keyboard:[...state.keyboard_active_app,...nav_keyboard]});
        const choseApp=state.app.activeApp.find(el=>{return el.bundle===data.split("|")[1]});
        const activeApp= [[
            {
                text:`Cкрыть`,callback_data:`hides_app|${choseApp._id}`
            }
        ],  [
            {
                text:`Расшарить по username`,callback_data:`share_app|${choseApp._id}`
            }
        ],  [
            {
                text:`Расшарить юзеру`,callback_data:`share_app_to_user|${choseApp._id}`
            }
        ],[
            {
                text:`Удалить`,callback_data:`delete_app|${choseApp._id}`
            }
        ],] 
        

        bot.sendMessage(id,`# ${choseApp.name} (${choseApp.price}, ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) 
        *Google Play*:${choseApp.google_play_url}
        *Автопуши *:
         Текст:${choseApp.notification_text}
         Время старта: ${choseApp.notification_start}min.
         Интервал: ${choseApp.notification_interval}min.
         Макс.к-во: ${choseApp.max_count}
        *Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}
        ${choseApp.image_link}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...activeApp,...nav_keyboard]
            }
        })
    }
    if((state.mode===bot_const_menu.activeApp)&&(data.split("|")[0]===bot_const_menu.hidesApp)){//скрити   
        //hidesApp
        removeAllMessage(bot,messageId)
        if(hideApp({app_id:data.split("|")[1]})){
            bot.sendMessage(id,"Прилу Cкрыто",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]]
                }
            });
        }else  bot.sendMessage(id,"Щось пішло не так");
    }

    if((state.mode===bot_const_menu.activeApp)&&(data.split("|")[0]===bot_const_menu.shareApp)){//розшарити
        //shareAppToUsers
        removeAllMessage(bot,messageId)

         if(shareAppToUser({app_id:data.split("|")[1]})){
            bot.sendMessage(id,"Прилу розшарино",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]]
                }
            });
        }else  bot.sendMessage(id,"Щось пішло не так");
    }
    if((state.mode===bot_const_menu.activeApp)&&(data.split("|")[0]===bot_const_menu.shareAppToUser)){//розшарити
        //shareAppToUsers
    
          //shareAppToUsers
        removeAllMessage(bot,messageId)
        const idApp=data.split("|")[1]
        const choseApp=state.app.activeApp.find(el=>el._id==idApp)
        state.control.mode="share_app_to_user";
        state.control.idApp=idApp;
        bot.sendMessage(id,"введите данные пользователя для поиска в бд.(userName )",{
            reply_markup:{
                inline_keyboard:[[ {
                    text:`🢘Назад`,callback_data:`act_app|${choseApp.bundle}`
                }]]
            }
        })
        

    }
    if(((state.mode==bot_const_menu.activeApp)||(state.mode==bot_const_menu.hideApp))&&(data.split("|")[0]==bot_const_menu.shareYes)){
        //   text:`Да`,callback_data:`share_yes|${user.userIdTelegram}|${choseApp.bundle}`
        removeAllMessage(bot,messageId)
        const usetId=data.split("|")[1];
        const bundleApp=data.split("|")[2];
        try{
       await setUserConfirmApp({
            bundle:bundleApp,
            confirmId:usetId
        })
        if(await setApproveApp({bundle:bundleApp})){
            bot.sendMessage(id,"Прилу передано пользователю!",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]] 
                }
            }) 
        }else{
            bot.sendMessage(id,"Штото пошло не так",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]]
                }
            }) 
        }
    
    }
        catch(er){
            console.log(er);
        }
    }
     

    if(((state.mode===bot_const_menu.activeApp)||(state.mode===bot_const_menu.hideApp)||(state.mode===bot_const_menu.banApp))&&(data.split("|")[0]===bot_const_menu.deleteApp)){//удалити
        if(deleteApp({id:data.split("|")[1]})){
            removeAllMessage(bot,messageId)
            bot.sendMessage(id,"Прила удалина",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]]
                }
            });
        }else  bot.sendMessage(id,"Щось пішло не так");  
    }
     
    
    })


    //.............................................
    //обробка пріли які використовуються

    bot.on("callback_query",async query=>{
        const id=query.message.chat.id; 
        const data=query.data; 
        messageId=query.message.message_id;
    
        if(data.indexOf("in_use|")!=-1){
            removeAllMessage(bot,messageId)
            nav.push({message:"Прилы которые используются",keyboard:[...state.keyboard_inUse_app,...nav_keyboard]});
            const choseApp= await state.app.inuseApp.find(el=>{return el.bundle===data.split("|")[1]});
            const inUseApp= [[
                {
                    text:`Изменить ссылку`,callback_data:`change_ref|${choseApp._id}`  
                }
            ],  [
                {
                    text:`Изменить процент редиректа`,callback_data:`change_redirect_p|${choseApp._id}` 
                } 
            ], [
                { 
                    text:`Изменить разрешенные гео`,callback_data:`change_geo_app|${choseApp._id}`
                }
            ], 
            [
                {
                    text:`Контакт покупателя`,callback_data:`contact_user|${choseApp._id}`
                } 
            ],
        
        ] 
        state.keyboard_inUse_app_local=inUseApp;
        const geoArr=choseApp?.geo?.sort((a,b)=>{
            return b.installs-a.installs
        })
        bot.sendMessage(id,`# ${choseApp.name} (${choseApp.price}, ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) \n*Ccылка:*${choseApp.url}\n*К-во уникальных пользователей - *${choseApp.installs}\n*Топ Гео:*${geoArr.length!=0?geoArr.map(el=>"\n"+el.geo_it+":"+el.installs):"Нет гео"}\n*Автопуши *: Текст:${choseApp.notification_text}\nВремя старта: ${choseApp.notification_start}min.\nИнтервал: ${choseApp.notification_interval}min. \nМакс.к-во: ${choseApp.max_count}\n*Редирект*: ${choseApp.redirect_traff_url}\n*Разрешены гео:${choseApp.redirect_traff_urls}*\n*Процент редиректа:*${choseApp.redirect_traff_percent}%\n*Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}\n${"https://play.google.com/store/apps/details?id=com.rovio.angrybirdsfriends"}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...inUseApp,...nav_keyboard] 
            }
        })
        }
        //змінити силку редіректу
        if((state.mode===bot_const_menu.inUse)&&(data.split("|")[0]===bot_const_menu.changeReff)){
            const appID=data.split("|")[1];
            removeAllMessage(bot,messageId)
            const choseApp=state.app.inuseApp.find(el=>{return el._id===appID});

            state.control.mode=bot_const_menu.changeReff
            state.control.idApp=choseApp._id;

            
          
            
            state.control.idApp=appID;
            state.control.mode=bot_const_menu.changeReff;
            
            bot.sendMessage(id,"Введите redirect url:",{
                reply_markup:{
                    inline_keyboard:[[{
                        text:`🢘Назад`,callback_data:`in_use|${choseApp.bundle}`
                    }],nav_keyboard[1]]
                } 
            })
        }
             //змінити процент редіректу
             if((state.mode===bot_const_menu.inUse)&&(data.split("|")[0]===bot_const_menu.changeRedirectP)){
                const appID=data.split("|")[1];
                removeAllMessage(bot,messageId)
                const choseApp=state.app.inuseApp.find(el=>{return el._id===appID});
              
               
                state.control.idApp=appID;
                state.control.mode=bot_const_menu.changeRedirectP;
                
                bot.sendMessage(id,"Введите новий процент redirect:",{
                    reply_markup:{
                        inline_keyboard:[[{
                            text:`🢘Назад`,callback_data:`in_use|${choseApp.bundle}` 
                        }],nav_keyboard[1]]
                    }  
                })
            }  
    
             //змінити  гео
    if((state.mode===bot_const_menu.inUse)&&(data.split("|")[0]===bot_const_menu.changeGeoApp)){
        const appID=data.split("|")[1];
        removeAllMessage(bot,messageId)
        const choseApp=state.app.inuseApp.find(el=>{return el._id===appID});
       
       
        state.control.idApp=appID;
        state.control.mode=bot_const_menu.changeGeoApp;
        
        bot.sendMessage(id,"Введите  гео (UA RU IT):",{
            reply_markup:{
                inline_keyboard:[[{
                    text:`🢘Назад`,callback_data:`in_use|${choseApp.bundle}` 
                }],nav_keyboard[1]]
            }  
        })
    }  
//контакт user.
    if((state.mode===bot_const_menu.inUse)&&(data.split("|")[0]===bot_const_menu.contactUser)){
        const appID=data.split("|")[1];
        removeAllMessage(bot,messageId)
        const choseApp=state.app.inuseApp.find(el=>{return el._id===appID});
       
       
        state.control.idApp=appID;
        state.control.mode=bot_const_menu.changeRedirectP;
         const user=await getUser(choseApp.user_confirm)
        bot.sendMessage(id,`Контакт покупателя:\n${user.userName}\n${user.userIdTelegram}\n${user.userTelegram_nik}`,{
            reply_markup:{
                inline_keyboard:[[{
                    text:`🢘Назад`,callback_data:`in_use|${choseApp.bundle}` 
                }],nav_keyboard[1]]
            }  
        })
    }
    });
    

    bot.on("message",async msg=>{
               //змінити силку редіректу
               if((state.mode===bot_const_menu.inUse)&&(state.control.mode==bot_const_menu.changeReff)){
                messageId=msg.message_id;
                const id=msg.chat.id;
                const text=msg.text;

                if(setRedirectUrl({id:state.control.idApp,url:text})){
                    state.app.inuseApp.forEach(e=>{
                        if(e._id==state.control.idApp){
                            e.redirect_traff_url=text
                        }
                    })
                    bot.sendMessage(id,"Ссылка изменилась")
                }else  bot.sendMessage(id,"Штото пошло не так")

               }
               //.........................
               // змінити процент редіректу
               if((state.mode===bot_const_menu.inUse)&&(state.control.mode==bot_const_menu.changeRedirectP)){
                messageId=msg.message_id;
                const id=msg.chat.id;
                const text=msg.text;

                if(setRedirectPrecent({id:state.control.idApp,percent:text})){
                    state.app.inuseApp.forEach(e=>{
                        if(e._id==state.control.idApp){
                            e.redirect_traff_percent=text;
                        }
                    })
                    bot.sendMessage(id,"Процент редиректу измененный ")
                }else  bot.sendMessage(id,"Штото пошло не так")

               }
               //.................................
               
               //змінит гео:
               if((state.mode===bot_const_menu.inUse)&&(state.control.mode==bot_const_menu.changeGeoApp)){
                messageId=msg.message_id;
                const id=msg.chat.id;
                const text=msg.text;

                if(setRedirectGeo({id:state.control.idApp,geo:text})){
                    state.app.inuseApp.forEach(e=>{
                        if(e._id==state.control.idApp){
                            e.redirect_traff_urls=text.split(" ");
                        }
                    })
                    bot.sendMessage(id,"Новый GEO установлен ")
                }else  bot.sendMessage(id,"Штото пошло не так")

               }

               //........................
        //розшарить прилу
        if(((state.mode===bot_const_menu.activeApp)||(state.mode===bot_const_menu.hideApp))&&(state.control.mode==bot_const_menu.shareAppToUser)){
            
            messageId=msg.message_id;
            const id=msg.chat.id;
            const text=msg.text.trim();
            const idApp=state.control.idApp;
            let choseApp;
            if(state.mode===bot_const_menu.activeApp) choseApp=state.app.activeApp.find(el=>el._id==idApp)
            if(state.mode===bot_const_menu.hideApp) choseApp=state.app.hideApp.find(el=>el._id==idApp)
            let user=await findUser({userName:text});
            
            
            if(user!=undefined){ 
                bot.sendMessage(id,`Пользователь найден ${user.userName}:\nрасшарить пользователю прилу?`,{
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {
                                    text:`Да`,callback_data:`share_yes|${user.userIdTelegram}|${choseApp.bundle}`
                                },
                                {
                                    text:`Нет`,callback_data:`act_app|${choseApp.bundle}`
                                }
                            ]]
                    }
                })
            }else {
                bot.sendMessage(id,"Пользователь не найден",{
                    reply_markup:{
                        inline_keyboard:[[
                            {text:`<=Назад`,callback_data:`${state.mode=="act_app"?"act_app":"hide_app"}|${choseApp.bundle}`}
                        ]]
                    }
                })
            }


          

           }




    })
    
    //.................................................... .......

    // скриті пріли
    bot.on("callback_query",async query=>{
        const id=query.message.chat.id; 
        const data=query.data; 
        messageId=query.message.message_id;
    if(data.indexOf("hide_app|")!=-1){
        removeAllMessage(bot,messageId)
        // nav.push({message:"Cкрытые прилы",keyboard:[...state.keyboard_active_app,...nav_keyboard]});
        const choseApp=state.app.hideApp.find(el=>{return el.bundle===data.split("|")[1]});
        const activeApp= [[
            {
                text:`Показать`,callback_data:`show_app|${choseApp._id}`
            }
        ],   [
            {
                text:`Расшарить юзеру`,callback_data:`share_app_to_user|${choseApp._id}`
            }
        ],[
            {
                text:`Удалить`,callback_data:`delete_app|${choseApp._id}`
            }
        ],] 
        

        bot.sendMessage(id,`# ${choseApp.name} (${choseApp.price}, ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) 
        *Google Play*:${choseApp.google_play_url}
        *Автопуши *:
         Текст:${choseApp.notification_text}
         Время старта: ${choseApp.notification_start}min.
         Интервал: ${choseApp.notification_interval}min.
         Макс.к-во: ${choseApp.max_count}
        *Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}
        ${choseApp.image_link}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...activeApp,...nav_keyboard]//не забути доробити 
            }
        })
    }
    if((state.mode===bot_const_menu.hideApp)&&(data.split("|")[0]==="show_app")){//скрити   
        //showApp
        removeAllMessage(bot,messageId)
        if(showApp({app_id:data.split("|")[1]})){
            bot.sendMessage(id,"Прилу сделано видимой",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]]
                }
            });
        }else  bot.sendMessage(id,"Щось пішло не так");
    }

    
    if((state.mode===bot_const_menu.hideApp)&&(data.split("|")[0]===bot_const_menu.shareAppToUser)){//розшарити
        //shareAppToUsers
          //shareAppToUsers
        removeAllMessage(bot,messageId)
        const idApp=data.split("|")[1]
        const choseApp=state.app.hideApp.find(el=>el._id==idApp)
        state.control.mode="share_app_to_user";
        state.control.idApp=idApp;
        bot.sendMessage(id,"введите данные пользователя для поиска в бд.(userName )",{
            reply_markup:{
                inline_keyboard:[[ {
                    text:`🢘Назад`,callback_data:`hide_app|${choseApp.bundle}`
                }]]
            }
        })
        

    }
    
     

    











})
    //...............................



    
    bot.on("callback_query",async query=>{
        const id=query.message.chat.id; 
        const data=query.data; 
        messageId=query.message.message_id; 
    
        if(data.indexOf("ban_app|")!=-1){
            removeAllMessage(bot,messageId)
          
            
            const choseApp= await state.app.banApp.find(el=>{return el.bundle===data.split("|")[1]});
            const inUseApp= [[
                {
                    text:`Удалить`,callback_data:`delete_app|${choseApp._id}`  
                }
            ],  
            [
                {
                    text:`Контакт покупателя`,callback_data:`contact_user|${choseApp._id}`
                } 
            ],
        
        ] 
        state.keyboard_inUse_app_local=inUseApp;
        const geoArr=choseApp?.geo?.sort((a,b)=>{
            return b.installs-a.installs
        })
        bot.sendMessage(id,`# ${choseApp.name} (${choseApp.price}, ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) \n*Ccылка:*${choseApp.url}\n*К-во уникальных пользователей - *${choseApp.installs}\n*Топ Гео:*${geoArr.length!=0?geoArr.map(el=>"\n"+el.geo_it+":"+el.installs):"Нет гео"}\n*Автопуши *: Текст:${choseApp.notification_text}\nВремя старта: ${choseApp.notification_start}min.\nИнтервал: ${choseApp.notification_interval}min. \nМакс.к-во: ${choseApp.max_count}\n*Редирект*: ${choseApp.redirect_traff_url}\n*Разрешены гео:${choseApp.redirect_traff_urls}*\n*Процент редиректа:*${choseApp.redirect_traff_percent}%\n*Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}\n${choseApp.google_play_url}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...inUseApp,...nav_keyboard] 
            }
        }) 
        }

     
        if((state.mode===bot_const_menu.banApp)&&(data.split("|")[0]===bot_const_menu.contactUser)){
            
            const appID=data.split("|")[1];
            removeAllMessage(bot,messageId)
            const choseApp=state.app.banApp.find(el=>{return el._id===appID});
           
           
            state.control.idApp=appID;
            state.control.mode=bot_const_menu.changeRedirectP;
             const user=await getUser(choseApp.user_confirm)
             console.log("BanAPP Contact");
            bot.sendMessage(id,`Контакт покупателя:\n${user.userName}\n${user.userIdTelegram}\n${user.userTelegram_nik}`,{
                reply_markup:{
                    inline_keyboard:[[{
                        text:`🢘Назад`,callback_data:`ban_app|${choseApp.bundle}`  
                    }],nav_keyboard[1]]
                }  
            })
        }
             

    });




    //обробка пріл в очікуванні 
    bot.on("callback_query",async query=>{
        const id=query.message.chat.id; 
        const data=query.data; 
        messageId=query.message.message_id; 
    
        if(data.indexOf("pendding_app|")!=-1){
            removeAllMessage(bot,messageId)
          
            
            const choseApp= await state.app.penndingApp.find(el=>{return el.bundle===data.split("|")[1]});
            const penddingApp= [[
                {
                    text:`Установить ссылку на картинку`,callback_data:`set_img_url|${choseApp._id}`  
                }
            ],  
            [
                {
                    text:`Изменить цену`,callback_data:`change_price|${choseApp._id}`
                } 
            ],   [
                {
                    text:`Изменить ссылку редиректу`,callback_data:`change_ref|${choseApp._id}`
                } 
            ],
            [
                {
                    text:`Изменить процент редиректу`,callback_data:`change_redirect_p|${choseApp._id}`
                } 
            ],
            [
                {
                    text:`Почистить url `,callback_data:`clean_url|${choseApp._id}`
                } 
            ],
            [
                {
                    text:`Установить naming`,callback_data:`set_naming|${choseApp._id}`
                } 
            ]
        
        ] 
        const geoArr=choseApp?.geo?.sort((a,b)=>{
            return b.installs-a.installs
        })
  
        bot.sendMessage(id,`# ${choseApp.name} (${choseApp.price}, ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) \n*Ccылка:*${choseApp.url}\n*К-во уникальных пользователей - *${choseApp.installs}\n*Naming:*${choseApp.naming.lengt!=0?choseApp.naming.map(el=>"\n"+el.name+" - "+el.name_ref):"Нет неймингов"}\n*Топ Гео:*${geoArr.length!=0?geoArr.map(el=>"\n"+el.geo_it+":"+el.installs):"Нет гео"}\n*Автопуши *: Текст:${choseApp.notification_text}\nВремя старта: ${choseApp.notification_start}min.\nИнтервал: ${choseApp.notification_interval}min. \nМакс.к-во: ${choseApp.max_count}\n*Редирект*: ${choseApp.redirect_traff_url}\n*Разрешены гео:${choseApp.redirect_traff_urls}*\n*Процент редиректа:*${choseApp.redirect_traff_percent}%\n*Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}\n${choseApp.google_play_url}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...penddingApp,[{
                    text:`🢘Назад`,callback_data:`pendding_app`
                }],nav_keyboard[1]] 
            }
        }) 
        }
        

        //очистити url
        if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.cleanUrl)){
            const appID=data.split("|")[1];
            removeAllMessage(bot,messageId)
            const choseApp=state.app.penndingApp.find(el=>{return el._id===appID});
        
          if(setURL({url:"",id:appID})){
            state.app.penndingApp.forEach(e=>{
                if(e._id==appID){
                    e.url=""
                }
            })
            bot.sendMessage(id,"URL был изменен ! ",{
                reply_markup:{
                    inline_keyboard:[[{
                        text:`🢘Назад`,callback_data:`pendding_app|${choseApp.bundle}`
                    }],nav_keyboard[1]]
                } 
            }) 
          }else{
            bot.sendMessage(id,"Шото не так  ",{
                reply_markup:{
                    inline_keyboard:[[{
                        text:`🢘Назад`,callback_data:`pendding_app|${choseApp.bundle}`
                    }],nav_keyboard[1]]
                } 
            }) 
          }
            
            
        }

        //
//set Url

if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.changeReff)){
    const appID=data.split("|")[1];
    removeAllMessage(bot,messageId)
    const choseApp=state.app.penndingApp.find(el=>{return el._id===appID});

    

    bot.sendMessage(id,"Введите redirect url:",{
        reply_markup:{
            inline_keyboard:[[{
                text:`🢘Назад`,callback_data:`pendding_app|${choseApp.bundle}`
            }],nav_keyboard[1]]
        } 
    })
}
//setImage

if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.setImageUrl)){
    const appID=data.split("|")[1];
    removeAllMessage(bot,messageId)
    const choseApp=state.app.penndingApp.find(el=>{return el._id===appID});

    state.control.mode=bot_const_menu.changeReff
    state.control.idApp=choseApp._id; 
    state.control.idApp=appID;
    state.control.mode=bot_const_menu.changeReff;
    
    bot.sendMessage(id,"Введите Image url:",{
        reply_markup:{
            inline_keyboard:[[{
                text:`🢘Назад`,callback_data:`pendding_app|${choseApp.bundle}`
            }],nav_keyboard[1]]
        } 
    })
}
//setPrice

if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.changePrice)){
    const appID=data.split("|")[1];
    removeAllMessage(bot,messageId)
    const choseApp=state.app.penndingApp.find(el=>{return el._id===appID});

    state.control.mode=bot_const_menu.changeReff
    state.control.idApp=choseApp._id; 
    state.control.idApp=appID;
    state.control.mode=bot_const_menu.changePrice;
    
    bot.sendMessage(id,"Введите цену на прілку:",{
        reply_markup:{
            inline_keyboard:[[{
                text:`🢘Назад`,callback_data:`pendding_app|${choseApp.bundle}`
            }],nav_keyboard[1]]
        } 
    })
}
 //змінити процент редіректу зутвштп
 if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.changeRedirectP)){
    const appID=data.split("|")[1];
    removeAllMessage(bot,messageId)
    const choseApp=state.app.penndingApp.find(el=>{return el._id===appID});
  
   
    state.control.idApp=appID;
    state.control.mode=bot_const_menu.changeRedirectP;
    
    bot.sendMessage(id,"Введите новий процент redirect:",{
        reply_markup:{
            inline_keyboard:[[{
                text:`🢘Назад`,callback_data:`in_use|${choseApp.bundle}` 
            }],nav_keyboard[1]]
        }  
    })
}  

if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.setNaming)){
    const appID=data.split("|")[1];
    removeAllMessage(bot,messageId)
    const choseApp=state.app.penndingApp.find(el=>{return el._id===appID});
  
   
    state.control.idApp=appID;
    state.control.mode=bot_const_menu.setNaming;
    
    bot.sendMessage(id,"Введите naming у формате:(name-url)",{
        reply_markup:{
            inline_keyboard:[[{
                text:`🢘Назад`,callback_data:`pendding_app|${choseApp.bundle}` 
            }],nav_keyboard[1]]
        }  
    })
}  




///


    });
    //обробка

    bot.on("message",async msg=>{
        //змінити силку редіректу /pendingapp
         messageId=msg.message_id;
        if((state.mode===bot_const_menu.penndingApp)&&(state.control.mode==bot_const_menu.changeReff)){
         messageId=msg.message_id;
         const id=msg.chat.id;
         const text=msg.text;

         if(setRedirectUrl({id:state.control.idApp,url:text})){
             state.app.penndingApp.forEach(e=>{
                 if(e._id==state.control.idApp){
                     e.redirect_traff_url=text
                 }
             })
             bot.sendMessage(id,"Ссылка изменилась")
         }else  bot.sendMessage(id,"Штото пошло не так")

        }
    //setImageUrl

    if((state.mode===bot_const_menu.penndingApp)&&(state.control.mode==bot_const_menu.setImageUrl)){
         messageId=msg.message_id;
         const id=msg.chat.id;
         const text=msg.text;
        
         if(setImageUrl({id:state.control.idApp,url:text})){
             state.app.penndingApp.forEach(e=>{
                 if(e._id==state.control.idApp){
                     e.image_link=text
                 }
             })
             bot.sendMessage(id,"Image Url изменилась")
         }else  bot.sendMessage(id,"Штото пошло не так")

        }

        //setPrice

        if((state.mode===bot_const_menu.penndingApp)&&(state.control.mode==bot_const_menu.changePrice)){
            messageId=msg.message_id;
            const id=msg.chat.id;
            const text=msg.text;
           console.log("SetPrice");
            if(setPrice({id:state.control.idApp,price:text})){
                state.app.penndingApp.forEach(e=>{
                    if(e._id==state.control.idApp){
                        e.price=text
                    }
                }) 
                bot.sendMessage(id,"Вы установили новую цену ")
            }else  bot.sendMessage(id,"Штото пошло не так")
   
           }
    


           if((state.mode===bot_const_menu.penndingApp)&&(state.control.mode==bot_const_menu.changeRedirectP)){
            messageId=msg.message_id;
            const id=msg.chat.id;
            const text=msg.text;

            if(setRedirectPrecent({id:state.control.idApp,percent:text})){
                state.app.penndingApp.forEach(e=>{
                    if(e._id==state.control.idApp){
                        e.redirect_traff_percent=text;
                    }
                })
                bot.sendMessage(id,"Процент редиректу измененный ")
            }else  bot.sendMessage(id,"Штото пошло не так")

           }

//устанавить нейминг
if((state.mode===bot_const_menu.penndingApp)&&(state.control.mode==bot_const_menu.setNaming)){
    messageId=msg.message_id;
    const id=msg.chat.id;
    const text=msg.text;

    if(setNaming({id:state.control.idApp,naming:text})){
        state.app.penndingApp.forEach(e=>{
            if(e._id==state.control.idApp){
                e.naming.push({
                    name:text.split("-")[0],
                    name_ref:text.split("-")[1]
                })
            }
        })
        bot.sendMessage(id,"Нейминг добавлен ")
    }else  bot.sendMessage(id,"Штото пошло не так")

   }



    })

    //.......................................
    
//обробник пріл пройшли модерацію





bot.on("callback_query",async query=>{
    const id=query.message.chat.id; 
    const data=query.data; 
    messageId=query.message.message_id; 

    if(data.indexOf("chekGooglePlay|")!=-1){
        removeAllMessage(bot,messageId)
      
        
        const choseApp= await state.app.chekGoogle.find(el=>{return el.bundle===data.split("|")[1]});
        const googleAps= [
          [
            {
                text:`Спрятать прилу`,callback_data:`hided_apps|${choseApp._id}`
            } 
        ],
        [
            {
                text:`Сделать активной`,callback_data:`make_active|${choseApp._id}`
            } 
        ],
    
    ] 
    const geoArr=choseApp?.geo?.sort((a,b)=>{
        return b.installs-a.installs
    })

    bot.sendMessage(id,`# ${choseApp.name} (${choseApp.price}, ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) \n*Ccылка:*${choseApp.url}\n*К-во уникальных пользователей - *${choseApp.installs}\n*Топ Гео:*${geoArr.length!=0?geoArr.map(el=>"\n"+el.geo_it+":"+el.installs):"Нет гео"}\n*Автопуши *: Текст:${choseApp.notification_text}\nВремя старта: ${choseApp.notification_start}min.\nИнтервал: ${choseApp.notification_interval}min. \nМакс.к-во: ${choseApp.max_count}\n*Редирект*: ${choseApp.redirect_traff_url}\n*Разрешены гео:${choseApp.redirect_traff_urls}*\n*Процент редиректа:*${choseApp.redirect_traff_percent}%\n*Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}\n${choseApp.google_play_url}`,{
        parse_mode:"Markdown",
        reply_markup:{
            inline_keyboard:[...googleAps,[{
                text:`🢘Назад`,callback_data:`chekGooglePlay`
            }],nav_keyboard[1]] 
        }
    }) 
    }
//заховати прілу

if((state.mode===bot_const_menu.chekGooglePlay)&&(data.split("|")[0]===bot_const_menu.hidedApps)){
const appID=data.split("|")[1];
removeAllMessage(bot,messageId)
const choseApp=state.app.chekGoogle.find(el=>{return el._id===appID});

//const app= await App.find({sold:false,visibility_public:false,status:"active"})

if(hideApp({app_id:appID})){
    const apps=state.app.chekGoogle.filter(el=>el._id==appID);
    state.app.chekGoogle=state.app.chekGoogle.filter(el=>el._id!=appID);
    state.app.hideApp.push(apps)
bot.sendMessage(id,"Прилу скрыто!",{
    reply_markup:{
        inline_keyboard:[nav_keyboard[1]]
    } 
})}else{
    bot.sendMessage(id,"Прилу НЕ скрыто!",{
        reply_markup:{
            inline_keyboard:[[{
                text:`🢘Назад`,callback_data:`chekGooglePlay|${choseApp.bundle}`
            }],nav_keyboard[1]]
        } 
    })
}

}
//setImage
if((state.mode===bot_const_menu.chekGooglePlay)&&(data.split("|")[0]===bot_const_menu.makeActive)){
const appID=data.split("|")[1];
removeAllMessage(bot,messageId)
const choseApp=state.app.chekGoogle.find(el=>{return el._id===appID});



if(showApp({app_id:appID})){

    const apps=state.app.chekGoogle.filter(el=>el._id==appID);
    state.app.chekGoogle=state.app.chekGoogle.filter(el=>el._id!=appID);
    state.app.activeApp.push(apps)
bot.sendMessage(id,"Прилу сделано видимой!",{
    reply_markup:{
        inline_keyboard:[nav_keyboard[1]]
    } 
})}else{
    bot.sendMessage(id,"Прилу НЕ сделано видимой!",{
        reply_markup:{
            inline_keyboard:[[{
                text:`🢘Назад`,callback_data:`chekGooglePlay|${choseApp.bundle}`
            }],nav_keyboard[1]]
        } 
    })
}
}

});


