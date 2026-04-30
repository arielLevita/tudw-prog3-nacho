import Actors from "../database/actors.database.js";
import ActorResponseDTO from "../dtos/actor.response.dto.js";

export default class ActorsService {

  static KEYS_MAP = {
    actorId: 'actor_id',
    firstName: 'first_name',
    lastName: 'last_name',
    lastUpdate: 'last_update'
  };

  static mapKeysToColumns = (obj) => {

    if (obj === undefined || obj === null) {
      return null;
    }

    if (Object.keys(obj).length === 0) {
      return null;
    }

    const res = Object.entries(obj).reduce((acc, [key, value]) => {
      const column = ActorsService.KEYS_MAP[key];
      if (column) acc[column] = value;
      return acc;
    }, {});

    return res;
  };

  constructor() {
    this.actors = new Actors();
  }

  findAll = async (filter, limit, offset, order) => {

    //Obtengo los filtros para cada campo ya con el nombre que llevan en la BD.
    const sqlFilter = ActorsService.mapKeysToColumns(filter);

    //Idem anterior pero para el/los campo por el que voy a hacer las ordenaciones.   
    const sqlOrder = ActorsService.mapKeysToColumns(order);

    const tableResults = await this.actors.findAll(sqlFilter, limit, offset, sqlOrder);

    const dtoResults = tableResults.map(row => new ActorResponseDTO(row));

    return dtoResults;
  }

  findById = async (id) => {
    const row = await this.actors.findById(id);
    return new ActorResponseDTO(row);
  }

  create = async (actor) => {
    const actorId = await this.actors.create(actor);
    return await this.findById(actorId);
  }

  update = async (actorId, actor) => {
    await this.actors.update(actorId, actor);
    return await this.findById(actorId);
  }

  destroy = async (actorId) => {
    await this.actors.destroy(actorId);
  }

};