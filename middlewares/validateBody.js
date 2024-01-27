const {HttpError} = require("../helpers");

const validateBody = schema => {
    const func = (req, res, next)=> {
        console.log(req.body);
        if (Object.keys(req.body).length === 0){
            next(HttpError(400, "missing fields"));
  }
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, `missing required ${error.message.replace(/"/g, "").replace(/is required/, "field")}`));
        }
        next()
    }

    return func;
}

module.exports = validateBody;