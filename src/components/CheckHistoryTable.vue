<template>
  <CTable responsive striped small hover class="text-center">
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell
          role="button"
          class="user-select-none"
          scope="col"
          @click="sort(item.sortBy)"
          v-for="item in thData"
          :key="item.id"
          >{{ item.title }}</CTableHeaderCell
        >
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow align="middle" v-for="item in data" :key="item.id">
        <CTableDataCell>
          <span style="width: 300px; overflow: hidden">
            {{ item.serviceid }}
          </span>
        </CTableDataCell>
        <CTableDataCell style="width: 500px; overflow: hidden">
          <span style="width: 100px; overflow: hidden">
            {{ item.name }}
          </span>
        </CTableDataCell>
        <CTableDataCell>
          <span style="width: 100px; overflow: hidden">
            {{ item.start_time.slice(0, 10) }}
            &nbsp;&nbsp;{{ item.start_time.slice(11, 16) }}
          </span>
        </CTableDataCell>
        <CTableDataCell>
          <span style="width: 60px; overflow: hidden">
            12343{{ item.userid }}
          </span>
        </CTableDataCell>
        <CTableDataCell>
          <div
            v-if="item.resultcodeid == 0"
            style="width: 60px; overflow: hidden"
            class="bg-success rounded text-light m-auto"
          >
            success
          </div>
          <div
            v-else
            style="width: 60px; overflow: hidden"
            class="bg-danger rounded text-light m-auto"
          >
            error
          </div>
        </CTableDataCell>
        <CTableDataCell>
          <div
            v-if="item.separate == 1"
            style="width: 60px; overflow: hidden"
            class="rounded m-auto text-light bg-warning"
          >
            <CIcon :content="icons.cilStream" />
          </div>
          <div v-else></div>
        </CTableDataCell>
        <CTableDataCell>
          <span style="width: 60px; overflow: hidden">
            {{ item.partitionnumber }}
          </span>
        </CTableDataCell>
        <CTableDataCell>
          <CIcon
            class="cursor-pointer"
            @click="getDetailedInfo(item.id)"
            :content="icons.cilInfo"
          />
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
</template>
<script>
export default {
  name: 'CheckHistoryTable',
  props: ['icons', 'data', 'thData', 'operations'],
  methods: {
    sort: function (sortBy) {
      this.$emit('sort', sortBy)
    },
    getDetailedInfo: function (id) {
      this.$emit('getDetailedInfo', id)
    },
  },
}
</script>
