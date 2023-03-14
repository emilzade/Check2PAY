<template>
  <div class="modal-vue">
    <div
      class="settings-modal rounded p-3 d-flex align-items-center justify-content-between"
      v-if="isActive"
    >
      <CheckInfoModal :item="data"></CheckInfoModal>
    </div>
    <div
      class="overlay overlay-check"
      v-if="isActive"
      @click="closeModal"
    ></div>
  </div>
</template>
<script>
import CheckInfoModal from '@/components/CheckInfoModal.vue'
export default {
  name: 'CheckResultModal',
  props: ['isActive', 'data'],
  components: { CheckInfoModal },
  methods: {
    closeModal: function () {
      this.$emit('changeActiveState', 'checkResult')
    },
  },
}
</script>
