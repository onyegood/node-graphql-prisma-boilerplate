import Joi from "joi";

export default Joi.object().keys({
  passwordToken: Joi.number().required().label("Password Token")
});