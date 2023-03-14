<template>
  <CRow class="d-flex py-2 justify-content-end">
    <Transition name="fade">
      <CCol
        role="button"
        v-if="isSelectMultipleTableDataActive"
        @click="checkSelectedData(selectedTableData)"
        class="btn btn-primary col-lg-2 m-1 col-md-3 col-sm-4 col-5 d-flex align-items-center gap-2 justify-content-center"
      >
        <CIcon
          :content="icons.cilMediaPlay"
          role="button"
          class="text-light"
        ></CIcon>
        <span>Check Selected</span>
      </CCol>
    </Transition>
    <CCol
      @click="confirmCheckAll"
      class="btn btn-primary col-lg-2 m-1 col-md-3 col-sm-4 col-5 d-flex align-items-center gap-2 justify-content-center"
    >
      <CIcon
        :content="icons.cilMediaPlay"
        role="button"
        class="text-light"
      ></CIcon>
      <span>Check All</span>
    </CCol>
    <CCol class="col-12 my-2 d-flex justify-content-between">
      <div class="d-flex align-items-center">
        <div class="form-check px-3">
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
        <div class="form-check px-3">
          <CFormLabel
            role="button"
            class="form-check-label user-select-none"
            for="isSelectAllActive"
          >
            Select All
            <input
              class="form-check-input"
              type="checkbox"
              id="isSelectAllActive"
              @click="selectAllDataClick"
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
        <CIcon :content="icons.cilDataTransferDown"></CIcon>
      </JsonExcel>
    </CCol>
  </CRow>
</template>
<script>
import JsonExcel from 'vue-json-excel3'
export default {
  name: 'CheckButtonsContainer',
  props: ['isSelectMultipleTableDataActive', 'icons', 'dbData'],
  components: { JsonExcel },
  methods: {
    checkSelectedData: function (selectedTableData) {
      this.$emit('checkSelected', selectedTableData)
    },
    confirmCheckAll: function () {
      this.$emit('setConfirmCheckAllModalActive')
    },
    selectMultipleDataClick: function () {
      this.$emit('selectMultipleDataClick')
    },
    selectAllDataClick: function () {
      this.$emit('selectAllDataClick')
    },
  },
}
</script>
