<template>
  <div class="d-flex align-items-center justify-content-between pb-5">
    <router-link :to="{ name: 'Index' }">
      <CButton color="secondary" variant="outline"
        ><CIcon :content="icons.cilArrowLeft"
      /></CButton>
    </router-link>
    <div v-if="isPageLoading" class="display-5 text-center">Check History</div>
    <div v-else class="display-5 text-center">
      <div>Check History</div>
      <Transition name="slide-fade">
        <div
          class="text-secondary"
          v-if="serviceData.totalCount > 0 && !isPageLoading"
        >
          <span>{{ serviceData.data[0].gateServiceId }}</span>
          -
          <span>{{ serviceData.data[0].name }}</span>
        </div>
      </Transition>
    </div>
    <div></div>
  </div>
  <CheckHistoryTable
    :icons="icons"
    :data="sortedSearchResults"
    :thData="thData"
    @sort="sort"
    @getDetailedInfo="getDetailedHistory"
  ></CheckHistoryTable>

  <CheckHistoryDetailedModal
    :detailedHistory="detailedHistory"
    :isActive="isDetailedHistoryModalActive"
    :hasException="isCheckHistoryHasException"
    :icons="icons"
    @closeDetailedHistoryModal="closeDetailedHistoryModal"
  ></CheckHistoryDetailedModal>

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

  <LoaderFullPage :isLoading="isPageLoading"></LoaderFullPage>
</template>
<script>
import { ref } from 'vue'
import CheckHistoryDetailedModal from '@/components/CheckHistoryDetailedModal.vue'
import CheckHistoryTable from '@/components/CheckHistoryTable.vue'
import LoaderFullPage from '@/components/LoaderFullPage.vue'
import Pagination from 'v-pagination-3'
import {
  cilInfo,
  cilWarning,
  cilX,
  cilCheckCircle,
  cilBurn,
  cilStream,
  cilArrowLeft,
} from '@coreui/icons'
export default {
  components: {
    CheckHistoryDetailedModal,
    CheckHistoryTable,
    LoaderFullPage,
    Pagination,
  },
  data() {
    const dbData = {
      totalCount: 0,
      data: [],
    }
    const serviceData = {
      totalCount: 0,
      data: [],
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
    const errorData = {
      hasError: false,
      message: '',
    }
    const detailedHistory = {}
    const isCheckHistoryHasException = ref(false)
    const isDetailedHistoryModalActive = ref(false)
    const isPageLoading = false

    const currentPage = 1
    const perPageElementCount = 20
    const currentSort = 'startTime'
    const currentSortDir = 'desc'

    const icons = {
      cilInfo,
      cilWarning,
      cilX,
      cilCheckCircle,
      cilBurn,
      cilStream,
      cilArrowLeft,
    }
    return {
      icons,

      dbData,
      serviceData,
      thData,
      currentSort,
      currentSortDir,
      currentPage,
      perPageElementCount,
      detailedHistory,
      isCheckHistoryHasException,
      isDetailedHistoryModalActive,
      isPageLoading,
      errorData,
    }
  },
  computed: {
    dynamicSearchQuery() {
      return (offset) =>
        `${this.$store.state.testApi}/api/CheckRequest/CheckRequestHistories?serviceId=${this.$route.params.id}&from_date=2020-01-01%2000%3A00&to_date=2025-01-01%2000%3A00&limit=${this.perPageElementCount}&offset=${offset}`
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
    getDetailedHistory: function (id) {
      this.isDetailedHistoryModalActive = true
      this.detailedHistory = this.dbData.data.find((x) => x.id == id)
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
    pageSelected: function (pageId) {
      var offset = (pageId - 1) * this.perPageElementCount
      this.getDbData(offset)
    },
    getDbData: function (offset) {
      this.isPageLoading = true
      //console.log(this.dynamicSearchQuery(offset))
      fetch(this.dynamicSearchQuery(offset))
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Something went wrong')
        })
        .then((data) => {
          this.dbData = data
          console.log(this.dbData)
          this.isPageLoading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getServiceData: function () {
      fetch(
        `${this.$store.state.testApi}/api/Services/GetServices?ids=${this.$route.params.id}&offset=0&limit=1`,
      )
        .then((response) => response.json())
        .then((data) => {
          this.serviceData = data
          console.log(data)
        })
    },
  },
  beforeMount() {
    this.getDbData(0)
    this.getServiceData()
    console.log(this.$route.params.id)
  },
}
</script>
