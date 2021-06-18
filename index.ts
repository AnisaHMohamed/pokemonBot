

import { sm } from 'jssm';
import axios, { AxiosRequestConfig } from 'axios';

import { Prompt } from './services/prompt'
import { Data } from './services/data'
import { StateService } from './services/state'
import { StateTypes, States } from './config/types'

//Finite State Machine
const FSM = sm`
welcome 'next'<-> menu;
menu => more;
menu -> goodbye;
more <-> pokemon;
more <-> moves;
more -> chooseattack;
more -> goodbye;
chooseattack 'next' -> attackmenu;
attackmenu => opponent;
attackmenu -> goodbye;
opponent => goodbye;
`;
const states: States = {
    'welcome': {
        type: StateTypes.Question,
        next:'menu',
        text: () => "So you want to be a Pokémon Master! \nBefore we begin, \nLet's make the biggest decision of your Pokémon journey. \nFirst, Pick your starter Pokémon! Bulbasaur, Charmander or Squirtle?",
        //force the choice Bulbasaur, Charmander or Squirtle
        //make a choice here to valid pokemon
        //if valid pokemon is not chosen then reask the question

        after: (state) => {
            
            Data.set('moves', 'No Moves');
            Data.set('favAttack', 'No Favorite Attack');
            const pokemon = state.answer.toLowerCase();
            const starterpokemon = ['charmander', 'squirtle', 'bulbasuar']
            if (starterpokemon.includes(pokemon)) {
                Data.set('pokemon', pokemon);
            } 
        },
        
    },
    'chooseattack': {
        type: StateTypes.Question,
        next: 'attackmenu',
        before: async () => {
            const pokemon = Data.get('pokemon')
            const moves = Data.get('moves');
            if (moves == 'No Moves') {

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
                        pokemonMoves.push(pokemonData.moves[_i].move.name.toLowerCase())
                    }
                    Data.set('moves', pokemonMoves)
                    return;
                }
                ).catch(() => {
                    Data.set('moves', 'No Moves')
                    return;
                });
            }
            return
        },
        text: () => {
            const moves = Data.get('moves');
            let attacks = ''
            const numOfMoves = 5

            for (let index = 0; index < numOfMoves; index++) {
                attacks += moves[index].toLowerCase() + ', ';
            }
            return `Here are your attacks: ${attacks}. Which one is your favourite?`

        },
        after: (state) => {
            //check if attack provided is one of the attacks in our stat
            //if it is set attack to choosen attack otherwise there should be a repeat 
            //due to invalid entry
            const moves = Data.get('moves');
            const favAttack = state.answer.toLowerCase();
            if (moves.includes(favAttack)) {
                Data.set('favAttack', favAttack);
                return `Great choice! ${favAttack} is a great attack`;
            }
            else {
                Data.set('favAttack', 'No Favorite Attack');
            }
        }
    },
    'menu': {
        type: StateTypes.Question,
        
        text: () => {
            const pokemon = Data.get('pokemon');

            return `Want to find out more information about ${pokemon}? Type 'more' for a list of choices or 'goodbye' to quit!`},
        choices: ["more", "goodbye"]
    },
    'more': {
        //another menu so that this menu only happens once and it is conversational
        type: StateTypes.Question,
        text: () => {
            const pokemon = Data.get('pokemon');
            return `Get to know your new ${pokemon}! To see the Pokemon you chose 'pokemon', \nTo see all the cool moves your new ${pokemon} can do type 'moves', \nWhen your ready to take the next step type 'chooseattack' to get ready to fight! \nor 'goodbye' to quit!`},
        choices: ["pokemon", "moves", "goodbye", "chooseattack"]
    },
    'attackmenu': {
        //another menu so that this menu only happens once and it is conversational
        type: StateTypes.Question,
        text: () => "Now that you have choosen your attack now its time to fight!!\nAre you up for the challenge? \nTo start your next battle type 'opponent'!",
        choices: ["goodbye", "attack", "opponent"]
    },
    'pokemon': {
        //if pokemon wasnt chosen should have another text however 
        //if implemented correctly I wont need to do this as I will be forced
        //to pick a pokemon
        type: StateTypes.Statement,
        next: "more",
        text: () => {
            const pokemon = Data.get('pokemon');
            return `Your starter pokemon is ${pokemon}.`;
        }
    },
    'attack': {
        type: StateTypes.Statement,
        next: "more", //add condition whether to go to more or favorite attack 
        text: () => {
            const attack = Data.get('favAttack');

            if (attack != 'No Favorite Attack') {
                return `What a pro! Your favourite attack is ${attack}!`

            }
            else {
                return 'Choose attack';
            }

        }
    },
    'moves': {
        type: StateTypes.Statement,
        next: "more",
        before: async () => {
            const pokemon = Data.get('pokemon');
            const pokeUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokemon
            const options: AxiosRequestConfig = {
                method: 'GET',
                url: pokeUrl
            };
            await axios.request(options).then(response => {
                const numOfMoves = 5;
                const pokemonMoves = [];
                const pokemonData = response.data;
                for (let _i = 0; _i < numOfMoves; _i++) {
                    pokemonMoves.push(pokemonData.moves[_i].move.name.toLowerCase())
                }
                Data.set('moves', pokemonMoves);
                return;
            }
            ).catch(() => {
                Data.set('moves', 'No Moves');
                return;
            });
        },
        text: () => {
            const moves = Data.get('moves');
            let finalString = 'Your current pokemon moves are ';
            const numOfMoves = 5
            if (moves == 'No Moves') {
                finalString = 'You didn\'t pick a valid starter pokemon so you have no moves ';
            } else {
                for (var _i = 0; _i < numOfMoves; _i++) {
                    if (_i == 0) {
                        finalString += moves[_i] + ', ';
                    }
                    else if (_i < numOfMoves) {
                        finalString += ' ' + moves[_i] + ', ';
                    }
                }
                finalString += 'and ' + moves[numOfMoves] + '.';
            }
            return finalString
        }
    },
    'opponent': {
        type: StateTypes.Statement,
        next: "goodbye",
        before: async () => {
            const options: AxiosRequestConfig = {
                method: 'GET',
                url: 'https://pokeapi.co/api/v2/pokemon/'
            };
            await axios.request(options).then(response => {

                let opponent = response.data.results;
                opponent = opponent[Math.floor(Math.random() * 21)].name;
                Data.set('opponent', opponent);

                return;
            }
            ).catch(() => {
                const pokemon = Data.get('pokemon');
                let opponent = 'No Opponent';
                Data.set('opponent', opponent);
                return;
            });
        },
        text: () => {
            const pokemon = Data.get('pokemon');
            const opponent = Data.get('opponent');
            const attack = Data.get('favAttack');

            if (opponent == 'No Opponents') {
                return `Your ${pokemon} is too strong no opponent is willing to fight!`;
            } else {

                return `A wild ${opponent} has appeared! I choose you ${pokemon}! Use your ${attack}! \nEnjoying this project? \nWant to continue playing? \nLet the developer know!`;
            }
        }
    },
    'goodbye': {
        type: StateTypes.Statement,
        text: () => "Until next time...I wanna be the very best...Like no one ever was!",
        after: () => {
            Prompt.close();
            process.exit();
        }
    }
}

const StateManager = new StateService(FSM, states);
