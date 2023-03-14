<template>
  <CRow class="d-flex py-2 justify-content-end">
    <CCol class="col-6 my-2 d-flex justify-content-start">
      <CButtonGroup role="button">
        <CButton color="info" variant="outline" @click="selectAllDataClick"
          >Select All</CButton
        >
        <CButton
          color="danger"
          variant="outline"
          @click="clearSelectedMultipleData"
          >Clear</CButton
        >
      </CButtonGroup>
    </CCol>
    <CCol class="col-6 d-flex justify-content-end align-items-center">
      <CButtonGroup role="group" aria-label="Check Buttons">
        <CButton
          color="primary"
          variant="outline"
          @click="checkSelectedData(selectedTableData)"
          ><CIcon :content="icons.cilMediaPlay" role="button"></CIcon>Check
          Selected</CButton
        >
        <CButton color="primary" variant="outline" @click="confirmCheckAll"
          ><CIcon :content="icons.cilMediaPlay" role="button"></CIcon>Check
          All</CButton
        >
        <CDropdown color="primary" variant="btn-group" class="rounded">
          <CDropdownToggle color="primary" variant="outline" split>
            primary
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem @click="checkTopServices(10)" class="cursor-pointer"
              >Top 10</CDropdownItem
            >
            <CDropdownItem @click="checkTopServices(50)">Top 50</CDropdownItem>
            <CDropdownItem @click="checkTopServices(100)"
              >Top 100</CDropdownItem
            >
          </CDropdownMenu>
        </CDropdown>
      </CButtonGroup>
    </CCol>
  </CRow>
</template>
<script>
export default {
  name: 'CheckButtonsContainer',
  props: [
    'isSelectMultipleTableDataActive',
    'icons',
    'dbData',
    'isSelectedAll',
  ],
  components: {},
  methods: {
    checkSelectedData: function (selectedTableData) {
      this.$emit('checkSelected', selectedTableData)
    },
    confirmCheckAll: function () {
      this.$emit('setConfirmCheckAllModalActive')
    },
    clearSelectedMultipleData: function () {
      this.$emit('clearSelectedMultipleData')
    },
    selectAllDataClick: function () {
      this.$emit('selectAllDataClick')
    },
    checkTopServices: function (limit) {
      this.$emit('checkTopServices', limit)
    },
  },
}
</script>
