<template>
  <CRow>
    <CTable responsive striped small hover class="text-center">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell
            role="button"
            class="user-select-none"
            scope="col"
            @click="sort(item.sortBy)"
            v-for="item in thData"
            :key="item.id"
            >{{ item.title }}</CTableHeaderCell
          >
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow
          align="middle"
          v-for="item in sortedSearchResults"
          :key="item.id"
        >
          <CTableDataCell>
            <span style="width: 100px; overflow: hidden">
              {{ item.serviceid }}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <span style="width: 100px; overflow: hidden">
              {{ item.name }}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <span style="width: 100px; overflow: hidden">
              {{ item.start_time.slice(0, 10) }}
              &nbsp;&nbsp;{{ item.start_time.slice(11, 16) }}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <span style="width: 60px; overflow: hidden">
              12343{{ item.userid }}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <div
              v-if="item.resultcodeid == 0"
              style="width: 60px; overflow: hidden"
              class="bg-success rounded text-light m-auto"
            >
              success
            </div>
            <div
              v-else
              style="width: 60px; overflow: hidden"
              class="bg-danger rounded text-light m-auto"
            >
              error
            </div>
          </CTableDataCell>
          <CTableDataCell>
            <div
              v-if="item.separate == 1"
              style="width: 60px; overflow: hidden"
              class="rounded m-auto text-light bg-warning"
            >
              <CIcon :content="cilStream" />
            </div>
            <div v-else></div>
          </CTableDataCell>
          <CTableDataCell>
            <span style="width: 60px; overflow: hidden">
              {{ item.partitionnumber }}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <CIcon @click="getDetailedHistory(item.id)" :content="cilInfo" />
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </CRow>

  <!--History Modal Start -->
  <div class="modal-vue">
    <div
      class="settings-modal rounded p-3 overflow-auto"
      v-if="isDetailedHistoryModalActive"
    >
      <div class="d-flex justify-content-end p-3">
        <CIcon
          :content="cilX"
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
          {{ detailedHistory.serviceid }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Service Name:</span>
          {{ detailedHistory.name }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">User Id:</span> 1
          {{ detailedHistory.userid }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Check Date:</span>
          {{ detailedHistory.end_time.slice(0, 10) }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Check Duration:</span>
          {{ detailedHistory.start_time.slice(11, 19) }}
          {{ detailedHistory.end_time.slice(11, 19) }}
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Request:</span>
          <p class="overflow-auto">
            {{ detailedHistory.request }}
          </p>
        </li>
        <li class="list-group-item">
          <span class="text-secondary">Response:</span>
          <code style="background-color: #e9e9e9" class="d-block p-3 rounded">
            {{ detailedHistory.response }}
          </code>
        </li>
      </ul>
      <CAlert
        v-if="isCheckHistoryHasException"
        color="danger"
        class="d-flex align-items-center gap-2"
      >
        <CIcon :content="cilBurn" class="flex-shrink-0 me-2" />
        <div>Exception: {{ detailedHistory.exceptiondata }}</div>
      </CAlert>
      <CAlert v-else color="success" class="d-flex align-items-center gap-2">
        <CIcon :content="cilCheckCircle" class="flex-shrink-0 me-2" />
        <div>No Exception</div>
      </CAlert>
    </div>

    <div
      class="overlay overlay-history"
      v-if="isDetailedHistoryModalActive"
      @click="closeDetailedHistoryModal"
    ></div>
  </div>
  <!--History Modal End -->
</template>
<script>
import { ref } from 'vue'
import {
  cilInfo,
  cilWarning,
  cilX,
  cilCheckCircle,
  cilBurn,
  cilStream,
} from '@coreui/icons'
export default {
  data() {
    const dbData = []
    const thData = [
      { id: 1, title: 'Service Id', sortBy: 'serviceid' },
      { id: 1, title: 'Name', sortBy: 'name' },
      { id: 2, title: 'Start Date', sortBy: 'start_time' },
      { id: 3, title: 'User Id', sortBy: 'userid' },
      { id: 6, title: 'Result', sortBy: 'result' },
      { id: 6, title: 'Separate', sortBy: 'separate' },
      { id: 6, title: 'Partition Nº', sortBy: 'partitionnumber' },
      { id: 7, title: 'Operations', sortBy: null },
    ]
    const searchWarning = {
      isActive: false,
      data: null,
    }
    const detailedHistory = {}
    const isCheckHistoryHasException = ref(false)
    const isDetailedHistoryModalActive = ref(false)

    const currentSort = 'id'
    const currentSortDir = 'asc'
    return {
      cilInfo,
      cilWarning,
      cilX,
      cilCheckCircle,
      cilBurn,
      cilStream,

      dbData,
      thData,
      currentSort,
      currentSortDir,

      searchWarning,
      detailedHistory,
      isCheckHistoryHasException,
      isDetailedHistoryModalActive,
    }
  },
  computed: {
    sortedSearchResults() {
      /*eslint-disable*/
      return this.dbData.sort((a, b) => {
        let modifier = 1
        if (this.currentSortDir === 'desc') modifier = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
        return 0
      })
    },
  },
  methods: {
    getDetailedHistory: function (id) {
      this.isDetailedHistoryModalActive = true
      this.detailedHistory = this.dbData.find((x) => x.id == id)
      if (this.detailedHistory.exceptiondata) {
        this.isCheckHistoryHasException = true
      }
      console.log(this.detailedHistory)
    },
    closeDetailedHistoryModal: function () {
      this.isDetailedHistoryModalActive = false
      this.isCheckHistoryHasException = false
    },
    sort: function (sortDir) {
      //if sortDir == current sort, reverse
      if (sortDir === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = sortDir
    },
    getDbData: function () {
      fetch(
        `http://localhost:8081/api/CheckRequest/CheckRequestHistories/${this.$route.params.id}`,
      )
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          this.createNewModel(this.dbData)
          console.log(this.dbData)
        })
    },
    createNewModel: function (data) {
      this.dbData = data.map((obj) => ({
        ...obj,
        result: obj.resultcodeid == 0 ? 'success' : 'error',
      }))
    },
  },
  beforeMount() {
    this.getDbData()
  },
}
</script>
