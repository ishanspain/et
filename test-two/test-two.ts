import { Logger } from "../dist";
import { Logger as etLogger } from "express-throtle";

// import { Logger  as etLogger} from "et";


Logger.logger("log 1")
etLogger.Logger.logger("log 2")
