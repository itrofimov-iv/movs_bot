var TelegramBot = require('node-telegram-bot-api');
var db = require('./db/db');
var ObjectID = require('mongodb').ObjectID;
//asd

var token = '417143040:AAEuE_851SI8yp-SjN0IRKFM7YyXLT8F8J0'; //deploy
// var token = '363117408:AAFAWaXUye_BuvTdSH-iwtGoH3hTR49LRNI'; //test
var dbname = 'mongodb://kilkuss96:741222@mongodb/sampledb'; //deploy
// var dbname = 'mongodb://localhost:27017/myapi'; //test
var idNewsChannel = -1001110394500;  //deploy
// var idNewsChannel = -1001134677653;   //test

var bot = new TelegramBot(token, { polling: true });

//region important message

bot.on('message', (msg) => {
    var important = '#важно'
    if (msg.text !== undefined) {
        if (msg.text.toLowerCase().indexOf(important) !== -1) {
            addLog('sendImportantMsg', msg);
            bot.sendMessage(idNewsChannel, msg.text);
        }
    }
});

//endregion

//region timetable

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.from.id, "Выберите свою группу.", {
        "reply_markup": {
            "keyboard": [["/g ПМИ-1", "/g ПМИ-2"], ["/g ПМИ-1 + бух.учет", "/g ПМИ-2 + бух.учет"]],
            "resize_keyboard": true,
            "one_time_keyboard": true,
            "selective": true
        }
    });
})

bot.onText(/\/timetable/, (msg) => {
    bot.sendMessage(msg.from.id, "Выберите день недели", {
        "reply_markup": {
            "keyboard": [["/r Сегодня", "/r Завтра"], ["/r ПН", "/r ВТ", "/r СР", "/r ЧТ", "/r ПТ", "/r Сб"]],
            "resize_keyboard": true,
            "one_time_keyboard": true,
            "selective": true
        }
    });
})

//получение расписания
bot.onText(/\/r (.+)/, (msg, match) => {
    addLog('getTimetable', msg);
    mdate = (msg.date) * 1000;
    var date = new Date(mdate);
    var cday = date.getDay();
    var rday = 0;
    var evenWeek = isEvenWeek(date.getTime());
    switch (match[1].toLowerCase()) {
        case 'пн':
            rday = 1;
            break;
        case 'вт':
            rday = 2;
            break;
        case 'ср':
            rday = 3;
            break;
        case 'чт':
            rday = 4;
            break;
        case 'пт':
            rday = 5;
            break;
        case 'сб':
            rday = 6;
            break;
        case 'сегодня':
            rday = cday;
            break;
        case 'завтра':
            if (cday === 6) {
                rday = 0;
            }
            else {
                rday = cday + 1;
            }
            break;
        default:
            return;
    }

    evenWeek = rday < cday ? !evenWeek : evenWeek;

    db.connect(dbname, (err) => {
        if (err) {
            return console.log(err);
        }
        db.get().collection('movsdb').findOne(
            { id: msg.from.id },
            (err, obj) => {
                if (err) {
                    return console.log(err);
                }
                if (obj !== null) {
                    sendTimetable(msg, rday, evenWeek, obj.group);
                }
                else {
                    bot.sendMessage(msg.chat.id, 'Для начала выберите группу!');
                }
            }
        )
    })
})

//добавление группы
bot.onText(/\/g (.+)/, (msg, match) => {
    addLog('setGroup', msg);
    var group = 0;
    switch (match[1].toLowerCase()) {
        case 'пми-1':
            group = 1;
            break;
        case 'пми-2':
            group = 2;
            break;
        case 'пми-1 + бух.учет':
            group = 3;
            break;
        case 'пми-2 + бух.учет':
            group = 4;
            break;
        default:
            return;
    }
    setGroup(msg.from.id, group);
})

//endregion

//region date

function isEvenWeek(mdate) {
    var oneweek = 604800000;
    var firstweek = 1506279600000;
    var temp = Math.trunc((mdate - firstweek) / oneweek) % 2;
    return temp === 1 ? true : false;
}

//endregion

//region db

function sendTimetable(msg, rday, week, group) {
    console.log('group', group, 'week', week, 'day', rday)
    switch (rday) {
        case 0:
            bot.sendMessage(msg.chat.id, 'Выходной.')
            break;
        case 1:
            if (group === 1 || group === 3) {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s018.radikal.ru/i505/1710/b4/e1e4dd499380.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://s019.radikal.ru/i629/1710/0d/7299b640eaa4.png')
                }
            }
            else {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s018.radikal.ru/i523/1710/1d/d6d64f0e96b1.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://s011.radikal.ru/i315/1710/0c/1064828ff460.png')
                }
            }
            break;
        case 2:
            if (group === 1 || group === 3) {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s019.radikal.ru/i616/1710/de/94e64ef2c77a.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://i057.radikal.ru/1710/ed/30409c30ba79.png')
                }
            }
            else {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s018.radikal.ru/i509/1710/66/d3407df46141.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://s019.radikal.ru/i616/1710/de/94e64ef2c77a.png')
                }
            }
            break;
        case 3:
            if (group === 1 || group === 3) {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s48.radikal.ru/i122/1710/fa/52daeb752e50.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://s019.radikal.ru/i622/1710/fe/b1a9014ad072.png')
                }
            }
            else {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s019.radikal.ru/i624/1710/9e/42fe13a49b3c.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://s019.radikal.ru/i621/1710/71/7c1b0b85f99f.png')
                }
            }
            break;
        case 4:
            if (group === 1 || group === 2) {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s018.radikal.ru/i504/1710/56/43e522b9e3b0.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://s41.radikal.ru/i094/1710/5c/389a1b172cd4.png')
                }
            }
            else {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s018.radikal.ru/i516/1710/e5/6070fd95b11f.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://s018.radikal.ru/i524/1710/8a/2a113dd37a8c.png')
                }
            }
            break;
        case 5:
            if (group === 1 || group === 3) {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://i075.radikal.ru/1710/f7/df4e3c4fbd72.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://i075.radikal.ru/1710/f7/df4e3c4fbd72.png')
                }
            }
            else {
                if (!week) {
                    bot.sendPhoto(msg.chat.id, 'http://s019.radikal.ru/i642/1710/cf/1f5870c5b077.png')
                } else {
                    bot.sendPhoto(msg.chat.id, 'http://s019.radikal.ru/i642/1710/cf/1f5870c5b077.png')
                }
            }
            break;
        case 6:
            bot.sendMessage(msg.chat.id, 'Выходной.')
            break;
    }
}

function setGroup(id, group) {
    db.connect(dbname, (err) => {
        if (err) {
            return console.log(err);
        }
        db.get().collection('movsdb').findOne(
            { id: id },
            (err, obj) => {
                if (err) {
                    return console.log(err);
                }
                if (obj === null) {
                    var stud = {
                        id: id,
                        group: group
                    }
                    db.get().collection('movsdb').insert(stud, (err, result) => {
                        if (err) {
                            return console.log(err);
                        }
                    })
                }
                else {
                    db.get().collection('movsdb').updateOne(
                        { _id: obj._id },
                        { $set: { group: group } },
                        (err, result) => {
                            if (err) {
                                return console.log(err);
                            }
                        }
                    )
                }
            }
        )
    })
}

//endregion

//region log

function addLog(type, msg) {
    var date = new Date(msg.date * 1000);
    console.log(date + " | " + type + " | " + msg.from.id + " | "
        + msg.from.first_name + " | " + msg.from.last_name + " | "
        + msg.from.username);
}

//endregion