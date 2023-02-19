import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addPokemon, IPokemon, setActivePokemon } from "./PokemonSlice";

export interface IPokemonState {
  activePokemon: number | null;
  favPokemons: IPokemon[];
}

export default function Pokemon() {
  const [pokeNames, setPokeNames] = useState<string[]>([]);
  const [pokeData, setPokeData] = useState<string[]>([]);

  const { activePokemon, favPokemons }: IPokemonState = useSelector(
    (state: any) => state.pokemons
  );
  const dispatch = useDispatch();

  // load pokemons list
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPokeData(data.results);
        setPokeNames(
          data.results.map((pokemon: any) => {
            return pokemon.name;
          })
        );
      });
  }, []);

  // load IPokemon data
  const loadPokemonData = async (index: number): Promise<IPokemon> => {
    let stats: any;
    await fetch(`https://pokeapi.co/api/v2/pokemon/${+index + 1}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        stats = data.stats;
      });

    return {
      id: activePokemon as number,
      name: pokeNames[activePokemon as number],
      hp: stats.find((obj: any) => obj.stat.name === "hp").base_stat as number,
      attack: stats.find((obj: any) => obj.stat.name === "attack")
        .base_stat as number,
    };
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="25px">
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="15px"
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={pokeNames}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Pokemon's name" />
          )}
          onChange={(e: any) =>
            dispatch(setActivePokemon(e.target.dataset.optionIndex))
          }
        />
        <Button
          variant="outlined"
          onClick={async () => {
            if (
              activePokemon &&
              !favPokemons.find((pokemon) => pokemon.id === activePokemon)
            ) {
              dispatch(addPokemon(await loadPokemonData(activePokemon)));
            }
          }}
        >
          Add to favorites
        </Button>
      </Stack>
      {activePokemon && (
        <Card sx={{ maxWidth: 345 }} variant="outlined">
          <CardContent>
            <Typography
              sx={{ fontSize: 26 }}
              color="text.secondary"
              textTransform="capitalize"
              fontWeight="bolder"
            >
              {pokeNames[activePokemon]}
            </Typography>
            <CardMedia
              component="img"
              height="30%"
              image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
                +activePokemon + 1
              }.svg`}
              alt={pokeNames[activePokemon]}
            />
          </CardContent>
        </Card>
      )}
      <Button variant="outlined">
        <Link to="favorites">Favorites</Link>
      </Button>
    </Box>
  );
}
