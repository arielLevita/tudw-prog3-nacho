import express from "express";
import ActorsController from "../../controllers/actors.controller.js";
import actorIdValidator from "../../validators/actorId.validator.js";
import actorsFindAllValidator from "../../validators/actorsFindAll.validator.js";
import actorsFindAllTransformer from "../../transformers/actorsFindAll.transformer.js";

const controller = new ActorsController();
const router = express.Router();

router.get("/actors", [actorsFindAllValidator, actorsFindAllTransformer], controller.findAll.bind(controller));

export { router };