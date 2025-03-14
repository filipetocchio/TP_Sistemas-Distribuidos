import { Router } from 'express';

// import de Controllers
import { TbUsuarioRouter } from './TbUsuario.Router'; // TbUsuarioLoginRouter, TbUsuarioLogoutRouter, TbUsuarioRefreshTokenRouter


export const apiV1Router = Router();

// Url para uso de API
apiV1Router.use("/TbUsuario", TbUsuarioRouter);
// apiV1Router.use("/Login", TbUsuarioLoginRouter);
// apiV1Router.use("/Logout", TbUsuarioLogoutRouter);
// apiV1Router.use("/Refresh", TbUsuarioRefreshTokenRouter);