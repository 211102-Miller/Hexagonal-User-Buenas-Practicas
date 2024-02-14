import { registerUserController, verificateUserController, loginUserController } from "../dependencies";
import express  from "express";

export const userRouter = express.Router();


userRouter.post("/", registerUserController.register.bind(registerUserController));

userRouter.put("/:token/activate", verificateUserController.update.bind(verificateUserController));

userRouter.post("/login", loginUserController.login.bind(loginUserController));


