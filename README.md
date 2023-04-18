## Criss Cross Game

Live Site on Netlify: [https://preeminent-kelpie-32a7a6.netlify.app/](https://preeminent-kelpie-32a7a6.netlify.app/)

### Table of contents

- [Overview](#overview)

- [The challenge](#the-challenge)

- [Screenshot](#screenshot)

- [Links](#links)

- [My process](#my-process)

- [Built with](#built-with)

- [What I learned](#what-i-learned)

- [Continued development](#continued-development)

- [Useful resources](#useful-resources)

- [Author](#author)

- [Acknowledgments](#acknowledgments)

## Overview

"Simple" game of Criss Cross

### The challenge

- [ ] Components must be implemented on classes, no hooks.
- [ ] Implement "help" button which make computer to set symbol in any empty cell (no need to implement logic just use random cell)
- [ ] There should be a button to start a new game. At any time you can reset the game and start again
- [ ] Show information about which player is currently playing and which symbol he use (X or O). You can make so first player use X or assign symbol randomly.

Users are be able to:

- [ ] Play with another user offline
- [ ] Play with robot offline
- [ ] Use help button to make a auto turn any time during the game

### Screenshot

### Links

- Solution GitHub: [https://github.com/vasily-mishanin/criss-cross](https://github.com/vasily-mishanin/criss-cross)

- Live Site on Netlify: [https://preeminent-kelpie-32a7a6.netlify.app/](https://preeminent-kelpie-32a7a6.netlify.app/)

- Cross CodePen: [https://codepen.io/vasily-mishanin/pen/BaOegqr](https://codepen.io/vasily-mishanin/pen/BaOegqr)

- O CodePen: [https://codepen.io/vasily-mishanin/pen/rNZgbpM](https://codepen.io/vasily-mishanin/pen/rNZgbpM)

## My process

### Built with

- Semantic HTML5 markup, canvas for strokes on the criss-cross field

- CSS custom properties,

- Flexbox

- Mobile-first workflow

- [React](https://reactjs.org/) - JS library

- [Vite](https://vitejs.dev/) - builder

### What I learned

- refresh good old classes on React
- quirky algorithm to play with a robot
- another algorithm of helping turn
- how to use svg X and O
- how to use absolute positioned canvas
- how to draw a lines on the canvas according to props
- you need to ctx.closePath(); for canvas not to remember all line paths

### Continued development

Finished for now

### Useful resources

## Me

- Website - [vasmish.com](https://vasmish.com/)

- Twitter - [@MishaninVasily](https://twitter.com/MishaninVasily)

## Acknowledgments

> Thanks to my mentor Milovanov Constantin from [DSR Corporation](https://en.dsr-corporation.com/) for thorough review of the code.

What I've refactored:

- clean App.ts from any logic so make it root component of the app;
- change all strings into TS Enums and constants;
- moved types into separate files for corresponding components, though I've left types of props inside component .tsx file;
- moved constants into corresponding files inside components folders;
- created smaller functions insdie main game component to separate concerns;
- refactor Grid drawing code to map props and not copypast Cell components;
- break code into smaller functions and components;
- move instances of Audio into constants to reduce delay;
- rid off logs;
- replace while loop with .find(() => {})
