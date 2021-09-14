import { recompute } from '@App/recompute';

describe('recompute', () => {
  it('sanely handles the appropriate internal variables being missing', () => {
    expect(recompute({}, 'missing')).toBeUndefined();
  });
  it('appropriately increments the recompute variable by one if the internal variable exists', () => {
    const instance = {
      $__recomputables: {
        missing: {
          backdoor: 0,
        },
      },
    };
    recompute(instance, 'missing');
    expect(instance.$__recomputables.missing.backdoor).toBe(1);
  });
});
