import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pokemon from './Pokemon';
import './App.css'; 

const App = () => {
  const [allPokemons, setAllPokemon] = useState([]);
  const [pokemSoundPlayed, setPokemSoundPlayed] = useState(false);

  useEffect(() => {
    const fetchAllPokemons = async () => {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      setAllPokemon(response.data.results);
    };

