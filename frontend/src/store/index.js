import { createStore } from 'vuex'

const axios = require('axios');

const instance = axios.create({
  baseURL :"http://localhost:3000/api/"
});

let user = localStorage.getItem('user');
if (!user) {
  user = {
    userId:-1,
    token:'',
  };  
}else{
  try{
    user = JSON.parse(user);
    instance.defaults.headers.common['Authorization'] = user.token;
  }catch{
    user = {
      userId:-1,
      token:'',
    };
  } 
}

export default createStore({
  state: {
    status: '',
    user: user,
    userInfos: {
      username:'',
      email:'',
      password:'',
    },
    userMessages:[],

  },
  mutations: {
    setStatus: function(state,status){
      state.status = status;
    },
    logUser: function(state, user){
      instance.defaults.headers.common['Authorization'] = user.token;
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    userInfos: function(state, userInfos) {
      state.userInfos = userInfos;
    },
    userMessages: function(state, userMessages){
      state.userMessages = userMessages;
      console.log(state.userMessages);
    },
    addMessage: function(state, userMessages){
      state.userMessages.push(userMessages);
    },
    deleteMessage: function(state, /*deleteMessage*/){
      console.log(state.userMessages.length)
      //const postion = state.userMessages.findIndex( (el) => el.id===deleteMessage);
      //state.userMessages.splice(postion,1)
      //state.userMessages = [...state.userMessages]
      console.log(state.userMessages.length)
    },

    logout: function(state) {
      state.user = {
        userId: -1,
        token: ''
      }
      localStorage.removeItem('user');
    }
  },
  actions: {
    createAccount: ({commit}, userInfos) =>{
      commit('setStatus', 'loading');
      return new Promise ((resolve, reject) => {
        commit;
        instance.post('/user/signup', userInfos)
        .then(function (response){
          commit('setStatus', 'created');
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error_create');
          reject(error);
        })
      })  
    },
    login: ({commit}, userInfos) =>{
      commit('setStatus', 'loading');
      return new Promise ((resolve, reject) => {
        instance.post('/user/login', userInfos)
        .then(function (response){
          commit('setStatus', '');
          commit('logUser', response.data);
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error_login');
          reject(error);
        })
      })  
    },
    deleteAccount: ({commit}) =>{
      instance.delete('/user/:id')
      .then(function (response){
        commit('userInfos', response.data);
      })
    },

    getUserInfos: ({commit}) => {
      instance.get('/user/me')
      .then(function (response){
        commit('userInfos', response.data);
      })
      .catch(function(){
      })
    },
    modifBio: ({commit}, userInfos) =>{
      return new Promise ((resolve, reject) => {
        commit;
        instance.put('/user/me', userInfos)
        .then(function (response){
          commit;
          resolve(response);
        })
        .catch(function(error){
          reject(error);
        })
      })  
    },

    getuserMessages :({commit}) => {
      instance.get('/message/')
      .then(function(response){
        commit('userMessages', response.data);
      })
    },
    createMessage: ({commit}, userMessages) =>{
      return new Promise ((resolve, reject) => {
        instance.post('/message/new', userMessages)
        .then(function (response){
          commit("addMessage", response.data);
          document.location.reload();
          resolve(response);
        })
        .catch(function(error){
          reject(error);
        })
      })  
    },
    deleteMessage: ({commit},data) =>{
      console.log(data)
      instance.delete('/message/'+data.id)
      .then(function (response){
        commit('deleteMessage', response.data);
        document.location.reload();
      })
      .catch(function(){
        window.alert("Vous n'etes pas autorisé a supprimer ce message !")
      })
    },
  },
})
