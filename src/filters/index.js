import check from "@/util/check";
export default {
    install(Vue) {
        Vue.filter("fixed2", val => {
            if (check.isEmpty(val)) return 0;
            val = Number(val);
            return val.toFixed(2);
        });

        Vue.filter("inputFilter", val => {
            return val.replace(
                /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
                ""
            );
        });
    }
};
