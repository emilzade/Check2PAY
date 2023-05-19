<template>
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
    const thData = [
      { id: 1, title: 'Service Id', sortBy: 'gateServiceId' },
      { id: 1, title: 'Name', sortBy: 'serviceName' },
      { id: 2, title: 'Start Date', sortBy: 'startTime' },
      { id: 3, title: 'User Id', sortBy: 'appUserId' },
      { id: 6, title: 'Result', sortBy: 'resultCode' },
      { id: 6, title: 'Partition Nº', sortBy: 'partitionNumber' },
      { id: 7, title: 'Operations', sortBy: null },
    ]
    const searchWarning = {
      isActive: false,
      data: null,
    }
    const detailedHistory = {}
    const isCheckHistoryHasException = ref(false)
    const isDetailedHistoryModalActive = ref(false)
    const isPageLoading = ref(false)

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
    }
    return {
      icons,

      dbData,
      thData,
      currentSort,
      currentSortDir,
      currentPage,
      perPageElementCount,
      searchWarning,
      detailedHistory,
      isCheckHistoryHasException,
      isDetailedHistoryModalActive,
      isPageLoading,
    }
  },
  computed: {
    dynamicSearchQuery() {
      return (offset) =>
        `https://localhost:5006/api/CheckRequest/CheckRequestHistories?serviceId=${this.$route.params.id}&from_date=2020-01-01%2000%3A00&to_date=2025-01-01%2000%3A00&offset=${offset}&limit=${this.perPageElementCount}`
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
      console.log(this.dynamicSearchQuery(offset))
      fetch(this.dynamicSearchQuery(offset))
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          console.log(this.dbData)
          this.isPageLoading = false
        })
    },
  },
  beforeMount() {
    this.getDbData(0)
  },
}
</script>
