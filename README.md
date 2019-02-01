# SFE Quality Assurance

This bot is designed to deal with complaints, suggestions, and general requests for help from the [SFE Discord Server](https://discord.gg/sfe).

## Work in Progress

Please keep in mind this bot isn't finished, and is using my half-built, 3 thirds functioning DJS framework since I like it slightly too much.

Additionally, this bot is programmed in TypeScript - **you'll find an awful lot of standard JS does not work**, so please be careful when submitting merge requests, and contributions.

## Setup

To run this bot, you're going to need a copy of [jisco](https://github.com/actuallyori/jisco) and a clone of this bot. Dependancies (if there are any) can be installed by running `yarn` or `npm i`, depending on which is your favourite package manager.

You'll also need a copy of MongoDB, as this is the version of storage I've chosen to use for this bot. You can tweak the strategy yourself in `index.ts`, but I wouldn't recommend this, since the rest of the bot will be using the database for storage as well, outside of the jisco client.
