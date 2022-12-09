const getByTourId = require('./Services').getByTourId;

async function tourId(req, res, next) {
    const response = await getByTourId(req.params.id);
    return response.data;
}

module.exports={tourId}