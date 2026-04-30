import express from "express";
import ActorsController from "../../controllers/actors.controller.js";

const actorsController = new ActorsController();

const router = express.Router();

router.get("/actors", actorsController.findAll);

export { router };