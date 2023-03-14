<template>
  <div class="modal-vue">
    <div
      class="check-modal rounded p-3 d-flex align-items-center justify-content-between"
      v-if="isActive"
    >
      <div class="">
        <span class="text-secondary pe-2">{{
          currentElement.gate_service_id
        }}</span>
        <span>{{ currentElement.name }}</span>
      </div>
      <div
        style="transform: scale(2); height: 30px"
        v-if="currentElement.isLoading"
        class="check-loading"
      >
        <div class="check">
          <div class="semipolar-spinner pe-3">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="overlay overlay-check"
      v-if="isActive"
      @click="closeModal"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'CheckModal',
  props: ['isActive', 'currentElement'],
  methods: {
    closeModal: function () {
      this.$emit('changeActivetate', 'check')
    },
  },
}
</script>
