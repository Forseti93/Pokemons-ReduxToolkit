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
import TextField from "@mui/material/TextField";
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
  const [pokeData, setPokeData] = useState<any[]>([]);

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
        // img example
        // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/848.png
        const idArray = data.results.map((el: any) => {
          const url = el.url;
          const regEx = /\d+(?!.*\d)/gm;
          const id = url.match(regEx);
          return id[0];
        });

        setPokeData((prev) => {
          return data.results.map((elem: any, ind: number) => {
            return {
              ...elem,
              id: idArray[ind] as string,
            };
          });
        });
        setPokeNames(
          data.results.map((pokemon: any) => {
            return pokemon.name;
          })
        );
      });
  }, []);

  // load IPokemon data
  const loadPokemonData = async (index: number): Promise<IPokemon> => {
    const stats = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data.stats;
      });

    return {
      id: index as number,
      name: pokeNames[(index - 1) as number],
      hp: stats.find((obj: any) => obj.stat.name === "hp").base_stat as number,
      attack: stats.find((obj: any) => obj.stat.name === "attack")
        .base_stat as number,
    };
  };

  // React.SyntheticEvent, value: string, reason: string
  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    // const value = event.target.value
    dispatch(
      setActivePokemon(
        pokeData.find((el) => {
          if (el.name === value) {
            return el.name === value;
          }
        })?.id
      )
    );
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="25px">
      <Stack
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        gap="15px"
        sx={{
          padding: "16px",
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={pokeNames}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Pokemon's name" />
          )}
          onInputChange={handleInputChange}
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
              {pokeNames[activePokemon - 1]}
            </Typography>
            <CardMedia
              component="img"
              height="30%"
              image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${activePokemon}.png`}
              alt={pokeNames[activePokemon - 1]}
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
