<template>
    <div id="container">
        <!-- 顶部的模块导航部分 -->
         <el-menu mode="horizontal" @select="selectedItem" default-active="0">
            <el-menu-item v-for="(item, index) in categoryData" :index="`${index}`" :key="index">{{item.label}}</el-menu-item>
         </el-menu>
         <!-- 帖子列表部分 -->
        <div>
            <!-- 通过for循环来创建列表 -->
            <div class="post" v-for="(post, index) in posts" :key="index" @click="goDetail(index)">
                <span class="avatar">{{post.author.nickname.charAt(0)}}</span>
                <span class="content">
                    <div class="title">{{post.title}}</div>
                    <div class="summary">{{post.summary}}</div>
                    <div class="time">发布时间：{{post.publish_time}}</div>
                </span>
                <div class="line"></div>
            </div>
            <!-- 分页时加载更多按钮 -->
            <div class="more" @click="loadMore">{{ bottomViewText }}</div>
        </div>
    </div>
    <div class="publish">
        <el-button type="primary" style="width: 50px; height: 50px; font-size: 30px;" icon="Edit" circle v-on:click="publishPost" />
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import { CategoryModel, Post } from '../../tools/Model';
    import networkPath from '../../tools/Network';
    import { ElMessage, ElMessageBox } from 'element-plus';

    @Options({})
    export default class Home extends Vue {
        categoryData: CategoryModel[] = [] // 子模块类别数据
        posts:Post[] = []            // 帖子列表数据
        selectedCategoryId = 0       // 当前选中的子模块id
        hasMore = true               // 是否有更多数据可以加载
        bottomViewText = "单击加载更多"
        // 声明周期方法，组件挂载时请求分类数据
        mounted():void {
            this.loadDataCategories()
        }
        // 请求全部子模块数据
        loadDataCategories():void {
            this.axios.get(networkPath.categories).then((res)=>{
                this.categoryData = res.data.content;
                this.selectedCategoryId = this.categoryData[0].id;
                this.loadPosts(); // 加载对应子模块的帖子数据
            }).catch(()=>{
                ElMessage.error("网络失败，请稍后刷新页面")
            })
        }
        // 加载帖子数据
        loadPosts() {
            // 请求帖子数据
            this.axios.get(networkPath.posts + `?category_id=${this.selectedCategoryId}&offset=0&limit=5`).then((response)=>{
                // 赋值帖子列表变量，响应式的更新页面
                this.posts =  response.data.content;
                // 处理是否可以加载更多数据的逻辑
                if (response.data.content.length < 5) {
                    this.bottomViewText = "到底啦~"
                    this.hasMore = false
                } else {
                    this.bottomViewText = "点击加载更多"
                    this.hasMore = true
                }
            }).catch(()=>{
                ElMessage.error("网络失败，请稍后刷新页面")
            })
        }
        // 加载更多数据
        loadMore() {
            if (!this.hasMore) {
                return;
            }
            this.axios.get(networkPath.posts + `?category_id=${this.selectedCategoryId}&offset=${this.posts.length}&limit=5`).then((response)=>{
                // 将新请求到的数据追加到当前列表的末尾 
                this.posts.push(...response.data.content);
                console.log(this.posts);
                if (response.data.content.length < 5) {
                    this.bottomViewText = "到底啦~"
                    this.hasMore = false
                } else {
                    this.bottomViewText = "点击加载更多"
                    this.hasMore = true
                }
            }).catch(()=>{
                ElMessage.error("网络失败，请稍后刷新页面")
            })
        }
        // 选中某个子模块调用方法
        selectedItem(index: number, indexPath:Array<string>) {
            console.log(index, indexPath)
            this.selectedCategoryId = this.categoryData[index].id;
            console.log('用户选择阅览模块：' + this.selectedCategoryId + ',' + this.categoryData[index].label)
            this.loadPosts();
        }
         // 发布帖子
        publishPost() {
            ElMessageBox.confirm(`确认在当前模块下发布新的帖子？`).then(() => {
                // 跳转到帖子发布页面
                this.$router.push({name:"publish", params:{category_id: this.selectedCategoryId}})
            }).catch(()=>{
                console.log("取消发布");
            });
        }
        // 跳转帖子详情页
        goDetail(index: number){
            let postId = this.posts[index].id;
            this.$router.push({name: 'detail', params: {id: postId}});
        }
    }
</script>

<style scoped>
/* 容器的样式 */
#container {
    margin: 0 auto;
    width: 950px;
    background-color: white;
    box-shadow: 5px 5px 10px #c1c1c1;
    border-radius: 5px;
    overflow:hidden;
    position: relative;
}
/* 帖子项的样式 */
.post {
    height: 130px;
    background-color: white;
    position: relative;
}
/* 头像样式 */
.avatar {
    margin-top: 15px;
    margin-left: 15px;
    width: 50px;
    height: 50px;
    background-color:azure;
    color: black;
    font-size: 30px;
    font-weight: bold;
    display:inline-block;
    text-align: center;
    line-height: 50px;
    border-radius: 10px;
    position: absolute;
}
/* 内容部分样式 */
.content {
    margin-top: 0px;
    padding: 0px;
    display:inline-block;
    margin-left: 80px;
    margin-right: 80px;
    position: absolute;
}
/* 标题样式 */
.title {
    margin-top: 10px;
    width: 100%;
    font-weight: bold;
    color: #444444;
    font-size: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
}
/* 摘要样式 */
.summary {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-top: 5px;
    font-size: 15px;
    line-height: 25px;
    color: #777777;
}
/* 时间模块样式 */
.time {
    font-size: 14px;
    margin-top: 5px;
    color: #a1a1a1;
}
/* 分割线样式 */
.line {
    background-color: #e1e1e1;
    width: 100%;
    height: 1px;
    position:absolute; 
    bottom:0;
}
/* 加载更多按钮的样式 */
.more {
    height: 50px;
    line-height: 50px;
    text-align: center;

}
/* 发布按钮样式 */
.publish {
    position: fixed;
    right: 100px;
    top: 110px;
}

</style>