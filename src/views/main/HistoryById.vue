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

  <LoaderFullPage :isLoading="isPageLoading"></LoaderFullPage>
</template>
<script>
import { ref } from 'vue'
import CheckHistoryDetailedModal from '@/components/CheckHistoryDetailedModal.vue'
import CheckHistoryTable from '@/components/CheckHistoryTable.vue'
import LoaderFullPage from '@/components/LoaderFullPage.vue'
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
  },
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
    const isPageLoading = ref(false)

    const currentSort = 'start_time'
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

      searchWarning,
      detailedHistory,
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
        `http://localhost:8081/api/CheckRequest/CheckRequestHistories/${this.$route.params.id}`,
      )
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data
          this.createNewModel(this.dbData)
          console.log(this.dbData)
          this.isPageLoading = false
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
