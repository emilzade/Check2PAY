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
          <CIcon :content="cilDataTransferDown"></CIcon>
        </JsonExcel>
        <div class="btn btn-dark btn-lg" @click="search">Search</div>
      </CCol>
      <CAlert
        v-if="searchWarning.isActive"
        class="d-flex align-items-center gap-2 my-3"
        color="warning"
        dismissible
      >
        <CIcon :content="cilWarning" />
        {{ searchWarning.data }}
      </CAlert>
    </CRow>
  </CForm>
  <CRow class="py-5">
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
          v-for="item in sortedSearchResults.slice(0, 100)"
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
            <span style="width: 100px; display: block; overflow: hidden">
              {{ item.start_time.slice(0, 10) }}
              <br />{{ item.start_time.slice(11, 16) }}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <span style="width: 60px; overflow: hidden">
              12343{{ item.userid }}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <div
              style="width: 60px; overflow: hidden"
              :class="{
                'bg-success': item.result == 'success',
                'bg-danger': item.result == 'error',
              }"
              class="rounded m-auto text-light"
            >
              {{ item.result }}
            </div>
            <!-- <div
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
            </div> -->
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
            <CIcon
              class="cursor-pointer"
              @click="getDetailedHistory(item.id)"
              :content="cilInfo"
            />
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </CRow>
  <!--pagination start-->
  <div class="d-flex justify-content-center text-center pt-3 salam">
    <pagination
      v-model="currentPage"
      :records="totalElementCount"
      :per-page="perPageElementCount"
      @paginate="pageSelected"
      :options="{ chunk: 8 }"
    />
  </div>
  <!--pagination end-->
  <!--Info Modal Start -->
  <div class="modal-vue">
    <div
      class="history-modal rounded p-3 overflow-auto"
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
          <p class="overflow-auto">{{ detailedHistory.request }}</p>
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
  <!--Info Modal End -->
</template>
<script>
import JsonExcel from 'vue-json-excel3'
import Pagination from 'v-pagination-3'
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

    const currentPage = 1
    const currentSort = 'id'
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
    return {
      cilInfo,
      cilWarning,
      cilX,
      cilCheckCircle,
      cilBurn,
      cilDataTransferDown,
      cilStream,

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
      fetch(
        `http://localhost:8081/api/CheckRequest/CheckRequestHistoriesMulti/?srv_name=${this.formData.srv_name}&serviceId=${this.formData.serviceId}&partitionNum=${this.formData.partitionNum}&from_date=${this.formData.from_date}&to_date=${this.formData.to_date}`,
      )
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          this.createNewModel(this.dbData)
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
      fetch('http://localhost:8081/api/CheckRequest/CheckRequestHistories')
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          this.createNewModel(this.dbData)
          console.log(this.dbData)
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
