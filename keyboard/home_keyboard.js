
module.exports=function({app}){
    return [
        [
            {
                text:`Добавить приложение`,callback_data:"add_app"
            }
        ],
        [
           {
               text:`Ожидают подтверждения (${app.confirmApp.length})`,callback_data:"aw_confirm"
           }
       ],
       [
           {
               text:`Активные приложения (${app.activeApp.length})`,callback_data:"act_app"
           }
       ],
       [
           {
               text:`В использовании (${app.inuseApp.length})`,callback_data:"in_use"
           }
       ],
       [
           {
               text:`Скрытые приложения (${app.hideApp.length}) `,callback_data:"hide_app"
           }
       ], 
       [
           {
               text:`Забаненые приложения (${app.banApp.length})`,callback_data:"ban_app"
           }
       ],
       [
           {
               text:`Прилы в разработке (${app.penndingApp.length})`,callback_data:"pendding_app"
           }
       ],
    
       [
        {
            text:`Проверены  Google Play:(${app.chekGoogle.length}) :`,callback_data:"chekGooglePlay"
        }
    ],
       
    ]
}


