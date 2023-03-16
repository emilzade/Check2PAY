<template>
  <CRow class="d-flex py-2 justify-content-end">
    <CCol class="col-6 d-flex justify-content-end">
      <CButtonGroup role="group" aria-label="Check Buttons">
        <CButton color="primary" variant="outline" @click="check"
          ><CIcon :content="icons.cilMediaPlay" role="button"></CIcon>Check
        </CButton>
        <CDropdown
          auto-close="outside"
          color="primary"
          variant="btn-group"
          class="rounded"
        >
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
            <CDropdownItem @click="checkTopServices(limitService)"
              >Check Top <CIcon :content="icons.cilArrowBottom"></CIcon>
            </CDropdownItem>
            <CFormInput class="w-75 m-auto mt-2" v-model="limitService" />
          </CDropdownMenu>
        </CDropdown>
      </CButtonGroup>
    </CCol>
    <CCol class="col-12 my-2 d-flex justify-content-between">
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
  </CRow>
</template>
<script>
export default {
  name: 'CheckButtonsContainer',
  props: ['icons', 'dbData', 'isSelectedAll', 'isSelectedTableDataEmpty'],
  components: {},
  data() {
    const limitService = 10
    return {
      limitService,
    }
  },
  methods: {
    check() {
      if (!this.isSelectedTableDataEmpty) {
        this.checkSelectedData()
      } else {
        this.confirmCheckAll()
      }
    },
    checkSelectedData: function () {
      this.$emit('checkSelected')
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
