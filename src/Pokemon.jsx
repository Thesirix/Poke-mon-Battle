import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pokemon = ({ url }) => {
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [healthPercentage, setHealthPercentage] = useState(100);
  const [attackInfo, setAttackInfo] = useState(null);

  const fetchPokemonDetail = async () => {
    const response = await axios.get(url);
    setPokemonDetail(response.data);
// calcul current hp / % ___________________________________________________________
    const hpStat = response.data.stats.find(stat => stat.stat.name === "hp");
    const currentHP = hpStat.base_stat;
    const maxHP = currentHP;
    const percentage = (currentHP / maxHP) * 100;
    setHealthPercentage(percentage);

    let selectedMove = null;
    let power = 0;
// cherche une atack tant quel est egal a 0 power _______________________________
    while (!selectedMove || power === 0) {
      const randomMoveIndex = Math.floor(Math.random() * response.data.moves.length);
      const randomMove = response.data.moves[randomMoveIndex].move;

      const moveResponse = await axios.get(randomMove.url);
      power = moveResponse.data.power;

      if (power && power !== 0) {
        selectedMove = randomMove;
      }
    }
//_______________________________________________________
    setAttackInfo({
      name: selectedMove.name,
