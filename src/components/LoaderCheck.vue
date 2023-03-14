<template>
  <div v-if="isLoading" class="w-15">
    <div class="check-loading border rounded p-0 m-0">
      <div
        class="check w-100 h-100 d-flex justify-content-center align-items-center"
      >
        <div class="fingerprint-spinner w-75 p-0 m-0">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
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
