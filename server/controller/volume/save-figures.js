
const userVolume = require('../../model/volume')

const saveFigures = async function (ctx,next) {
    let res = await userVolume.saveFiguresValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = saveFigures