import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pokemon = ({ url }) => {
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [healthPercentage, setHealthPercentage] = useState(100);
  const [attackInfo, setAttackInfo] = useState(null);

  const fetchPokemonDetail = async () => {
    const response = await axios.get(url);
