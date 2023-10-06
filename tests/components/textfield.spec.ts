import { mount } from '@vue/test-utils';
import PTextField from '../../src/ui/components/PTextField';

describe('PTextField', function () {

  it('should render correctly', function () {
    const wrapper = mount(PTextField)
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('should apply color', function () {
    const wrapper = mount(PTextField, {
      props: {
        color: '#ff0000'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('should apply loading', function () {
    const wrapper = mount(PTextField, {
      props: {
        loading: true
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('should apply block', function () {
    const wrapper = mount(PTextField, {
      props: {
        block: true
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('should apply flat', function () {
    const wrapper = mount(PTextField, {
      props: {
        flat: true
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });
  it('should apply disabled', function () {
    const wrapper = mount(PTextField, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });
});
