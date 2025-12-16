export const envConfig = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB || 'mongodb://localhost:27017/nest-pokemon',
  port: process.env.PORT || 3000,
  defaultPokemonLimit: process.env.DEFAULT_POKEMON_LIMIT || 3,
});
