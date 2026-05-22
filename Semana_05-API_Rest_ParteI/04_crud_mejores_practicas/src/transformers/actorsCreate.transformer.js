//Transforma el request body en un DTO (Data Transfer Object) para estandarizar los datos antes de que lleguen al controlador. 
// En este caso, toma los campos firstName y lastName del cuerpo de la solicitud, los convierte a mayúsculas y elimina los espacios en blanco 
// al principio y al final. Luego, asigna este objeto transformado a req.dto para que esté disponible en el controlador.
const actorsCreateTransformer = (req, res, next) => {
    const { firstName, lastName } = req.body;
    req.dto = {
        firstName: firstName.trim().toUpperCase(),
        lastName: lastName.trim().toUpperCase(),
        lastUpdate: new Date().toISOString().replace('T', ' ').replace('Z', '')
    };
    next();
};

export default actorsCreateTransformer;

