<template>
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
  <CRow class="d-flex py-2 justify-content-end">
    <Transition name="fade">
      <CCol
        role="button"
        v-if="isSelectMultipleTableDataActive"
        @click="checkSelected(selectedTableData)"
        class="btn btn-primary col-lg-2 m-1 col-md-3 col-sm-4 col-5 d-flex align-items-center gap-2 justify-content-center"
      >
        <CIcon :content="cilMediaPlay" role="button" class="text-light"></CIcon>
        <span>Check Selected</span>
      </CCol>
    </Transition>
    <CCol
      @click="isCheckAllConfirmModalActive = true"
      class="btn btn-primary col-lg-2 m-1 col-md-3 col-sm-4 col-5 d-flex align-items-center gap-2 justify-content-center"
    >
      <CIcon :content="cilMediaPlay" role="button" class="text-light"></CIcon>
      <span>Check All</span>
    </CCol>
    <CCol class="col-12 my-2 d-flex justify-content-between">
      <div class="d-flex align-items-center">
        <div class="form-check">
          <CFormLabel
            role="button"
            class="form-check-label user-select-none"
            for="isSelectMultipleTableDataActive"
          >
            Selectible
            <input
              class="form-check-input"
              type="checkbox"
              id="isSelectMultipleTableDataActive"
              @click="selectMultipleDataClick"
            />
          </CFormLabel>
        </div>
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
    </CCol>
  </CRow>
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
              :content="cilMediaPlay"
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
                :content="cilHistory"
                role="button"
                class="text-warning"
              ></CIcon>
            </router-link>
            <CIcon
              v-c-tooltip="{
                content: 'Settings of this element',
                placement: 'top',
              }"
              :content="cilSettings"
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

  <!--Settings Modal Start -->
  <div class="modal-vue">
    <div class="settings-modal rounded p-3" v-if="isSettingsModalActive">
      <div v-if="isParameterLoading" class="modal-loading bg-light rounded">
        <div class="fingerprint-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
      </div>
      <div class="d-flex justify-content-end p-3">
        <CIcon
          :content="cilX"
          @click="closeModal('settings')"
          width="40"
          class="border rounded close-button-custom"
          role="button"
          height="30"
        />
      </div>
      <div class="p-5">
        <p class="display-5 text-muted">Parameters</p>
        <div class="my-3 fs-4">
          <span>{{ parameterListOfElement.Id }}</span>
          <span> - </span>
          <span> {{ parameterListOfElement.Name }}</span>
        </div>
        <div
          v-if="isParameterInputFocused == false"
          :class="{
            'text-success': parameterChangeData.isSuccess,
            'text-danger': !parameterChangeData.isSuccess,
          }"
        >
          {{ parameterChangeData.message }}
        </div>
        <CForm>
          <CRow>
            <!--parameterListOfElement-->
            <CCol
              v-for="parameterOfElement in parameterListOfElement.parameterList"
              class="col-12 my-2 d-flex justify-content-between"
              :key="parameterOfElement.Id"
            >
              <CFormLabel class="w-50 mx-2 text-secondary my-auto"
                >Parameter namee
                <CFormInput
                  :value="parameterOfElement.name"
                  @input="
                    (event) => (parameterOfElement.name = event.target.value)
                  "
                  @focus="parameterInputFocused()"
                />
              </CFormLabel>
              <CFormLabel class="w-50 mx-2 text-secondary my-auto"
                >Parameter value
                <CFormInput
                  :value="parameterOfElement.value"
                  @input="
                    (event) => (parameterOfElement.value = event.target.value)
                  "
                  @focus="parameterInputFocused()"
                />
              </CFormLabel>
              <div
                class="btn btn-danger d-flex justify-content-center align-items-center mt-4"
                @click="
                  removeParameter(
                    parameterListOfElement.Id,
                    parameterOfElement.id,
                  )
                "
              >
                <CIcon class="text-light" :content="cilTrash"></CIcon>
              </div>
            </CCol>
            <CCol class="col-12 d-flex justify-content-between">
              <CFormInput
                @click="isAddParameterActive = !isAddParameterActive"
                value="Add"
                type="button"
                class="btn btn-outline-primary w-25"
              />
              <CFormInput
                @click="editParametersOfElement(parameterListOfElement.Id)"
                class="btn btn-outline-warning w-25"
                value="Edit"
                type="button"
              />
            </CCol>
            <CCol
              v-if="isAddParameterActive"
              class="col-12 my-2 d-flex justify-content-between align-items-end"
            >
              <CFormLabel class="w-50 mx-2 text-secondary my-auto"
                >Parameter name
                <CFormInput
                  v-model="newParameter.name"
                  @focus="parameterInputFocused()"
                />
              </CFormLabel>
              <CFormLabel class="w-50 mx-2 text-secondary my-auto"
                >Parameter value
                <CFormInput
                  v-model="newParameter.value"
                  @focus="parameterInputFocused()"
                />
              </CFormLabel>
              <div
                @click="addNewParameterToService(parameterListOfElement.Id)"
                class="btn btn-outline-success d-flex align-items-center"
              >
                Submit
              </div>
            </CCol>
          </CRow>
        </CForm>
      </div>
    </div>
    <div
      class="overlay overlay-settings"
      v-if="isSettingsModalActive"
      @click="closeModal('settings')"
    ></div>
  </div>
  <!--Settings Modal End -->

  <!--Check Modal Start -->
  <div class="modal-vue">
    <div
      class="check-modal rounded p-3 d-flex align-items-center justify-content-between"
      v-if="isCheckModalActive"
    >
      <div class="">
        <span class="text-secondary pe-2">{{
          currentlyCheckingElement.gate_service_id
        }}</span>
        <span>{{ currentlyCheckingElement.name }}</span>
      </div>
      <div
        style="transform: scale(2); height: 30px"
        v-if="currentlyCheckingElement.isLoading"
        class="check-loading"
      >
        <div class="semipolar-spinner pe-3">
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
        </div>
      </div>
      <div
        v-if="currentlyCheckingElement.checkedElementStatus.success"
        class="element-checked-success"
      >
        <div class="check-wrapper-success">
          <svg
            class="checkmark-success"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              class="checkmark__circle-success"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              class="checkmark__check-success"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
      </div>
      <div
        v-if="currentlyCheckingElement.checkedElementStatus.error"
        class="element-checked-error"
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 130.2 130.2"
        >
          <circle
            class="path circle"
            fill="none"
            stroke="#D06079"
            stroke-width="6"
            stroke-miterlimit="10"
            cx="65.1"
            cy="65.1"
            r="62.1"
          />
          <line
            class="path line"
            fill="none"
            stroke="#D06079"
            stroke-width="6"
            stroke-linecap="round"
            stroke-miterlimit="10"
            x1="34.4"
            y1="37.9"
            x2="95.8"
            y2="92.3"
          />
          <line
            class="path line"
            fill="none"
            stroke="#D06079"
            stroke-width="6"
            stroke-linecap="round"
            stroke-miterlimit="10"
            x1="95.8"
            y1="38"
            x2="34.4"
            y2="92.2"
          />
        </svg>
      </div>
    </div>
    <div
      class="overlay overlay-check"
      v-if="isCheckModalActive"
      @click="closeModal('check')"
    ></div>
  </div>
  <!--Check Modal End -->

  <!--Check All Confirm Modal Start-->
  <div class="modal-vue">
    <div
      class="check-modal rounded p-3 d-flex flex-column justify-content-around align-items-center"
      v-if="isCheckAllConfirmModalActive"
    >
      <div class="fs-4 text-center">Confirm Check All Items In Database</div>
      <div class="d-flex justify-content-around align-items-center w-100 pt-1">
        <div
          @click="isCheckAllConfirmModalActive = false"
          class="btn btn-outline-danger btn-lg"
        >
          Close
        </div>
        <div @click="checkAll()" class="btn btn-outline-success btn-lg">
          Check All
        </div>
      </div>
    </div>
    <div
      class="overlay overlay-check"
      v-if="isCheckAllConfirmModalActive"
      @click="isCheckAllConfirmModalActive = false"
    ></div>
  </div>
  <!--Check All Confirm Modal End-->

  <!--Check Selected Modal Start-->
  <div class="modal-vue">
    <div
      ref="container"
      class="rounded checkSelected-modal p-3"
      v-if="isCheckSelectedModalActive"
    >
      <div
        class="Check-All-Inner-ModalMaximized justify-content-end d-flex overflow-hidden gap-4 p-1 bg-light border rounded align-items-center"
      >
        <div @click="isCheckSelectedLoadingStopped = true">
          <div
            class="btn btn-danger text-light"
            v-if="!isCheckSelectedLoadingStopped"
          >
            Stop Loading
          </div>
          <div class="btn btn-secondary disabled" v-else>Stopped</div>
        </div>
        <CIcon
          :content="cilX"
          @click="closeModal('checkSelected')"
          width="40"
          class="border rounded"
          role="button"
          height="30"
        />
      </div>
      <div class="m-5 p-5">
        <div
          v-for="item in selectedTableData"
          :key="item.id"
          class="border rounded my-2 ps-3 d-flex justify-content-between align-items-center position-relative"
        >
          <div class="px-2 text-secondary small">
            {{ item.gate_service_id }}
          </div>
          <div class="w-85 small">{{ item.name }}</div>
          <div v-if="item.isLoading" class="w-15">
            <div class="check-loading border rounded p-0 m-0">
              <div class="fingerprint-spinner w-75 p-0 m-0">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
              </div>
            </div>
          </div>
          <div
            @click="showCheckInfo(item.id, 'checkSelected')"
            v-if="item.checkedElementStatus.success"
            class="element-checked-success w-15 h-100"
          >
            <div
              class="bg-success text-light rounded h-100 d-flex justify-content-center align-items-center cursor-pointer"
            >
              Success
            </div>
            <!-- <div class="check-wrapper-success">
              <svg
                class="checkmark-success"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  class="checkmark__circle-success"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  class="checkmark__check-success"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div> -->
          </div>
          <div
            @click="showCheckInfo(item.id, 'checkSelected')"
            v-if="item.checkedElementStatus.error"
            class="element-checked-error w-15"
          >
            <div
              class="bg-danger text-light rounded h-100 d-flex justify-content-center align-items-center cursor-pointer"
            >
              Error
            </div>
            <!-- <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 130.2 130.2"
            >
              <circle
                class="path circle"
                fill="none"
                stroke="#D06079"
                stroke-width="6"
                stroke-miterlimit="10"
                cx="65.1"
                cy="65.1"
                r="62.1"
              />
              <line
                class="path line"
                fill="none"
                stroke="#D06079"
                stroke-width="6"
                stroke-linecap="round"
                stroke-miterlimit="10"
                x1="34.4"
                y1="37.9"
                x2="95.8"
                y2="92.3"
              />
              <line
                class="path line"
                fill="none"
                stroke="#D06079"
                stroke-width="6"
                stroke-linecap="round"
                stroke-miterlimit="10"
                x1="95.8"
                y1="38"
                x2="34.4"
                y2="92.2"
              />
            </svg> -->
          </div>
          <CheckInfoModal
            v-if="item.isShowInfoActive"
            :item="item.checkData"
          ></CheckInfoModal>
        </div>
      </div>
    </div>
    <div
      :class="{
        'overlay overlay-checkSelected': !isCheckAllModalMinimized,
      }"
      v-if="isCheckSelectedModalActive"
      @click="closeModal('checkSelected')"
    ></div>
  </div>
  <!--Check Selected Modal End-->

  <!--Check All Modal Start-->
  <div class="modal-vue">
    <div
      @scroll="handleScroll"
      ref="container"
      :class="{
        'checkAll-modal p-3': !isCheckAllModalMinimized,
        'checkAll-modal-minimized border shadow': isCheckAllModalMinimized,
      }"
      class="rounded"
      v-if="isCheckAllModalActive"
    >
      <div
        :class="{
          'Check-All-Inner-ModalMaximized  justify-content-end':
            !isCheckAllModalMinimized,
          'Check-All-Inner-ModalMinimized justify-content-start':
            isCheckAllModalMinimized,
        }"
        class="d-flex overflow-hidden gap-4 p-1 bg-light border rounded align-items-center"
      >
        <div
          v-if="!isCheckAllModalMinimized"
          @click="isCheckAllLoadingStopped = true"
        >
          <div
            class="btn btn-danger text-light"
            v-if="!isCheckAllLoadingStopped"
          >
            Stop Loading
          </div>
          <div class="btn btn-secondary disabled" v-else>Stopped</div>
        </div>
        <CIcon
          v-if="!isCheckAllModalMinimized"
          :content="cilWindowMinimize"
          @click="minimizeCheckAllModal"
          width="40"
          class="border rounded"
          height="30"
          role="button"
        />
        <CIcon
          v-if="isCheckAllModalMinimized"
          :content="cilWindowMaximize"
          @click="maximizeCheckAllModal"
          width="40"
          class="border rounded"
          role="button"
          height="30"
        />
        <CIcon
          :content="cilX"
          @click="closeModal('checkAll')"
          width="40"
          class="border rounded"
          role="button"
          height="30"
        />
      </div>
      <div class="m-5 p-5">
        <div
          v-for="item in checkAllData"
          :key="item.id"
          class="border rounded my-2 ps-3 d-flex justify-content-between align-items-center position-relative"
        >
          <div class="px-2 text-secondary small">{{ item.serviceid }}</div>
          <div class="w-85 small">{{ item.name }}</div>
          <div v-if="item.isLoading" class="w-15">
            <div class="check-loading border rounded">
              <div class="fingerprint-spinner w-75">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
              </div>
            </div>
          </div>
          <div
            @click="showCheckInfo(item.id, 'checkAll')"
            v-if="item.checkedElementStatus.success"
            class="element-checked-success w-15 h-100"
          >
            <div
              class="bg-success text-light rounded h-100 d-flex justify-content-center align-items-center cursor-pointer"
            >
              Success
            </div>
            <!-- <div class="check-wrapper-success">
              <svg
                class="checkmark-success"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  class="checkmark__circle-success"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  class="checkmark__check-success"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div> -->
          </div>
          <div
            @click="showCheckInfo(item.id, 'checkAll')"
            v-if="item.checkedElementStatus.error"
            class="element-checked-error w-15"
          >
            <div
              class="bg-danger text-light rounded h-100 d-flex justify-content-center align-items-center cursor-pointer"
            >
              Error
            </div>
            <!-- <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 130.2 130.2"
            >
              <circle
                class="path circle"
                fill="none"
                stroke="#D06079"
                stroke-width="6"
                stroke-miterlimit="10"
                cx="65.1"
                cy="65.1"
                r="62.1"
              />
              <line
                class="path line"
                fill="none"
                stroke="#D06079"
                stroke-width="6"
                stroke-linecap="round"
                stroke-miterlimit="10"
                x1="34.4"
                y1="37.9"
                x2="95.8"
                y2="92.3"
              />
              <line
                class="path line"
                fill="none"
                stroke="#D06079"
                stroke-width="6"
                stroke-linecap="round"
                stroke-miterlimit="10"
                x1="95.8"
                y1="38"
                x2="34.4"
                y2="92.2"
              />
            </svg> -->
          </div>
          <CheckInfoModal
            v-if="item.isShowInfoActive"
            :item="item"
          ></CheckInfoModal>
        </div>
      </div>
    </div>
    <div
      :class="{
        'overlay overlay-checkAll': !isCheckAllModalMinimized,
      }"
      v-if="isCheckAllModalActive"
      @click="closeModal('checkAll')"
    ></div>
  </div>
  <!--Check All Modal End-->
</template>

<script>
import { ref, isProxy, toRaw } from 'vue'
import {
  cilSettings,
  cilMediaPlay,
  cilHistory,
  cilTrash,
  cilX,
  cilWindowMinimize,
  cilWindowMaximize,
  cilDataTransferDown,
} from '@coreui/icons'
import JsonExcel from 'vue-json-excel3'
import Pagination from 'v-pagination-3'
import CheckInfoModal from '@/components/CheckInfoModal.vue'
export default {
  components: {
    JsonExcel,
    Pagination,
    CheckInfoModal,
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
      checkedElementStatus: {
        success: false,
        error: false,
      },
    }
    const newParameter = {
      id: 1,
      active: true,
      serviceid: null,
      name: null,
      value: null,
    }
    const totalElementCount = 0
    const perPageElementCount = 20
    const currentPage = 1
    const currentSort = 'id'
    const currentSortDir = 'asc'
    const limitPosition = 20
    const isScrolled = false
    const lastPosition = 0

    const isCheckModalActive = ref(false)
    const isSettingsModalActive = ref(false)
    const isCheckAllModalActive = ref(false)
    const isCheckInfoModalActive = ref(false)
    const isCheckAllConfirmModalActive = ref(false)
    const isCheckAllLoadingStopped = ref(false)
    const isCheckSelectedLoadingStopped = ref(false)
    const isModalLoading = ref(false)
    const isParameterLoading = ref(false)
    const isParameterInputFocused = ref(false)
    const isAddParameterActive = false
    const isElementChecking = ref(false)
    const isCheckAllModalMinimized = ref(false)
    const isCheckSelectedModalActive = ref(false)

    const isSelectMultipleTableDataActive = ref(false)

    return {
      currentSort,
      currentSortDir,
      cilSettings,
      cilMediaPlay,
      cilHistory,
      cilTrash,
      cilX,
      cilWindowMinimize,
      cilWindowMaximize,
      cilDataTransferDown,

      thData,
      dbData,
      checkAllData,
      newParameter,
      filterForm,
      parameterListOfElement,
      parameterChangeData,
      selectedTableData,
      currentlyCheckingElement,

      currentPage,
      perPageElementCount,
      totalElementCount,
      limitPosition,
      isScrolled,
      lastPosition,

      isCheckModalActive,
      isCheckAllLoadingStopped,
      isCheckSelectedLoadingStopped,
      isSettingsModalActive,
      isCheckAllModalActive,
      isCheckAllConfirmModalActive,
      isCheckSelectedModalActive,
      isCheckInfoModalActive,
      isCheckAllModalMinimized,
      isModalLoading,
      isParameterLoading,
      isParameterInputFocused,
      isElementChecking,
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
        .then(async (data) => await this.checkAsync(data))
    },
    checkAsync: async function (data) {
      console.log(data)
      if (data[0].resultcodeid == 0) {
        this.currentlyCheckingElement.checkedElementStatus.success = true
      } else {
        this.currentlyCheckingElement.checkedElementStatus.error = true
      }
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
            } catch {
              this.isCheckAllLoadingStopped = true
              console.log(
                'Something went wrong with request , please check again...',
              )
            }
            console.log(newData.id, this.isScrolled)
          })
        if (!this.isCheckAllModalActive) {
          break
        }
        if (this.isCheckAllLoadingStopped) {
          break
        }
        console.log(this.$refs.container.scrollY)
        if (this.isScrolled == false) {
          this.$refs.container.scrollTop = this.$refs.container.scrollHeight
        }
      }
    },
    checkSelected: async function () {
      if (this.selectedTableData.length <= 1) {
        alert('Please select at least 2 element...')
      } else {
        this.isCheckSelectedModalActive = true
        this.isCheckSelectedLoadingStopped = false
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
                this.isCheckSelectedLoadingStopped = true
                console.log(
                  'Something went wrong with request , please check again...',
                )
              }
            })
          if (!this.isCheckSelectedModalActive) {
            break
          }
          if (this.isCheckSelectedLoadingStopped) {
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
    addNewParameterToService: function (id) {
      this.isParameterInputFocused = false
      this.newParameter.serviceid = id
      if (isProxy(this.newParameter)) {
        var reqObject = toRaw(this.newParameter)
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
        case 'settings':
          this.isSettingsModalActive = false
          this.isAddParameterActive = false
          this.parameterChangeData = {
            isSuccess: false,
            message: null,
          }
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
        this.lastPosition < this.$refs.container.scrollY &&
        this.limitPosition < this.$refs.container.scrollY
      ) {
        this.isScrolled = true
        // move up!
      }

      if (this.lastPosition > this.$refs.container.scrollY) {
        this.isScrolled = false
        // move down
      }

      this.lastPosition = this.$refs.container.scrollY
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
}
</script>
