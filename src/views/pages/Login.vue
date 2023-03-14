<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Role"
                      v-model="email"
                      autocomplete="off"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="off"
                      v-model="password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" @click="login()" class="px-4">
                        Login
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import router from '@/router'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
  setup() {},
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    ...mapGetters('auth', {
      getLoginApiStatus: 'getLoginApiStatus',
    }),
  },
  methods: {
    ...mapActions('auth', {
      actionLoginApi: 'loginApi',
    }),
    async login() {
      console.log(this.email, this.password)
      const payload = {
        email: this.email,
        password: this.password,
      }
      await this.actionLoginApi(payload)
      if (this.getLoginApiStatus == 'success') {
        router.push({ name: 'Main' })
      } else {
        alert('failed')
      }
    },
  },
}
</script>
