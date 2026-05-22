import express from "express";
import { query, param, body, validationResult } from "express-validator";
import apicache from "apicache";
import ActorsController from "../../controllers/actors.controller.js";
import actorIdValidator from "../../validators/actorId.validator.js";
import actorsFindAllValidator from "../../validators/actorsFindAll.validator.js";
import actorsCreateValidator from "../../validators/actorsCreate.validator.js";
import actorsFindAllTransformer from "../../transformers/actorsFindAll.transformer.js";
import actorsCreateTransformer from "../../transformers/actorsCreate.transformer.js"

const cache = apicache.middleware;

const controller = new ActorsController();
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

router.get("/", (req, res) => {
    res.send({ status: "OK" });
})

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
router.get("/actors", [actorsFindAllValidator, actorsFindAllTransformer, cache("5 minutes")], controller.findAll.bind(controller));

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
router.get("/actors/:actorId", actorIdValidator, controller.findById.bind(controller));

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
router.post("/actors", [actorsCreateValidator, actorsCreateTransformer], controller.create.bind(controller));

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
router.put("/actors/:actorId", [actorIdValidator, actorsCreateValidator, actorsCreateTransformer], controller.update.bind(controller));

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
router.delete("/actors/:actorId", actorIdValidator, controller.destroy.bind(controller));

export { router };