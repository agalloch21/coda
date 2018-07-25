import { map } from '@most/core';
import validateStream from '../../lib/common/validation';
import withAttr from '../../lib/common/mixins';

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = numIdx => ({
  format: {
    required: true,
    check: ['scalar', 'vector'],
    transform() {
      return 'vector';
    },
  },
  size: {
    required: true,
    check: { min: 1 },
    transform() {
      return numIdx;
    },
  },
});

/**
 * Check if the array of indices is valid given the size of the input stream
 * @ignore
 * @param  {Array} a     Array of indices
 * @param  {number} size Size of the input stream
 * @return {boolean}     whether the indices are valid
 */
function indicesValid(a, size) {
  return a.map(x => (typeof x === 'number') && Math.floor(x) === x && x < size)
    .reduce((b, x) => b && x, true);
}

/**
 * Select the channels of a numeric stream from a set of indices
 *
 * @param  {Array} indices  The array of indices
 * @param  {Stream} source  The input stream (scalar or vector)
 * @return {Stream}         The stream of vectors with values at the selected
 * indices
 *
 * @example
 * import * from 'mars';
 *
 * const process = periodic(10).rand({ size: 5 }).select([0, 4, 3, 0]).tap(log);
 * runEffects(process.take(5), newDefaultScheduler());
 */
export default function select(indices, source) {
  const idx = (typeof indices === 'number') ? [indices] : indices;
  const attr = validateStream('select', specification(idx.length), source.attr);
  if (!indicesValid(idx, source.attr.size)) {
    throw new Error('Indices must be an array of integers in the range of the source stream');
  }
  const selectionFunction = (source.attr.format === 'scalar') ?
    frame => idx.map(() => frame) :
    frame => idx.map(i => frame[i]);
  return withAttr(attr)(map(selectionFunction, source));
}