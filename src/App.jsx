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
        openingAudio.currentTime = 0.2; // quand ça commence pour éviter le vide 
        openingAudio.play();
      }, 50); // delai pour laisser charger
    }
  }, [pokemSoundPlayed]);

  const handleStartButtonClick = () => {
    setPokemSoundPlayed(true);
  };

  const handleDrop = (event, targetPokemon) => {
    event.preventDefault();
    const draggedPokemonUrl = event.dataTransfer.getData('text/plain');
    const attackingPokemon = allPokemons.find(pokemon => pokemon.url === draggedPokemonUrl);
    if (!attackingPokemon) return;

    const updatedPokemons = allPokemons.map(pokemon => {
      if (pokemon.url === targetPokemon.url) {
        const updatedHP = Math.max(0, pokemon.hp); 
        return { ...pokemon, hp: updatedHP };
      }
      return pokemon;
    });

