import {MagicRouter} from "@/magicRouter/MagicRouter";
import {setGroupManagementRoutes} from "@/magicRouter/routes/groupManagementRoutes";
import {setUserRoutes} from "@/magicRouter/routes/userRoutes";
import {setUserAuthRoutes} from "@/magicRouter/routes/userAuthRoutes";

const globalMagicRouter = new MagicRouter()

setGroupManagementRoutes(globalMagicRouter)
setUserRoutes(globalMagicRouter)
setUserAuthRoutes(globalMagicRouter)

export default globalMagicRouter


