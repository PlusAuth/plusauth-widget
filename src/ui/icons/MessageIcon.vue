<script setup lang="ts">

</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path
        fill="currentColor"
        fill-opacity="0"
        stroke-dasharray="70"
        d="M3 19.5v-15.5c0 -0.55 0.45 -1 1 -1h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-14.5Z"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.6s"
          values="70;0"
        />
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="1.2s"
          dur="0.15s"
          to=".3"
        />
      </path>
      <g fill="none">
        <g
          stroke-dasharray="10"
          stroke-dashoffset="10"
        >
          <path d="M8 7h8">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.7s"
              dur="0.2s"
              to="0"
            />
          </path>
          <path d="M8 10h8">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.8s"
              dur="0.2s"
              to="0"
            />
          </path>
        </g>
        <path
          stroke-dasharray="6"
          stroke-dashoffset="6"
          d="M8 13h4"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.9s"
            dur="0.2s"
            to="0"
          />
        </path>
      </g>
    </g>
  </svg>
</template>

<style scoped>

</style>
