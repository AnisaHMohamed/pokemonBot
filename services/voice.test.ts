import { Voice } from './voice'

const say = require('say')
jest.mock('say');

describe('`Voice Service`', () => {

    const phrase = 'hello';

    it('should offer `isSpeaking`, `speak` and `stop`', () => {
        expect(Voice.speak).toBeDefined();
        expect(Voice.stop).toBeDefined();
    });

    describe('`speak`', () => {

        it('should set `isSpeaking` to true when there\'s dialog', () => {
            Voice.speak(phrase);
            expect(Voice.isSpeaking).toBeTruthy()
        });

        it('should set `isSpeaking` to true when there\'s dialog', () => {
            Voice.speak(phrase);
            expect(Voice.activePhrase).toBe(phrase)
        });

    });

    describe('`stop`', () => {

        it('should call `say.stop`', () => {
            Voice.stop();
            expect(say.stop).toHaveBeenCalled()
        });

    });

    describe('`onClose`', () => {

        it('should set `isSpeaking` to false when it\'s done', () => {
            Voice.isSpeaking = true;
            Voice.activePhrase = phrase;
            Voice.onClose(phrase);
            expect(Voice.isSpeaking).toBeFalsy()
        });

    });

});