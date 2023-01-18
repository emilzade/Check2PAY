<template>
  <div class="modal-vue">
    <div class="settings-modal rounded p-3" v-if="isActive">
      <div v-if="isLoading" class="modal-loading bg-light rounded">
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
          :content="icons.cilX"
          @click="changeActiveState"
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
          v-if="isInputFocused == false"
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
                  @focus="parameterInputFocused"
                />
              </CFormLabel>
              <CFormLabel class="w-50 mx-2 text-secondary my-auto"
                >Parameter value
                <CFormInput
                  :value="parameterOfElement.value"
                  @input="
                    (event) => (parameterOfElement.value = event.target.value)
                  "
                  @focus="parameterInputFocused"
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
                <CIcon class="text-light" :content="icons.cilTrash"></CIcon>
              </div>
            </CCol>
            <CCol class="col-12 d-flex justify-content-between">
              <CFormInput
                @click="changeAddParameterActiveState"
                value="Add"
                type="button"
                class="btn btn-outline-primary w-25"
              />
              <CFormInput
                @click="editParameter(parameterListOfElement.Id)"
                class="btn btn-outline-warning w-25"
                value="Edit"
                type="button"
              />
            </CCol>
            <CCol
              v-if="isAddActive"
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
                @click="addNewParameter(parameterListOfElement.Id)"
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
      v-if="isActive"
      @click="changeActiveState"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'SettingsModal',
  props: [
    'isActive',
    'isLoading',
    'icons',
    'parameterListOfElement',
    'parameterChangeData',
    'isInputFocused',
    'isAddActive',
  ],
  data() {
    const newParameter = {
      id: 1,
      active: true,
      serviceid: null,
      name: null,
      value: null,
    }
    return {
      newParameter,
    }
  },
  methods: {
    changeAddParameterActiveState: function () {
      this.$emit('changeAddActiveState')
    },
    changeActiveState: function () {
      this.$emit('changeActiveState', 'settings')
    },
    parameterInputFocused: function () {
      this.$emit('paramInputFocused')
    },
    removeParameter(serviceId, parameterId) {
      this.$emit('removeParameterOfElement', serviceId, parameterId)
    },
    addNewParameter: function (id) {
      this.$emit('addNewParameter', id, this.newParameter)
    },
    editParameter: function (id) {
      this.$emit('editParameter', id)
    },
  },
}
</script>
