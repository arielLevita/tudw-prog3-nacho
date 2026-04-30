import ActorResponseDTO from "../dtos/actor.response.dto.js";
import ActorsService from "../services/actors.service.js";

export default class ActorsController {

    constructor() {
        this.service = new ActorsService();
    }

    findAll = async (req, res) => {

        const { filter, limit, offset, order } = req.query;

        try {

            const data = await this.service.findAll(filter, limit, offset, order);

            res.send(data);

        } catch (error) {
            console.error(error);
            res.status(error?.status || 500).send({ status: "Fallo", data: { error: error?.message || error } });
        }
    }

    findById = async (req, res) => {
        const actorId = req.params.actorId;
        const data = await this.service.findById(actorId);

        if (!data) {
            res.status(404).send({ status: "Fallo", data: { error: "Actor no encontrado." } })
        }

        res.send(data);
    }

    create = async (req, res) => {

        const actor = req.dto;

        try {
            const actorCreado = await this.service.create(actor);
            res.status(201).send({ status: "OK", data: actorCreado });
        } catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: "Fallo", data: { error: error?.message || error } });
        }
    }

    update = async (req, res) => {
        
        const actorId = req.params.actorId;
        const body = req.dto;
        
        try {
            const actorActualizado = await this.service.update(actorId, body);
            res.status(200).send(actorActualizado);
        } catch (error) {
            res.status(error?.status || 500).send({ status: "Fallo", data: { error: error?.message || error } });
        }
    }

    destroy = async (req, res) => {

        const actorId = req.params.actorId;

        try {
            await this.service.destroy(actorId);
            res.status(204).send();
        } catch (error) {
            res.status(error?.status || 500).send({ status: "Fallo", data: { error: error?.message || error } });
        }
    }
};