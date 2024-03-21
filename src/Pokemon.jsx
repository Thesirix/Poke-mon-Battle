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
      damage: power
    });
  };
// drag n drop section ___________________________________________
  useEffect(() => {
    fetchPokemonDetail();
  }, []);

  const handleClick = () => {
    const audio = new Audio(pokemonDetail?.cries?.latest);
    audio.play();
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({ pokemonDetail, attackInfo }));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    const { attackInfo: sourceAttackInfo } = data;

    const sourceAttackPower = sourceAttackInfo.damage;

    const targetHPStat = pokemonDetail?.stats.find(stat => stat.stat.name === "hp");
    if (!targetHPStat) return;

    let newHP = targetHPStat.base_stat - sourceAttackPower;
    newHP = Math.max(newHP, 0);

    const newPercentage = (newHP / targetHPStat.base_stat) * 100;

    const updatedPokemonDetail = {
      ...pokemonDetail,
      stats: pokemonDetail.stats.map(stat => {
        if (stat.stat.name === "hp") {
          return {
            ...stat,
            base_stat: newHP
          };
        }
        return stat;
      })
    };

    setPokemonDetail(updatedPokemonDetail);
    setHealthPercentage(newPercentage);
  };
// ________________________________________________________________________________
  return (
    <div style={{ display: 'inline-block', marginRight: '20px' }}>
      <div>{pokemonDetail?.name}</div>
      <img
        src={pokemonDetail?.sprites?.front_default}
        onClick={handleClick}
        draggable={true}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        alt={pokemonDetail?.name}
      />
      <div>HP: {pokemonDetail?.stats.find(stat => stat.stat.name === "hp").base_stat}</div>
      <div
        style={{
          height: '10px',
          borderRadius: '5px',
          backgroundColor: healthPercentage === 100 ? 'green' : 'red',
          marginTop: '5px',
          width: `${healthPercentage}%` // Réduire la taille en fonction du pourcentage de points de vie restants
        }}
      />
      {attackInfo && (
        <div>
          Attack: {attackInfo.name} - Damage: {attackInfo.damage}
        </div>
      )}
    </div>
  );
};

export default Pokemon;
