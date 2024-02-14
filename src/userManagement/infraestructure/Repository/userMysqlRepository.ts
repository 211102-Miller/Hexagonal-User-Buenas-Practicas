import { User } from "../../domain/Entity/user";
import { UserInterface } from "../../domain/Port/userInterface";
import { query } from "../../../database/mysql";
import { verificateToken } from "../../../helpers/tokenEmail";
import { compare } from "../../../helpers/ashs";
import { tokenSigIn } from "../../../helpers/token";

export class UserMysqlRepository  implements UserInterface{
    async registerUser(user: User): Promise<any> {
        try {
            const { contact, credential, status } = user;
            
            // Insertar los datos del usuario en la base de datos
            const sql = "INSERT INTO user (uuid, name, lastName, cellphone, email, password, activationToken, verifiedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            const params = [
                user.uuid,
                contact.name,
                contact.lastName,
                contact.cellphone,
                credential.email,
                credential.password,
                status.activationToken,
                status.verifiedAt
            ];

            await query(sql, params);

            return user;
        } catch (error) {
            console.error("Error al registrar usuario en MySQL:", error);
            throw new Error("Error al registrar usuario en MySQL");
        }
    }

    async verificateUser(token: string): Promise<string> {
        try {
            // Verificar el token
            const email = verificateToken(token);
    
            if (email) {
                // Si el token es válido, buscar el usuario por el token en la base de datos
                const sql = "UPDATE user SET verifiedAt = NOW() WHERE activationToken = ?";
                const params = [token];
                const result = await query(sql, params);
                
                if (result instanceof Array && result.length > 0 && result[0] instanceof Object) {
                    const affectedRows = result[0]['affectedRows']; 
    
                    if (affectedRows && typeof affectedRows === 'number' && affectedRows > 0) {
                        // Si se encontró y actualizó el usuario, retornar un mensaje de confirmación
                        return "Usuario confirmado correctamente.";
                    }
                }
            }
            // El token no es válido o el usuario no se encontró, retornar un mensaje de error
            return "No se pudo confirmar el usuario.";
        } catch (error) {
            console.error("Error al verificar usuario en MySQL:", error);
            throw new Error("Error al verificar usuario en MySQL");
        }
    }

    async loginUser(email: string, password: string): Promise<string | null> {
        try {
            // Primero, obtener el usuario por email.
            const [users]: any = await query('SELECT * FROM user WHERE email = ? LIMIT 1', [email]);
          
            if (!users || users.length === 0) {
                return null;
            }
    
            const user = users[0];
            console.log(user)
    
            // Verificar si la contraseña proporcionada coincide con la almacenada en la base de datos.
            const passwordMatches = await compare(password, user.password);
          
            if (!passwordMatches) {
                return 'Unauthorized';
            }
            console.log("pasooo")
            // Verificar si el usuario ha sido verificado.
            if (!user.verifiedAt) {
                return 'El usuario aún no ha verificado su cuenta';
            }
            console.log("pasooooooo")
            
    
            // Aquí podrías generar y devolver un token JWT si estás usando autenticación basada en tokens.
            // Por ahora, simplemente devolvemos un mensaje de éxito.
            const token: string = tokenSigIn(user.uuid, user.email);
            console.log("pasooo")

            return token;

        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            throw error;
        }
    }
}