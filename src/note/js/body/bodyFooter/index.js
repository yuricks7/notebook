import { main as addModifyDate } from "../../../../shared/js/body/bodyFooter/modifyDate.js";
import { main as addTocOnBody } from "../../../../shared/js/body/bodyFooter/tocOnBody.js";
import { main as addRowNumbersOnCodeBlocks} from "../../../../shared/js/body/bodyFooter/rowNumOnCodeBlock.js";

addTocOnBody();
addRowNumbersOnCodeBlocks();
// (addModifyDate($))(jQuery); // 他の関数が実行できないので最後に置く。
