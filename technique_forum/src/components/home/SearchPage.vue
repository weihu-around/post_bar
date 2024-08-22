<template>
    <div id="container">
        <!-- 帖子列表部分 -->
        <div>
            <!-- 通过for循环来创建列表 -->
            <div class="post" v-for="(post, index) in posts" :key="`${index}`" v-on:click="goDetail(index)">
                <span class="avatar">
                    {{ post.author.nickname.charAt(0) }}
                </span>
                <span class="content">
                    <div class="title">
                        {{ post.title }}
                    </div>
                    <div class="summary">
                        {{ post.summary }}
                    </div>
                    <div class="time">
                        发布时间：{{ post.publish_time }}
                    </div>
                </span>
                <div class="line"></div>
            </div>
            <!-- 分页时加载更多按钮 -->
            <div class="more" v-on:click="loadMore">{{ bottomViewText }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Post } from '../../tools/Model'
import networkPath from '../../tools/Network';
import { ElMessage } from 'element-plus';


@Options({
    props: {
        keyword:String
    }
})
export default class SearchPage extends Vue {
    keyword!:string
    // 帖子列表数据
    posts:Post[] = []
    // 标记是否有更多数据可以加载
    hasMore = true
    // 底部加载更多数据按钮的文案
    bottomViewText = "点击加载更多"
    // 生命周期方法，组件挂载时请求分类数据
    mounted(): void {
        this.loadPosts();
    }

    // 加载帖子数据
    loadPosts() {
        // 请求帖子数据
        this.axios.get(networkPath.searchPosts + `?keyword=${this.keyword}&offset=0&limit=5`).then((response)=>{
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
        this.axios.get(networkPath.searchPosts + `?keyword=${this.keyword}&offset=${this.posts.length}&limit=5`).then((response)=>{
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
    // 跳转详情
    goDetail(index: number) {
        let postId = this.posts[index].id;
        this.$router.push({name:'detail', params:{id: postId}});
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

</style>
