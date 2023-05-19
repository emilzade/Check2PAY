<template>
  <CForm>
    <CRow
      class="py-5 d-flex align-items-center justify-content-start w-75 m-auto"
    >
      <CCol class="col-md-4 col-12 py-2">
        <!-- <CFormLabel for="name" class="text-secondary bg-light">
          Name
        </CFormLabel> -->
        <CFormInput
          id="name"
          placeholder="Service Name"
          name="srv_name"
          type="text"
          v-model="formData.srv_name"
          class="input-custom bg-light border border-secondary rounded"
        />
      </CCol>
      <CCol class="col-md-4 col-12 py-2">
        <!-- <CFormLabel for="serviceId" class="text-secondary bg-light">
          Service Id
        </CFormLabel> -->
        <CFormInput
          id="serviceId"
          name="serviceId"
          type="text"
          placeholder="Service Id"
          v-model="formData.serviceId"
          class="input-custom bg-light border border-secondary rounded"
        />
      </CCol>
      <CCol class="col-md-4 col-12 py-2">
        <!-- <CFormLabel for="partitionNumber" class="text-secondary bg-light">
          Partition Number
        </CFormLabel> -->
        <CFormInput
          id="partitionNumber"
          type="text"
          placeholder="Partition Number"
          name="partitionNum"
          v-model="formData.partitionNum"
          class="input-custom bg-light border border-secondary rounded"
        />
      </CCol>
      <CCol class="col-md-4 col-12 py-2 small">
        <div class="d-flex justify-content-between my-2">
          <div
            class="d-flex flex-column align-items-center"
            v-for="successType in successTypes"
            v-bind:key="successType.id"
          >
            <CFormLabel :for="'successType' + successType.id" role="button"
              ><small>{{ successType.name }}</small></CFormLabel
            >
            <CFormInput
              class="form-check-input"
              type="checkbox"
              :id="'successType' + successType.id"
              :name="'successType' + successType.id"
              :value="successType.name"
              :checked="successType.default"
              @click="successType.checked = !successType.checked"
            />
          </div>
        </div>
      </CCol>
      <CCol class="col-md-4 col-12 py-2"
        ><CFormLabel for="startDate" class="text-secondary"
          >Start Date </CFormLabel
        ><CFormInput
          id="startDate"
          type="date"
          name="from_date"
          v-model="formData.from_date"
          class="bg-light text-dark"
        />
      </CCol>
      <CCol class="col-md-4 col-12 py-2"
        ><CFormLabel for="endDate" class="text-secondary">End Date </CFormLabel
        ><CFormInput
          id="endDate"
          type="date"
          name="to_date"
          v-model="formData.to_date"
          class="bg-light text-dark"
        />
      </CCol>
      <CCol
        class="col-12 py-3 d-flex align-items-center justify-content-end gap-5"
      >
        <div
          class="d-flex align-items-center justify-content-end p-0 m-0 gap-2"
        >
          <input
            class="w-25 bg-light text-secondary border rounded p-2"
            type="number"
            id="perPageElementCount"
            name="perPageElementCount"
            v-model="perPageElementCount"
          />
          <CFormLabel class="m-0 text-secondary" for="perPageElementCount"
            >Per Page Element Count</CFormLabel
          >
        </div>
        <JsonExcel
          class="btn btn-outline-success"
          v-c-tooltip="{
            content: 'Download as excel',
            placement: 'top',
          }"
          :data="dbData.data"
        >
          <CIcon :content="icons.cilDataTransferDown"></CIcon>
        </JsonExcel>
        <CButton color="dark" variant="outline" @click="search" size="lg"
          >Search</CButton
        >
      </CCol>
      <CAlert
        v-if="searchWarning.isActive"
        class="d-flex align-items-center gap-2 my-3"
        color="warning"
        dismissible
      >
        <CIcon :content="icons.cilWarning" />
        {{ searchWarning.data }}
      </CAlert>
    </CRow>
  </CForm>
  <CheckHistoryTable
    :icons="icons"
    :data="sortedSearchResults"
    :thData="thData"
    @sort="sort"
    @getDetailedInfo="getDetailedHistory"
  ></CheckHistoryTable>

  <!--pagination start-->
  <div class="d-flex justify-content-center text-center pt-3">
    <pagination
      v-model="currentPage"
      :records="dbData.totalCount"
      :per-page="perPageElementCount"
      @paginate="pageSelected"
      :options="{ chunk: 8 }"
    />
  </div>
  <!--pagination end-->

  <CheckHistoryDetailedModal
    :detailedHistory="detailedHistory"
    :isActive="isDetailedHistoryModalActive"
    :icons="icons"
    @closeDetailedHistoryModal="closeDetailedHistoryModal"
  ></CheckHistoryDetailedModal>
  <LoaderFullPage :isLoading="isPageLoading"></LoaderFullPage>
</template>
<script>
import JsonExcel from 'vue-json-excel3'
import Pagination from 'v-pagination-3'
import CheckHistoryDetailedModal from '@/components/CheckHistoryDetailedModal.vue'
import CheckHistoryTable from '@/components/CheckHistoryTable.vue'
import LoaderFullPage from '@/components/LoaderFullPage.vue'

import { ref } from 'vue'
import {
  cilInfo,
  cilWarning,
  cilX,
  cilCheckCircle,
  cilBurn,
  cilDataTransferDown,
  cilStream,
} from '@coreui/icons'
export default {
  components: {
    JsonExcel,
    Pagination,
    CheckHistoryDetailedModal,
    CheckHistoryTable,
    LoaderFullPage,
  },
  name: 'History',
  data() {
    const dbData = {
      data: [],
      totalCount: 0,
    }
    const thData = [
      { id: 1, title: 'Service Id', sortBy: 'gateServiceId' },
      { id: 1, title: 'Name', sortBy: 'serviceName' },
      { id: 2, title: 'Start Date', sortBy: 'startTime' },
      { id: 3, title: 'User Id', sortBy: 'appUserId' },
      { id: 6, title: 'Result', sortBy: 'resultCode' },
      { id: 6, title: 'Partition Nº', sortBy: 'partitionNumber' },
      { id: 7, title: 'Operations', sortBy: null },
    ]
    const formData = {
      serviceId: '',
      partitionNum: '',
      srv_name: '',
      status: [],
      from_date: this.getPreviousDay(
        new Date(new Date().toISOString().slice(0, 10)),
      )
        .toISOString()
        .slice(0, 10),
      to_date: new Date().toISOString().slice(0, 10),
    }
    const perPageElementCount = 20
    const searchWarning = {
      isActive: false,
      data: null,
    }
    const successTypes = [
      {
        id: 1,
        name: 'Success',
        value: '0',
        checked: false,
      },
      {
        id: 2,
        name: 'OSMP',
        value: '1',
        checked: false,
      },
      {
        id: 3,
        name: 'Parameter',
        value: '202',
        checked: false,
      },
    ]
    const detailedHistory = {}
    const isDetailedHistoryModalActive = ref(false)
    const icons = {
      cilInfo,
      cilWarning,
      cilX,
      cilCheckCircle,
      cilBurn,
      cilDataTransferDown,
      cilStream,
    }
    const currentPage = 1
    const currentSort = 'startTime'
    const currentSortDir = 'desc'
    const isPageLoading = ref(false)
    return {
      icons,
      dbData,
      thData,
      formData,
      detailedHistory,
      searchWarning,
      currentSort,
      currentSortDir,
      currentPage,
      successTypes,

      perPageElementCount,

      isDetailedHistoryModalActive,
      isPageLoading,
    }
  },
  computed: {
    dynamicSearchQuery() {
      return (offset) =>
        `http://localhost:84/api/CheckRequest/CheckRequestHistories?srv_name=${this.formData.srv_name}&serviceId=${this.formData.serviceId}&partitionNum=${this.formData.partitionNum}${this.selectedStatus}&from_date=${this.formData.from_date}%2000%3A00&to_date=${this.formData.to_date}%2000%3A00&limit=${this.perPageElementCount}&offset=${offset}`
    },
    selectedStatus() {
      var tempString = ''
      for (var i = 0; i < this.successTypes.length; i++) {
        if (this.successTypes[i].checked) {
          tempString += '&status=' + this.successTypes[i].value
        }
      }
      return tempString
    },
    sortedSearchResults() {
      /*eslint-disable*/
      return this.dbData.data.sort((a, b) => {
        let modifier = 1
        if (this.currentSortDir === 'desc') modifier = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
        return 0
      })
    },
  },
  methods: {
    search: function () {
      console.log(this.formData)
      this.getDbData(0)
    },
    getDbData: function (offset) {
      this.isPageLoading = true
      console.log(this.dynamicSearchQuery(offset))
      fetch(this.dynamicSearchQuery(offset))
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          this.createNewModel(this.dbData.data)
          console.log(this.dbData)
          this.isPageLoading = false
        })
    },
    pageSelected: function (pageId) {
      var offset = (pageId - 1) * this.perPageElementCount
      this.getDbData(offset)
    },
    getPreviousDay: function (date = new Date()) {
      const previous = new Date(date.getTime())
      previous.setDate(date.getDate() - 1)

      return previous
    },
    getDetailedHistory: function (id) {
      this.isDetailedHistoryModalActive = true
      this.detailedHistory = this.dbData.data.find((x) => x.id == id)
      console.log(this.detailedHistory)
    },
    closeDetailedHistoryModal: function () {
      this.isDetailedHistoryModalActive = false
    },
    sort: function (sortDir) {
      //if sortDir == current sort, reverse
      if (sortDir === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = sortDir
    },
    createNewModel: function (data) {
      this.dbData.data = data.map((obj) => ({
        ...obj,
        result: obj.resultCode == 0 ? 'success' : 'error',
      }))
    },
  },
  beforeMount() {
    this.getDbData(0)
    // fetch('http://localhost:84/api/Services/GetServices?offset=0&limit=1500')
    //   .then((response) => response.json())
    //   .then((data) => (this.tempData = data.services))
  },
}
</script>
