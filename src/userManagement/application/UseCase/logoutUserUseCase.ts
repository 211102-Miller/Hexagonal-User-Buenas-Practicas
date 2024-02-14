import { User } from "../../domain/Entity/user";
import { UserInterface } from "../../domain/Port/userInterface";

export class LogoutUserUseCase{

    constructor(readonly userInterface: UserInterface){}

    async logout(uuid:string, token: string):Promise<User| null | any| string>{
        try {
            const close = await this.userInterface.logoutUser(uuid, token);
            return close;
        } catch (error) {
            return null;
        }
    }
}