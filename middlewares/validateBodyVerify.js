const {HttpError} = require("../helpers");

const validateBodyVerify = schema => {
    
    const func = (req, res, next)=> {
        const { error } = schema.validate(req.body);
        if (Object.keys(req.body).length === 0||error){
            next(HttpError(400, "missing required field email"));
  }
        next()
    }

    return func;
}

module.exports = validateBodyVerify;