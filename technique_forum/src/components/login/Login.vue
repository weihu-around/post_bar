<template>
    <div id="container">
        <div id="title">用户登录</div>
        <!-- 信息输入区 -->
        <el-row class="input">
            <el-col :span="3"><div class="label">账户：</div></el-col>
            <el-col :span="9"><el-input v-model="account" prefix-icon="User" aria-placeholder="请输入账户"></el-input></el-col>
        </el-row>
        <el-row class="input">
            <el-col :span="3"><div class="label">密码：</div></el-col>
            <el-col :span="9"><el-input v-model="password" prefix-icon="Key" aria-placeholder="请输入密码"></el-input></el-col>
        </el-row>
        <!-- 登录按钮区 -->
        <el-button @click="login" style="width: 100px;margin-top: 20px;margin-left: 100px;" type="primary" :disabled="disabled">登录</el-button>
        <!-- 跳转注册页面的链接 -->
         <div class="link"><el-link href="#/sign">还没有账户？立即注册</el-link></div>
    </div>
</template>

<script lang="ts">
    import {Options, Vue} from 'vue-class-component';
    import networkPath from '../../tools/Network';
    import store, {UserInfo} from '@/tools/Store';
    import { ElMessage } from 'element-plus';

    @Options({})
    export default class Login extends Vue {
        // 登录按钮是否可用
        get disabled(){
            return !(this.account && this.password)
        }
        // 绑定到账户输入框的数据
        account?: string = ""
        // 绑定到密码输入框的数据
        password?: string = ""
        // 登录按钮单击的方法
        login() {
            this.axios.get(networkPath.login + `?account=${this.account}&password=${this.password}`).then((res)=>{
                let userInfo:UserInfo = res.data.content;
                // 进行用户信息的全局状态修改
                store.commit('registUserInfo', userInfo);
                ElMessage({
                    message: '登录成功，即将跳转到首页 ~ ',
                    type: 'success'
                })
                setTimeout(()=>{
                    this.$router.push({name: 'home'})
                }, 2000)
            }).catch((error)=>{
                ElMessage.error(error.response.data.msg)
            })
        }
    }
</script>

<style scoped>
    #container {
        margin: 0 auto;
        width: 800px;
        background-color: white;
        box-shadow: 5px 5px 10px #c1c1c1;
        border-radius: 5px;
        overflow: hidden;
    }
    #title {
        margin: 10px 0px 0px 20px;
        font-size: 18px;
        font-weight: bold;
    }
    .label {
        display: flex;
        height: 100%;
        line-height: 100%;
        justify-content: center;
        align-items: center;
    }
    .input {
        margin-top: 20px;
        text-align: center;
    }
    .link {
        margin-left: 100px;
        margin-top: 15px;
        margin-bottom: 20px;
    }
</style>