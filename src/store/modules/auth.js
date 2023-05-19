import axios from 'axios'
//import jwtInterceptor from '../../shared/jwt.interceptor'
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
}

const actions = {
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
  async loginApi({ commit }, data) {
    const configObject = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
    await fetch('http://localhost:84/api/Authenticate/login', configObject)
      .then(async (response) => await response.json())
      .then((data) => {
        console.log(data)
        if (data.status == 200) {
          commit('setLoginApiStatus', 'success')
          localStorage.setItem('isAuthenticated', 'true')
        } else if (data.status == 401) {
          commit('setLoginApiStatus', 'failed')
          localStorage.setItem('isAuthenticated', 'false')
        }
      })
  },

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
  setLoginApiStatus(state, data) {
    state.loginApiStatus = data
  },

  setUserProfile(state, data) {
    const userProfile = {
      id: data.id,
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      phone: data.phone,
    }
    state.userProfile = userProfile
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
