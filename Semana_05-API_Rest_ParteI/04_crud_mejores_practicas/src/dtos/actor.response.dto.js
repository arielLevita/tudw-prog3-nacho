export default class ActorResponseDTO {

    constructor(obj) {
        this.actorId = obj.actor_id;
        this.firstName = obj.first_name;
        this.lastName = obj.last_name;
        this.lastUpdate = obj.last_update;
    }

}

