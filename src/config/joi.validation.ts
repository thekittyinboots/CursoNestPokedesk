import * as joi from 'joi';

export const joiValidationSchema = joi.object({
  MONGODB: joi.string().required(),

  PORT: joi.number().default(3000),

  DEFAULT_POKEMON_LIMIT: joi.number().default(7),
});
