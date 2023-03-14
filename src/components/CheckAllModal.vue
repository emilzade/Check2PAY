<template>
  <div class="modal-vue">
    <div
      ref="container"
      :class="{
        'checkAll-modal p-3': !isMinimized,
        'checkAll-modal-minimized border shadow': isMinimized,
      }"
      class="rounded scroll-smooth"
      v-if="isActive"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div
        :class="{
          'Check-All-Inner-ModalMaximized  justify-content-between':
            !isMinimized,
          'Check-All-Inner-ModalMinimized justify-content-center': isMinimized,
        }"
        class="d-flex overflow-hidden p-1 bg-light rounded-top align-items-center transition-1"
      >
        <div v-if="!isMinimized" class="d-flex gap-4 fs-08">
          <div>
            <span class="text-secondary">Elements checked: </span>
            <span class="text-success">{{ currentCheckingElementNumber }}</span>
          </div>
          <div>
            <span class="text-secondary">Elements Left: </span>
            <span class="text-warning">{{ elementsLastForCheck }}</span>
          </div>
          <div>
            <span class="text-secondary">Total Elements: </span
            ><span class="text-info">{{ allElementsCountForCheck }}</span>
          </div>
          <div>
            <span class="text-secondary">Time Elapsed: </span
            ><span class="text-dark"
              >{{ checkTimeElapsed.minutes }}:{{
                checkTimeElapsed.seconds
              }}</span
            >
          </div>
        </div>
        <div class="d-flex gap-4 align-items-center">
          <div v-if="!isMinimized" @click="stopCheckAll">
            <div class="btn btn-danger text-light" v-if="!isStopped">
              Stop Loading
            </div>
            <div class="btn btn-secondary disabled" v-else>Stopped</div>
          </div>
          <CIcon
            v-if="!isMinimized"
            :content="icons.cilWindowMinimize"
            @click="minimizeModal"
            width="40"
            class="border rounded"
            height="30"
            role="button"
          />
          <CIcon
            v-if="isMinimized"
            :content="icons.cilWindowMaximize"
            @click="maximizeModal"
            width="40"
            class="border rounded"
            role="button"
            height="30"
          />
          <CIcon
            :content="icons.cilX"
            @click="changeActiveState"
            width="40"
            class="border rounded"
            role="button"
            height="30"
          />
        </div>
      </div>
      <div class="m-5 p-5 overflow-hidden transition-1">
        <div
          v-for="item in checkData"
          :key="item.id"
          class="checkAll-item-animation border rounded my-2 ps-3 d-flex justify-content-between align-items-center position-relative"
        >
          <div>
            <!-- <CIcon
              class="cursor-pointer"
              :content="icons.cilInfo"
              @click="showInfo(item.id, 'checkAll')"
            /> -->
            <CIcon
              class="cursor-pointer"
              :content="icons.cilInfo"
              @click="showInfo(item.id, 'checkAll')"
            />
          </div>
          <div class="px-2 text-secondary small">{{ item.serviceid }}</div>
          <div class="w-85 small">{{ item.name }}</div>
          <LoaderCheck :isLoading="item.isLoading"></LoaderCheck>
          <div
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
          <div>
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
                  class="border rounded"
                />
              </div>
              <CheckInfoModal :item="item"></CheckInfoModal>
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
    </div>
    <div
      :class="{
        'overlay overlay-checkAll': !isMinimized,
      }"
      v-if="isActive"
      @click="changeActiveState"
    ></div>
  </div>
</template>
<style>
.checkAll-item-animation {
  animation-name: check-item;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
}
@keyframes check-item {
  0% {
    transform: translateX(-30%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>
<script>
import CheckInfoModal from '@/components/CheckInfoModal.vue'
import LoaderCheck from '@/components/LoaderCheck.vue'
export default {
  name: 'CheckAllModal',
  props: [
    'checkData',
    'isActive',
    'isMinimized',
    'isStopped',
    'icons',
    'currentPosition',
    'currentCheckingElementNumber',
    'elementsLastForCheck',
    'allElementsCountForCheck',
    'checkTimeElapsed',
  ],
  components: {
    CheckInfoModal,
    LoaderCheck,
  },
  data() {
    const isHovered = false
    return {
      interval: null,
      isHovered,
    }
  },
  computed: {
    currentHeight: function () {
      return this.$refs.container.scrollHeight
    },
  },
  methods: {
    closeCheckInfo: function () {
      this.$emit('closeCheckInfoModal', 'checkInfoCheckAll')
    },
    changeActiveState: function () {
      this.$emit('changeActiveState', 'checkAll')
    },
    maximizeModal: function () {
      this.$emit('maximizeModal')
    },
    minimizeModal: function () {
      this.$emit('minimizeModal')
    },
    stopCheckAll: function () {
      this.$emit('stopCheckAll')
    },
    showInfo: function (id, name) {
      this.$emit('getCheckInfo', id, name)
    },
    handleScroll: function () {
      if (!this.isHovered) {
        this.$refs.container.scrollTop = this.$refs.container.scrollHeight
      }
    },
    getScrollTop: function () {
      return this.$refs.container.scrollTop
    },
  },
  created() {},
}
</script>
