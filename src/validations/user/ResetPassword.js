import Joi from "joi";

export default Joi.object().keys({
  passwordToken: Joi.string().required().label("Password Token"),
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