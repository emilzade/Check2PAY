<template>
  <!--
  stop scroll when manual scroll
  -->
  <CRow class="w-50 m-auto">
    <CCol class="col-md-6 col-12 m-auto py-2">
      <CFormInput
        v-model="filterForm.GateServiceId"
        id="gate_service_id"
        type="text"
        placeholder="Filter by Gate Service Id"
        class="w-100 h-100"
      />
    </CCol>
    <CCol class="col-md-6 col-12 m-auto py-2">
      <CFormInput
        v-model="filterForm.Name"
        id="name"
        type="text"
        placeholder="Filter by Name"
        class="w-100 h-100"
      />
    </CCol>
  </CRow>

  <CheckButtonsContainer
    :icons="icons"
    :isSelectMultipleTableDataActive="isSelectMultipleTableDataActive"
    :dbData="dbData"
    @setConfirmCheckAllModalActive="isCheckAllConfirmModalActive = true"
    @selectMultipleDataClick="selectMultipleDataClick"
    @selectAllDataClick="selectAllDataClick"
    @checkSelected="checkSelected"
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
      <CTableRow
        align="middle"
        v-for="item in filteredElements.slice(0, 100)"
        :key="item.id"
      >
        <CTableDataCell class="w-15">
          <label class="form-check-label py-3">
            <input
              type="checkbox"
              class="form-check-input"
              :value="item"
              :disabled="!isSelectMultipleTableDataActive"
              v-model="selectedTableData"
              @click="selectTableData(item)"
            />
          </label>
        </CTableDataCell>
        <CTableDataCell class="w-25">
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
  <!--pagination start-->
  <div class="d-flex justify-content-center text-center pt-3">
    <pagination
      v-model="currentPage"
      :records="totalElementCount"
      :per-page="perPageElementCount"
      @paginate="pageSelected"
      :options="{ chunk: 8 }"
    />
  </div>
  <!--pagination end-->

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
    @checkAll="checkAll"
  ></CheckAllConfirmModal>

  <CheckSelectedModal
    :checkData="selectedTableData"
    :isActive="isCheckSelectedModalActive"
    :icons="icons"
    @changeActiveState="changeModalActiveState"
    @getCheckInfo="showCheckInfo"
    @closeCheckInfoModal="closeModal"
  ></CheckSelectedModal>

  <CheckAllModal
    v-if="isCheckAllModalActive"
    ref="CheckAllModal"
    :checkData="checkAllData"
    :isActive="isCheckAllModalActive"
    :isMinimized="isCheckAllModalMinimized"
    :isStopped="isCheckAllLoadingStopped"
    :icons="icons"
    @changeActiveState="changeModalActiveState"
    @maximizeModal="maximizeCheckAllModal"
    @minimizeModal="minimizeCheckAllModal"
    @stopCheckAll="this.isCheckAllLoadingStopped = true"
    @getCheckInfo="showCheckInfo"
    @closeCheckInfoModal="closeModal"
  ></CheckAllModal>
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
  },
  name: 'Index',
  setup() {},
  data() {
    const thData = [
      { id: 0, title: '', sortBy: null },
      { id: 1, title: 'Gate Service Id', sortBy: 'id' },
      { id: 2, title: 'Name', sortBy: 'name' },
      { id: 4, title: 'Operations', sortBy: null },
    ]
    const dbData = []
    const checkAllData = []
    const selectedTableData = []
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
    const perPageElementCount = 20
    const currentPage = 1
    const currentSort = 'id'
    const currentSortDir = 'asc'

    const isCheckModalActive = ref(false)
    const isCheckResultActive = ref(false)
    const isSettingsModalActive = ref(false)
    const isCheckAllModalActive = ref(false)
    const isCheckInfoModalActive = ref(false)
    const isCheckAllConfirmModalActive = ref(false)
    const isCheckAllLoadingStopped = ref(false)
    const isModalLoading = ref(false)
    const isParameterLoading = ref(false)
    const isParameterInputFocused = ref(false)
    const isAddParameterActive = false
    const isCheckAllModalMinimized = ref(false)
    const isCheckSelectedModalActive = ref(false)

    const isSelectMultipleTableDataActive = ref(false)
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
      currentlyCheckingElement,

      currentPage,
      perPageElementCount,
      totalElementCount,

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
      isSelectMultipleTableDataActive,
      isAddParameterActive,
    }
  },
  computed: {
    filteredElements: function () {
      return this.filterElementsByGateServiceId(
        this.filterElementsByName(this.sortedSearchResults),
      )
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
    checkElement: async function (gate_service_id) {
      this.isCheckModalActive = true
      this.currentlyCheckingElement = this.dbData.filter(
        (n) => n.gate_service_id == gate_service_id,
      )[0]
      this.currentlyCheckingElement.checkedElementStatus.success = false
      this.currentlyCheckingElement.checkedElementStatus.error = false
      this.currentlyCheckingElement.isLoading = true
      await fetch(
        `http://localhost:8081/api/checkRequest?PRV_ID=${gate_service_id}`,
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
      if (data[0].resultcodeid == 0) {
        this.currentlyCheckingElement.checkedElementStatus.success = true
      } else {
        this.currentlyCheckingElement.checkedElementStatus.error = true
      }
      this.currentlyCheckingElement.data = data[0]
      this.isCheckModalActive = false
      this.isCheckResultActive = true
      this.currentlyCheckingElement.isLoading = false
    },
    checkAll: async function () {
      this.isCheckAllModalActive = true
      this.isCheckAllModalMinimized = false
      this.isCheckAllLoadingStopped = false
      this.isCheckAllConfirmModalActive = false
      this.checkAllData = []
      for (let i = 0; i < this.dbData.length; i++) {
        await fetch(
          `http://localhost:8081/api/checkRequest?PRV_ID=${this.dbData[i].gate_service_id}`,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          },
        )
          .then(async (response) => await response.json())
          .then((data) => {
            try {
              if (data.length == 1) {
                var newData = {
                  ...data[0],
                  name: this.dbData[i].name,
                  isLoading: true,
                  isShowInfoActive: false,
                  checkedElementStatus: { success: false, error: false },
                }
                this.checkAllData.push(newData)
                if (data[0].resultcodeid == 0) {
                  this.checkAllData[i].checkedElementStatus.success = true
                } else {
                  this.checkAllData[i].checkedElementStatus.error = true
                }
                this.checkAllData[i].isLoading = false
              } else {
                this.checkAllData[i].checkedElementStatus.error = true
              }
              this.$refs.CheckAllModal.handleScroll()
            } catch {
              this.isCheckAllLoadingStopped = true
              console.log(
                'Something went wrong with request , please check again...',
              )
            }
            //console.log(newData.id, this.isScrolled)
          })
        if (!this.isCheckAllModalActive) {
          break
        }
        if (this.isCheckAllLoadingStopped) {
          break
        }
        //console.log(this.$refs.container.scrollY)
      }
    },
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
            `http://localhost:8081/api/checkRequest?PRV_ID=${this.selectedTableData[i].gate_service_id}`,
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
                if (data.length == 1) {
                  this.selectedTableData[i].checkData = data[0]

                  if (data[0].resultcodeid == 0) {
                    this.selectedTableData[
                      i
                    ].checkedElementStatus.success = true
                  } else {
                    this.selectedTableData[i].checkedElementStatus.error = true
                  }
                  this.selectedTableData[i].isLoading = false
                } else {
                  this.selectedTableData[i].checkedElementStatus.error = true
                }
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
      console.log('salam')
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
    closeModal: function (modalName) {
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
        case 'checkAll':
          this.isCheckAllLoadingStopped = true
          for (let i = 0; i < this.dbData.length; i++) {
            this.dbData[i].checkedElementStatus.success = false
            this.dbData[i].checkedElementStatus.error = false
          }
          this.checkAllData = []
          this.isCheckAllModalActive = false
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
        case 'checkInfoCheckAll':
          for (var i = 0; i < this.checkAllData.length; i++) {
            this.checkAllData[i].isShowInfoActive = false
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
    filterResults(type) {
      if (this.filterForm.Name) {
        switch (type) {
          case 'name':
            console.log(
              this.dbData.filter((n) => n.name.includes(this.filterForm.Name)),
            )
            this.dbData.filter((n) => n.name.includes(this.filterForm.Name))
            break
          case 'parameter':
            console.log('par')
            break
          case 'operation':
            console.log('op')
            break
        }
      }
    },
    filterElementsByGateServiceId: function (dbData) {
      return dbData.filter((n) =>
        n.gate_service_id.toString().includes(this.filterForm.GateServiceId),
      )
    },
    filterElementsByName: function (dbData) {
      //contains
      return dbData.filter((n) =>
        n.name.toLowerCase().includes(this.filterForm.Name.toLowerCase()),
      )
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
    },
    selectMultipleDataClick: function () {
      if (this.isSelectMultipleTableDataActive == false) {
        this.isSelectMultipleTableDataActive = true
      } else {
        this.isSelectMultipleTableDataActive = false
        this.selectedTableData = []
      }
    },
    selectAllDataClick: function () {
      if (this.isSelectMultipleTableDataActive == false) {
        this.isSelectMultipleTableDataActive = true
        this.selectedTableData = this.dbData
      } else {
        this.isSelectMultipleTableDataActive = false
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
    handleScroll() {
      if (
        this.lastPosition < this.$refs.salam.scrollY &&
        this.limitPosition < this.$refs.salam.scrollY
      ) {
        this.isScrolled = true
        console.log('scrolled true')
        // move up!
      }

      if (this.lastPosition > this.$refs.salam.top.scrollY) {
        this.isScrolled = false
        console.log('scrolled false')
        // move down
      }

      //this.lastPosition = this.$refs.salam.scrollY
      // this.scrolled = window.scrollY > 250;
    },
    createNewModelArray: function () {
      this.dbData = this.dbData.map((obj) => ({
        ...obj,
        isLoading: false,
        checkedElementStatus: { success: false, error: false },
        isShowInfoActive: false,
        checkData: null,
      }))
    },
  },
  beforeMount() {
    fetch('http://localhost:8081/api/services', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.dbData = data
        this.totalElementCount = data.length
        this.createNewModelArray()
        console.log(this.dbData)
      })
  },
  mounted() {},
}
</script>
