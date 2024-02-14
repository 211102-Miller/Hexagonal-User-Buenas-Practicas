import { User } from "../../domain/Entity/user";
import { UserInterface } from "../../domain/Port/userInterface";

export class LoginUserUseCase{

    constructor(readonly userInterface:UserInterface){}

    async login(email:string, password:string):Promise<User | any | null | string>{
        try {
            const userLogin  = await this.userInterface.loginUser(email,password);
            return userLogin;
        } catch (error) {
            return null;
        }
    }
}