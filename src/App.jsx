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

    fetchAllPokemons(); 
  }, []);

  useEffect(() => {
    if (pokemSoundPlayed) {
      const audio = new Audio('src/assets/pokem.mp3');
      audio.playbackRate = 1.2; //pitch bend
      audio.play();
      setTimeout(() => {
        const openingAudio = new Audio('src/assets/Pokemon-Bleu- Opening.mp3');
