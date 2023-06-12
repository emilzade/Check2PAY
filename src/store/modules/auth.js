import axios from 'axios'
import VueCookies from 'vue-cookies'
//import jwtInterceptor from '../../shared/jwt.interceptor'z
const state = () => ({
  loginApiStatus: '',
  userProfile: {
    id: 0,
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
  },
  logOut: false,
})

const getters = {
  getLoginApiStatus(state) {
    return state.loginApiStatus
  },
  getUserProfile(state) {
    return state.userProfile
  },
  getLogout(state) {
    return state.logOut
  },
  getToken(state) {
    return state.token
  },
}

const actions = {
  async loginApi({ commit }, data) {
    console.log(data)
    const configObject = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }

    await fetch('http://localhost:84/api/Authenticate/login', configObject)
      .then((response) => response.json())
      .then(async (loginData) => {
        console.log(loginData)

        if (loginData.status == 200) {
          commit('setLoginApiStatus', 'success')
          localStorage.setItem('role', 'admin')
          localStorage.setItem('isAuthenticated', true)
          commit('setIsAuthenticated', true)

          var slicedDate =
            loginData.expiration.slice(0, 10) +
            ' ' +
            loginData.expiration.slice(11, 19)

          var parsedDate = new Date(slicedDate)
          var addedDate = parsedDate.setTime(
            parsedDate.getTime() + 2 * 60 * 60 * 1000,
          )
          var ceiledDate = Math.ceil((addedDate - new Date()) / 1000)

          VueCookies.set('token', loginData.token, `${ceiledDate}s`)
          commit('setToken', loginData.token)

          await fetch(
            `http://localhost:84/api/User/GetUser?username=${data.username}`,
            {
              method: 'GET',
              headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: `Bearer ${loginData.token}`,
              },
            },
          )
            .then(async (response) => await response.json())
            .then((userData) => {
              console.log(userData)
              localStorage.setItem('user', JSON.stringify(userData.data[0]))
              commit('setUserProfile', JSON.stringify(userData.data[0]))
            })
        } else {
          commit('setLoginApiStatus', 'failed')
          localStorage.setItem('role', '')
          localStorage.setItem('isAuthenticated', false)
          commit('setIsAuthenticated', false)
          VueCookies.set('token', '', '')
          commit('setToken', '')
        }
      })
  },
  /*
  async loginApi({ commit }, payload) {
    const response = await axios
      .post('http://localhost:3000/auth/login', payload, {
        withCredentials: true,
        credentials: 'include',
      })
      .catch((err) => {
        console.log(err)
      })

    if (response && response.data) {
      localStorage.setItem('isAuthenticated', 'true')
      commit('setLoginApiStatus', 'success')
    } else {
      commit('setLoginApiStatus', 'failed')
    }
  },*/
  // async loginApi({ commit }, data) {
  //   const configObject = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data),
  //   }
  //   await fetch('http://localhost:84/api/Authenticate/login', configObject)
  //     .then(async (response) => await response.json())
  //     .then((data) => {
  //       console.log(data)
  //       if (data.status == 200) {
  //         commit('setLoginApiStatus', 'success')
  //         localStorage.setItem('isAuthenticated', 'true')
  //       } else if (data.status == 401) {
  //         commit('setLoginApiStatus', 'failed')
  //         localStorage.setItem('isAuthenticated', 'false')
  //       }
  //     })
  // },

  async userProfile({ commit }) {
    // const response = await jwtInterceptor
    //   .get('http://localhost:3000/user-profile', {
    //     withCredentials: true,
    //     credentials: 'include',
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })

    // if (response && response.data) {
    //   commit('setUserProfile', response.data)
    // }
    const customUser = {
      id: 1,
      lastName: 'Testov',
      firstName: 'Test',
      email: 'test@mail.ru',
      phone: '100',
    }
    commit('setUserProfile', customUser)
  },

  async userLogout({ commit }) {
    const response = await axios
      .get('http://localhost:3000/logout', {
        withCredentials: true,
        credentials: 'include',
      })
      .catch((err) => {
        console.log(err)
      })

    if (response && response.data) {
      commit('setLogout', true)
      localStorage.removeItem('isAuthenticated')
    } else {
      commit('setLogout', false)
    }
  },
}

const mutations = {
  setUserProfile(state, data) {
    state.userProfile = data
  },
  setLoginApiStatus(state, data) {
    state.loginApiStatus = data
  },
  setIsAuthenticated(state, data) {
    state.isAuthenticated = data
  },
  setToken(state, data) {
    state.token = data
  },
  setLogout(state, payload) {
    state.logOut = payload
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
