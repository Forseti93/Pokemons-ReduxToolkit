import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IPokemonState } from "./pokemon/Pokemon";

export const Favorites = () => {
  const { favPokemons }: IPokemonState = useSelector(
    (state: any) => state.pokemons
  );

  return (
    <>
      <Link to="/">Home</Link>
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="25px"
      >
        {favPokemons.map((pokemon, id) => {
          return (
            <Box key={id}>
              <Card sx={{ maxWidth: 345 }} variant="outlined">
                <CardContent>
                  <Typography
                    sx={{ fontSize: 26 }}
                    color="text.secondary"
                    textTransform="capitalize"
                    fontWeight="bolder"
                  >
                    {pokemon.name}
                  </Typography>
                  <CardMedia
                    component="img"
                    height="30%"
                    image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                    alt={pokemon.name}
                  />
                  <Box display="flex" justifyContent="space-between" gap="16px">
                    <Typography
                      sx={{ fontSize: 16 }}
                      color="text.secondary"
                      textTransform="capitalize"
                    >
                      HP: {pokemon.hp}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 16 }}
                      color="text.secondary"
                      textTransform="capitalize"
                    >
                      Attack: {pokemon.attack}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
