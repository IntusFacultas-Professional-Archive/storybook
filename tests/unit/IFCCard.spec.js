import { mount } from '@vue/test-utils';
import { IFCCard } from '@Components/Card/IFCCard';

import { StringReplaceAllPolyfill } from '@Components/StringReplaceAllPolyfill';

StringReplaceAllPolyfill();

describe('IFCCard', () => {
  it("displays content in the title slot", () => {
    const wrapper = mount(IFCCard, {
      propsData: {
      },
      slots: {
        title: '<h1 id="test">Test</h1>'
      },
    });
    expect(wrapper.find('h1#test').element).toBeDefined();
  });
  it("displays content in the body slot", () => {
    const wrapper = mount(IFCCard, {
      propsData: {
      },
      slots: {
        body: '<h1 id="test">Test</h1>'
      },
    });
    expect(wrapper.find('h1#test').element).toBeDefined();
  });
  it("displays content in the image slot", () => {
    const wrapper = mount(IFCCard, {
      propsData: {
      },
      slots: {
        image: '<h1 id="test">Test</h1>'
      },
    });
    expect(wrapper.find('h1#test').element).toBeDefined();
  });
  it("displays content in the buttons slot", () => {
    const wrapper = mount(IFCCard, {
      propsData: {
      },
      slots: {
        buttons: '<h1 id="test">Test</h1>'
      },
    });
    expect(wrapper.find('h1#test').element).toBeDefined();
  });
});
