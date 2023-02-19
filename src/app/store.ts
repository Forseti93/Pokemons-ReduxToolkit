import { configureStore } from "@reduxjs/toolkit";
import pokemonReducers from "../components/pokemon/PokemonSlice";

const store = configureStore({
  reducer: {
    pokemons: pokemonReducers
  },
});

export default store;
