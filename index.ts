

import { sm } from 'jssm';
import axios, { AxiosRequestConfig } from 'axios';

import { Prompt } from './services/prompt'
import { Data } from './services/data'
import { StateService } from './services/state'

import { StateTypes, States } from './config/types'
//Finite State Machine
const FSM = sm`
welcome 'next' -> menu;
menu <-> attack;
menu<-> more;
menu <-> favoriteattack;
menu -> goodbye;
more <-> moves;
more  <-> pokemon;
more  <-> attack;
more -> goodbye;
more <-> favoriteattack;

`;


const states: States = {
    'welcome': {
        type: StateTypes.Question,
        text: () => "So you want to be a Pokémon Master! I'm a Thinking Machine on a recorded line. Before we begin Let's make the biggest decision of your Pokémon journey. First, Pick your starter Pokémon! Bulbasaur, Charmander or Squirtle?",
        //force the choice Bulbasaur, Charmander or Squirtle
        //make a choice here to valid pokenmon

        after: (state) => {
            const starterpokemon = ['charmander', 'squirtle', 'bulbasuar']
            if (starterpokemon.includes(state.answer.toLowerCase())) {
                Data.set('pokemon', state.answer.toLowerCase());
            }
        },
    },
    'favoriteattack': {
        type: StateTypes.Question,
        before: async () => {
            const pokemon = Data.get('pokemon')
            const pokeUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokemon
            const options: AxiosRequestConfig = {
                method: 'GET',
                url: pokeUrl
            };
            await axios.request(options).then(response => {
                const pokemonData = response.data;
                //for each object push attack to moves for the first 5
                const attack = []
                const numOfMoves = 5
                for (let index = 0; index < numOfMoves; index++) {
                     attack.push(pokemonData[index].move.name);
                }
                Data.set('moves', pokemonData.moves)
                return;
            }
            ).catch((e: Error) => {
                Data.set('moves', 'No Moves')
                return;
            });

        },
        text: () => {
            const moves= Data.get('moves');
            let attacks = ''
            const numOfMoves = 5
            for (let index = 0; index < numOfMoves; index++) {
                 attacks += moves[index].move.name + ', ';
            }

            return `Here are your attacks: ${attacks}. Which one is your favourite?`

        },
        after: (state) => {
            Data.set('attack', state.answer.toLowerCase());
            return
        }
    },
    'menu': {
        type: StateTypes.Question,
        text: () => "Want to find out more information about your pokemon? Type 'more' for a list of choices or 'goodbye' to quit!",
        choices: ["pokemon", "moves", "attack", "goodbye", "opponent", "more", "favoriteattack"]
    },
    'more': {
        type: StateTypes.Question,
        text: () => "To see your pokemon type 'pokemon', To see a list of moves see type 'moves', To see your  pokemons attack type 'attack', To see a list of opponents type 'opponent' or 'goodbye' to quit!",
        choices: ["pokemon", "moves", "attack", "goodbye", "opponent", "more","favoriteattack"]
    },
    'pokemon': {
        type: StateTypes.Statement,
        next: "more",
        text: () => {
            const pokemon = Data.get('pokemon');
            return `Your starter pokemon is ${pokemon}, of course.`
        }
    },
    'attack': {
        type: StateTypes.Statement,
        next: "menu",
        text: () => {
            const attack = Data.get('attack');
            return `Your favourite attack is ${attack}, of course.`
        }
    },
    'moves': {
        type: StateTypes.Statement,
        next: "more",
        before: async () => {
            const pokemon = Data.get('pokemon')
            const pokeUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokemon
            const options: AxiosRequestConfig = {
                method: 'GET',
                url: pokeUrl
            };
            await axios.request(options).then(response => {
                const numOfMoves = 5;
                const pokemonMoves = [];
                const pokemonData = response.data;
             
             
                for (var _i = 0; _i < numOfMoves; _i++) {
                        pokemonMoves.push(pokemonData.moves[_i].move.name) 
                    }


             
                Data.set('moves', pokemonMoves)
                return;
            }
            ).catch((e: Error) => {
                Data.set('moves', 'No Moves')
                return;
            });

        },
        text: () => {
            const moves = Data.get('moves');
            let finalString = 'Your current pokemon moves are '
            const numOfMoves = 5
            if (moves == 'No Moves') {
                finalString = 'You didn\'t pick a valid starter pokemon so you have no moves '
            } else {
                for (var _i = 0; _i < numOfMoves; _i++) {
                    if (_i == 0) {
                        finalString += moves[_i]+ ', '
                    }
                    else if (_i < numOfMoves) {
                        finalString += ' ' + moves[_i]+ ', '
                    }
                }
                finalString += 'and ' + moves[numOfMoves]+ '.'

            }

            return finalString
        }
    },
    'goodbye': {
        type: StateTypes.Statement,
        text: () => "Ok. See you.",
        after: () => {
            Prompt.close();
            process.exit();
        }
    }
}

const StateManager = new StateService(FSM, states);
