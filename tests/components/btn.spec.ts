import { mount } from '@vue/test-utils';
import PBtn from '../../src/ui/components/PBtn';

describe('PBtn', function () {

  it('should render correctly', function () {
    const wrapper = mount(PBtn)
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('should apply color', function () {
    const wrapper = mount(PBtn, {
      props: {
        color: '#ff0000'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('should apply loading', function () {
    const wrapper = mount(PBtn, {
      props: {
        loading: true
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('should apply block', function () {
    const wrapper = mount(PBtn, {
      props: {
        block: true
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('should apply flat', function () {
    const wrapper = mount(PBtn, {
      props: {
        flat: true
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });
  it('should apply disabled', function () {
    const wrapper = mount(PBtn, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });
});
