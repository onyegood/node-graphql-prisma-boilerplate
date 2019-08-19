import Joi from "joi";

export default Joi.object().keys({
  name: Joi.string().min(5).max(255).required().label("Name")
});