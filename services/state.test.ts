jest.mock('readline');
jest.useFakeTimers();

import { sm } from 'jssm';
import { States, StateTypes } from '../config/types';
import { StateService } from './state'
import { Prompt } from './prompt';
import { Voice } from './voice';

describe('`State Service`', () => {

    let State: StateService;

    beforeAll(() => {
        Prompt.interface = {
            question: jest.fn().mockReturnValue('hello'),
            close: jest.fn()
        }

        Voice.speak = jest.fn()
        Voice.stop = jest.fn()
    })

    beforeEach(() => {
        const FSM = sm`welcome 'next' <-> attack 'next' <-> menu;`;
        const states: States = {
            'welcome': {
                type: StateTypes.Question,
                before: jest.fn(),
                text: jest.fn().mockReturnValue('hello'),
                after: jest.fn()
            },
            'attack': {
                type: StateTypes.Statement,
                before: jest.fn(),
                text: jest.fn().mockReturnValue('hello'),
                after: jest.fn()
            }
        };
        State = new StateService(FSM, states)
    })


    it('should offer `executeState`, `transitionIn` and `transitionOut`', () => {
        expect(State.executeState).toBeDefined();
        expect(State.transitionIn).toBeDefined();
        expect(State.transitionOut).toBeDefined();
    });

    describe('`transitionIn`', () => {
        it('should run `before` if there is one', async () => {
            await State.transitionIn()
            expect(State.state.before).toHaveBeenCalled();
        });
    });

    describe('`transitionOut`', () => {

        beforeEach(() => {
            State.executeState = jest.fn()
            State.machine.transition = jest.fn()
            State.machine.action = jest.fn()
        });


        it('should transition to `next` if it exists', async () => {
            State.state.next = 'next';

            await State.transitionOut()

            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith(State.state.next);
        });

        it('should transition to a choice it exists in `choices`', async () => {
            State.state.answer = 'menu1';
            State.state.choices = ['menu1', 'menu2'];

            await State.transitionOut()

            expect(State.machine.transition).toHaveBeenCalled();
            expect(State.machine.transition).toHaveBeenCalledWith(State.state.answer);
        });  

        it('should transition to the default `action` if there is no choice or next', async () => {
            await State.transitionOut()
            expect(State.machine.action).toHaveBeenCalled();            
        });
          
    });

    describe('`executeState`', () => {
        let answer = 'executeState answer';

        beforeAll(() => {

            Prompt.question = jest.fn().mockImplementation(() => {
                const promise = new Promise(resolve => {
                    resolve(answer);
                });

                return promise;
            })

        })

        beforeEach(() => {
            State.machine.transition('welcome')
            State.transitionIn = jest.fn()
            State.transitionOut = jest.fn()
        })

        it('should should call `transitionIn` and `transitionOut`', async () => {
            await State.executeState()
            expect(State.transitionIn).toHaveBeenCalled();
            expect(State.transitionOut).toHaveBeenCalled();
        });

        it('should should call `Voice.speak`', async () => {
            await State.executeState();
            expect(Voice.speak).toHaveBeenCalled();
        });

        describe('for `StateTypes.Question`', () => {

            it('should call `Prompt.question`', async () => {
                await State.executeState();
                expect(Prompt.question).toHaveBeenCalled();
            });

            it('should store the answer on the state', async () => {
                await State.executeState();
                expect(State.state.answer).toBe(answer);
            });
            it('should check if answer is provided', async () => {
                await State.executeState();
                expect(State.state.answer.length).toBeGreaterThan(1);
            });
        });

        describe('for `StateTypes.Statement`', () => {

            it('should wait until the bot is finished speaking before transitioning', (done) => {

                State.transitionOut = jest.fn().mockImplementation(() => {
                    expect(Voice.isSpeaking).toBeFalsy();
                    done()
                })

                Voice.isSpeaking = true
                jest.runOnlyPendingTimers();
                jest.advanceTimersByTime(500);
                Voice.isSpeaking = false;
                jest.advanceTimersByTime(500);
                expect(State.transitionOut).toHaveBeenCalled();

            });

        });

    });

});