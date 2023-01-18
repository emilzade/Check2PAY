<template>
  <div class="modal-vue overflow-hidden">
    <div
      ref="container"
      class="rounded checkSelected-modal p-3 overflow-hidden"
      v-if="isActive"
    >
      <div
        class="Check-All-Inner-ModalMaximized justify-content-end d-flex overflow-hidden gap-4 p-1 bg-light border rounded-top align-items-center"
      >
        <CIcon
          :content="icons.cilX"
          @click="changeActiveState"
          width="40"
          class="border rounded my-1"
          role="button"
          height="30"
        />
      </div>
      <div class="m-5 p-5 overflow-hidden">
        <div
          v-for="item in checkData"
          :key="item.id"
          class="border rounded my-2 ps-3 d-flex justify-content-between align-items-center position-relative"
        >
          <div v-if="!item.isLoading">
            <CIcon
              class="cursor-pointer"
              :content="icons.cilInfo"
              @click="showInfo(item.id, 'checkSelected')"
            />
          </div>
          <div v-if="item.isLoading">
            <CIcon :content="icons.cilApplications" />
          </div>
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
            v-if="item.checkedElementStatus.success"
            class="element-checked-success w-15 h-100"
          >
            <div
              class="bg-success text-light rounded h-100 d-flex justify-content-center align-items-center"
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
            v-if="item.checkedElementStatus.error"
            class="element-checked-error w-15"
          >
            <div
              class="bg-danger text-light rounded h-100 d-flex justify-content-center align-items-center"
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
          <div
            :class="{
              'check-MultipleInfoHidden': !item.isShowInfoActive,
              'check-MultipleInfoActive': item.isShowInfoActive,
            }"
          >
            <div class="bg-light" style="z-index: 9999">
              <CIcon
                @click="closeCheckInfo"
                :content="icons.cilArrowLeft"
                width="40"
                height="30"
                role="button"
                class="border rounded-end"
              />
            </div>
            <CheckInfoModal :item="item.checkData"></CheckInfoModal>
          </div>
          <div
            :class="{
              'overlay overlay-checkInfo': !isMinimized,
            }"
            v-if="item.isShowInfoActive"
            @click="closeCheckInfo"
          ></div>
        </div>
      </div>
    </div>
    <div
      :class="{
        'overlay overlay-checkSelected': !isMinimized,
      }"
      v-if="isActive"
      @click="changeActiveState"
    ></div>
  </div>
</template>
<script>
import CheckInfoModal from '@/components/CheckInfoModal.vue'
export default {
  name: 'CheckSelectedModal',
  props: ['checkData', 'isActive', 'isMinimized', 'icons'],
  components: {
    CheckInfoModal,
  },
  data() {
    return {}
  },
  methods: {
    closeCheckInfo: function () {
      this.$emit('changeActiveState', 'checkInfoCheckSelected')
    },
    changeActiveState: function () {
      this.$emit('changeActiveState', 'checkSelected')
    },
    showInfo: function (id, name) {
      this.$emit('getCheckInfo', id, name)
    },
    handleScroll: function () {
      this.$refs.container.scrollTop = this.$refs.container.scrollHeight
    },
  },
  mounted() {
    console.log(this.$refs)
  },
}
</script>
