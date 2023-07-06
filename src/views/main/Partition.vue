<template>
  <CForm>
    <CRow
      class="py-5 d-flex align-items-center justify-content-start w-75 m-auto"
    >
      <CCol class="col-md-3 col-6 py-2">
        <CFormLabel for="userId" class="text-secondary bg-light">
          User Id
        </CFormLabel>
        <CFormInput
          id="userId"
          placeholder="User Id"
          name="userId"
          type="text"
          v-model="formData.userId"
          class="input-custom border border-secondary rounded"
        />
      </CCol>
      <CCol class="col-md-3 col-6 py-2">
        <CFormLabel for="partitionNumber" class="text-secondary bg-light">
          Partition Number
        </CFormLabel>
        <CFormInput
          id="partitionId"
          type="text"
          placeholder="Partition Id"
          name="partitionNum"
          v-model="formData.partitionUd"
          class="input-custom border border-secondary rounded"
        />
      </CCol>
      <CCol class="col-md-3 col-6 py-2"
        ><CFormLabel for="startDate" class="text-secondary"
          >Start Date </CFormLabel
        ><CFormInput
          id="startDate"
          type="date"
          name="from_date"
          v-model="formData.from_date"
          class="text-dark"
        />
      </CCol>
      <CCol class="col-md-3 col-6 py-2"
        ><CFormLabel for="endDate" class="text-secondary">End Date </CFormLabel
        ><CFormInput
          id="endDate"
          type="date"
          name="to_date"
          v-model="formData.to_date"
          class="text-dark"
        />
      </CCol>
      <CCol
        class="col-12 py-3 d-flex align-items-center justify-content-end gap-5"
      >
        <div
          class="d-flex align-items-center justify-content-end p-0 m-0 gap-2"
        >
          <input
            class="w-25 text-secondary border rounded p-2"
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
  <CTable responsive striped small hover class="text-center">
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell
          class="user-select-none"
          v-for="(item, index) in thData"
          :key="index"
          role="button"
          scope="col"
          @click="sort(item.sortBy)"
          >{{ item.title }}</CTableHeaderCell
        >
      </CTableRow>
    </CTableHead>
    <CTableBody align="middle" v-for="item in dbData.data" :key="item.id">
      <CTableRow>
        <CTableDataCell style="width: 200px; overflow: hidden">
          <span style="width: 100px; overflow: hidden">
            {{ item.appUserId }}
          </span>
        </CTableDataCell>
        <CTableDataCell style="width: 200px; overflow: hidden">
          <span style="width: 100px; overflow: hidden">
            {{ item.partitionNumber }}
          </span>
        </CTableDataCell>
        <CTableDataCell style="width: 200px; overflow: hidden">
          <span
            class="bg-secondary rounded px-3 text-light"
            style="width: 100px; overflow: hidden"
          >
            {{ item.historyCount }}
          </span>
        </CTableDataCell>
        <CTableDataCell style="width: 200px; overflow: hidden">
          <span
            class="bg-success rounded px-3 text-light"
            style="width: 100px; overflow: hidden"
          >
            {{ item.successCount }}
          </span>
        </CTableDataCell>
        <CTableDataCell style="width: 200px; overflow: hidden">
          <span
            class="bg-danger rounded px-3 text-light"
            style="width: 100px; overflow: hidden"
          >
            {{ item.errorCount }}
          </span>
        </CTableDataCell>
        <CTableDataCell style="width: 200px; overflow: hidden">
          <span
            @click="PassQueryToHistorySearch(item)"
            style="width: 100px; overflow: hidden"
          >
            <CIcon class="text-success" :content="icons.cilExternalLink" />
          </span>
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>

  <!--pagination start-->
  <div class="d-flex justify-content-center">
    <pagination
      v-model="currentPage"
      :records="dbData.totalCount"
      :per-page="perPageElementCount"
      @paginate="pageSelected"
      :options="{ chunk: 8 }"
    />
  </div>
  <!--pagination end-->
  <LoaderFullPage :isLoading="isPageLoading"></LoaderFullPage>
</template>
<script>
import JsonExcel from 'vue-json-excel3'
import Pagination from 'v-pagination-3'
import LoaderFullPage from '@/components/LoaderFullPage.vue'
import { mapGetters } from 'vuex'
import { ref } from 'vue'
import {
  cilInfo,
  cilWarning,
  cilX,
  cilCheckCircle,
  cilBurn,
  cilDataTransferDown,
  cilStream,
  cilExternalLink,
} from '@coreui/icons'
export default {
  components: {
    JsonExcel,
    Pagination,
    LoaderFullPage,
  },
  name: 'History',
  data() {
    const dbData = {
      data: [],
      totalCount: 0,
    }
    const thData = [
      { id: 1, title: 'User Id', sortBy: 'userid' },
      { id: 3, title: 'Partition Number', sortBy: 'partitionNumber' },
      { id: 2, title: 'History Count', sortBy: 'historyCount' },
      { id: 2, title: 'Success Count', sortBy: 'successCount' },
      { id: 2, title: 'Error Count', sortBy: 'errorCount' },
      { id: 4, title: 'Operations', sortBy: null },
    ]
    const formData = {
      userId: '',
      partitionId: '',
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
      cilExternalLink,
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

      totalElementCount,
      perPageElementCount,

      isCheckHistoryHasException,
      isDetailedHistoryModalActive,
      isPageLoading,
    }
  },
  computed: {
    dynamicSearchQuery() {
      return (offset) =>
        `${this.$store.state.testApi}/api/Services/GetPartitionsCount?offset=${offset}&limit=${this.perPageElementCount}&partitionId=2&userId=${this.formData.userId}&startDate=${this.formData.from_date}%2000%3A00&endDate=${this.formData.to_date}%2000%3A00`
    },
    ...mapGetters(['getCurrentVendorCode']),
  },
  watch: {
    getCurrentVendorCode() {
      this.getDbData(0)
    },
  },
  methods: {
    search: function () {
      this.getDbData(0)
    },
    getDbData: function (offset) {
      this.dbData = {
        data: [],
        totalCount: 0,
      }
      this.isPageLoading = true
      console.log(this.formData)
      console.log(this.dynamicSearchQuery(offset))
      fetch(this.dynamicSearchQuery(offset))
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          //this.createNewModel(this.dbData)
          console.log(data)
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
    PassQueryToHistorySearch: function (item) {
      var newObject = {
        partitionNumber: item.partitionNumber,
        appUserId: item.appUserId,
        from_date: this.formData.from_date,
        to_date: this.formData.to_date,
      }
      console.log(newObject)
      this.$store.commit('setSearchHistoryItemByPartition', newObject)

      this.$router.push({
        name: 'History',
      })
    },
    sort: function (sortDir) {
      //if sortDir == current sort, reverse
      if (sortDir === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = sortDir
    },
  },
  beforeMount() {},
}
</script>
