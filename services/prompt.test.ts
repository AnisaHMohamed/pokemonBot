jest.mock('readline');
import { Prompt } from './prompt'

describe('`Prompt Service`', () => {

    beforeEach(function(){
        Prompt.interface = {
            question: jest.fn(),
            close: jest.fn()
        }
    })

    it('should offer `interface`, `close` and `question`', () => {

        expect(Prompt.interface).toBeDefined();
        expect(Prompt.close).toBeDefined();
        expect(Prompt.question).toBeDefined();

    });

    describe('`close`', () => {
        it('should close the interface', () => {
            Prompt.interface.close = jest.fn();
            Prompt.close();
            expect(Prompt.interface.close).toHaveBeenCalled()
        });
    });

    describe('`write`', () => {
        it('should output a phrase', () => {
            console.log = jest.fn();
            Prompt.write('hello');
            expect(console.log).toHaveBeenCalled()
        });
    });

    describe('`question`', () => {
        it('should should call `interface.question`', () => {
            Prompt.question('hello');
            expect(Prompt.interface.question).toHaveBeenCalled()
        });

        it('should append `\\r\\n>`', () => {
            const input = 'hello'; 
            Prompt.question(input); // will call addListener with a callback
            expect(Prompt.interface.question.mock.calls[0][0]).toBe(input +'\r\n> ')
        });
    });
});