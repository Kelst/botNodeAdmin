
module.exports=function({app}){
    return [
        [
            {
                text:`Додати апку`,callback_data:"add_app"
            }
        ],
        [
            {
                text:`В розробці ${app.penndingApp.length==0?"":"("+app.penndingApp.length+")"}`,callback_data:"pendding_app"
            }
        ],
        [ 
           {
               text:`В модерації ${app.moderateApp.length==0?"":"("+app.moderateApp.length+")"}`,callback_data:"aw_confirm"
           }
       ],
       [
        {
            text:`Сховані ${app.hideApp.length==0?"":"("+app.hideApp.length+")"} `,callback_data:"hide_app"
        }
    ],
    //  [
    //     {
    //         text:`Пройшли модерацію  Google Play:(${app.chekGoogle.length==0?"":"("+app.chekGoogle.length+")"} :`,callback_data:"chekGooglePlay"
    //     }
    // ],
       [
           {
               text:`В продажі ${app.activeApp.length==0?"":"("+app.activeApp.length+")"}`,callback_data:"act_app"
           }
       ],
       [
           {
               text:`Придбані ${app.inuseApp.length==0?"":"("+app.inuseApp.length+")"}`,callback_data:"in_use"
           }
       ],
       
    [
        {
            text:`Заблоковані ${app.banApp.length==0?"":"("+app.banApp.length+")"}`,callback_data:"ban_app"
        }
    ],
       
    ]
}


//lol