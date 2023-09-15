import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, TextInput, Pressable} from 'react-native';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [pokes, setPokes] = useState([]);
  const [searchText, setSearchText] = useState(''); // État pour stocker la saisie de l'utilisateur
  const [filteredPokes, setFilteredPokes] = useState([]);
  const [showFilteredResults, setShowFilteredResults] = useState(false);
  const [pokemonShininess, setPokemonShininess] = useState({});





  const getListPoke = () => {
    const fetching = fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
      .then((response) => response.json())
      .then((pokemonData) => {
        const temporaryPokemon = [];

        Promise.all(
          pokemonData.results.map((pokemon) => {
            return fetch(pokemon.url)
              .then((response) => response.json())
              .then((pokemonData) => {
                console.log(temporaryPokemon);
                return temporaryPokemon.push(pokemonData);
              });
          })
        ).then(() => {
          temporaryPokemon.sort((poke1, poke2) => poke1.id - poke2.id);
          setPokes(temporaryPokemon);

          // Initialisez l'état de brillance pour chaque Pokémon
          const shininess = temporaryPokemon.reduce((acc, pokemon) => {
            acc[pokemon.name] = false;
            return acc;
          }, {});
          setPokemonShininess(shininess);
        });
      });
  }

  useEffect(() => {
    getListPoke();
  },[]);

  const renderItem = ({ item }) => {
    const imageUrl = pokemonShininess[item.name] ? item.sprites.front_shiny : item.sprites.front_default;


    const toggleShiny = (pokemonName) => {
      setPokemonShininess((prevShininess) => ({
        ...prevShininess,
        [pokemonName]: !prevShininess[pokemonName],
      }));
    };
    

    return (
      <View style={styles.box}>
        <View style={styles.imageBox}>
            <Image source={{ uri: imageUrl}} style={styles.imageStyle} />
        </View>
        <View style={styles.textBox}>
          <Pressable onPress={() => toggleShiny(item.name)} style={styles.favoriteBox}>
              <Image source={require('./assets/star.png')} style={styles.starIcon} />
          </Pressable>
          <Text style={styles.pokeNameStyle}>{item.name}</Text>
          <Text>Height : {item.height}</Text>
          <Text>Weight : {item.weight}</Text>
          {item.types.map(e => (
            <Text style={styles[e.type.name]} key={e.type.name}>{e.type.name}</Text>
          ))}
        </View>
      </View>
    );
  }

  // Fonction de recherche
  const searchPokemon = (text) => {
    setSearchText(text); // Mettre à jour la saisie de l'utilisateur
    const filtered = pokes.filter(
      (poke) =>
        poke.name.toLowerCase().includes(text.toLowerCase()) || // Recherche par nom
        poke.types.some((type) => type.type.name.toLowerCase().includes(text.toLowerCase())) // Recherche par type
    );
    setFilteredPokes(filtered); // Mettre à jour la liste filtrée
    setShowFilteredResults(true); // Mettre à jour la variable d'état pour afficher les résultats filtrés
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom ou type..."
        value={searchText}
        onChangeText={searchPokemon}
      />
      {showFilteredResults ? (
        filteredPokes.length > 0 ? (
          <FlatList
            data={filteredPokes}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        ) : (
          <Text>Aucun résultat trouvé.</Text>
        )
      ) : (
        pokes.length > 0 ? (
          <FlatList
            data={pokes}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        ) : (
          <Text>Loading...</Text>
        )
      )}
      <StatusBar style="auto" />
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  starIcon: {
    width: 40,
    height: 40,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: 'black',
    width: '48%',
    marginHorizontal: 10,
  },
  imageBox: {
    marginRight: 20,
  },
  imageStyle: {
    width: 100,
    height: 100
  },
  textBox: {
    flex: 1,
  },
  pokeNameStyle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  searchInput: {
    width: '95%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    margin: 10
  },
  grass: {
    backgroundColor: 'green',
  },
  poison: {
    backgroundColor: 'purple',
  },
  fire: {
    backgroundColor: 'red',
  },
  flying: {
    backgroundColor: 'grey',
  },
  normal: {
    backgroundColor: 'lightgrey',
  },
  fighting: { 
    backgroundColor: 'brown',
  },
  ground: {
    backgroundColor: 'lightbrown',
  },
  rock: {
    backgroundColor: 'darkbrown',
  },
  bug: {
    backgroundColor: 'lightgreen',
  },
  ghost: {
    backgroundColor: 'darkpurple',
  },
  water: {
    backgroundColor: 'blue',
  },
  electric: {
    backgroundColor: 'yellow',
  },
  psychic: {
    backgroundColor: 'pink',
  },
  ice: {
    backgroundColor: 'lightblue',
  },
  dragon: {
    backgroundColor: 'darkblue',
  },
  dark: {
    backgroundColor: 'black',
  },
  fairy: {
    backgroundColor: 'lightpink',
  },
  steel: {
    backgroundColor: 'darkgrey',
  }
});
