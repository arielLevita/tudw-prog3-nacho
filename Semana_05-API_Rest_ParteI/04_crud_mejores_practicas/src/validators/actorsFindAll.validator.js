import { query, param, body, validationResult } from "express-validator";

// Verifica que los query params limit y offset, si están presentes, sean enteros no negativos.
// Además, valida que el parámetro order, si se proporciona, sea uno de los valores permitidos (firstName, lastName o actorId) y que el parámetro asc, si se incluye, sea un valor booleano. Si alguna de estas validaciones falla, devuelve un error 400 con los detalles de la validación fallida.

const actorsFindAllValidator = [
    query('firstName')
        .optional()
        .isString().withMessage('firstName debe ser una cadena de texto'),
    query('lastName')
        .optional()
        .isString().withMessage('lastName debe ser una cadena de texto'),
    query('limit')
        .optional()
        .isInt({ min: 0 }).withMessage('limit debe ser un entero no negativo')
        .toInt(),
    query('offset')
        .optional()
        .isInt({ min: 0 }).withMessage('offset debe ser un entero no negativo')
        .toInt(),
    query('order')
        .optional()
        .isIn(['firstName', 'lastName', 'actorId']).withMessage('order debe ser uno de los siguientes valores: firstName, lastName, actorId'),
    query('asc')
        .optional()
        .isBoolean().withMessage('asc debe ser un valor booleano'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default actorsFindAllValidator;