# Department of Thinking Machines Chatbot Challenge
For the **Chatbot Challenge**, we'd like you to carve a few hours out of your day to make some improvements to a toy chatbot.

You have **7 days**, but *don't feel the need to spend more than 10 hours on it. If you find yourself spending more time, send us an email and we will be happy to answer any questions.*

Read this README, and make sure that you can run the code. You can always reach out to Andrew if you have any questions or need clairification.

##### Table of Contents
1. [Your objective](#your-objective-make-some-improvements)
2. [Post assignment discussion](#post-assignment-discussion)
3. [How to run the chat bot](#how-to-run-the-chat-bot)

## Your objective: Make some improvements!

The application consists of three major responsibilities: state management, data handling and the conversation itself. Your challenge is to improve the bot. What that means is up to you!

Below are some ideas for things you can improve. These are just suggestions! If you have a totally unrelated idea for how the product can be improved, we're more than happy to see what you come up with. (Don't forget your unit tests!)

#### Conversation Design

As you explore the basic functionality of the bot, you'll notice dialog leaves much to be desired. This is intentional as it's more to exercise the basic utilities of the application framework. Can you think of something more interesting? 

Here are a few ideas if you're looking for inspiration: 
- A flow that can take your order from your favourite restaurant.
- A flow that can recommend you a new book, song or movie based on your interests.
- A flow that mirrors your favourite personality quiz (what type of ice cream are you?).

#### Technical Quality 

The code and architecture of the code is set up to be good but not great. As you familiarize yourself with the code and it's architecture, think about what areas you feel could be improved.

Currently you give the bot commands with a keyword. This isn't actually a conversation and is contingent on a lot of things that could go right (case sensitivity being a good example). What changes could you make to help the bot facilitate more realistic inputs? 

## Post-assignment discussion

Following your submission, we will review it and invite you for a discussion, usually within a week.

During the discussion, we will ask you to explain your reasoning and justify the choices you have made. We are interested in hearing about:

- What goals you set for yourself, and how the work you did advanced those goals. Can you justify your choice of goals in terms of a larger vision, and can you articulate how the specific technical decisions you've made align with your stated goals?
- How you managed the trade-offs between development speed and quality, and between avoiding needless complexity and architecting with a view towards future extensibility.
- What you thought about this project.

## How to run the chat bot
### Basic Operations
The bot can be run by opening your terminal and running the following commands: 
* `npm start` - Runs the bot 
* `npm test` - Runs the tests associated with codebase 

### Commands
It asks collects a few pieces of information from you and you can give it a few commands:
* Weather
* attack
* Name
* goodbye

#### Gotchas
**Windows**: This package uses the "Say" package on NPM and requires Powershell installed and available in $PATH.
