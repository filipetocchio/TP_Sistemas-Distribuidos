import express from "express";

import { postTbUsuario } from "../controllers/TbUsuario/Post.controller";
import { getAllTbUsuario, getByIdTbUsuario } from "../controllers/TbUsuario/Get.controller";
import { putTbUsuario } from "../controllers/TbUsuario/Put.controller";
import { patchTbUsuario } from "../controllers/TbUsuario/Patch.controller";
import { deleteAllTbUsuario, deleteByIdTbUsuario } from "../controllers/TbUsuario/Delete.controller";

// import { loginTbUsuario } from "../controllers/TbUsuario/Login.controller";
// import { logoutTbUsuario } from "../controllers/TbUsuario/Logout.controller";
// import { refreshToken } from "../controllers/TbUsuario/Refresh.controller";

export const TbUsuarioRouter = express.Router();
export const TbUsuarioLoginRouter = express.Router();
export const TbUsuarioLogoutRouter = express.Router();
export const TbUsuarioRefreshTokenRouter = express.Router();

TbUsuarioRouter.post("/", postTbUsuario);
TbUsuarioRouter.get("/", getAllTbUsuario);
TbUsuarioRouter.get("/:id", getByIdTbUsuario);
TbUsuarioRouter.put("/:id", putTbUsuario);
TbUsuarioRouter.patch("/:id", patchTbUsuario);
TbUsuarioRouter.delete("/", deleteAllTbUsuario);
TbUsuarioRouter.delete("/:id", deleteByIdTbUsuario);

// TbUsuarioLoginRouter.post("/", loginTbUsuario);
// TbUsuarioLogoutRouter.get("/", logoutTbUsuario);
// TbUsuarioRefreshTokenRouter.post("/", refreshToken);