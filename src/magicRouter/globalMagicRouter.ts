import {MagicRouter} from "@/magicRouter/MagicRouter";
import {setGroupManagementRoutes} from "@/magicRouter/routes/groupManagementRoutes";
import {setUserRoutes} from "@/magicRouter/routes/userRoutes";
import {setUserAuthRoutes} from "@/magicRouter/routes/userAuthRoutes";
import {setTopicRoutes} from '@/magicRouter/routes/topicRoutes';
import {setTopicCommentRoutes} from '@/magicRouter/routes/topicCommentRoutes';
import {setRegistrationRoutes} from '@/magicRouter/routes/registrationRoutes';

const globalMagicRouter = new MagicRouter()

setGroupManagementRoutes(globalMagicRouter)
setTopicRoutes(globalMagicRouter)
setTopicCommentRoutes(globalMagicRouter)
setUserRoutes(globalMagicRouter)
setUserAuthRoutes(globalMagicRouter)
setRegistrationRoutes(globalMagicRouter)

export default globalMagicRouter


