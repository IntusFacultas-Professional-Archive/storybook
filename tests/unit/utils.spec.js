import {
  deepClone,
  saneDefault,
} from '@Components/utils.js';

describe('saneDefault', () => {
  it('safely does nothing', () => {
    expect(saneDefault()).toBeUndefined();
  });
});

describe('deepClone', () => {
  it('safely clones complicated structures', () => {
    const item = {
      a: {
        d: 'asdf',
        b: {
          c: 1,
        },
      },
    };
    const clonedItem = deepClone(item);
    expect(clonedItem).toStrictEqual(item);
    expect(clonedItem).not.toBe(item);
  });
});
