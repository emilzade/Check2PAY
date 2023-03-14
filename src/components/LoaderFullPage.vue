<template>
  <div v-if="isLoading" class="full-page">
    <div class="loading-view">
      <div class="loading-inner">
        <div class="semipolar-spinner">
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['isLoading'],
}
</script>
