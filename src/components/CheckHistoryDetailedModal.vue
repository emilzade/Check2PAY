<template>
  <div class="modal-vue">
    <div class="history-modal rounded p-3 overflow-auto" v-if="isActive">
      <div class="d-flex justify-content-end p-3">
        <CIcon
          :content="icons.cilX"
          @click="closeDetailedHistoryModal"
          width="40"
          class="border rounded"
          role="button"
          height="30"
        />
      </div>
      <h3 class="display-5 text-center">Detailed History</h3>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <span class="text-secondary">Id :</span> {{ detailedHistory.id }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Service Id:</span>
          {{ detailedHistory.gateServiceId }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Service Name:</span>
          {{ detailedHistory.serviceName }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">User Id:</span>
          {{ detailedHistory.appUserId }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Check Date:</span>
          {{ detailedHistory.endTime.slice(0, 10) }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Check Duration:</span>
          {{ detailedHistory.startTime.slice(11, 19) }}
          {{ detailedHistory.endTime.slice(11, 19) }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Request:</span>
          <p style="word-wrap: break-word">
            {{ detailedHistory.request }}
          </p>
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Response:</span>
          <br />
          <code style="background-color: #e9e9e9" class="d-block p-3 rounded">
            {{ detailedHistory.response }}
          </code>
        </li>
      </ul>
      <CAlert
        v-if="detailedHistory.resultCode != 0"
        color="danger"
        class="d-flex align-items-center gap-2"
      >
        <CIcon :content="icons.cilBurn" class="flex-shrink-0 me-2" />
        <div>Exception: {{ detailedHistory.exceptionData }}</div>
      </CAlert>
      <CAlert v-else color="success" class="d-flex align-items-center gap-2">
        <CIcon :content="icons.cilCheckCircle" class="flex-shrink-0 me-2" />
        <div>No Exception</div>
      </CAlert>
    </div>

    <div
      class="overlay overlay-history"
      v-if="isActive"
      @click="closeDetailedHistoryModal"
    ></div>
  </div>
</template>
<script>
export default {
  props: ['detailedHistory', 'isActive', 'icons'],
  methods: {
    closeDetailedHistoryModal: function () {
      this.$emit('closeDetailedHistoryModal')
    },
  },
}
</script>
