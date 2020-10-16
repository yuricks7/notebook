import { main as addModifyDate } from "./modifyDate.js";
import { main as addTocOnBody } from "./tocOnBody.js";
import { main as addRowNumbersOnCodeBlocks} from "./rowNumOnCodeBlock.js";

addTocOnBody();
addRowNumbersOnCodeBlocks();
// (addModifyDate($))(jQuery); // 他の関数が実行できないので最後に置く。
