<template>
  <!--check history multiple input array-->
  <CRow class="w-75 m-auto">
    <CCol class="col-md-4 col-12 m-auto py-2 position-relative">
      <CFormInput
        v-model="filterForm.GateServiceId"
        id="gate_service_id"
        type="text"
        placeholder="Filter by Gate Service Id"
        class="w-100 h-100"
        @keyup="filterElementsByGateServiceId"
        :class="{
          'border border-danger': !this.isServiceNameValid,
          'border border-success': this.isServiceNameValid,
        }"
      />
      <p
        v-if="!this.isServiceNameValid"
        class="border border-dark text-danger position-absolute top-100"
      >
        Please enter correct input
      </p>
    </CCol>
    <CCol class="col-md-4 col-12 m-auto py-2">
      <CFormInput
        v-model="filterForm.Name"
        id="name"
        type="text"
        placeholder="Filter by Name"
        class="w-100 h-100"
      />
    </CCol>
    <CCol class="col-md-4 col-12 m-auto py-2">
      <VueMultiselect
        v-model="selectedGroup"
        :options="dbGroups"
        :limit="1"
        :multiple="false"
        :close-on-select="true"
        :clear-on-select="false"
        :preserve-search="true"
        label="name"
        track-by="name"
        :placeholder="'Select Group'"
        @select="filterSelectedGroup"
      />
    </CCol>
  </CRow>

  <CheckButtonsContainer
    :icons="icons"
    :dbData="dbData"
    :isSelectedAll="isSelectedAll"
    @setConfirmCheckAllModalActive="isCheckAllConfirmModalActive = true"
    @clearSelectedMultipleData="clearSelectedMultipleData"
    @selectAllDataClick="selectAllDataClick"
    @checkSelected="checkSelected"
    @checkTopServices="checkTopServices"
  ></CheckButtonsContainer>

  <CTable responsive striped small hover>
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
    <CTableBody>
      <CTableRow align="middle" v-for="item in filteredElements" :key="item.id">
        <CTableDataCell class="w-15">
          <label class="form-check-label py-3">
            <input
              type="checkbox"
              class="form-check-input"
              :value="item"
              v-model="selectedTableData"
              @click="selectTableData(item)"
            />
          </label>
        </CTableDataCell>
        <CTableDataCell>
          <span style="width: 100px; overflow: hidden">
            {{ item.gate_service_id }}
          </span>
        </CTableDataCell>
        <CTableDataCell class="w-25">
          <span style="display: block; overflow: hidden; font-size: 12px">
            {{ item.name }}
          </span>
        </CTableDataCell>
        <CTableDataCell class="w-25">
          <span
            :class="{ 'bg-success': item.active, 'bg-danger': !item.active }"
            style="display: block; overflow: hidden; font-size: 12px"
            class="w-25 text-center text-light rounded"
          >
            {{ item.active }}
          </span>
        </CTableDataCell>
        <CTableDataCell class="w-25">
          <div class="w-50 d-flex justify-content-between pt-1">
            <CIcon
              v-c-tooltip="{
                content: 'Check this element',
                placement: 'top',
              }"
              :content="icons.cilMediaPlay"
              @click="checkElement(item.gate_service_id)"
              role="button"
              class="text-success"
            ></CIcon>
            <router-link
              :to="{
                name: 'HistoryById',
                params: {
                  id: item.gate_service_id,
                },
              }"
            >
              <CIcon
                v-c-tooltip="{
                  content: 'History of this element',
                  placement: 'top',
                }"
                :content="icons.cilHistory"
                role="button"
                class="text-warning d-block"
              ></CIcon>
            </router-link>
            <CIcon
              v-c-tooltip="{
                content: 'Settings of this element',
                placement: 'top',
              }"
              :content="icons.cilSettings"
              @click="getParameterList(item.gate_service_id)"
              role="button"
              class="text-dark"
            ></CIcon>
          </div>
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>

  <div class="d-flex justify-content-center text-center pt-3">
    <pagination
      v-model="currentPage"
      :records="totalElementCount"
      :per-page="perPageElementCount"
      @paginate="pageSelected"
      :options="{ chunk: 8 }"
    />
  </div>

  <SettingsModal
    :isActive="isSettingsModalActive"
    :isLoading="isParameterLoading"
    :icons="icons"
    :parameterListOfElement="parameterListOfElement"
    :parameterChangeData="parameterChangeData"
    :isInputFocused="isParameterInputFocused"
    :isAddActive="isAddParameterActive"
    @changeActiveState="changeModalActiveState"
    @changeAddActiveState="
      this.isAddParameterActive = !this.isAddParameterActive
    "
    @paramInputFocused="parameterInputFocused"
    @removeParameterOfElement="removeParameter"
    @editParameter="editParametersOfElement"
    @addNewParameter="addNewParameterToService"
  ></SettingsModal>

  <CheckModal
    :isActive="isCheckModalActive"
    :currentElement="currentlyCheckingElement"
    @changeActiveState="changeModalActiveState"
  ></CheckModal>

  <CheckResultModal
    :isActive="isCheckResultActive"
    :data="currentlyCheckingElement.data"
    @changeActiveState="changeModalActiveState"
  ></CheckResultModal>

  <CheckAllConfirmModal
    :isActive="isCheckAllConfirmModalActive"
    @changeActiveState="changeModalActiveState"
    @checkAll="checkAll(this.dbData)"
  ></CheckAllConfirmModal>

  <CheckSelectedModal
    :checkData="selectedTableData"
    :isActive="isCheckSelectedModalActive"
    :icons="icons"
    @changeActiveState="changeModalActiveState"
    @getCheckInfo="showCheckInfo"
    @closeCheckInfoModal="changeModalActiveState"
  ></CheckSelectedModal>

  <CheckAllModal
    v-if="isCheckAllModalActive"
    ref="CheckAllModal"
    :checkData="checkAllData"
    :isActive="isCheckAllModalActive"
    :isMinimized="isCheckAllModalMinimized"
    :isStopped="isCheckAllLoadingStopped"
    :icons="icons"
    :currentCheckingElementNumber="currentCheckingElementNumber"
    :elementsLastForCheck="elementsLastForCheck"
    :allElementsCountForCheck="allElementsCountForCheck"
    :checkTimeElapsed="checkTimeElapsed"
    @changeActiveState="changeModalActiveState"
    @maximizeModal="maximizeCheckAllModal"
    @minimizeModal="minimizeCheckAllModal"
    @stopCheckAll="this.isCheckAllLoadingStopped = true"
    @getCheckInfo="showCheckInfo"
    @closeCheckInfoModal="changeModalActiveState"
  ></CheckAllModal>

  <LoaderFullPage :isLoading="isPageLoading"></LoaderFullPage>
</template>
<style>
.check-MultipleInfoActive {
  position: fixed;
  top: 15%;
  left: 25%;
  right: 25%;
  bottom: 10%;
  z-index: 9999;
  animation-name: boxEnter;
  animation-duration: 0.5s;
}
.check-MultipleInfoHidden {
  position: fixed;
  top: 10%;
  left: 125%;
  right: 25%;
  bottom: 10%;
  opacity: 0;
  animation-name: boxLeave;
  animation-duration: 0.5s;
}
@keyframes boxEnter {
  0% {
    left: 125%;
  }
  100% {
    left: 25%;
  }
}
@keyframes boxLeave {
  0% {
    left: 25%;
  }
  100% {
    left: 125%;
  }
}
</style>
<script>
import { ref, isProxy, toRaw } from 'vue'
import store from '@/store/index'
import {
  cilSettings,
  cilMediaPlay,
  cilHistory,
  cilTrash,
  cilX,
  cilInfo,
  cilWindowMinimize,
  cilWindowMaximize,
  cilDataTransferDown,
  cilArrowLeft,
  cilApplications,
} from '@coreui/icons'

import Pagination from 'v-pagination-3'
import CheckButtonsContainer from '@/components/CheckButtonsContainer.vue'
import CheckAllConfirmModal from '@/components/CheckAllConfirmModal.vue'
import CheckAllModal from '@/components/CheckAllModal.vue'
import CheckSelectedModal from '@/components/CheckSelectedModal.vue'
import CheckResultModal from '@/components/CheckResultModal.vue'
import CheckModal from '@/components/CheckModal.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import LoaderFullPage from '@/components/LoaderFullPage.vue'
import 'vue-multiselect/dist/vue-multiselect.css'
import VueMultiselect from 'vue-multiselect'

export default {
  components: {
    Pagination,
    CheckButtonsContainer,
    CheckAllConfirmModal,
    CheckAllModal,
    CheckSelectedModal,
    CheckResultModal,
    CheckModal,
    SettingsModal,
    LoaderFullPage,
    VueMultiselect,
  },
  name: 'Index',
  setup() {},
  data() {
    const thData = [
      { id: 0, title: '', sortBy: null },
      { id: 1, title: 'Gate Service Id', sortBy: 'id' },
      { id: 2, title: 'Name', sortBy: 'name' },
      { id: 3, title: 'Active', sortBy: 'active' },
      { id: 4, title: 'Operations', sortBy: null },
    ]
    const dbData = []
    const dbGroups = [
      {
        id: 1,
        name: 'Araz',
      },
      {
        id: 2,
        name: 'Kapital',
      },
      {
        id: 3,
        name: 'Bravo',
      },
    ]
    const checkAllData = []
    const selectedTableData = []
    const selectedGroup = ref()
    const filterForm = ref({
      Name: '',
      GateServiceId: '',
    })
    const parameterListOfElement = []
    const parameterChangeData = {
      isSuccess: false,
      data: null,
    }
    const currentlyCheckingElement = {
      name: null,
      data: null,
      checkedElementStatus: {
        success: false,
        error: false,
      },
    }
    const totalElementCount = 0
    const perPageElementCount = 10
    const currentPage = 1
    const currentSort = 'topservicesid'
    const currentSortDir = 'asc'

    const currentCheckingElementNumber = ref(0)
    const elementsLastForCheck = ref(0)
    const allElementsCountForCheck = ref(0)
    const checkTimeInterval = ref()
    const checkTimeElapsed = {
      seconds: 0,
      minutes: 0,
    }

    const isServiceNameValid = ref(true)
    const isCheckModalActive = ref(false)
    const isCheckResultActive = ref(false)
    const isSettingsModalActive = ref(false)
    const isCheckAllModalActive = ref(false)
    const isCheckInfoModalActive = ref(false)
    const isCheckAllConfirmModalActive = ref(false)
    const isSelectedAll = ref(false)
    const isCheckAllLoadingStopped = ref(false)
    const isModalLoading = ref(false)
    const isParameterLoading = ref(false)
    const isParameterInputFocused = ref(false)
    const isAddParameterActive = false
    const isCheckAllModalMinimized = ref(false)
    const isCheckSelectedModalActive = ref(false)
    const isPageLoading = ref(false)
    const icons = {
      cilSettings,
      cilMediaPlay,
      cilHistory,
      cilTrash,
      cilX,
      cilInfo,
      cilWindowMinimize,
      cilWindowMaximize,
      cilDataTransferDown,
      cilArrowLeft,
      cilApplications,
    }

    return {
      dbGroups,
      icons,
      currentSort,
      currentSortDir,

      thData,
      dbData,
      checkAllData,
      filterForm,
      parameterListOfElement,
      parameterChangeData,
      selectedTableData,
      selectedGroup,
      currentlyCheckingElement,

      currentCheckingElementNumber,
      elementsLastForCheck,
      allElementsCountForCheck,
      checkTimeElapsed,
      checkTimeInterval,

      currentPage,
      perPageElementCount,
      totalElementCount,

      isServiceNameValid,
      isCheckModalActive,
      isCheckResultActive,
      isCheckAllLoadingStopped,
      isSettingsModalActive,
      isCheckAllModalActive,
      isCheckAllConfirmModalActive,
      isCheckSelectedModalActive,
      isCheckInfoModalActive,
      isCheckAllModalMinimized,
      isModalLoading,
      isParameterLoading,
      isParameterInputFocused,
      isAddParameterActive,
      isPageLoading,
      isSelectedAll,

      checkAllInterval: null,
    }
  },
  computed: {
    filteredElements: function () {
      return this.filterElementsByName(this.sortedSearchResults)
    },
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
    isSelectedTableDataEmpty: ({ selectedTableData }) =>
      selectedTableData.length === 0,
  },
  methods: {
    checkElement: async function (gate_service_id) {
      this.isCheckModalActive = true
      this.currentlyCheckingElement = this.dbData.filter(
        (n) => n.gate_service_id == gate_service_id,
      )[0]
      this.currentlyCheckingElement.checkedElementStatus.success = false
      this.currentlyCheckingElement.checkedElementStatus.error = false
      this.currentlyCheckingElement.isLoading = true
      await fetch(
        `http://localhost:8081/api/checkRequest/SingleCheck?PRV_ID=${gate_service_id}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
        .then(async (response) => await response.json())
        .then(async (data) => {
          await this.checkAsync(data)
        })
    },
    checkAsync: async function (data) {
      console.log(data)
      if (data.resultcodeid == 0) {
        this.currentlyCheckingElement.checkedElementStatus.success = true
      } else {
        this.currentlyCheckingElement.checkedElementStatus.error = true
      }
      this.currentlyCheckingElement.data = data
      this.isCheckModalActive = false
      this.isCheckResultActive = true
      this.currentlyCheckingElement.isLoading = false
    },
    checkTimeHandler: function () {
      if (!this.isCheckAllLoadingStopped) {
        this.checkTimeElapsed.seconds++
        if (this.checkTimeElapsed.seconds == 60) {
          this.checkTimeElapsed.seconds = 0
          this.checkTimeElapsed.minutes++
        }
        // if (this.checkTimeElapsed.minutes == 60) {
        //   this.checkTimeElapsed.minutes == 0
        // }
        // console.log(
        //   (this.checkTimeElapsed.minutes < 10
        //     ? '0' + this.checkTimeElapsed.minutes
        //     : this.checkTimeElapsed.minutes) +
        //     ':' +
        //     (this.checkTimeElapsed.seconds < 10
        //       ? '0' + this.checkTimeElapsed.seconds
        //       : this.checkTimeElapsed.seconds),
        // )
      }
    },
    resetCheckTimeHandler: function () {
      this.checkTimeElapsed.minutes = 0
      this.checkTimeElapsed.seconds = 0
      clearInterval(this.checkTimeInterval)
    },
    checkAll: async function (payload) {
      console.log(payload)
      this.isCheckAllModalActive = true
      this.isCheckAllModalMinimized = false
      this.isCheckAllLoadingStopped = false
      this.isCheckAllConfirmModalActive = false
      this.checkAllData = []
      this.allElementsCountForCheck = payload.length

      this.resetCheckTimeHandler()
      this.checkTimeInterval = setInterval(this.checkTimeHandler, 1000)
      this.checkTimeHandler()

      for (let i = 0; i < payload.length; i++) {
        console.log(payload[i].gate_service_id + ' ' + payload[i].name)
        await fetch(
          `http://localhost:8081/api/checkRequest/singlecheck?PRV_ID=${payload[i].gate_service_id}`,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          },
        )
          .then(async (response) => await response.json())
          .then((data) => {
            //try {
            var newData = {
              ...data,
              name: payload[i].name,
              isShowInfoActive: false,
              checkedElementStatus: {
                success: data.resultcodeid == 0 ? true : false,
                error: data.resultcodeid != 0 ? true : false,
              },
            }
            this.checkAllData.push(newData)
            if (this.checkAllData.length > 10) {
              console.log(this.$refs.CheckAllModal.getScrollTop())
            }

            this.$refs.CheckAllModal.handleScroll()

            this.elementsLastForCheck = payload.length - i
            // } catch {
            //   this.isCheckAllLoadingStopped = true
            //   alert('Something went wrong with request , please check again...')
            //   this.checkAllData[i].checkedElementStatus.error = true
            // }
          })
        if (!this.isCheckAllModalActive) {
          break
        }
        if (this.isCheckAllLoadingStopped) {
          break
        }
        if (i == payload.length - 1) {
          break
        }
        this.currentCheckingElementNumber = i
        //console.log(this.$refs.container.scrollY)
      }
    },

    // checkAll: async function () {
    //   this.isCheckAllModalActive = true
    //   this.isCheckAllModalMinimized = false
    //   this.isCheckAllLoadingStopped = false
    //   this.isCheckAllConfirmModalActive = false
    //   this.checkAllData = []
    //   this.allElementsCountForCheck = this.dbData.length

    //   this.resetCheckTimeHandler()
    //   this.checkTimeInterval = setInterval(this.checkTimeHandler, 1000)
    //   this.checkTimeHandler()

    //   var counter = 0
    //   var checkAllInterval = setInterval(async () => {
    //     fetch(
    //       `http://localhost:8081/api/checkRequest/singlecheck?PRV_ID=${this.dbData[counter].gate_service_id}`,
    //       {
    //         method: 'GET',
    //         headers: {
    //           'Content-type': 'application/json; charset=UTF-8',
    //         },
    //       },
    //     )
    //       .then(async (response) => await response.json())
    //       .then((data) => {
    //         console.log(this.dbData[counter].gate_service_id)
    //         console.log(data)
    //         try {
    //           var newData = {
    //             ...data,
    //             name: this.dbData[counter].name,
    //             isShowInfoActive: false,
    //             checkedElementStatus: {
    //               success: data.resultcodeid == 0 ? true : false,
    //               error: data.resultcodeid != 0 ? true : false,
    //             },
    //           }
    //           this.checkAllData.push(newData)

    //           //console.log(newData)
    //           //console.log(tempData[0])
    //           // if (this.checkAllData.length > 10) {
    //           //   console.log(this.$refs.CheckAllModal.getScrollTop())
    //           // }
    //           this.$refs.CheckAllModal.handleScroll()

    //           this.elementsLastForCheck = this.dbData.length - counter
    //         } catch (error) {
    //           // this.isCheckAllLoadingStopped = true
    //           // alert('Something went wrong with request , please check again...')
    //           console.error(error)
    //           //this.checkAllData[i].checkedElementStatus.error = true
    //         }
    //         counter++
    //       })
    //       console.log(this.dbData.length)
    //     if (counter == this.dbData.length) {
    //       clearInterval(checkAllInterval)
    //     }
    //   }, 2000)

    //   for (let i = 0; i < 15; i++) {
    //     if (!this.isCheckAllModalActive) {
    //       break
    //     }
    //     if (this.isCheckAllLoadingStopped) {
    //       break
    //     }
    //     this.currentCheckingElementNumber = i
    //     //console.log(this.$refs.container.scrollY)
    //   }
    // },

    checkSelected: async function () {
      if (this.selectedTableData.length <= 1) {
        alert('Please select at least 2 element...')
      } else {
        this.isCheckSelectedModalActive = true
        for (let i = 0; i < this.selectedTableData.length; i++) {
          this.selectedTableData[i].isLoading = true
        }
        for (let i = 0; i < this.selectedTableData.length; i++) {
          await fetch(
            `http://localhost:8081/api/checkRequest/singleCheck?PRV_ID=${this.selectedTableData[i].gate_service_id}`,
            {
              method: 'GET',
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            },
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data)
              try {
                this.selectedTableData[i].checkData = data

                if (data.resultcodeid == 0) {
                  this.selectedTableData[i].checkedElementStatus.success = true
                  this.selectedTableData[i].checkedElementStatus.error = false
                } else {
                  this.selectedTableData[i].checkedElementStatus.error = true
                  this.selectedTableData[i].checkedElementStatus.success = false
                }
                this.selectedTableData[i].isLoading = false
              } catch {
                console.log(
                  'Something went wrong with request , please check again...',
                )
              }
            })
          if (!this.isCheckSelectedModalActive) {
            break
          }
          console.log(this.selectedTableData[i])
        }
      }
    },
    checkTopServices: function (limit) {
      fetch(`http://localhost:8081/api/services/GetTopServices?limit=${limit}`)
        .then((response) => response.json())
        .then((data) => {
          this.checkAll(this.createNewModelArray(data))
        })
    },
    showCheckInfo: function (id, modalName) {
      console.log(id)
      if (modalName == 'checkSelected') {
        for (var i = 0; i < this.selectedTableData.length; i++) {
          if (this.selectedTableData[i].id != id) {
            this.selectedTableData[i].isShowInfoActive = false
          }
        }
        this.selectedTableData.find((x) => x.id == id).isShowInfoActive =
          !this.selectedTableData.find((x) => x.id == id).isShowInfoActive
        console.log(this.selectedTableData.find((x) => x.id == id))
      }
      if (modalName == 'checkAll') {
        for (var i = 0; i < this.checkAllData.length; i++) {
          if (this.checkAllData[i].id != id) {
            this.checkAllData[i].isShowInfoActive = false
          }
        }
        this.checkAllData.find((x) => x.id == id).isShowInfoActive =
          !this.checkAllData.find((x) => x.id == id).isShowInfoActive
        console.log(this.checkAllData)
      }
    },
    minimizeCheckAllModal: function () {
      this.isCheckAllModalMinimized = true
    },
    maximizeCheckAllModal: function () {
      this.isCheckAllModalMinimized = false
    },
    getParameterList: function (id) {
      this.isParameterLoading = true
      this.isSettingsModalActive = true
      fetch(`http://localhost:8081/api/services/getParametersList/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.parameterListOfElement.Id = id
          this.parameterListOfElement.Name = this.dbData.filter(
            (n) => n.gate_service_id == id,
          )[0].name
          this.parameterListOfElement.parameterList = data

          this.isParameterLoading = false
          console.log(data)
        })
    },
    editParametersOfElement: function (id) {
      this.isParameterInputFocused = false
      if (isProxy(this.parameterListOfElement.parameterList)) {
        var reqObject = toRaw(this.parameterListOfElement.parameterList)
      }
      const configObject = {
        method: 'Post',
        body: JSON.stringify(reqObject),
        headers: {
          'Content-type': 'application/json',
        },
      }
      fetch('http://localhost:8081/api/Services/UpdateParameter', configObject)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            this.isSettingsModalActive = false
            this.parameterChangeData.message =
              'Parameter has been changed successfully!'
            this.parameterChangeData.isSuccess = true
            this.getParameterList(id)
          } else {
            this.parameterChangeData.message = 'Something went wrong...'
            this.parameterChangeData.isSuccess = false
          }
        })

      this.setNewParameterNull()
    },
    addNewParameterToService: function (id, newParameter) {
      this.isParameterInputFocused = false
      newParameter.serviceid = id
      if (isProxy(newParameter)) {
        var reqObject = toRaw(newParameter)
      }
      const configObject = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqObject),
      }
      fetch(`http://localhost:8081/api/Services/AddParameter`, configObject)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data) {
            this.setNewParameterNull()
            this.isParameterInputFocused = false
            this.isSettingsModalActive = false
            this.parameterChangeData.message =
              'Parameter has been added succesfully'
            this.parameterChangeData.isSuccess = true
            this.isAddParameterActive = false
            this.getParameterList(id)
          } else {
            this.parameterChangeData.message = 'Something went wrong...'
            this.parameterChangeData.isSuccess = false
          }
        })
    },
    removeParameter: function (serviceId, parameterId) {
      this.isParameterInputFocused = false
      const configObject = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
      fetch(
        `http://localhost:8081/api/Services/RemoveParameter/${parameterId}`,
        configObject,
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data) {
            this.isSettingsModalActive = false
            this.parameterChangeData.message =
              'Parameter has been removed succesfully'
            this.parameterChangeData.isSuccess = true
            this.getParameterList(serviceId)
          } else {
            this.parameterChangeData.message = 'Something went wrong...'
            this.parameterChangeData.isSuccess = false
          }
        })
    },
    changeModalActiveState: function (modalName) {
      switch (modalName) {
        case 'check':
          this.currentlyCheckingElement.checkedElementStatus.success = false
          this.currentlyCheckingElement.checkedElementStatus.error = false
          for (let i = 0; i < this.dbData.length; i++) {
            this.dbData[i].checkedElementStatus.success = false
            this.dbData[i].checkedElementStatus.error = false
          }
          this.isCheckModalActive = false
          this.isCheckAllModalActive = false
          break
        case 'checkAllConfirm':
          this.isCheckAllConfirmModalActive = false
          break
        case 'checkAll':
          this.isCheckAllLoadingStopped = true
          for (let i = 0; i < this.dbData.length; i++) {
            this.dbData[i].checkedElementStatus.success = false
            this.dbData[i].checkedElementStatus.error = false
          }
          this.checkAllData = []
          this.isCheckAllModalActive = false
          this.resetCheckTimeHandler()
          break
        case 'checkSelected':
          this.isCheckAllLoadingStopped = true
          for (let i = 0; i < this.selectedTableData.length; i++) {
            this.selectedTableData[i].checkedElementStatus.success = false
            this.selectedTableData[i].checkedElementStatus.error = false
            this.selectedTableData[i].isShowInfoActive = false
          }
          this.isCheckSelectedModalActive = false
          break
        case 'checkInfoCheckAll':
          for (var i = 0; i < this.checkAllData.length; i++) {
            this.checkAllData[i].isShowInfoActive = false
          }
          break
        case 'checkInfoCheckSelected':
          for (var i = 0; i < this.selectedTableData.length; i++) {
            this.selectedTableData[i].isShowInfoActive = false
          }
          break
        case 'settings':
          this.isSettingsModalActive = false
          this.isAddParameterActive = false
          this.parameterChangeData = {
            isSuccess: false,
            message: null,
          }
          break
        case 'checkResult':
          this.currentlyCheckingElement.checkedElementStatus.success = false
          this.currentlyCheckingElement.checkedElementStatus.error = false
          for (let i = 0; i < this.dbData.length; i++) {
            this.dbData[i].checkedElementStatus.success = false
            this.dbData[i].checkedElementStatus.error = false
          }
          this.isCheckResultActive = false
          this.currentlyCheckingElement.data = null
          break
      }
    },
    selectTableData: function (element) {
      if (!this.selectedTableData.includes(element)) {
        this.selectedTableData.push(element)
      } else {
        this.selectedTableData.splice(
          this.selectedTableData.indexOf(element),
          1,
        )
      }
    },
    filterElementsByGateServiceId: function () {
      var string = this.filterForm.GateServiceId.split('')
      var asd = this.removeSpaces(string)
      var stringWithoutSpace = string.join('').substring(0, asd)
      var strArr = stringWithoutSpace.split(',')
      strArr = strArr.filter((v) => v != '')
      //console.log(strArr)
      //strArr = strArr.map(this.toNumber)

      // return dbData.filter((value) =>
      //   strArr.some((x) => value.gate_service_id.toString().includes(x)),
      // )

      if (this.filterForm.GateServiceId == '') {
        console.log(
          'http://localhost:8081/api/Services/GetServices?offset=0&limit=10',
        )
        fetch(
          'http://localhost:8081/api/Services/GetServices?offset=0&limit=10',
          store.dispatch('fetchGetObject'),
        )
          .then((response) => response.json())
          .then((data) => {
            this.dbData = data.services
            this.totalElementCount = data.totalCount
            this.dbData = this.createNewModelArray(data.services)
            console.log(data)
            this.isPageLoading = false
          })
      } else {
        console.log(
          `http://localhost:8081/api/services/FilterServiceById?ids=${strArr.join(
            '&ids=',
          )}`,
        )
        fetch(
          `http://localhost:8081/api/services/FilterServiceById?ids=${strArr.join(
            '&ids=',
          )}`,
        )
          .then((response) => response.json())
          .then((data) => {
            this.dbData = data.services
            this.totalElementCount = data.totalCount
            this.dbData = this.createNewModelArray(data.services)
            console.log(data)
          })
      }
      // if (this.filterForm.GateServiceId == '') {
      //   return dbData
      // } else {
      //   return dbData.filter((element) => {
      //     return strArr.some((id) => {
      //       return element.gate_service_id.toString().includes(id)
      //     })
      //   })
      // }

      // return dbData.filter((n) =>
      //   n.gate_service_id.toString().includes(this.filterForm.GateServiceId),
      // )
    },
    filterElementsByName: function (dbData) {
      //contains
      return dbData.filter((n) =>
        n.name.toLowerCase().includes(this.filterForm.Name.toLowerCase()),
      )
    },
    filterSelectedGroup: function (data) {
      this.isPageLoading = true
      fetch(
        `http://localhost:8081/api/Services/GetServices?groupId=${data.servicegroupid}`,
      )
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data.services
          this.totalElementCount = data.totalCount
          this.dbData = this.createNewModelArray(data.services)
          this.isPageLoading = false
        })
    },
    setNewParameterNull: function () {
      this.newParameter = {
        id: 1,
        active: true,
        serviceid: null,
        name: null,
        value: null,
      }
    },
    pageSelected: function (pageId) {
      console.log(pageId)
      // this.db = this.dbData.slice(
      //   (pageId - 1) * this.perPageElementCount,
      //   (pageId - 1) * this.perPageElementCount + this.perPageElementCount,
      // )
      this.isPageLoading = true
      fetch(
        `http://localhost:8081/api/Services/GetServices?offset=${
          (pageId - 1) * this.perPageElementCount
        }&limit=${this.perPageElementCount}`,
        store.dispatch('fetchGetObject'),
      )
        .then((response) => response.json())
        .then((data) => {
          this.dbData = data.services
          this.totalElementCount = data.totalCount
          this.dbData = this.createNewModelArray(data.services)
          console.log(data)
          this.isPageLoading = false
        })
      console.log(
        (pageId - 1) * this.perPageElementCount,
        (pageId - 1) * this.perPageElementCount + this.perPageElementCount,
      )
    },
    clearSelectedMultipleData: function () {
      this.selectedTableData = []
      this.isSelectedAll = false
    },
    selectAllDataClick: function () {
      if (this.isSelectedAll == false) {
        this.isSelectedAll = true
        this.selectedTableData = this.dbData
      } else {
        this.isSelectedAll = false
        this.selectedTableData = []
      }
    },
    sort: function (sortDir) {
      //if sortDir == current sort, reverse
      if (sortDir === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = sortDir
    },
    parameterInputFocused: function () {
      this.isParameterInputFocused = true
      console.log(this.isParameterInputFocused)
    },
    removeSpaces: function (str) {
      var count = 0
      for (var i = 0; i < str.length; i++) {
        if (str[i] != ' ') str[count++] = str[i]
      }
      return count
    },
    toNumber: function (value) {
      return Number(value)
    },
    createNewModelArray: function (data) {
      return data.map((obj) => ({
        ...obj,
        isLoading: false,
        checkedElementStatus: { success: false, error: false },
        isShowInfoActive: false,
        checkData: null,
      }))
    },
  },
  beforeMount() {
    this.isPageLoading = true
    fetch(
      `http://localhost:8081/api/Services/GetServices?offset=0&limit=${this.perPageElementCount}`,
      store.dispatch('fetchGetObject'),
    )
      .then((response) => response.json())
      .then((data) => {
        this.dbData = data.services
        this.totalElementCount = data.totalCount
        this.dbData = this.createNewModelArray(data.services)
        console.log(data)
        this.isPageLoading = false
      })
    fetch('http://localhost:8081/api/Services/GetGroups')
      .then((response) => response.json())
      .then((data) => {
        this.dbGroups = data
      })
    // fetch('http://localhost:8081/api/services/getgroups', {
    //   method: 'Get',
    //   headers: {
    //     'Content-type': 'application/json;charset=UTF-8',
    //   },
    // })
    //   .then((response) => response.json)
    //   .then((data) => console.log(data))
  },
}
</script>
