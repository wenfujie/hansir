const userVolume = require('../../model/volume')

const getAiMeasure = async function (ctx,next) {
    let res = await userVolume.getAiMeasure(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getAiMeasure
