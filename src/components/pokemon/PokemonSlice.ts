import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPokemon {
  id: number;
  name: string;
  hp: number;
  attack: number;
}

interface IPokemonsState {
  favPokemons: IPokemon[];
  activePokemon: number | null;
}

export const pokemonsSlice = createSlice({
  name: "pokemons",
  initialState: {
    favPokemons: [],
    activePokemon: null,
  } as IPokemonsState,
  reducers: {
    addPokemon: (state, action: PayloadAction<IPokemon>) => {
      state.favPokemons.push(action.payload);
    },
    setActivePokemon: (state, action) => {
      state.activePokemon = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addPokemon, setActivePokemon } = pokemonsSlice.actions;

export default pokemonsSlice.reducer;
