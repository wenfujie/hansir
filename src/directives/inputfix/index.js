/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 处理iphone键盘兼容性指令
 * @Date: 2019-02-28 17:40:05
 * @LastEditTime: 2019-03-20 14:53:35
 */

function getClientHeight() {
    const originHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
    return originHeight;
}

const elWhiteList = ["input", "textarea"];

// 查找input标签
function findInputTag(el) {
    if (el.getElementsByTagName("input").length > 0) {
        return el.getElementsByTagName("input")[0];
    } else if (el.getElementsByTagName("textarea").length > 0) {
        return el.getElementsByTagName("textarea")[0];
    } else {
        return el;
    }
}

export default {
    inserted: (el, binding, vnode) => {
        const ua = window.navigator.userAgent.toLocaleLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(ua);
        const isAndroid = /android/.test(ua);
        const target = findInputTag(el);
        let scrollFlag = false;
        // ios & android 键盘弹出
        target.addEventListener(
            "focus",
            () => {
                // 处理键盘弹出后所需的页面逻辑
                // el.scrollIntoViewIfNeeded();
                scrollFlag = true;
                console.log("-----scrollFlag = true-------")
            },
            false
        );

        //ios 键盘收起
        target.addEventListener(
            "blur",
            () => {
                // 处理键盘收起后所需的页面逻辑
                if(isIOS){
                    // el.scrollIntoView();
                    scrollFlag = false;
                    setTimeout(()=>{
                        console.log("是否真正触发了滚动",scrollFlag)
                        if(scrollFlag)return;
                        scrollTo(0, pageYOffset);
                    },200)
                }
            },
            false
        );

        /*键盘弹起后页面高度变小*/
        const originHeight = getClientHeight();
        window.addEventListener(
            "resize",
            () => {
                const resizeHeight = getClientHeight();
                if (resizeHeight < originHeight) {
                    // 键盘弹起所后所需的页面逻辑
                } else {
                    // 键盘弹起所后所需的页面逻辑
                }
            },
            false
        );
    },
    update: (el, binding, vnode) => {}
};
