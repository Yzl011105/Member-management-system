const state = {
    count: 0
}
const mutations = {
    add(state, n) {//n 为荷载
        state.count += n
    },
    subtraction(state, n) {
        state.count -= n
    }
}
const actions = {
    add1(context, n) {
        // 触发 mutations 中的 increment 改变 state
        context.commit('add', n)
    },
    subtraction1(context, n) {
        //按需传值
        context.commit('subtraction', n)
    }
}
const getters = {
    desc(state) {
        if (state.count < 50) {
            return '吃饭'
        } else if (state.count < 100) {
            return '睡觉'
        } else {
            return '打豆豆'
        }
    }
}

export default {//将整体变为一个对象作为默认成员导出
    // 存放状态（共享属性）
    state,
    //派生属性
    getters,
    // 改变 state 状态
    mutations,
    actions,
}