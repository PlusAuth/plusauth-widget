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
        fill="none"
        stroke-dasharray="4"
        d="M12 3v2"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.2s"
          values="4;0"
        />
      </path>
      <path
        fill="currentColor"
        fill-opacity="0"
        stroke-dasharray="30"
        stroke-dashoffset="30"
        d="M12 5c-3.31 0 -6 2.69 -6 6l0 6c-1 0 -2 1 -2 2h8M12 5c3.31 0 6 2.69 6 6l0 6c1 0 2 1 2 2h-8"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.2s"
          dur="0.4s"
          to="0"
        />
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="1.3s"
          dur="0.15s"
          to=".3"
        />
      </path>
      <g fill="none">
        <path
          stroke-dasharray="10"
          stroke-dashoffset="10"
          d="M10 20c0 1.1 0.9 2 2 2c1.1 0 2 -0.9 2 -2"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.7s"
            dur="0.2s"
            to="0"
          />
        </path>
        <path
          stroke-dasharray="6"
          stroke-dashoffset="6"
          d="M22 6v4"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.9s"
            dur="0.2s"
            to="0"
          />
        </path>
        <path
          stroke-dasharray="4"
          stroke-dashoffset="4"
          d="M22 14v0.01"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="1.1s"
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
