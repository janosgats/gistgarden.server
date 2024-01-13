import {MagicRouter} from "@/magicRouter/MagicRouter";
import {setGroupManagementRoutes} from "@/magicRouter/routes/groupManagementRoutes";
import {setUserRoutes} from "@/magicRouter/routes/userRoutes";
import {setUserAuthRoutes} from "@/magicRouter/routes/userAuthRoutes";
import {setTopicRoutes} from '@/magicRouter/routes/topicRoutes';

const globalMagicRouter = new MagicRouter()

setGroupManagementRoutes(globalMagicRouter)
setTopicRoutes(globalMagicRouter)
setUserRoutes(globalMagicRouter)
setUserAuthRoutes(globalMagicRouter)

export default globalMagicRouter


