import { query, param, body, validationResult } from "express-validator";

// Verifica que el cuerpo del mensaje tenga los campos requeridos de actor. 
// En este caso, se valida que el campo firstName no esté vacío y tenga al menos 3 caracteres, 
// y que el campo lastName también cumpla con estas mismas condiciones. 
// Si alguna de estas validaciones falla, devuelve un error 400 con los detalles de la validación fallida.
const actorsCreateValidator = [
    body("firstName")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),

    body("lastName")
        .notEmpty().withMessage("El apellido es obligatorio")
        .isLength({ min: 3 }).withMessage("El apellido debe tener al menos 3 caracteres"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default actorsCreateValidator;