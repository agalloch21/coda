/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import { plugin as analyze } from 'rollup-plugin-analyzer';
import minify from 'rollup-plugin-minify-es';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

import configAudio from './packages/audio/rollup.config';
import configCore from './packages/core/rollup.config';
import configMax from './packages/max/rollup.config';
import configMidi from './packages/midi/rollup.config';
import configMyo from './packages/myo/rollup.config';
import configPrelude from './packages/prelude/rollup.config';
import configUi from './packages/ui/rollup.config';

function fixConfiguration(config, path) {
  config.input = `${path}/${config.input}`;
  if (Array.isArray(config.output)) {
    config.output.forEach((o, i) => {
      config.output[i].file = `${path}/${o.file}`;
    });
  } else {
    config.output.file = `${path}/${config.output.file}`;
  }
}

fixConfiguration(configAudio, 'packages/audio');
fixConfiguration(configCore[0], 'packages/core');
fixConfiguration(configCore[1], 'packages/core');
fixConfiguration(configMax, 'packages/max');
fixConfiguration(configMidi, 'packages/midi');
fixConfiguration(configMyo, 'packages/myo');
fixConfiguration(configPrelude, 'packages/prelude');
fixConfiguration(configUi, 'packages/ui');

export default [
  configAudio,
  configCore[0],
  configCore[1],
  configMax,
  configMidi,
  configMyo,
  configPrelude,
  configUi,
];