// Esta función middleware se encarga de transformar en valores válidos 
// los parámetros de consulta (query params) para la ruta que obtiene todos los actores/actrices.
const actorsFindAllTransformer = (req, res, next) => {
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

export default actorsFindAllTransformer;