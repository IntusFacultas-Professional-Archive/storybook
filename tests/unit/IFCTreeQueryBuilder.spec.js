import { IFCTreeQueryBuilder } from '@Components/TreeQueryBuilder/IFCTreeQueryBuilder.vue';
import { mount } from '@vue/test-utils';

describe('IFCTreeQueryBuilder', () => {
  it('has prop value of type: Object that is required', () => {
    const { value } = IFCTreeQueryBuilder.props;
    expect(value.required).toBe(true);
    expect(value.type).toBe(Object);
  });

  it('has prop operators of type: Array that is required', () => {
    const { operators } = IFCTreeQueryBuilder.props;
    expect(operators.required).toBe(true);
    expect(operators.type).toBe(Array);
  });
});
