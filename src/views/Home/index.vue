<template>
  <a-card>
    <h1>Hi,{{ getTime() }}好</h1>
  </a-card>
</template>

<script setup lang="ts">
import { getTime } from '@/utils/time'
</script>
<style scoped lang="less"></style>
