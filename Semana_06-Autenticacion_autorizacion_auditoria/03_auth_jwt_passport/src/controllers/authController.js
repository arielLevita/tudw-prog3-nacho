import jwt from 'jsonwebtoken';
import passport from "passport";

class AuthController {

    login = async (req, res) => {
        passport.authenticate('local', { session: false }, 
            (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Solicitud incorrecta',
                    user
                });
            }

            // Generar un token web JSON firmado con el contenido del objeto de usuario y devolverlo en la respuesta
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        })(req, res);
    };

}

export default AuthController;