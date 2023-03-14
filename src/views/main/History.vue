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
      <CCol class="col-md-4 col-12 py-2">
        <CFormLabel for="partitionNumber" class="text-secondary bg-light">
          Status
        </CFormLabel>
        <CFormInput
          id="status"
          type="text"
          placeholder="Status"
          name="partitionNum"
          v-model="formData.status"
          class="input-custom bg-light border border-secondary rounded"
        />
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
          :data="dbData"
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
    :data="sortedSearchResults.slice(0, 100)"
    :thData="thData"
    @sort="sort"
    @getDetailedInfo="getDetailedHistory"
  ></CheckHistoryTable>

  <!--pagination start-->
  <pagination
    v-model="currentPage"
    :records="totalElementCount"
    :per-page="perPageElementCount"
    @paginate="pageSelected"
    :options="{ chunk: 8 }"
  />
  <!--pagination end-->

  <CheckHistoryDetailedModal
    :detailedHistory="detailedHistory"
    :isActive="isDetailedHistoryModalActive"
    :hasException="isCheckHistoryHasException"
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
    const formData = {
      serviceId: '',
      partitionNum: '',
      srv_name: '',
      status: '',
      from_date: this.getPreviousDay(
        new Date(new Date().toISOString().slice(0, 10)),
      )
        .toISOString()
        .slice(0, 10),
      to_date: new Date().toISOString().slice(0, 10),
    }
    const totalElementCount = 101
    const perPageElementCount = 20
    const searchWarning = {
      isActive: false,
      data: null,
    }
    const detailedHistory = {}
    const isCheckHistoryHasException = ref(false)
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
    const currentSort = 'start_time'
    const currentSortDir = 'desc'
    /*
    List<Service> services(int pageId = 1 , int perPageElementCount = 50 , obj obj)
    return{
      pageId: 2 ,
      elementCount: 50 ,
      totalItems: 1650 ,
      items:[{...},{...},{...}]
    }
    List<Service> servicesMulti(int pageId = 1 , int perPageElementCount = 50 , obj obj){
      return{
        pageId: 2,
        elementCount: 40,
        totalItems: 123,
        items:[{...},{...},{...}]
      }
    }

    List<CheckRequestHistory> checkRequestHistories(int pageId = 1 , int perPageElementCount = 50)
    return {
      pageId: 2 ,
      elementCount: 50 ,
      totalItems: 7843 ,
      items:[{...},{...},{...}]
    }

    List<CheckRequestHistory> checkRequestHistoriesMulti(int pageId = 1 , int perPageElementCount = 50 , obj obj)
    return {
      pageId: 2 ,
      elementCount: 50 ,
      totalItems: 7843 ,
      items:[{...},{...},{...}]
    }
    */
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

      totalElementCount,
      perPageElementCount,

      isCheckHistoryHasException,
      isDetailedHistoryModalActive,
      isPageLoading,
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
    search: function () {
      this.isPageLoading = true
      console.log(this.formData)
      console.log(
        `http://localhost:8081/api/CheckRequest/CheckRequestHistoriesMulti?srv_name=${this.formData.srv_name}&serviceId=${this.formData.serviceId}&partitionNum=${this.formData.partitionNum}&status=${this.formData.status}&from_date=${this.formData.from_date}&to_date=${this.formData.to_date}`,
      )
      fetch(
        `http://localhost:8081/api/CheckRequest/CheckRequestHistoriesMulti?srv_name=${this.formData.srv_name}&serviceId=${this.formData.serviceId}&partitionNum=${this.formData.partitionNum}&status=${this.formData.status}&from_date=${this.formData.from_date}&to_date=${this.formData.to_date}`,
      )
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          this.createNewModel(this.dbData)
          console.log(this.dbData)
          this.isPageLoading = false
        })
    },
    getPreviousDay: function (date = new Date()) {
      const previous = new Date(date.getTime())
      previous.setDate(date.getDate() - 1)

      return previous
    },
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
      this.isPageLoading = true
      fetch(
        `http://localhost:8081/api/CheckRequest/CheckRequestHistoriesMulti?srv_name=${this.formData.srv_name}&serviceId=${this.formData.serviceId}&partitionNum=${this.formData.partitionNum}&status=${this.formData.status}&from_date=${this.formData.from_date}&to_date=${this.formData.to_date}`,
      )
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          this.createNewModel(this.dbData)
          console.log(this.dbData)
          this.isPageLoading = false
        })
    },
    pageSelected: function (pageId) {
      console.log(pageId)
      // this.db = this.dbData.slice(
      //   (pageId - 1) * this.perPageElementCount,
      //   (pageId - 1) * this.perPageElementCount + this.perPageElementCount,
      // )
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
