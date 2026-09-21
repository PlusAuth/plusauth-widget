import { computed } from 'vue'

import { getCurrentInstanceName } from '../utils/current_instance';
import { EventProp } from '../utils/helpers';
import { propsFactory } from '../utils/props_factory';

import { useProxiedModel } from './proxied_model'


export interface HoverProps {
  hovered: boolean
  'onUpdate:hovered': ((hovered: boolean) => any) | undefined
}

export const makeHoverProps = propsFactory({
  hovered: Boolean,
  'onUpdate:hovered': EventProp<[boolean]>(),
}, 'hover')

export function useHover(
  props: HoverProps,
  name = getCurrentInstanceName()
) {
  const isHovered = useProxiedModel(props, 'hovered')
  const hoverClasses = computed(() => {
    return {
      [`${name}--hovered`]: isHovered.value,
    }
  })

  function mouseenter() {
    isHovered.value = true
  }

  function mouseleave() {
    isHovered.value = false
  }

  return { hoverClasses, isHovered, mouseenter, mouseleave }
}
