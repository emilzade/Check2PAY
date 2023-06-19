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
        <div class="d-flex justify-content-between align-items-center gap-2">
          <div class="overflow-auto">{{ item.request }}</div>
          <div @click="copyToClipboard(item.request)" class="btn btn-light">
            <CIcon :content="cilCopy" />
          </div>
        </div>
      </li>
      <li class="list-group-item break-word">
        <span class="text-secondary">Response:</span>
        <br />
        <div class="d-flex justify-content-between align-items-center gap-2">
          <div class="overflow-auto">{{ item.response }}</div>
          <div @click="copyToClipboard(item.response)" class="btn btn-light">
            <CIcon :content="cilCopy" />
          </div>
        </div>
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
import { cilBurn, cilCheckCircle, cilCopy } from '@coreui/icons'
export default {
  name: 'CheckInfoModal',
  props: ['item'],
  data() {
    return {
      cilBurn,
      cilCheckCircle,
      cilCopy,
    }
  },
  methods: {
    copyToClipboard(message) {
      navigator.clipboard.writeText(message)
    },
  },
  mounted() {},
}
</script>
