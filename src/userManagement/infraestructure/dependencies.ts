import { UserMysqlRepository } from "./Repository/userMysqlRepository";

import { RegisterUserUseCase } from "../application/UseCase/registerUserUseCase";
import { RegisterUserController } from "./Controller/registerUserController";

import { VerificateUserUseCase } from "../application/UseCase/verificateUserUseCase";
import { VerificateUserController } from "./Controller/verificateUserController";

import { LoginUserUseCase } from "../application/UseCase/loginUserUseCase";
import { LoginUserController } from "./Controller/loginUserController";

export const userMysqlRepository = new UserMysqlRepository()

export const registerUseCase = new RegisterUserUseCase(userMysqlRepository);
export const registerUserController = new RegisterUserController(registerUseCase,);

export const verificateUserUseCase = new VerificateUserUseCase(userMysqlRepository);
export const verificateUserController = new VerificateUserController(verificateUserUseCase);

export const loginUserUseCase = new LoginUserUseCase(userMysqlRepository);
export const loginUserController = new LoginUserController(loginUserUseCase);
