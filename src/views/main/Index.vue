<template>
  <CRow class="w-75 m-auto d-flex align-items-center">
    <CCol class="col-md-4 col-12 m-auto py-2 position-relative">
      <CFormInput
        v-model="filterForm.GateServiceId"
        id="gateServiceId"
        type="text"
        placeholder="Filter by Gate Service Id"
        class="w-100 h-100"
        @keyup="filterElements"
        :class="{
          'border border-danger': !this.isServiceNameValid,
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
        :options="dbGroups.data"
        :limit="1"
        :multiple="false"
        :close-on-select="true"
        :clear-on-select="false"
        :preserve-search="true"
        label="name"
        track-by="name"
        :placeholder="'Select Group'"
        @select="filterSelectedGroup"
        @remove="filterRemovedGroup"
      />
    </CCol>
  </CRow>

  <CheckButtonsContainer
    :icons="icons"
    :dbData="dbData"
    :isSelectedAll="isSelectedAll"
    :isSelectedTableDataEmpty="isSelectedTableDataEmpty"
    @setConfirmCheckAllModalActive="isCheckAllConfirmModalActive = true"
    @clearSelectedMultipleData="clearSelectedMultipleData"
    @selectAllDataClick="selectAllDataClick"
    @checkSelected="checkSelected"
    @checkTopServices="checkTopServices"
  ></CheckButtonsContainer>

  <!-- <div
    style="height: 300px; overflow-x: hidden; overflow-y: auto"
    class="border border-dark p-2 fw-bold w-25"
  >
    <NestedGroups
      :value="nestedDbGroups.children"
      @filterGroup="filterSelectedGroup"
      @salam="hey"
    ></NestedGroups>
  </div> -->

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
        <CTableDataCell class="w-15 position-relative">
          <img
            v-if="item.topservicesid == 1"
            :src="Number1"
            style="width: 20px; position: absolute; top: -10px"
          />
          <img
            v-if="item.topservicesid == 2"
            :src="Number2"
            style="width: 20px; position: absolute; top: -10px"
          />
          <img
            v-if="item.topservicesid == 3"
            :src="Number3"
            style="width: 20px; position: absolute; top: -10px"
          />
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
            {{ item.gateServiceId }}
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
              :content="icons.cilMediaPlay"
              @click="checkElement(item.gateServiceId)"
              role="button"
              class="text-success"
            ></CIcon>
            <router-link
              :to="{
                name: 'HistoryById',
                params: {
                  id: item.gateServiceId,
                },
              }"
            >
              <CIcon
                :content="icons.cilHistory"
                role="button"
                class="text-warning d-block"
              ></CIcon>
            </router-link>
            <CIcon
              :content="icons.cilSettings"
              @click="getParameterList(item.gateServiceId)"
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
      :records="dbData.totalCount"
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
    @checkAll="GetCheckAllDataAndCheck"
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
  cilArrowBottom,
  cilApplications,
  cilLockLocked,
  cilLockUnlocked,
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
import Number1 from '@/assets/images/number-1.png'
import Number2 from '@/assets/images/number-2.png'
import Number3 from '@/assets/images/number-3.png'
//import NestedGroups from '@/components/NestedGroups.vue'
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
      { id: 1, title: 'Gate Service Id', sortBy: 'gateServiceId' },
      { id: 2, title: 'Name', sortBy: 'name' },
      { id: 3, title: 'Active', sortBy: 'active' },
      { id: 4, title: 'Operations', sortBy: null },
    ]
    const dbData = {
      data: [],
      totalCount: 0,
    }
    const dbGroups = {
      data: [],
      totalCount: 0,
    }
    const nestedDbGroups = { servicegroupid: 0, name: 'root', children: [] }
    const checkAllData = []
    const selectedTableData = []
    const selectedGroup = ref()
    const filterForm = ref({
      Name: '',
      GateServiceId: '',
    })
    const filteredIdArr = []
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
      cilArrowBottom,
      cilApplications,
      cilLockLocked,
      cilLockUnlocked,
    }

    return {
      Number1,
      Number2,
      Number3,
      dbGroups,
      nestedDbGroups,
      icons,
      currentSort,
      currentSortDir,

      thData,
      dbData,
      checkAllData,
      filterForm,
      filteredIdArr,
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
      return this.dbData.data.sort((a, b) => {
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
    GetCheckAllDataAndCheck: function () {
      fetch('http://localhost:84/api/Services/GetAllSimplifiedServices')
        .then((response) => response.json())
        .then((data) => this.checkAll(data))
    },
    checkElement: async function (gateServiceId) {
      this.isCheckModalActive = true
      this.currentlyCheckingElement = this.dbData.data.find(
        (n) => n.gateServiceId == gateServiceId,
      )
      this.currentlyCheckingElement.checkedElementStatus.success = false
      this.currentlyCheckingElement.checkedElementStatus.error = false
      this.currentlyCheckingElement.isLoading = true
      await fetch(
        `http://localhost:84/api/checkRequest/SingleCheck?PRV_ID=${gateServiceId}&userId=bcd4`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
        .then(async (response) => await response.json())
        .then(async (data) => {
          console.log(data)
          await this.checkAsync(data)
        })
    },
    checkAsync: async function (data) {
      console.log(data)
      if (data.resultCode == 0) {
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
        console.log(payload[i].gateServiceId + ' ' + payload[i].name)
        var tempData = {
          gateServiceId: payload[i].gateServiceId,
          name: payload[i].name,
          isLoading: true,
        }
        this.checkAllData.push(tempData)
        await fetch(
          `http://localhost:84/api/checkRequest/singlecheck?PRV_ID=${payload[i].gateServiceId}&userId=bcd4`,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          },
        )
          .then(async (response) => await response.json())
          .then((data) => {
            console.log(data)
            //try {
            var index = payload.findIndex(
              (x) => x.gateServiceId == payload[i].gateServiceId,
            )
            this.checkAllData[index] = {
              ...data,
              ...tempData,
              isShowInfoActive: false,
              isLoading: false,
              checkedElementStatus: {
                success: data.resultCode == 0 ? true : false,
                error: data.resultCode != 0 ? true : false,
              },
            }
            console.log(this.checkAllData[index])
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
        this.currentCheckingElementNumber = i + 1
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
    //       `http://localhost:84/api/checkRequest/singlecheck?PRV_ID=${this.dbData[counter].gateServiceId}`,
    //       {
    //         method: 'GET',
    //         headers: {
    //           'Content-type': 'application/json; charset=UTF-8',
    //         },
    //       },
    //     )
    //       .then(async (response) => await response.json())
    //       .then((data) => {
    //         console.log(this.dbData[counter].gateServiceId)
    //         console.log(data)
    //         try {
    //           var newData = {
    //             ...data,
    //             name: this.dbData[counter].name,
    //             isShowInfoActive: false,
    //             checkedElementStatus: {
    //               success: data.resultCode == 0 ? true : false,
    //               error: data.resultCode != 0 ? true : false,
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
            `http://localhost:84/api/checkRequest/singleCheck?PRV_ID=${this.selectedTableData[i].gateServiceId}&userId=bcd4`,
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

                if (data.resultCode == 0) {
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
      fetch(
        `http://localhost:84/api/Services/GetServices?offset=0&limit=${limit}`,
      )
        .then((response) => response.json())
        .then((data) => this.checkAll(this.createNewModelArray(data.services)))
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
      fetch(`http://localhost:84/api/services/getParametersList/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.parameterListOfElement.Id = id
          this.parameterListOfElement.Name = this.dbData.data.filter(
            (n) => n.gateServiceId == id,
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
      fetch('http://localhost:84/api/Services/UpdateParameter', configObject)
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
      if (isProxy(newParameter)) {
        var reqObject = toRaw(newParameter)
      }
      console.log(reqObject)
      const configObject = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify([reqObject]),
      }
      fetch(`http://localhost:84/api/Services/AddParameter`, configObject)
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

      fetch(`http://localhost:84/api/Services/RemoveParameter/${parameterId}`)
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
    filterElements: function () {
      var string = this.filterForm.GateServiceId.split('')
      var asd = this.removeSpaces(string)
      var stringWithoutSpace = string.join('').substring(0, asd)
      this.filteredIdArr = stringWithoutSpace.split(',')
      this.filteredIdArr = this.filteredIdArr.filter((v) => v != '')
      //console.log(strArr)
      //strArr = strArr.map(this.toNumber)

      // return dbData.filter((value) =>
      //   strArr.some((x) => value.gateServiceId.toString().includes(x)),
      // )

      console.log(this.checkFilter())
      fetch(this.checkFilter(), store.dispatch('fetchGetObject'))
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          this.dbData = data
          this.dbData.data = this.createNewModelArray(data.data)
          this.isPageLoading = false
        })
      // if (this.filterForm.GateServiceId == '') {
      //   return dbData
      // } else {
      //   return dbData.filter((element) => {
      //     return strArr.some((id) => {
      //       return element.gateServiceId.toString().includes(id)
      //     })
      //   })
      // }

      // return dbData.filter((n) =>
      //   n.gateServiceId.toString().includes(this.filterForm.GateServiceId),
      // )
    },
    filterElementsByName: function (dbData) {
      //contains
      return dbData.filter((n) =>
        n.name.toLowerCase().includes(this.filterForm.Name.toLowerCase()),
      )
    },
    checkFilter(offset) {
      if (typeof offset == 'undefined') offset = 0
      if (
        this.filterForm.GateServiceId != '' &&
        this.selectedGroup != null &&
        this.selectedGroup != null
      ) {
        var fetchUrl = `http://localhost:84/api/Services/GetServices?ids=${this.filteredIdArr.join(
          '&ids=',
        )}&groupId=${this.selectedGroup.id}&offset=${offset}&limit=${
          this.perPageElementCount
        }`
        return fetchUrl
      } else if (
        this.filterForm.GateServiceId != '' &&
        (this.selectedGroup == null || this.selectedGroup == null)
      ) {
        var fetchUrl = `http://localhost:84/api/Services/GetServices?ids=${this.filteredIdArr.join(
          '&ids=',
        )}&offset=${offset}&limit=${this.perPageElementCount}`
        return fetchUrl
      } else if (
        this.filterForm.GateServiceId == '' &&
        this.selectedGroup != null &&
        this.selectedGroup != null
      ) {
        var fetchUrl = `http://localhost:84/api/Services/GetServices?groupId=${this.selectedGroup.id}&offset=${offset}&limit=${this.perPageElementCount}`
        return fetchUrl
      } else if (
        this.filterForm.GateServiceId == '' &&
        this.selectedGroup == null &&
        this.selectedGroup == null
      ) {
        var fetchUrl = `http://localhost:84/api/Services/GetServices?offset=${offset}&limit=${this.perPageElementCount}`
        return fetchUrl
      }
    },
    filterSelectedGroup: function (data) {
      console.log(data)
      this.selectedGroup = data
      this.filterElements()
    },
    filterRemovedGroup: function () {
      this.selectedGroup = null
      console.log(this.selectedGroup)
      this.filterElements()
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
      // this.db = this.dbData.slice(
      //   (pageId - 1) * this.perPageElementCount,
      //   (pageId - 1) * this.perPageElementCount + this.perPageElementCount,
      // )
      this.isPageLoading = true
      var offset = (pageId - 1) * this.perPageElementCount
      console.log(this.checkFilter(offset))
      fetch(this.checkFilter(offset), store.dispatch('fetchGetObject'))
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          this.dbData = data.services
          this.totalElementCount = data.totalCount
          this.dbData = this.createNewModelArray(data.services)
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
        this.selectedTableData = this.dbData.data
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
    toNestedGroups: function (data, pid = 0) {
      return data.reduce((r, e) => {
        if (pid == e.parent) {
          const object = { ...e }
          const children = toNested(data, e.parentservicegroupid)

          if (children.length) {
            object.children = children
          }

          r.push(object)
        }

        return r
      }, [])
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
    console.log(
      `http://localhost:84/api/Services/GetServices?offset=0&limit=${this.perPageElementCount}`,
    )
    fetch(
      `http://localhost:84/api/Services/GetServices?offset=0&limit=${this.perPageElementCount}`,
      store.dispatch('fetchGetObject'),
    )
      .then((response) => response.json())
      .then((data) => {
        this.dbData = data
        this.dbData.data = this.createNewModelArray(data.data)
        console.log(data)
        this.isPageLoading = false
      })
    fetch('http://localhost:84/api/Services/GetGroups')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.dbGroups.data = data.data.map((obj) => {
          if (obj.parentservicegroupid == null) {
            obj.parentservicegroupid = 0
          }
          return obj
        })

        // this.nestedDbGroups = { servicegroupid: 0, name: 'root', children: [] }

        // const addChild = (obj, parent) => {
        //   if (obj.parentservicegroupid === parent.servicegroupid) {
        //     parent.children.push({ ...obj, children: [] })
        //   } else {
        //     parent.children.forEach((item) => addChild(obj, item))
        //   }
        // }
        // const buildTree = (arr) =>
        //   arr.forEach((obj) => addChild(obj, this.nestedDbGroups))

        // buildTree(this.dbGroups)
        // console.log(this.nestedDbGroups)
      })
    // fetch('http://localhost:84/api/services/getgroups', {
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
