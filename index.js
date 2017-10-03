var TelegramBot = require('node-telegram-bot-api');

    // Устанавливаем токен, который выдавал нам бот.
    var token = '417143040:AAEuE_851SI8yp-SjN0IRKFM7YyXLT8F8J0';
    // Включить опрос сервера
    var bot = new TelegramBot(token, {polling: true});

    bot.on('message', (msg) => {
        var reg = ''
    })

    bot.onText(/\/help/, function (msg, match) {
        var fromId = msg.chat.id;
        var resp = "Команды для получения расписания: \n" 
                   + "  \/give day week group , где : \n"
                   + "      day - день недели \n"
                   + "          'mon' - понедельник, \n" 
                   + "          'tue' - вторник, \n" 
                   + "          'wed' - среда, \n" 
                   + "          'thu' - четверг, \n" 
                   + "          'fri' - пятница, \n" 
                   + "          'sat' - суббота \n"
                   + "      week - четность недели \n"
                   + "          'uneven' или '1' - для нечетной \n" 
                   + "          'even' или '2' - для четной \n"
                   + "      group - группа \n"
                   + "          '1' - для ПМИ-1 \n" 
                   + "          '2' - для ПМИ-2";
        bot.sendMessage(fromId, resp);
      });

    //give mon uneven(1) 1
    bot.onText(/\/give (.+) (.+) (.+)/, function (msg, match) {
      var fromId = msg.chat.id;   
      bot.sendMessage(fromId, getTimetable(match[2], match[1], match[3]));
    });

    function getTimetable(week, day, group){
        if(!(week == '1' || week == '2' || week == 'uneven' || week == 'even')){
            return "Неправильная неделя (параметр 2)! \n"
                    + "'uneven' или '1' - для нечетной \n" 
                    + "'even' или '2' - для четной";
        }
        if(!(day == 'mon' || day == 'tue' || day == 'wed' || day == 'fri' || day == 'sat')){
            return "Неправильный день недели (параметр 1)! \n" 
            + "'mon' - понедельник, \n" 
            + "'tue' - вторник, \n" 
            + "'wed' - среда, \n" 
            + "'thu' - четверг, \n" 
            + "'fri' - пятница, \n" 
            + "'sat' - суббота";
        }
        if(!(group == '1' || group == '2')){
            return "Неправильная группа (параметр 3)! \n" 
            + "'1' - для ПМИ-1 \n" 
            + "'2' - для ПМИ-2";
        }
        if(week == '1'){
            week = 'uneven';
        }
        if(week == '2'){
            week = 'even';
        }
        var resp = '';
        var stuDay = timetable[week][group][day]
        for(var key in stuDay){
            if(stuDay[key].name == ''){
                resp += key + ') ---' + '\n';
            }
            else{
                resp += key + ') ' + stuDay[key].name + ' (' + stuDay[key].type + ') - ' + stuDay[key].aud + '\n';
            }
        }
        return resp;
    }

//распсиание mon tue wed thu fri sat
var timetable = {
    'uneven': {

        '1': {
            'mon': {
                '1': {name:'', type:'', aud:''},
                '2': {name:'Алгоритмы и анализ сложности', type:'практ', aud:'419'},
                '3': {name:'Теория игр', type:'лаб', aud:'427'}
            },
            'tue': {
                '1': {name:'Web', type:'лек', aud:'424'},
                '2': {name:'Web', type:'лаб', aud:'239'},
                '3': {name:'Параллельное программ', type:'лек', aud:'419'}
            },
            'wed': {
                '1': {name:'Параллельное программ', type:'практ', aud:'517'}
            },
            'thu': {
                '1': {name:'Бух. учет', type:'лек', aud:'519'},
                '2': {name:'Бух. учет', type:'лек', aud:'519'},
                '3': {name:'Теория игр', type:'практ', aud:'419'},
                '4': {name:'ТРРП', type:'лек', aud:'427'}
            },
            'fri': {
                '1': {name:'Комб. алгоритмы', type:'лаб', aud:'239'},
                '2': {name:'Комб. алгоритмы', type:'лек', aud:'419'}
            },
            'sat': {
                '1': {name:'', type:'', aud:''}
            }         
        },

        '2': {
            'mon': {
                '1': {name:'', type:'', aud:''},
                '2': {name:'Алгоритмы и анализ сложности', type:'практ', aud:'419'},
            },
            'tue': {
                '1': {name:'Web', type:'лек', aud:'424'},
                '2': {name:'', type:'', aud:''},
                '3': {name:'Параллельное программ', type:'лек', aud:'419'},
                '4': {name:'Web', type:'лаб', aud:'239  '},
            },
            'wed': {
                '1': {name:'Параллельное программ', type:'практ', aud:'517'},
                '2': {name:'ТРРП', type:'лаб', aud:'239'}
            },
            'thu': {
                '1': {name:'Бух. учет', type:'лек', aud:'519'},
                '2': {name:'Бух. учет', type:'лек', aud:'519'},
                '3': {name:'Теория игр', type:'практ', aud:'419'},
                '4': {name:'ТРРП', type:'лек', aud:'427'}
            },
            'fri': {
                '1': {name:'', type:'', aud:''},
                '2': {name:'Комб. алгоритмы', type:'лек', aud:'419'},
                '3': {name:'Комб. алгоритмы', type:'лаб', aud:'239'}
            },
            'sat': {
                '1': {name:'', type:'', aud:''}
            }       
        }

    },

    'even': {

        '1': {
            'mon': {
                '1': {name:'Алгоритмы и анализ сложности', type:'лек', aud:'419'},
                '2': {name:'Алгоритмы и анализ сложности', type:'практ', aud:'419'}
            },
            'tue': {
                '1': {name:'Web', type:'лек', aud:'424'},
                '2': {name:'Web', type:'лаб', aud:'239'},
                '3': {name:'Параллельное программ', type:'лек', aud:'419'},
                '4': {name:'Параллельное программ', type:'лаб', aud:'210'}
            },
            'wed': {
                '1': {name:'Теория игр', type:'лек', aud:'419'},
                '2': {name:'ТРРП', type:'лаб', aud:'239'}
            },
            'thu': {
                '1': {name:'Бух. учет', type:'лек', aud:'519'},
                '2': {name:'Бух. учет', type:'лек', aud:'519'},
                '3': {name:'ТРРП', type:'паркт', aud:'419'}
            },
            'fri': {
                '1': {name:'Комб. алгоритмы', type:'лаб', aud:'239'},
                '2': {name:'Комб. алгоритмы', type:'лек', aud:'419'}
            },
            'sat': {
                '1': {name:'', type:'', aud:''}
            }    
        },

        '2': {
            'mon': {
                '1': {name:'Алгоритмы и анализ сложности', type:'лек', aud:'419'},
                '2': {name:'Алгоритмы и анализ сложности', type:'практ', aud:'419'},
                '3': {name:'Теория игр', type:'лаб', aud:'427'}
            },
            'tue': {
                '1': {name:'Web', type:'лек', aud:'424'},
                '2': {name:'', type:'', aud:''},
                '3': {name:'Параллельное программ', type:'лек', aud:'419'},
                '4': {name:'Web', type:'лаб', aud:'239  '}
            },
            'wed': {
                '1': {name:'Теория игр', type:'лек', aud:'419'},
                '2': {name:'Параллельное программ', type:'лаб', aud:'239'}
            },
            'thu': {
                '1': {name:'Бух. учет', type:'лек', aud:'519'},
                '2': {name:'Бух. учет', type:'лек', aud:'519'},
                '3': {name:'ТРРП', type:'паркт', aud:'419'}
            },
            'fri': {
                '1': {name:'', type:'', aud:''},
                '2': {name:'Комб. алгоритмы', type:'лек', aud:'419'},
                '3': {name:'Комб. алгоритмы', type:'лаб', aud:'239'}
            },
            'sat': {
                '1': {name:'', type:'', aud:''}
            }     
        }

    }
}