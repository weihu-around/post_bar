import { createStore } from "vuex";
// 描述用户信息的接口
interface UserInfo {
    account: string,
    nickname: string,
    id: number
}
const store = createStore<UserInfo>({
    // 进行状态数据初始化
    state(){
        return {
            account: "",
            nickname: "",
            id: NaN
        }
    },
    // 提供一个Getter方法来获取登录状态
    getters: {
        isLogin: (state) => {
            return !isNaN(state.id)
        }
    },
    // 提供修改用户信息和清空用户信息的方法
    mutations: {
        clearUserInfo(state){
            state.account = "";
            state.nickname = "";
            state.id = NaN;
        },
        registUserInfo(state, userinfo: UserInfo) {
            state.account = userinfo.account;
            state.nickname = userinfo.nickname;
            state.id = userinfo.id;
        }
    }
})

// 导出需要使用的对象和接口
export default store;
export {UserInfo};