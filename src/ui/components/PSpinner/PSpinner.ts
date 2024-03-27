import type { ComponentPublicInstance, VNode } from 'vue';
import { computed, defineComponent, h } from 'vue';

import './PSpinner.css'
import { convertToUnit } from '../../utils';

const RADIUS = 20;

function genCircle(this: ComponentPublicInstance<any>,
                   name: string, offset: string | number): VNode {
  return h('circle', {
    class: `pa__progress-circular__${name}`,
    fill: 'transparent',
    cx: 2 * this.viewBoxSize,
    cy: 2 * this.viewBoxSize,
    r: RADIUS,
    'stroke-width': this.strokeWidth,
    'stroke-dasharray': this.strokeDashArray,
    'stroke-dashoffset': offset,
  })
}

function genSvg(this: ComponentPublicInstance<any>) {
  const children = [
    this.indeterminate || this.genCircle('underlay', 0),
    this.genCircle('overlay', this.strokeDashOffset),
  ]

  // @ts-ignore
  return h('svg', {
    style: this.svgStyles,
    xmlns: 'http://www.w3.org/2000/svg',
    // eslint-disable-next-line max-len
    viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`,
  }, children)
}

function genInfo(this: ComponentPublicInstance<any>) {
  return h('div', {
    class: 'pa__progress-circular__info',
  }, this.$slots.default)
}

export default defineComponent({
  name: 'PSpinner',
  props: {
    button: Boolean,
    indeterminate: Boolean,
    rotate: {
      type: [Number, String],
      default: 0,
    },
    color: {
      type: String
    },
    size: {
      type: [Number, String],
      default: 32,
    },
    width: {
      type: [Number, String],
      default: 4,
    },
    modelValue: {
      type: [Number, String],
      default: 0,
    },
  },
  setup(props) {
    const calculatedSize = computed(() => {
      return Number(props.size) + (props.button ? 8 : 0)
    })
    const circumference = computed(() => {
      return 2 * Math.PI * RADIUS
    })
    const strokeDashArray = computed(() => {
      return Math.round(circumference.value * 1000) / 1000
    })
    const strokeDashOffset = computed(() => {
      return Math.round(circumference.value * 1000) / 1000
    })
    const viewBoxSize = computed(() => {
      return RADIUS / (1 - Number(props.width) / +props.size)
    })
    const strokeWidth = computed(() => {
      return Number(props.width) / +props.size * viewBoxSize.value * 2
    })
    const styles = computed(() => {
      return {
        height: convertToUnit(calculatedSize.value),
        width: convertToUnit(calculatedSize.value),
      }
    })
    const svgStyles = computed(() => {
      return {
        transform: `rotate(${Number(props.rotate)}deg)`,
      }
    })

    const normalizedValue = computed(() => {
      const val = Number(props.modelValue)
      if (isNaN(val) || val < 0) {
        return 0
      }

      if (val > 100) {
        return 100
      }

      return val
    })
    const classes = computed(() => {
      return {
        ...props.color ? { [`text-${props.color}`]: true } : {},
        'pa__progress-circular--indeterminate': props.indeterminate,
        'pa__progress-circular--button': props.button,
      }
    })
    return {
      normalizedValue,
      calculatedSize,
      circumference,
      classes,
      strokeWidth,
      strokeDashOffset,
      viewBoxSize,
      strokeDashArray,
      styles,
      svgStyles,
      genSvg,
      genCircle,
      genInfo
    }
  },
  render() {
    return h('div',  {
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
      class: this.classes,
      style: this.styles
    }, [
      this.genSvg(),
      this.genInfo(),
    ])
  },
})
