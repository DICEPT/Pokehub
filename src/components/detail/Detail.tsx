import { useEffect, useState } from 'react';
import PokemonInfo from './PokemonInfo';
import Status from './Status';
import { getPokemonData, getPokemonSpecies } from '@/lib/poketApi';
import { PokemonType, Stat } from '@/lib/type';
import PokemonImg from './PokemonImg';
import { useParams } from 'react-router-dom';
import { FORM_NAMES } from '@/lib/pokemonFormNames';

const Detail = () => {
  const [pokemon, setPokemon] = useState<PokemonType | null>(null);
  const [baseStats, setBaseStats] = useState<Stat[]>([]);
  const [flavorText, setFlavorText] = useState('');
  const [genus, setGenus] = useState('');
  const [selectedFormName, setSelectedFormName] = useState('');

  const params = useParams();

  useEffect(() => {
    const fetchDataAPI = async () => {
      try {
        const pokemonData = await getPokemonData(params.id ?? '');

        const speciesUrl = pokemonData.species.url;
        const speciesDetailData = await getPokemonSpecies(speciesUrl);

        const koreanSpeciesData = speciesDetailData.flavor_text_entries.find(
          (flavor_text_entries: { language: { name: string } }) =>
            flavor_text_entries.language.name === 'ko',
        );

        const koreanGenusData = speciesDetailData.genera.find(
          (genera: { language: { name: string } }) =>
            genera.language.name === 'ko',
        );

        setBaseStats(pokemonData.stats);
        setPokemon(pokemonData);
        setFlavorText(koreanSpeciesData.flavor_text);
        setGenus(koreanGenusData.genus);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataAPI();
  }, [params.id]);

  const onFormChange = async (formName: string) => {
    try {
      const FormChangeData = await getPokemonData(formName);

      const koreanFormName = FORM_NAMES[formName];

      setSelectedFormName(koreanFormName);
      setPokemon({ ...FormChangeData, id: pokemon?.id, name: pokemon?.name });
      setBaseStats(FormChangeData.stats);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PokemonInfo pokemon={pokemon} onFormChange={onFormChange} />
        <PokemonImg
          pokemon={pokemon}
          flavorText={flavorText}
          genus={genus}
          formName={selectedFormName}
        />
        <Status baseStats={baseStats} />
      </div>
    </>
  );
};

export default Detail;
