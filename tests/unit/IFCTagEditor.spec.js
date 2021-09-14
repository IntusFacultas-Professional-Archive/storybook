import { IFCTagEditor } from '@Components/TagEditor/IFCTagEditor.vue';
import { mount } from '@vue/test-utils';

describe('IFCTagEditor', () => {
  it('has a prop name of type: String that is required', () => {
    const { name } = IFCTagEditor.props;
    expect(name.type).toBe(String);
    expect(name.required).toBe(true);
  });

  it('has a prop id of type: String that is not required', () => {
    const { id } = IFCTagEditor.props;
    expect(id.type).toBe(String);
    expect(id.required).toBe(false);
  });

  it('has a prop value of type: Array that is required and validates the array', () => {
    const { value } = IFCTagEditor.props;
    expect(value.type).toBe(Array);
    expect(value.required).toBe(true);
    const { validator } = value;
    expect(validator([])).toBe(true);
    expect(validator([1])).toBe(false);
    expect(validator(['1'])).toBe(true);
    expect(validator(['1', 1])).toBe(false);
  });

  it('computes an id for the input element based on id or name', async () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: [],
      },
    });
    expect(wrapper.vm.computedId).toBe(wrapper.vm.name);
    await wrapper.setProps({ id: '1asdf' });
    expect(wrapper.vm.computedId).toBe(wrapper.vm.id);
  });

  it('computes an id for the input element based on id or name', async () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: [],
      },
    });
    expect(wrapper.vm.computedId).toBe(wrapper.vm.name);
    await wrapper.setProps({ id: '1asdf' });
    expect(wrapper.vm.computedId).toBe(wrapper.vm.id);
  });

  it('captures focus when captureFocus is called', () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: [],
      },
    });
    const input = wrapper.vm.$refs?.input;
    input.focus = jest.fn();
    wrapper.vm.captureFocus();
    expect(input.focus).toHaveBeenCalled();
    const element = wrapper.find('.IFCTagEditor__BackgroundCatcher');
    wrapper.vm.captureFocus = jest.fn();
    element.trigger('click');
    expect(wrapper.vm.captureFocus).toHaveBeenCalled();
  });

  it('$emits blur on input blur', () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: ['1', '2'],
      },
    });
    const input = wrapper.find('input');
    wrapper.vm.$emit = jest.fn();
    input.trigger('blur');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('blur');
  });

  it('$emits focus on input focus', () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: ['1', '2'],
      },
    });
    const input = wrapper.find('input');
    wrapper.vm.$emit = jest.fn();
    input.trigger('focus');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('focus');
  });

  it('calls handleInput on input input', () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: ['1', '2'],
      },
    });
    const input = wrapper.find('input');
    wrapper.vm.handleInput = jest.fn();
    input.trigger('input');
    expect(wrapper.vm.handleInput).toHaveBeenCalled();
  });

  it('$emits change when remove is called, with the tags that don\'t match the argument passed', () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: ['1', '2'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.remove('1');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('change', ['2']);
    wrapper.vm.remove = jest.fn();
    const element = wrapper.find('button');
    element.trigger('click');
    expect(wrapper.vm.remove).toHaveBeenCalled();
  });

  it('handles inputValue that lacks the comma', () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: ['1', '2'],
      },
    });
    wrapper.vm.handleInput({
      target: {
        value: 'asdf',
      },
    });
    expect(wrapper.vm.inputValue).toBe('asdf');
  });

  it('handles inputValue that with a comma', () => {
    const wrapper = mount(IFCTagEditor, {
      propsData: {
        name: 'Asdf',
        value: ['1', '2'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleInput({
      target: {
        value: 'asdf,fdsa',
      },
    });
    expect(wrapper.vm.inputValue).toBe('fdsa');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('change', ['1', '2', 'asdf']);
  });
});
