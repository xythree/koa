import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export function createStore(context) {

    return new Vuex.Store({
        state: {
            list: context.list,
            article: context.article
        },
        actions: {

        },
        mutations: {

        }
    })
}