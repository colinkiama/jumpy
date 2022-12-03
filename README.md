# Jumpy

Easy arcade game to test out Phaser.js.

## Summary

You're the green square. The goal is to get as many points as you can by
successfully jumping over obstacles (the red rectangles).

If you collide with an obstacle, the game ends.

![Jumpy Screenshot](img/jumpy.png)

## Controls

| Key     | Action |
| ------- | ------ |
| `Space` | Jump   |
|         |        |

Created from [Phaser 3](https://github.com/photonstorm/phaser) starter with [TypeScript](https://www.typescriptlang.org/), [Rollup](https://rollupjs.org) with ⚡️ lightning fast HMR through [Vite](https://vitejs.dev/): https://github.com/geocine/phaser3-rollup-typescript

## Development

After cloning the repo, run `yarn install` from your project directory. Then, you can start the local development
server by running `yarn dev` and navigate to http://localhost:3000.

### Commands

| Command        | Description                                              |
| -------------- | -------------------------------------------------------- |
| `yarn install` | Install project dependencies                             |
| `yarn dev`     | Builds project and open web server, watching for changes |
| `yarn build`   | Builds code bundle with production settings              |
| `yarn serve`   | Run a web server to serve built code bundle              |

### Production Builds

After running `yarn build`, the files you need for production will be on the `dist` folder. To test code on your `dist` folder, run `yarn serve` and navigate to http://localhost:5000
