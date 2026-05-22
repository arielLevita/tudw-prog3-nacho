import { query, param, body, validationResult } from "express-validator";

//Valida que el actorId sea un entero positivo y que esté presente en la ruta. 
// Si no es así, devuelve un error 400 con los detalles de la validación fallida.
const actorIdValidator = [
    param('actorId')
        .notEmpty().withMessage('actorId es requerido')
        .isInt({ min: 1 }).withMessage('actorId debe ser un entero positivo')
        .toInt(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default actorIdValidator;