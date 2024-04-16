<template>
  <!--  eslint-disable max-len-->
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    width="100%"
    height="100%"
    class="pa__hand"
    y="0px"
    viewBox="0 0 512 512"
  >
    <g class="pa__palm">
      <path
        d="M104.1,450c-5,0-6.8-3.6-8.9-7.2c-2.2-3.8-0.9-8.7,2.9-10.9c3.8-2.2,
        8.7-0.9,10.9,2.9c0.7,1.2,1.3,2.2,1.8,3C114.3,443.1,110.3,450,104.1,450z"
      />
      <path
        d="M244.3,496H216c-32.5,0-63.2-12.5-86.4-35.1c-3.2-3.1-8.2-3-11.3,
        0.2c-3.1,3.2-3,8.2,0.2,11.3c26.3,25.6,60.9,39.6,97.6,39.6h28.3c40.6,
        0,78.8-15.8,107.5-44.5l-11.4-11.2C314.7,481.9,280.6,496,244.3,496z"
      />
    </g>
    <g
      class="pa__thumb_container"
      :class="{ 'pa__selected': selected.includes(0) }"
      @click="onSelect(0)"
    >
      <rect
        x="340.4"
        y="248"
        class="pa__st0"
        width="171.6"
        height="219.5"
      />
      <path
        id="pa__thumb"
        class="pa__finger"
        d="M475.7,248c-25.2,0-48.8,9.8-66.6,27.6c-0.4,0.4-13.5,16-43.6,
					51.6c-2.3,2.1-5.2,2.6-7.8,1.8l-2.3,15.9
					c7.9,1.7,16.5-0.4,22.1-7.1l43.2-51.2c14.7-14.6,34.3-22.7,
					55.1-22.7c16.9,0,27.9,20.2,13.8,35.2L340.4,456.2l11.4,11.2
					c0.1-0.1-4.9,5.2,149.2-157.2C524.7,286.4,507.2,248,475.7,248z"
      />
    </g>

    <g
      class="pa__index_container"
      :class="{ 'pa__selected': selected.includes(1) }"
      @click="onSelect(1)"
    >
      <rect
        x="271.3"
        y="29.9"
        class="pa__st0"
        width="139.1"
        height="315"
      />
      <path
        id="pa__index"
        class="pa__finger"
        d="M352,321.4v-41.5l52.1-194.6c7.4-27.8-13.5-55.4-42.5-55.4c-19.8,
        0-37.3,13.4-42.5,32.5L280,199.1l-8.7,64.9c3.5,0.3,7.2-1.5,
        8.4-5.7l54.9-191.4c3.9-13.6,15.4-20.9,27.1-20.9c18.4,0,31.8,17.5,
        27.1,35.2c-56.2,209.6-52.7,196-52.7,197.7v42.5c0,12.9,9.1,21.4,19.3,
        23.6l2.3-15.9C354.5,328.1,352,325.2,352,321.4z"
      />
    </g>

    <g
      class="pa__middle_container"
      :class="{ 'pa__selected': selected.includes(2) }"
      @click="onSelect(2)"
    >
      <rect
        x="192"
        class="pa__st0"
        width="88"
        height="263.9"
      />
      <path
        id="pa__middle"
        class="pa__finger"
        d="M236,0c-24.5,0-44,19.9-44,44v145l8.4,68.7c3.9-0.2,7.6-3,7.6-8V44c0-7.5,2.9-14.5,8.2-19.8
		C233.7,6.8,264,19,264,44v212c0,4.8,3.6,7.6,7.3,7.9l8.7-64.9V44C280,19.8,260.2,0,236,0z"
      />
    </g>
    <g
      class="pa__ring_container"
      :class="{ 'pa__selected': selected.includes(3) }"
      @click="onSelect(3)"
    >
      <rect
        x="74"
        y="39.1"
        class="pa__st0"
        width="126.4"
        height="240.9"
      />
      <path
        id="pa__ring"
        class="pa__finger"
        d="M192,189L160.5,71.7c-6.3-23.5-30.4-37.4-53.9-31.1c-23.3,6.2-37.5,30.3-31.1,
        53.9l32.6,121.8l27.2,63.7c3-1.6,5.1-4.9,4-9.1C86.3,72.9,90,88.3,90,83.1c0-21.3,
        23.3-35,42-24.2c6.5,3.7,11.1,9.8,13,17l47.2,176c1.1,4.2,4.7,6.1,8.2,5.9L192,189z"
      />
    </g>
    <g
      class="pa__little_container"
      :class="{ 'pa__selected': selected.includes(4) }"
      @click="onSelect(4)"
    >
      <rect
        x="0"
        y="138.2"
        class="pa__st0"
        width="135.4"
        height="279.2"
      />
      <path
        id="pa__little"
        class="pa__finger"
        d="M74.6,158.2c-11-19.1-35.5-25.7-54.6-14.6C1.2,154.4-5.9,178.7,5.4,198.2l44.9,77.8C67.1,
        305.1,76,338.3,76,372c0,13.5,1.9,26.8,5.7,39.7c1.3,4.2,5.7,6.7,9.9,
        5.4c4.2-1.2,6.7-5.7,5.4-9.9C93.7,395.8,92,383.9,92,372c0-36.5-9.6-72.4-27.9-104l-44.
        9-77.8c-2.1-3.6-3.2-7.8-3.2-12c0-24.7,32.7-33,44.8-12l63.9,110.7c2.5,4.3,7.2,4.8,10.6,
        3l-27.2-63.7L74.6,158.2z"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'Hand',
  props: {
    selected: { type: Array, default: () => [] }
  },
  emits: ['select'],
  methods: {
    /**
     * @param ind { number }
     * @returns {void}
     */
    onSelect(ind){
      this.$emit('select', ind)
    }
  },
}
</script>

<style>

</style>
