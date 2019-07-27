import goods from "./Goods";
import logis from "./Logis";
import ItemList from "./ItemList";
import WheelPicker from "@/components/WheelPicker";
import ordState from "./ordState";
import Empty from "@/components/EmptyContent.vue";
import emInfo from "./emInfo";
import { Popup, List, Area, Toast, PullRefresh } from "vant";

export default {
    logis,
    goods,
    WheelPicker,
    ItemList,
    ordState,
    emInfo,
    "van-popup": Popup,
    "van-list": List,
    "van-area": Area,
    "van-toast": Toast,
    empty: Empty,
    "van-pull-refresh": PullRefresh
};
