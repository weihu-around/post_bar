<template>
    <el-container id="container">
        <!-- 通用头部 -->
        <el-header style="margin: 0;padding: 0;box-shadow: 5px 5px 10px #c1c1c1;" height="80px">
            <el-container style="background-color: #ffffff;margin: 0;padding: 0;height: 80px;">
                <div style="margin: auto;margin-left: 300px;">
                    <h1 style="float: left;">开发者技术交流讨论会</h1>
                    <div v-if="isLogin" style="margin: auto;margin-left:60px;float: left;">
                        <el-input v-model="keyword" style="height: 30px;width: 500px;" placeholder="搜搜感兴趣的帖子吧 ~">
                            <template #prepend>
                                <el-button icon="Search"/>
                            </template>
                            <template #append>
                                <el-button @click="toSearch">前往</el-button>
                            </template>
                        </el-input>
                    </div>
                    <div v-if="isLogin" style="float: left; margin-left: 40px;">
                        <el-button type="danger" @click="logout">登出</el-button>
                    </div>
                </div>
            </el-container>
        </el-header>
        <el-main style="padding: 0;margin-top: 20px;">
            <!-- 这里用来渲染具体的功能模块 -->
            <router-view :key="$route.fullPath"></router-view>
        </el-main>
    </el-container>
</template>

<script lang="ts">
    import {Options, Vue} from 'vue-class-component';
    import store from '../../tools/Store';

    @Options({})
    export default class Layout extends Vue {
        keyword = ""
        get isLogin():boolean {
            return store.getters.isLogin;
        }
        toSearch(){
            if(this.keyword) {
                this.$router.push({name: "search", params: {keyword: this.keyword}})
            }
        }
        logout(){
            store.commit('clearUserInfo');
            this.$router.push({name: 'login'})
        }
    }
</script>

<style scoped>
    #container {
        height: 100%;
        width: 100%;
        margin: 0px;
        padding: 0px;
    }
</style>