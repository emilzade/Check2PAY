<template>
  <div class="w-100 p-3 border rounded check-info-modal">
    <div class="text-secondary">
      {{ item.request }}
    </div>
    <br />
    <div class="text-secondary">{{ item.response }}</div>
    <CAlert
      v-if="item.resultcodeid == 0"
      color="success"
      class="d-flex align-items-center gap-2 p-2 mt-2"
    >
      <CIcon :content="cilCheckCircle" class="flex-shrink-0 me-2" />
      <div>No Exception</div>
    </CAlert>
    <CAlert
      v-else
      color="danger"
      class="d-flex align-items-center gap-2 p-2 mt-2"
    >
      <CIcon :content="cilBurn" class="flex-shrink-0 me-2" />
      <div>Exception: {{ item.exceptiondata }}</div>
    </CAlert>
  </div>
</template>
<style>
.check-info-modal {
  position: absolute;
  right: 15%;
  top: 100%;
  overflow: auto;
  background-color: white;
  z-index: 9999;
  font-size: 0.7rem;
  animation-name: box;
  animation-duration: 0.5s;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.75);
}
@keyframes box {
  0% {
    box-shadow: 0px 5px 10px 0px rgba(255, 255, 255, 0.75);
  }
  100% {
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.75);
  }
}
</style>
<script>
import { cilBurn, cilCheckCircle } from '@coreui/icons'
export default {
  name: 'CheckInfoModal',
  props: ['item'],
  data() {
    return {
      cilBurn,
      cilCheckCircle,
    }
  },
}
</script>
