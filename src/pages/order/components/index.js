import ScrollTab from "@/components/ScrollTab";
import tabs from "@/components/Tabs";
import logistic from "@/components/logistic";
import orderInfo from "./order-info";
import orderStep from "./order-step";
import goodList from "./good-list";
import customList from "./custom-list";
import volumeAppoint from "./volumeAppoint";
import ActionCells from "./ActionCells";
import ActionSheet from "./ActionSheet";

import addressInfo from "./address-info";
import { Popup } from "vant";
export default {
  ScrollTab,
  logistic,
  orderInfo,
  goodList,
  customList,
  orderStep,
  addressInfo,
  ActionCells,
  ActionSheet,
  volumeAppoint,
  "van-popup": Popup
};
