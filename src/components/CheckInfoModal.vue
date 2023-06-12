<template>
  <div
    class="w-100 h-100 p-3 check-info-modal"
    v-if="item != null && !item.isLoading"
  >
    <ul class="list-group list-group-flush">
      <li class="list-group-item break-word">
        <span class="text-secondary">Id :</span> {{ item.id }}
      </li>
      <li class="list-group-item break-word">
        <span class="text-secondary">Service Id:</span>
        {{ item.gateServiceId }}
      </li>
      <li class="list-group-item break-word">
        <span class="text-secondary">Service Name:</span>
        {{ item.serviceName }}
      </li>
      <li class="list-group-item break-word">
        <span class="text-secondary">User Id:</span> 1
        {{ item.appUserId }}
      </li>
      <li class="list-group-item break-word">
        <span class="text-secondary">Check Date:</span>
        {{ item.endTime.slice(0, 10) }}
      </li>
      <li class="list-group-item break-word">
        <span class="text-secondary">Check Duration:</span>
        {{ item.startTime.slice(11, 19) }}
        {{ item.endTime.slice(11, 19) }}
      </li>
      <li class="list-group-item break-word">
        <span class="text-secondary">Request:</span>
        <p class="overflow-auto">{{ item.request }}</p>
      </li>
      <li class="list-group-item break-word">
        <span class="text-secondary">Response:</span>
        <br />
        <p class="d-block rounded">
          {{ item.response }}
        </p>
      </li>
    </ul>
    <br />
    <CAlert
      v-if="item.resultCode == 0"
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
      <div>Exception: {{ item.exceptionData }}</div>
    </CAlert>
  </div>
</template>
<style>
.break-word {
  word-wrap: break-word;
}
.check-info-modal {
  height: 400px;
  width: 600px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: white;
  z-index: 9999;
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
  mounted() {},
}
</script>
