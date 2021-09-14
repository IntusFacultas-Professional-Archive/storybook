import { IFCButton } from '@Components/Button/IFCButton.vue';
import { mount } from '@vue/test-utils';

describe('IFCButton.vue', () => {
  it('renders content passed to the slot', () => {
    const wrapper = mount(IFCButton, {
      propsData: {
        variant: 'primary',
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.find('.fake-msg')).toBeDefined();
  });
  it('has a default 40 Number height prop for setting the height and width of circle buttons', () => {
    const { height } = IFCButton.props;
    expect(height.type).toBe(Number);
    expect(height.default).toBe(40);
  });
  it('has a default-false Boolean circle prop for setting the button to a circle', () => {
    const { circle } = IFCButton.props;
    expect(circle.type).toBe(Boolean);
    expect(circle.default).toBe(false);
  });
  it('has a default false Boolean endcap prop for setting the button to be an endcap', () => {
    const { endcap } = IFCButton.props;
    expect(endcap.type).toBe(Boolean);
    expect(endcap.default).toBe(false);
  });
  it('has a required String variant prop for setting the button variant', () => {
    const { variant } = IFCButton.props;
    expect(variant.type).toBe(String);
    expect(variant.required).toBe(true);
  });
  it('has a default false Boolean block prop for setting the button to be a block element', () => {
    const { block } = IFCButton.props;
    expect(block.type).toBe(Boolean);
    expect(block.default).toBe(false);
  });
  it('has a default md String size prop for setting the button size', () => {
    const { size } = IFCButton.props;
    expect(size.type).toBe(String);
    expect(size.default).toBe('md');
  });
  it('Passes listeners to the inner child', () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    const wrapper = mount(IFCButton, {
      propsData: {
        variant: 'primary',
      },
      listeners: {
        click: onClick,
        hover: onHover,
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.find('button').trigger('click');
    wrapper.find('button').trigger('hover');
    expect(onClick).toHaveBeenCalled();
    expect(onHover).toHaveBeenCalled();
  });
});
