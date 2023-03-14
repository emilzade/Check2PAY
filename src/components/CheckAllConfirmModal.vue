<template>
  <div v-if="isActive" class="modal-vue">
    <div
      class="check-modal rounded p-3 d-flex flex-column justify-content-around align-items-center"
    >
      <div class="fs-4 text-center">Confirm Check All Items In Database</div>
      <div class="d-flex justify-content-around align-items-center w-100 pt-1">
        <div @click="changeActiveState" class="btn btn-outline-danger btn-lg">
          Close
        </div>
        <div @click="checkAll()" class="btn btn-outline-success btn-lg">
          Check All
        </div>
      </div>
    </div>
    <div
      class="overlay overlay-check"
      v-if="isActive"
      @click="changeActiveState"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'CheckAllConfirmModal',
  props: ['isActive'],
  data() {
    return {}
  },
  methods: {
    changeActiveState: function () {
      this.$emit('changeActiveState', 'checkAllConfirm')
      console.log(this.isActive)
    },
    checkAll: function () {
      this.$emit('checkAll')
    },
  },
  mounted() {},
}
</script>
