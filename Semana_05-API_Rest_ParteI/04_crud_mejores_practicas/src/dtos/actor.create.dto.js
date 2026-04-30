export default class ActorCreateDTO {

    constructor(object) {
        this.actorId = object.actorId;
        this.firstName = object.firstName;
        this.lastName = object.lastName;
        this.lastUpdate = new Date().toISOString().replace('T', ' ').replace('Z', '')
    }

}

