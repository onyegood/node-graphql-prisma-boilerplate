import Joi from "joi";

export default Joi.object().keys({
  firstName: Joi.string().min(3).max(255).required().label("First Name"),
  lastName: Joi.string().min(3).max(255).required().label("Last Name"),
  email: Joi.string().email().required().label("Email"),
  phone: Joi.number().min(11).required().label("Phone"),
  role: Joi.string().required().label("Role"),
  password: Joi.string().regex(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,30}$/).label("Password").options({
    language: {
      string: {
        regex: {
          base: "must have at least one lowercase letter, one uppercase letter, one digit and special character."
        }
      }
    }
  })
});