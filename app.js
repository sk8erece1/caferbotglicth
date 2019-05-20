const request = require('request');
const logger = require(__dirname + '/util/logger');
const fs = require('fs');

const triesPerSecond = 0.25;

var working = [];

getGiftCode = function () {
    let code = '';
    let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for(var i = 0; i < 18; i++){
        code = code + dict.charAt(Math.floor(Math.random() * dict.length));
    }
    return code;
}

checkCode = function (code) {
    request(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`, (error, res, body) => {
        if(error){
            logger.error(`An error occurred:`);
            logger.error(error);
            return;
        }
        try {
            body = JSON.parse(body);
            if(body.message != "Unknown Gift Code" && body.message != "You are being rate limited."){
                logger.info(`FOUND CODE THAT WORKS: https://discord.gift/${code}`);
                console.log(JSON.stringify(body, null, 4));
                working.push(`https://discord.gift/${code}`);
                fs.writeFileSync(__dirname + '/codes.json', JSON.stringify(working, null, 4));
            }
            else {
                logger.info(`${code} Geçersiz Kod!`);
            }
        }
        catch (error) {
            logger.error(`An error occurred:`);
            logger.error(error);
            return;
        }
    });
}
logger.info(`Discord Nitro Generator v1.0.2`);
logger.info(`${(1/triesPerSecond)} Saniyede Bir Kod Üretir!`)
logger.info(`Edit: --Evindar Budakçı--\n`);

checkCode(getGiftCode());
setInterval(() => {
    checkCode(getGiftCode());
}, (1/triesPerSecond) * 0);