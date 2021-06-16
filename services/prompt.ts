import * as readline from "readline";

export class PromptService {

    interface: any;

    constructor() {

        this.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

    }

    close() {
        this.interface.close();
    }

    write(phrase) {
        console.log(phrase);
    }

    question(phrase: string) {
        return new Promise((resolve) => {
            this.interface.question(`${phrase}\r\n> `, (answer) => resolve(answer));
        });
    }
}

export const Prompt = new PromptService();