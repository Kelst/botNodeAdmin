//підключення бота
const TOKKEN="5187338885:AAFvQmAg38G0fpLAvcYPrneZbWY-tkHtXU0";
const TelegramApi=require("node-telegram-bot-api");
let bot
require('dotenv').config();
const token = process.env.TELEGRAM_TOKEN;

//масив для id повідомлень(потрібен для очистки)
let messageId=0;
const removeAllMessage=require("./helper/removeMessage")//приймає обєкт бот та масив ід повідомлень(bot,messageId)
if (process.env.NODE_ENV === 'production') {
    bot = new TelegramApi(TOKKEN);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
 } else {
    bot = new TelegramApi(TOKKEN, { polling: true });
 }
//бібліотека для https запитів
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const express = require('express')
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

  

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
        chekGoogle:[],
        moderateApp:[],
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
    keyboard_moderate:[],
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
const setModerate=require("./requestApi/moderateApp")
const deleteRedirect=require("./requestApi/deleteRedirect")
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
const getModerateApp = require("./requestApi/getModerateApp");
//перевірка пріл якщо пройшли модерку
async function  checkAllPrills(){
  

    const stateApp=await getStateApp();
    state.app.activeApp=stateApp.activeApp;
    state.app.banApp=stateApp.banApp;
    state.app.confirmApp=stateApp.confirmApp;
    state.app.hideApp=stateApp.hideApp; 
    state.app.inuseApp=stateApp.inuseApp;
    state.app.penndingApp=stateApp.pendingApp;
    state.app.moderateApp=stateApp.moderateApp
      
}


//
//.................._........................ 
bot.on("message",msg=>{
    messageId=msg.message_id;
})
bot.onText(/\/getId/, async msg=>{
    bot.sendMessage(msg.chat.id,`Твій id: ${msg.chat.id}`)
})
//запуск бота 
bot.onText(/\/start/, async msg=>{
   state.control.mode="";
   state.control.idApp=""
   state.mode=""
    const {id}=msg.chat;
     messageId=msg.message_id;
     const stateApp=await getStateApp();
    state.app.activeApp=stateApp.activeApp;
    state.app.banApp=stateApp.banApp;
    state.app.confirmApp=stateApp.confirmApp;
    state.app.hideApp=stateApp.hideApp;
    state.app.inuseApp=stateApp.inuseApp;
    state.app.penndingApp=stateApp.pendingApp;
    state.app.moderateApp=stateApp.moderateApp;
    await   checkGooglePlay(state.app.moderateApp,state.app.chekGoogle)
     await checkAllPrills()

    setTimeout(el=>{
setInterval(() => {
    checkGooglePlay(state.app.moderateApp,state.app.chekGoogle)
}, 1800000);
    },6000)
    state.user.first_name=msg.from.first_name;
    state.user.last_name=msg.from.last_name;
   
    nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:await home_keyboard(state)},{message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})
    
    removeAllMessage(id,bot,messageId)
    bot.sendMessage(id,`Здоров був друже\nКонтроль всіх апок тут`,{
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
        removeAllMessage(id,bot,messageId)
        nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})

        state.mode=bot_const_menu.addApp
        bot.sendMessage(id,`Введи початкову інфу по апці в форматі:\n- Application Name*application type*package name
        \napplication type може бути: gambling/betting/finances/crypto/dating/subscriptions/nutra
        \nПриклад: Bit Vegas*gambling*com.bit.vegas`,{
            reply_markup:{
                inline_keyboard:nav_keyboard
            }
        }) 
         break;
    //___________________________________________________________________________________//
    
      
        //підьвердити прілку
        case bot_const_menu.awaConfirm:
            removeAllMessage(id,bot,messageId);
            nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})

            state.mode=bot_const_menu.awaConfirm;
            state.app.moderateApp=await getModerateApp();

            if(state.app.moderateApp.length>0){
                state.keyboard_moderate=state.app.moderateApp.map(el=>{
                    return  [
                        {
                            text:`${el.name} (${el.type})`,callback_data:`aw_confirm|${el.bundle}`
                        }
                    ]
                })
             
                // nav.push({message:"Ожидают подтверждения",keyboard:[...keyboard_confirm_app,...nav_keyboard]})
                bot.sendMessage(id,"Очікують модерації",{
                    reply_markup:{
                        inline_keyboard:[...state.keyboard_moderate,nav_keyboard[1]]
                    }
                })
            }else{
                bot.sendMessage(id,"ПУСТО!",{
                    reply_markup:{
                        inline_keyboard:[nav_keyboard[1]]
                    }
                })
            } 
        break;
//___________________________________________________________________________________//

//активні пріли початок
        case bot_const_menu.activeApp:
            removeAllMessage(id,bot,messageId);
            nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.activeApp;
            state.app.activeApp=await getActiveApp();
            if(state.app.activeApp.length>0){
                state.keyboard_active_app=state.app.activeApp.map(el=>{
                    return  [
                        {
                            text:`${el.name} (${el.type})`,callback_data:`act_app|${el.bundle}`
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
        removeAllMessage(id,bot,messageId);
        nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})
        state.mode=bot_const_menu.inUse;
        state.app.inuseApp=await getAppsInUse();

          if(state.app.inuseApp.length>0){
                state.keyboard_inUse_app=state.app.inuseApp.map(el=>{
                    return  [
                        {
                            text:`${el.name} (${el.type})`,callback_data:`in_use|${el.bundle}`
                        }
                    ]
                })
                
             
                bot.sendMessage(id,"В розробці",{
                    reply_markup:{
                        inline_keyboard:[...state.keyboard_inUse_app,nav_keyboard[1]]
                    }
                })
            }else{
                bot.sendMessage(id,"ПУСТО!",{
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
          
            removeAllMessage(id,bot,messageId);
            nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.hideApp;
            state.app.hideApp=await getHideApp();
            if(state.app.hideApp.lengt!=0){
                state.keyboard_hideApp=state.app.hideApp.map(el=>{
                    return  [
                        {
                            text:`${el.name} (${el.type})`,callback_data:`hide_app|${el.bundle}`
                        }
                    ] 
                })
                
             
                bot.sendMessage(id,"Сховані:",{
                    reply_markup:{
                        inline_keyboard:[...state?.keyboard_hideApp,nav_keyboard[1]]
                    }
                })
            }else{
                bot.sendMessage(id,"ПУСТО!",{
                    reply_markup:{
                        inline_keyboard:nav_keyboard[1]
                    }
                })
            }
            //...................
            
        break;

        case bot_const_menu.banApp:
            
            removeAllMessage(id,bot,messageId);
            nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.banApp;
            state.app.banApp=await getBanApp();
            console.log("Ban App");
              if(state.app.banApp.length!=0){
                    state.keyboard_banApp=state.app.banApp.map(el=>{
                        return  [
                            {
                                text:`${el.name} (${el.type})`,callback_data:`ban_app|${el.bundle}`
                            }
                        ]
                    })
                    bot.sendMessage(id,"Заблоковані",{
                        reply_markup:{
                            inline_keyboard:[...state.keyboard_banApp,nav_keyboard[1]]
                        }
                    })
                }else{
                    bot.sendMessage(id,"ПУСТО!",{
                        reply_markup:{
                            inline_keyboard:[nav_keyboard[1] ] 
                        }
                    })
                }
    

        
        break;

        //пріли в розробці
        case bot_const_menu.penndingApp:
            
            removeAllMessage(id,bot,messageId);
            nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.penndingApp;
            state.app.penndingApp=await getPenndingApp();
            
              if(state.app.penndingApp.length!=0){
                    state.keyboard_pendingApp=state.app.penndingApp.map(el=>{
                        return  [
                            {
                                text:`${el.name} (${el.type})`,callback_data:`pendding_app|${el.bundle}`
                            }
                        ]
                    })
                    
                 
                    bot.sendMessage(id,"В розробці",{
                        reply_markup:{
                            inline_keyboard:[...state.keyboard_pendingApp,nav_keyboard[1]]
                        }
                    })
                }else{
                    bot.sendMessage(id,"ПУСТО!",{
                        reply_markup:{
                            inline_keyboard:[nav_keyboard[1] ] 
                        }
                    })
                }
        
        
        break;
        ///.........................................
        //пройшли перевірку google play
        case bot_const_menu.chekGooglePlay:
            
            removeAllMessage(id,bot,messageId);
            nav.push({message:`Здоров був друже \nКонтроль всіх апок тут`,keyboard:home_keyboard(state)})
            state.mode=bot_const_menu.chekGooglePlay;
            
              if(state.app.chekGoogle.length!=0){
                    state.keyboard_checkGoogle=state.app.chekGoogle.map(el=>{
                        return  [
                            {
                                text:`${el.name} (${el.type})`,callback_data:`chekGooglePlay|${el.bundle}`
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
            removeAllMessage(id,bot,messageId);
            state.mode="";
          
            nav.splice(1,nav.length)
           await checkAllPrills();
            bot.sendMessage(id,`Здоров був друже \nКонтроль всіх апок тут`,{
                reply_markup:{
                    inline_keyboard:home_keyboard(state) 
                }
            })
            
        break;
        case bot_const_menu.back: 
        removeAllMessage(id,bot,messageId);
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
        if(msg.text==="/start") return 
        
        if((state.mode===bot_const_menu.addApp)){
           const text=msg.text.split("*");
           const app={ 
            name:text[0]||"empty name",
            type:text[1]||"",
            bundle:text[2]||"test.bundle",
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
        removeAllMessage(id,bot,messageId)
    
        
        const choseApp=state.app.moderateApp.find(el=>{return el.bundle===data.split("|")[1]});
        const approvePay= [
        //     [
        //     {
        //         text:`Подтвердить оплату`,callback_data:`approvePay|${data.split("|")[1]}`
        //     }
        // ],  [
        //     {
        //         text:`Контакт покупателя`,callback_data:`contact_user|${choseApp.user_confirm}`
        //     }
        // ], [
        //     {
        //         text:`Отклонить`,callback_data:`cancel_pay|${data.split("|")[1]}|${choseApp.user_confirm}`
        //     }
        // ],
        [
                {
                    text:`Штовхнути в “сховані”`,callback_data:`hides_app|${choseApp._id}`
                }
            ],
        [{
                    text:`Видалити`,callback_data:`delete_app|${choseApp._id}`
                }
        ],
    ] 
       
        bot.sendMessage(id,`${choseApp.name} (${choseApp.type})\n Google Play:${choseApp.google_play_url}}\n Дата відправки в модерацію:${choseApp?.moderate_date}`,{
            reply_markup:{
                inline_keyboard:[...approvePay,[{
                    text:`🢘Назад`,callback_data:`aw_confirm`
                }]] 
            }
        })

    }
    if((state.mode===bot_const_menu.awaConfirm)&&(data.split("|")[0]===bot_const_menu.hidesApp)){//скрити   
        //hidesApp
        removeAllMessage(id,bot,messageId)
        if(hideApp({app_id:data.split("|")[1]})){
            bot.sendMessage(id,"Апку сховано!",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]]
                }
            });
        }else  bot.sendMessage(id,"Щось пішло не так");
    }
    // if(data.indexOf("approvePay")!=-1){
    //     const bundle=data.split("|")[1];
    //     if(setApproveApp({
    //         bundle:bundle
    //     })){
    //         let arr=state.app.confirmApp.find(el=>el.bundle!=bundle);
    //        state.app.confirmApp=arr;

    //         removeAllMessage(id,bot,messageId);
    //         bot.sendMessage(id,"оплата подтверждена",{//коли буде готова бот для користувачів потрібно буде надіслати їм смс про що оплата підтверджена
    //             reply_markup:{
    //                 inline_keyboard:[nav_keyboard[1]] 
    //             }
    //         })

    //     }

    // }
    // if((bot_const_menu.contactUser===data.split("|")[0])&&((state.mode==="aw_confirm"))){
    //     removeAllMessage(id,bot,messageId)
    //     console.log("Aw");
    //      const user=await getUser(data.split("|")[1])
    //      bot.sendMessage(id,`Контакт покупателя:${user.userName}\n IdTelegram:${user.userIdTelegram}\nNikName@${user.userTelegram_nik}`,{
    //          reply_markup:{
    //              inline_keyboard:nav_keyboard
                 
    //          }
    //      });

    // }
    // if(bot_const_menu.cancelPay===data.split("|")[0]){ 
    //     const bundle=data.split("|")[1];
    //     const userIdtelegram=data.split("|")[2];
    //     if(cancelApproveApp({
    //         bundle:bundle
    //     })){
    //         bot.sendMessage(id,`отказано в оплате, прила возвращена в общий доступ:`,{//повідомити користувача
    //             reply_markup:{
    //                 inline_keyboard:nav_keyboard
    //             }
    //         });
 
    //     }

    // }
    
})

    //....................................

    //обробка активні прілки
    
    bot.on("callback_query",async query=>{
        const id=query.message.chat.id; 
        const data=query.data; 
        messageId=query.message.message_id;
    if(data.indexOf("act_app|")!=-1){
        removeAllMessage(id,bot,messageId)
        nav.push({message:"В продажу:",keyboard:[...state.keyboard_active_app,...nav_keyboard]});
        const choseApp=state.app.activeApp.find(el=>{return el.bundle===data.split("|")[1]});
        const activeApp= [
            [
                {
                    text:`Розшарити`,callback_data:`share_app_to_user|${choseApp._id}`
                }
            ],
            [
                {
                    text:`Штовхнути в “Заблоковані”`,callback_data:`send_to_ban|${choseApp._id}`
                }
            ], 
        [
            {
                text:`Штовхнути в “Сховані”`,callback_data:`hides_app|${choseApp._id}`
            }
        ],
        // [
        //     {
        //         text:`Расшарить по username`,callback_data:`share_app|${choseApp._id}`
        //     }
        // ],
        [
            {
                text:`Удалить`,callback_data:`delete_app|${choseApp._id}`
            }
        ],] 
        

        bot.sendMessage(id,`# ${choseApp.name} ( ${choseApp.type})\n*Ціна:*${choseApp.price}$\n*Google Play*:${choseApp.google_play_url}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...activeApp,...nav_keyboard]
            }
        })
    }
    if((state.mode===bot_const_menu.activeApp)&&(data.split("|")[0]===bot_const_menu.hidesApp)){//скрити   
        //hidesApp
        removeAllMessage(id,bot,messageId)
        if(hideApp({app_id:data.split("|")[1]})){
            bot.sendMessage(id,"Апку сховано!",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]]
                }
            });
        }else  bot.sendMessage(id,"Щось пішло не так");
    }

    if((state.mode===bot_const_menu.activeApp)&&(data.split("|")[0]===bot_const_menu.shareApp)){//розшарити
        //shareAppToUsers
        removeAllMessage(id,bot,messageId)

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
        removeAllMessage(id,bot,messageId)
        const idApp=data.split("|")[1]
        const choseApp=state.app.activeApp.find(el=>el._id==idApp)
        state.control.mode="share_app_to_user";
        state.control.idApp=idApp;
        bot.sendMessage(id,"Введіть дані користувача для пошуку.(userName )",{
            reply_markup:{
                inline_keyboard:[[ {
                    text:`🢘Назад`,callback_data:`act_app|${choseApp.bundle}`
                }]]
            }
        })
        

    }
    if(((state.mode==bot_const_menu.activeApp)||(state.mode==bot_const_menu.hideApp))&&(data.split("|")[0]==bot_const_menu.shareYes)){
      
        removeAllMessage(id,bot,messageId)
        const usetId=data.split("|")[1];
        const bundleApp=data.split("|")[2];
        try{
       await setUserConfirmApp({
            bundle:bundleApp,
            confirmId:usetId
        })
        if(await setApproveApp({bundle:bundleApp})){
            state.control.mode="";
            state.control.idApp="";
            bot.sendMessage(id,"Апку передано користувачу",{
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
     

    if(((state.mode===bot_const_menu.activeApp)||(state.mode===bot_const_menu.hideApp)||(state.mode===bot_const_menu.banApp)||(state.mode===bot_const_menu.penndingApp)||(state.mode===bot_const_menu.awaConfirm))&&(data.split("|")[0]===bot_const_menu.deleteApp)){//удалити
        if(deleteApp({id:data.split("|")[1]})){
            removeAllMessage(id,bot,messageId)
            bot.sendMessage(id,"Апка успішно видалена",{
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
            removeAllMessage(id,bot,messageId)
            nav.push({message:"Продані апки",keyboard:[...state.keyboard_inUse_app,...nav_keyboard]});
            const choseApp= await state.app.inuseApp.find(el=>{return el.bundle===data.split("|")[1]});
            const inUseApp= [
            //     [
            //     {
            //         text:`Изменить ссылку`,callback_data:`change_ref|${choseApp._id}`  
            //     }
            // ],  
            // [
            //     {
            //         text:`Изменить процент редиректа`,callback_data:`change_redirect_p|${choseApp._id}` 
            //     } 
            // ], 
            // [
            //     { 
            //         text:`Изменить разрешенные гео`,callback_data:`change_geo_app|${choseApp._id}`
            //     }
            // ], 
            // [
            //     {
            //         text:`Контакт покупателя`,callback_data:`contact_user|${choseApp._id}`
            //     } 
            // ],
            [
                    {
                        text:`Змінити дані редіректу`,callback_data:`change_date_redirect|${choseApp._id}`
                    } 
                ],
                [
                    {
                        text:`Видалити редірект`,callback_data:`delete_redirect|${choseApp._id}`
                    } 
                ],
        
        ] 
        state.keyboard_inUse_app_local=inUseApp;
        const geoArr=choseApp?.geo?.sort((a,b)=>{
            return b.installs-a.installs
        })
        const user=await getUser(choseApp.user_confirm)
        console.log(user);
        const georedirect=choseApp.redirect_traff_urls.length>0?choseApp.redirect_traff_urls:"all";
        const redirect=choseApp.redirect_traff_url!=""?choseApp.redirect_traff_url+` ${georedirect} ${choseApp.redirect_traff_percent}%`:"-";
        bot.sendMessage(id,`# ${choseApp.name} (${choseApp.type}) - ${choseApp.price}$\n *Покупець*:${user.userName}+" "+${user.userTelegram_nik}\n*Дата покупки*${choseApp.dateConfirm}\n*Уніків всього: - *${choseApp.installs}\n*Неймінги:${choseApp.naming.length>0?choseApp.naming.map(el=>{return  "\n"+el.name+":"+el.name_ref}):"-"}*\n*Глобальний лінк:*${choseApp.url}\n\n*Топ Гео:*${geoArr.length!=0?geoArr.map(el=>"\n"+el.geo_it+":"+el.installs):"- "}\n*Автопуші *:\n *Текст*:${choseApp.notification_text}\n* Час старту*: ${choseApp.notification_start}min.\n *Інтервал*: ${choseApp.notification_interval}min. \n *Максимальна кількість*: ${choseApp.max_count}\n\n*Редірект:* ${redirect}:\nGoogle Play:${choseApp.google_play_url}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...inUseApp,...nav_keyboard] 
            }
        })
        }
        //видалити редірект
        if((state.mode===bot_const_menu.inUse)&&(data.split("|")[0]===bot_const_menu.deleteRedirect)){
            const appID=data.split("|")[1];
            const choseApp=state.app.inuseApp.find(el=>{return el._id===appID});
           
            const user=await getUser(choseApp.user_confirm)
           if(deleteRedirect({id:appID})){
              
            state.app.inuseApp.forEach(el=>{
                if(el._id===appID){
                    el.redirect_traff_urls=[]
                    el.redirect_traff_url="";
                }
            })
            bot.answerCallbackQuery({
                callback_query_id:query.id,
                text:"Редірект видалено"
            })
            // removeAllMessage(id,bot,messageId)
            const geoArr=choseApp?.geo?.sort((a,b)=>{
                return b.installs-a.installs
            })
            const inUseApp= [
             
                [
                        {
                            text:`Змінити дані редіректу`,callback_data:`change_date_redirect|${choseApp._id}`
                        } 
                    ],
                    [
                        {
                            text:`Видалити редірект`,callback_data:`delete_redirect|${choseApp._id}`
                        } 
                    ],
            
            ] 
            const {chat,message_id,text}=query.message
            const georedirect=choseApp.redirect_traff_urls.length>0?choseApp.redirect_traff_urls:"all";
            const redirect=choseApp.redirect_traff_url!=""?choseApp.redirect_traff_url+` ${georedirect} ${choseApp.redirect_traff_percent}%`:"-";
            bot.editMessageText(`# ${choseApp.name} (${choseApp.type}) - ${choseApp.price}$\n *Покупець*:${user.userName}+" "+${user.userTelegram_nik}\n*Дата покупки*${choseApp.dateConfirm}\n*Уніків всього: - *${choseApp.installs}\n*Неймінги:${choseApp.naming.length>0?choseApp.naming.map(el=>{return  "\n"+el.name+":"+el.name_ref}):"-"}*\n*Глобальний лінк:*${choseApp.url}\n\n*Топ Гео:*${geoArr.length!=0?geoArr.map(el=>"\n"+el.geo_it+":"+el.installs):"- "}\n*Автопуші *:\n *Текст*:${choseApp.notification_text}\n* Час старту*: ${choseApp.notification_start}min.\n *Інтервал*: ${choseApp.notification_interval}min. \n *Максимальна кількість*: ${choseApp.max_count}\n\n*Редірект:* ${redirect}:\nGoogle Play:${choseApp.google_play_url}`,{
                chat_id:chat.id,
                message_id:message_id,
                parse_mode:"Markdown",
                reply_markup:{
                    inline_keyboard:[...inUseApp,...nav_keyboard] 
                }
            })





           }


        }

        //
        //змінити дані редіректу
        if((state.mode===bot_const_menu.inUse)&&(data.split("|")[0]===bot_const_menu.changeDateRedirect)){
            const appID=data.split("|")[1];
            const choseApp=state.app.inuseApp.find(el=>{return el._id===appID});
            removeAllMessage(id,bot,messageId)
            state.control.mode=bot_const_menu.changeDateRedirect
            state.control.idApp=choseApp._id;
            bot.sendMessage(id,"*Введіть дані редіректу в такому форматі*:\nлінк*процент*гео\n*Наприклад*:\n https://coinlist.co/dashboard/999*10*ua,ru,kz (або all для гео)",{
                reply_markup:{
                    inline_keyboard:[[{
                        text:`🢘Назад`,callback_data:`in_use|${choseApp.bundle}`
                    }],nav_keyboard[1]]
                } 
            })

        }

        //


        //змінити силку редіректу
        if((state.mode===bot_const_menu.inUse)&&(data.split("|")[0]===bot_const_menu.changeReff)){
            const appID=data.split("|")[1];
            removeAllMessage(id,bot,messageId)
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
                removeAllMessage(id,bot,messageId)
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
        removeAllMessage(id,bot,messageId)
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
        removeAllMessage(id,bot,messageId)
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
        state.control.mode="";
            state.control.idApp="";
    }
    });
    

    bot.on("message",async msg=>{
        //змінити дані редіректу
        if((state.mode===bot_const_menu.inUse)&&(state.control.mode==bot_const_menu.changeDateRedirect)){
            messageId=msg.message_id;
            const id=msg.chat.id;
            const text=msg.text;
            const choseApp=state.app.inuseApp.find(el=>{return el._id===state.control.idApp});
            const reqArr=text.split("*");
            if(reqArr.length<2){
                removeAllMessage(id,bot,messageId)
                bot.sendMessage(id,"Неправильний формат вводу, введіть ще раз.",{
                    reply_markup:{
                        inline_keyboard:[[{
                            text:`🢘Назад`,callback_data:`in_use|${choseApp.bundle}`
                        }],nav_keyboard[1]]
                    } 
                })
            }else if((reqArr.length===2)||(reqArr.length===3)){
                removeAllMessage(id,bot,messageId);

                const link=reqArr[0];
                const procent=reqArr[1];
                const geo=reqArr.length===2?"":reqArr[2];
                Promise.all([ setRedirectUrl({id:state.control.idApp,url:link}),
                 setRedirectPrecent({id:state.control.idApp,percent:procent}),
                 setRedirectGeo({id:state.control.idApp,geo:geo}),]).catch(er=>console.log(er))
                 state.app.inuseApp.forEach(el=>{
                    if(el._id===state.control.idApp){
                        el.redirect_traff_urls=geo!=""?geo.split(","):[]
                        el.redirect_traff_url=link;
                        el.redirect_traff_percent=procent||3;
                    }
                })
                 bot.sendMessage(id,"Дані редіректу змінені.",{
                    reply_markup:{
                        inline_keyboard:[[{
                            text:`🢘Назад`,callback_data:`in_use|${choseApp.bundle}`
                        }],nav_keyboard[1]]
                    } 
                }) 
            }

        //     if(setRedirectUrl({id:state.control.idApp,url:text})){
        //         state.app.inuseApp.forEach(e=>{
        //             if(e._id==state.control.idApp){
        //                 e.redirect_traff_url=text
        //             }
        //         })
        //         state.control.mode="";
        // state.control.idApp="";
        //         bot.sendMessage(id,"Ссылка изменилась")
        //     }else  {state.control.mode="";
        //     state.control.idApp="";bot.sendMessage(id,"Штото пошло не так")}

           }


        ///
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
                    state.control.mode="";
                    state.control.idApp="";
                    bot.sendMessage(id,"Ссылка изменилась")
                }else  {state.control.mode="";
                state.control.idApp="";bot.sendMessage(id,"Штото пошло не так")}

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
                    state.control.mode="";
            state.control.idApp="";
            state.control.mode="";
            state.control.idApp="";
                    bot.sendMessage(id,"Процент редиректу измененный ")
                }else  {state.control.mode="";
                state.control.idApp="";bot.sendMessage(id,"Штото пошло не так")}

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
                    state.control.mode="";
            state.control.idApp="";
                    bot.sendMessage(id,"Новый GEO установлен ")
                }else {state.control.mode="";
                state.control.idApp=""; bot.sendMessage(id,"Штото пошло не так")}

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
                bot.sendMessage(id,`Користувач знайдений ${user.userName}:\n передати апку користувачу?`,{
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {
                                    text:`Так`,callback_data:`share_yes|${user.userIdTelegram}|${choseApp.bundle}`
                                },
                                {
                                    text:`Ні`,callback_data:`act_app|${choseApp.bundle}`
                                }
                            ]]
                    }
                })
            }else {
                bot.sendMessage(id,"Користувач не знайдений",{
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
        removeAllMessage(id,bot,messageId)
      
        const choseApp=state.app.hideApp.find(el=>{return el.bundle===data.split("|")[1]});
        const activeApp= [
            [
                {
                    text:`Розшарити`,callback_data:`share_app_to_user|${choseApp._id}`
                }
            ],
            [
            {
                text:`Штовхнути в “В продаж”`,callback_data:`show_app|${choseApp._id}`
            }
        ],  [
            {
                text:`Штовхнути в “Заблоковані”`,callback_data:`send_to_ban|${choseApp._id}`
            }
        ],[
            {
                text:`Удалить`,callback_data:`delete_app|${choseApp._id}`
            }
        ],] 
        

        bot.sendMessage(id,`# ${choseApp.name} ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) \n*URL: ${choseApp.url||"-"}* \n*bundle*: ${choseApp.bundle} \n*Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}\n*Google Play*:${choseApp.google_play_url}\n
        ${choseApp.image_link}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...activeApp,[
                    {text:`<=Назад`,callback_data:`hide_app`}
                ],nav_keyboard[1]]
            }
        })
    }
    //send to ban
    if(((state.mode===bot_const_menu.hideApp)||(state.mode===bot_const_menu.activeApp))&&(data.split("|")[0]==="send_to_ban")){
        removeAllMessage(id,bot,messageId)
        if(changeAppStatus({app_id:data.split("|")[1],status:"ban"})){
            bot.sendMessage(id," Апка успішно заблокована",{
                reply_markup:{
                    inline_keyboard:[[{
                        text:`🢘Назад`,callback_data:` ${state.mode===bot_const_menu.activeApp?"act_app":"hide_app"}`
                    }],nav_keyboard[1]] 
                }
            })
        }

    }
    if((state.mode===bot_const_menu.hideApp)&&(data.split("|")[0]==="show_app")){
        //showApp
        // removeAllMessage(id,bot,messageId)
        // if(showApp({app_id:data.split("|")[1]})){
        //     bot.sendMessage(id,"Апку відправлено в продаж",{
        //         reply_markup:{
        //             inline_keyboard:[nav_keyboard[1]]
        //         }
        //     });
        // }else  bot.sendMessage(id,"Щось пішло не так");
        const choseApp=state.app.hideApp.find(el=>{return el._id===data.split("|")[1]});
        removeAllMessage(id,bot,messageId)
        state.control.mode=bot_const_menu.setPriceAndBaner;
        state.control.idApp=choseApp._id;
        bot.sendMessage(id,`Введіть дані апки в такому форматі:\n ціна*лінк на баннер\nПриклад: 400*https://imgur.com/444`,{
            reply_markup:{
                inline_keyboard:[[
                    {text:`<=Назад`,callback_data:`hide_app|${choseApp.bundle}`}
                ],nav_keyboard[1]]
            }
        })
    }

    
    if((state.mode===bot_const_menu.hideApp)&&(data.split("|")[0]===bot_const_menu.shareAppToUser)){//розшарити
        //shareAppToUsers
          //shareAppToUsers
        removeAllMessage(id,bot,messageId)
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
//обробка банер
bot.on("message",async msg=>{
    messageId=msg.message_id;
    const id=msg.chat.id;
    if((state.mode==bot_const_menu.hideApp)&&(state.control.mode==bot_const_menu.setPriceAndBaner)){
        const text=msg.text.split("*");
        if(text.length===2){
            removeAllMessage(id,bot,messageId)
           await setPrice({id:state.control.idApp,price:text[0]})
           await setImageUrl({id:state.control.idApp,url:text[1]})
        if(showApp({app_id:state.control.idApp})){
            state.control.mode="";
            state.control.idApp=""
            bot.sendMessage(id,"Апку відправлено в продаж",{
                reply_markup:{
                    inline_keyboard:[nav_keyboard[1]]
                }
            });
        }else  bot.sendMessage(id,"Щось пішло не так");
        }else{
            const choseApp=state.app.hideApp.find(el=>{return el._id===state.control.idApp});
            removeAllMessage(id,bot,messageId)
            bot.sendMessage(id,"Неправильний формат вводу, введіть ще раз.",{
                reply_markup:{
                    inline_keyboard:[[
                        {text:`<=Назад`,callback_data:`hide_app|${choseApp.bundle}`}
                    ],nav_keyboard[1]]
                }
            });
        }

    }

})
//..........

    
    bot.on("callback_query",async query=>{
        const id=query.message.chat.id; 
        const data=query.data; 
        messageId=query.message.message_id; 
    
        if(data.indexOf("ban_app|")!=-1){
            removeAllMessage(id,bot,messageId)
          
            
            const choseApp= await state.app.banApp.find(el=>{return el.bundle===data.split("|")[1]});
            const inUseApp= [[
                {
                    text:`Удалить`,callback_data:`delete_app|${choseApp._id}`  
                }
            ],  
          
        
        ] 
        state.keyboard_inUse_app_local=inUseApp;
        const geoArr=choseApp?.geo?.sort((a,b)=>{
            return b.installs-a.installs
        })
        let user={
            userName:"Не було користувачів",
            userTelegram_nik:"Не було користувачів"
        };
        if(choseApp.user_confirm!=""){user=await getUser(choseApp.user_confirm)}
        console.log(user);
        const redirect=choseApp.redirect_traff_urls.length>0?choseApp.redirect_traff_urls:"all";
        bot.sendMessage(id,`# ${choseApp.name} (${choseApp.type}) - ${choseApp.price}$\n *Покупець*:${user?.userName}+" "+${user?.userTelegram_nik}\n*Дата покупки*${choseApp.dateConfirm}\n*Уніків всього: - *${choseApp.installs}\n*Неймінги:${choseApp.naming.length>0?choseApp.naming.map(el=>{return  "\n"+el.name+":"+el.name_ref}):"-"}*\n*Глобальний лінк:*${choseApp.url}\n\n*Топ Гео:*${geoArr.length!=0?geoArr.map(el=>"\n"+el.geo_it+":"+el.installs):"- "}\n*Автопуші *:\n *Текст*:${choseApp.notification_text}\n* Час старту*: ${choseApp.notification_start}min.\n *Інтервал*: ${choseApp.notification_interval}min. \n *Максимальна кількість*: ${choseApp.max_count}\n\n*Редірект:* ${redirect}:\nGoogle Play:${choseApp.google_play_url}`,{
            parse_mode:"Markdown",
            reply_markup:{ 
                inline_keyboard:[...inUseApp,...nav_keyboard] 
            }
        })
        
        }

     
        if((state.mode===bot_const_menu.banApp)&&(data.split("|")[0]===bot_const_menu.contactUser)){
            
            const appID=data.split("|")[1];
            removeAllMessage(id,bot,messageId)
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
            removeAllMessage(id,bot,messageId)
          
            
            const choseApp= await state.app.penndingApp.find(el=>{return el.bundle===data.split("|")[1]});
            const penddingApp= [
            //     [
            //     {
            //         text:`Установить ссылку на картинку`,callback_data:`set_img_url|${choseApp._id}`  
            //     }
            // ],  
            // [
            //     {
            //         text:`Изменить цену`,callback_data:`change_price|${choseApp._id}`
            //     } 
            // ],   
            // [
            //     {
            //         text:`Изменить ссылку редиректу`,callback_data:`change_ref|${choseApp._id}`
            //     } 
            // ],
            // [
            //     {
            //         text:`Изменить процент редиректу`,callback_data:`change_redirect_p|${choseApp._id}`
            //     } 
            // ],
            // [
            //     {
            //         text:`Почистить url `,callback_data:`clean_url|${choseApp._id}`
            //     } 
            // ],
            // [
            //     {
            //         text:`Установить naming`,callback_data:`set_naming|${choseApp._id}`
            //     } 
            // ],
            [
                {
                    text:`${choseApp.url==""?"Переключити на заглушку":"Переключити на лінк"}`,callback_data:`switch_link|${choseApp._id}`
                } 
            ],
            [
                {
                    text:`Відправити в модерацію`,callback_data:`send_to_moderate|${choseApp._id}`
                } 
            ],
            [
                {
                    text:`Удалить прилу.`,callback_data:`delete_app|${choseApp._id}`
                } 
            ]
        
        ] 
        
 
        bot.sendMessage(id,`# ${choseApp.name} , ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) \n*Ccылка:*${choseApp.url===""?"Немає силки":choseApp.url}\n*К-во уникальных пользователей - *${choseApp.installs}\n*Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}\n${choseApp.google_play_url}`,{
            parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...penddingApp,[{
                    text:`🢘Назад`,callback_data:`pendding_app`
                }],nav_keyboard[1]] 
            }
        }) 
        }

        //відправити в модерацію

        if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.sendToModerate)){
            const appID=data.split("|")[1];
            const choseApp=state.app.penndingApp.find(el=>{return el._id===appID}); 

            await setModerate({app_id:appID})
            removeAllMessage(id,bot,messageId)
            state.app.penndingApp.filter(el=>el._id!=appID)
            choseApp.status="moderating"
            state.app.moderateApp.push(choseApp)
            await setURL({url:"",id:appID})
            bot.sendMessage(id,"Прілу відправлено в модерацію",{
                reply_markup:{
                    inline_keyboard:[[{
                        text:`🢘Назад`,callback_data:`pendding_app`
                    }],nav_keyboard[1]] 
                }
            })



           
        }




        //змінити лінк
        if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.switchLink)){
            const appID=data.split("|")[1];
           
            const choseApp=state.app.penndingApp.find(el=>{return el._id===appID}); 
            const penddingApp= [
                
                [
                    {
                        text:`${choseApp.url==""?"Переключити на заглушку":"Переключити на лінк"}`,callback_data:`switch_link|${choseApp._id}`
                    } 
                ],
                [
                    {
                        text:`Відправити в модерацію`,callback_data:`send_to_moderate|${choseApp._id}`
                    } 
                ],
                [
                    {
                        text:`Удалить прилу.`,callback_data:`delete_app|${choseApp._id}`
                    } 
                ]
            
            ] 
            const {chat,message_id,text}=query.message
            if(choseApp.url==""){
                await setURL({url:"https://www.google.com.ua/",id:appID})
                state.app.penndingApp.forEach(e=>{if(e._id==choseApp._id){
                    e.url="https://www.google.com.ua/"
                }})
                bot.answerCallbackQuery({
                    callback_query_id:query.id,
                    text:"Заглушка встановлена"
                })
                // removeAllMessage(id,bot,messageId)
               
                
                bot.editMessageText(`# ${choseApp.name} , ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) \n*Ccылка:*${choseApp.url===""?"Немає силки":choseApp.url}\n*К-во уникальных пользователей - *${choseApp.installs}\n*Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}\n${choseApp.google_play_url}`,{
                    chat_id:chat.id,
                    message_id:message_id,
                    parse_mode:"Markdown",
            reply_markup:{
                inline_keyboard:[...penddingApp,[{
                    text:`🢘Назад`,callback_data:`pendding_app`
                }],nav_keyboard[1]] 
            }
                })
            }else{
                await  setURL({url:"",id:appID})
                bot.answerCallbackQuery({
                    callback_query_id:query.id,
                    text:"Лінк встановлено"
                })
                state.app.penndingApp.forEach(e=>{if(e._id==choseApp._id){
                    e.url=""
                }})
                bot.editMessageText(`# ${choseApp.name} , ${choseApp.type}) - ${choseApp.status}(visibility:${choseApp.visibility_public}) \n*Ccылка:*${choseApp.url===""?"Немає силки":choseApp.url}\n*К-во уникальных пользователей - *${choseApp.installs}\n*Кэшировать последнюю зашруженную страницу*: ${choseApp.save_last_url===true?"Да":"Нет"}\n${choseApp.google_play_url}`,{
                    chat_id:chat.id,
                    message_id:message_id,
                    parse_mode:"Markdown",
                    reply_markup:{
                        inline_keyboard:[...penddingApp,[{
                            text:`🢘Назад`,callback_data:`pendding_app`
                        }],nav_keyboard[1]] 
                    }
                })
            }


        }

        //очистити url
        if((state.mode===bot_const_menu.penndingApp)&&(data.split("|")[0]===bot_const_menu.cleanUrl)){
            const appID=data.split("|")[1];
            removeAllMessage(id,bot,messageId)
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
    removeAllMessage(id,bot,messageId)
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
    removeAllMessage(id,bot,messageId)
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
    removeAllMessage(id,bot,messageId)
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
    removeAllMessage(id,bot,messageId)
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
    removeAllMessage(id,bot,messageId)
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
             state.control.mode="";
            state.control.idApp="";
             bot.sendMessage(id,"Ссылка изменилась")
         }else {state.control.mode="";
         state.control.idApp=""; bot.sendMessage(id,"Штото пошло не так")}

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
             state.control.mode="";
            state.control.idApp="";
             bot.sendMessage(id,"Image Url изменилась")
         }else {state.control.mode="";
         state.control.idApp=""; bot.sendMessage(id,"Штото пошло не так")}

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
                state.control.mode="";
            state.control.idApp="";
                bot.sendMessage(id,"Вы установили новую цену ")
            }else {
                    state.control.mode="";
                    state.control.idApp="";
                    bot.sendMessage(id,"Штото пошло не так")}
   
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
                state.control.mode="";
            state.control.idApp="";
                bot.sendMessage(id,"Процент редиректу измененный ")
            }else  {state.control.mode="";
            state.control.idApp="";bot.sendMessage(id,"Штото пошло не так")}

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
        state.control.mode="";
            state.control.idApp="";
        bot.sendMessage(id,"Нейминг добавлен ")
    }else {state.control.mode="";
    state.control.idApp=""; bot.sendMessage(id,"Штото пошло не так")}

   }



    })

    //.......................................
    
//обробник пріл пройшли модерацію





bot.on("callback_query",async query=>{
    const id=query.message.chat.id; 
    const data=query.data; 
    messageId=query.message.message_id; 

    if(data.indexOf("chekGooglePlay|")!=-1){
        removeAllMessage(id,bot,messageId)
      
        
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


