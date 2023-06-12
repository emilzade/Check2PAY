<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm>
                <h1>Register</h1>
                <p class="text-medium-emphasis">Create your account</p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="First Name"
                    v-model="formData.firstname"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Last Name"
                    v-model="formData.lastname"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Username"
                    v-model="formData.username"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-at" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Email account"
                    v-model="formData.email"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Password"
                    v-model="formData.password"
                  />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Repeat password"
                    v-model="repeatPassword"
                  />
                </CInputGroup>
                <div class="d-grid">
                  <CButton color="success" @click="createAccount"
                    >Create Account</CButton
                  >
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    const formData = {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
    }
    const repeatPassword = ''
    return {
      formData,
      repeatPassword,
    }
  },
  methods: {
    createAccount: function () {
      console.log(this.formData)
      if (this.formData.password != this.repeatPassword) {
        // alert for not correct password
      } else {
        const configObject = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formData),
        }
        fetch(
          `${this.$store.state.testApi}/api/Authenticate/register`,
          configObject,
        ).then((response) => response.json().then((data) => console.log(data)))
      }
    },
  },
  beforeMount() {},
}
</script>
