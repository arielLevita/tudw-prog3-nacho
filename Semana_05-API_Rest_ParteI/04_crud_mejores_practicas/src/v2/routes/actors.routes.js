import express from "express";
import { query, param, body, validationResult } from "express-validator";
import apicache from "apicache";
import ActorsController from "../../controllers/actors.controller.js";

const cache = apicache.middleware;

//Valida que el actorId sea un entero positivo y que esté presente en la ruta. 
// Si no es así, devuelve un error 400 con los detalles de la validación fallida.
const validateId = [
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

// Verifica que los query params limit y offset, si están presentes, sean enteros no negativos.
// Además, valida que el parámetro order, si se proporciona, sea uno de los valores permitidos (firstName, lastName o actorId) y que el parámetro asc, si se incluye, sea un valor booleano. Si alguna de estas validaciones falla, devuelve un error 400 con los detalles de la validación fallida.

const validateQueryParams = [
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


// Verifica que el cuerpo del mensaje tenga los campos requeridos de actor. 
// En este caso, se valida que el campo firstName no esté vacío y tenga al menos 3 caracteres, 
// y que el campo lastName también cumpla con estas mismas condiciones. 
// Si alguna de estas validaciones falla, devuelve un error 400 con los detalles de la validación fallida.
const validatePayload = [
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

// Esta función middleware se encarga de transformar en valores válidos 
// los parámetros de consulta (query params) para la ruta que obtiene todos los actores/actrices.
const findAllTransformarQueryParams = (req, res, next) => {
    //Si no están definidos limit y offset no hago paginación
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    //Obtengo los filtros para cada campo. Si no están definidos no los incluyo en el objeto filter.
    const filterObj = {};
    const orderObj = {};

    const { firstName, lastName, order } = req.query;

    if (firstName) filterObj.firstName = firstName;
    if (lastName) filterObj.lastName = lastName;
    if (order) orderObj[order] = req.query.asc === "true" ? "ASC" : "DESC";

    req.query.filter = filterObj;
    req.query.order = orderObj;

    next();
};


//Transforma el request body en un DTO (Data Transfer Object) para estandarizar los datos antes de que lleguen al controlador. 
// En este caso, toma los campos firstName y lastName del cuerpo de la solicitud, los convierte a mayúsculas y elimina los espacios en blanco 
// al principio y al final. Luego, asigna este objeto transformado a req.dto para que esté disponible en el controlador.
const transformDTO = (req, res, next) => {
    const { firstName, lastName } = req.body;
    req.dto = {
        firstName: firstName.trim().toUpperCase(),
        lastName: lastName.trim().toUpperCase(),
        lastUpdate: new Date().toISOString().replace('T', ' ').replace('Z', '')
    };
    next();
}

const actorsController = new ActorsController();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Actor:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         actorId:
 *           type: integer
 *           description: ID del actor/actriz
 *         firstName:
 *           type: string
 *           description: Nombre del actor/actriz
 *         lastName:
 *           type: string
 *           description: apellido del actor/actriz
 *         lastUpdate:
 *           type: string
 *           format: date-time
 *           description: última modificación del actor/actriz. 
 *       example:
 *         actorId: 1
 *         firstName: PENELOPE
 *         lastName: GUINESS
 *         lastUpdate: 2024-09-12 18:05:18
 * 
 *     Error:
 *       type: object
 *       properties:    
 *         error:
 *           type: string
 *       example:
 *         error: "Actor no encontrado"
 */

/**
 * @swagger
 * /api/actors:
 *   get:
 *     summary: Obtiene una lista de todos los actores/actrices
 *     tags: [Actors]
 *     responses:
 *       200:
 *         description: Lista de actores/actrices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actor'
 *             examples:
 *               ejemplo1:
 *                 summary: Ejemplo de respuesta exitosa
 *                 value:
 *                   - actorId: 1
 *                     firstName: PENELOPE
 *                     lastName: GUINESS
 *                     lastUpdate: 2024-09-12 18:05:18
 *                   - actorId: 2
 *                     firstName: NICK
 *                     lastName: CAGE
 *                     lastUpdate: 2023-10-12 18:36:36
 */
router.get("/actors", [validateQueryParams, findAllTransformarQueryParams, cache("5 minutes")], actorsController.findAll);

/**
 * @swagger
 * /api/actors/{actorId}:
 *   get:
 *     summary: Obtener información de un actor/actriz
 *     tags: [Actors]
 *     description: Devuelve los detalles de un actor/actriz por su ID.
 *     parameters:
 *       - name: actorId
 *         in: path
 *         required: true
 *         description: El ID del actor/actriz que se desea obtener.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Actor/actriz encontrado/a.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 actorId:
 *                   type: integer
 *                   example: 1
 *                 firstName:
 *                   type: string
 *                   example: "NICK"
 *                 lastName:
 *                   type: string
 *                   example: "CAGE"
 *                 lastUpdate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-09-19T14:38:00Z"
 *       '404':
 *         description: Actor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Actor no encontrado"
 */

router.get("/actors/:actorId", validateId, actorsController.findById);

/** 
 * @swagger
 * /api/actors:
 *   post: 
 *     summary: Crea un nuevo actor / actriz.
 *     tags: [Actors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 *     responses:
 *       201:
 *         description: Actor/actriz creado/a exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       400:
 *         description: Solicitud inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/actors", [validatePayload, transformDTO], actorsController.create);

/**
 * @swagger
 * /api/actors/{actorId}:
 *   put:
 *     summary: Actualiza un actor/actriz existente.
 *     tags: [Actors]
 *     parameters:
 *       - name: actorId
 *         in: path
 *         required: true
 *         description: El ID del actor/actriz que se desea modificar.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 *     responses:
 *       200:
 *         description: Actor/actriz actualizado/a exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       400:
 *         description: Solicitud inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/actors/:actorId", [validateId, validatePayload, transformDTO], actorsController.update);

/**
 * @swagger
 * /api/actors/{actorId}:
 *   delete:
 *     summary: Elimina un actor/actriz existente.
 *     tags: [Actors]
 *     parameters:
 *       - name: actorId
 *         in: path
 *         required: true
 *         description: El ID del actor/actriz que se desea eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Actor/actriz eliminado/a exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       400:
 *         description: Solicitud inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/actors/:actorId", validateId, actorsController.destroy);

export { router };