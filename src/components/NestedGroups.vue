<template>
  <div>
    <div v-if="Array.isArray(value)">
      <div class="ps-4" v-for="item in value" :key="item.id">
        <NestedGroups :value="item" />
      </div>
    </div>
    <div v-else-if="typeof value == 'object' && !!value">
      <span @click="filterGroup(value)">{{ value.name }}</span>
      <NestedGroups class="fw-normal" :value="value.children" />
    </div>
    <span v-else> .. {{ value }} ..</span>
  </div>
</template>

<script>
export default {
  name: 'NestedGroups',
  props: ['value'],
  methods: {
    filterGroup: function (data) {
      this.$emit('filterGroup', data)
      this.$emit('salam')
    },
  },
}
</script>
