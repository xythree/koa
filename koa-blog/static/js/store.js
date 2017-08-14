import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        searchVal: "",
        articleTotal: 0,
        articleList: []
    },
    actions: {
        setSearchVal({ state }, val) {
            state.searchVal = val
        },
        search({ state, dispatch }, { skip = 0 }) {
            dispatch("getArticleList", { skip })
        },
        getArticleList({ state }, { skip, limit = 15 }) {
            axios.get("/article", {
                params: {
                    txt: state.searchVal,
                    limit,
                    skip
                }
            }).then(result => {
                let data = result.data

                state.articleTotal = data.count
                state.articleList = data.data
            })
        }
    }
})

module.exports = store