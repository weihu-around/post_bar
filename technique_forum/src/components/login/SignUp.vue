<template>
    <div id="container">
        <div id="title">用户注册</div>
        <el-row class="input">
            <el-col :span="3"><div class="label">账户：</div></el-col>
            <el-col :span="9"><el-input v-model="account" prefix-icon="User" placeholder="请输入账号"></el-input></el-col>
        </el-row>
        <el-row class="input">
            <el-col :span="3"><div class="label">昵称：</div></el-col>
            <el-col :span="9"><el-input v-model="nickname" prefix-icon="Reading" placeholder="取个昵称吧"></el-input></el-col>
        </el-row>
        <el-row class="input">
            <el-col :span="3"><div class="label">密码：</div></el-col>
            <el-col :span="9"><el-input v-model="password" prefix-icon="Key" placeholder="请输入密码"></el-input></el-col>
        </el-row>
        <el-button @click="signUp" style="width:100px;margin-top:100px;margin-left: 100px;" type="primary" :disabled="disabled">立即注册</el-button>
        <div class="link"><el-link href="#/login">已有账户？返回登录</el-link></div>
    </div>
</template>

<script lang="ts">
    import {Options, Vue} from 'vue-class-component';
    import networkPath from '../../tools/Network';
    import store, {UserInfo} from '@/tools/Store';
    import { ElMessage } from 'element-plus';

    @Options({})
    export default class SignUp extends Vue {
        // 注册按钮是否可用
        get disabled() {
            return !(this.account && this.password && this.nickname)
        }
        // 账户名
        account?:string = ""
        // 密码
        password?:string = ""
        // 昵称
        nickname?:string = ""
        // 注册按钮单击执行的方法
        signUp() {
            this.axios.post(networkPath.signUp, {
                account: this.account,
                nickname: this.nickname,
                password: this.password
            }).then((res)=>{
                let userInfo:UserInfo = res.data.content;
                // 用户信息的全局状态修改
                store.commit("registUserInfo", userInfo);
                ElMessage({
                    message: '注册成功，即将跳转到首页',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$router.push({name: "home"})
                }, 2000);
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