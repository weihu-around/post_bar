<template>
    <!-- 显示当前的子模块名称 -->
    <div class="category">
        当前模块：{{ post?.category.label ?? "" }}
    </div>
    <!-- 内容部分 -->
    <div id="container">
        <!-- 帖子标题 -->
         <div class="title">
            {{ post?.title }}
         </div>
         <!-- 作者，发布时间等 -->
         <div>
            <span class="tag">作者：{{ post?.author.nickname }}</span>
            <span class="tag">发布时间：{{ post?.publish_time }}</span>
            <span class="tag delete" v-if="post?.author.id == userId" @click="deletePost">删除帖子</span>
         </div>
         <!-- 摘要部分 -->
         <div class="summary">
            <div class="summary_title">摘要</div>
            <div class="summary_content">{{ post?.summary }}</div>
         </div>
         <!-- 帖子内容 -->
         <div v-html="post?.content" class="content editor-content-view"></div>
    </div>
    <!-- 评论部分 -->
    <div id="container">
        <!-- 标题 -->
         <div class="comment_title">
            <span>用户评论</span>
            <span style="margin-left: 10px; font-size: 12px; padding: 10px; font-weight: bold; background-color: antiquewhite; border-radius: 10px;" v-on:click="publicComment">发布评论</span>
         </div>
         <div v-for="(item, index) in comments" :key="index" @click="publishReply(index)">
            <div class="comment_icon">
                {{ item.author.nickname[0] }}
            </div>
            <div class="comment_container">
                <div v-if="item.reply" class="reply">
                    回复{{ item.reply?.nickname }}:
                </div>
                <div class="comment_content">
                    {{ item.author.nickname }}说: {{ item.content }}
                </div>
                <div class="comment_tags">
                    <span>
                        发布时间: {{ item.publish_time }}
                    </span>
                    <span v-if="item.author.id == userId" style="color: red;" @click.stop="deleteComment(item.id)">
                        删除
                    </span>
                </div>
            </div>
        </div>
        <div v-if="hasMoreComments" class="comment_more" @click="loadComment">
            点击加载更多
         </div>
    </div>
    <!-- 发布评论的对话框 -->
    <el-dialog v-model="conmentPannelOpen" title="发布评论">
        <div style="margin-bottom: 30px; font-size: 22px;" v-if="replyTo">回复：{{ replyTo.nickname }}</div>
        <div>
            <el-input
                v-model="commentText"
                :rows="4"
                type="textarea"
                placeholder="请输入评论"
            />
        </div>
        <div style="margin-top: 30px;">
            <el-button size="large" type="primary" :disabled="canPublishComment" @click="toPublishComment">评论</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import { Post, Comment } from '../../tools/Model';
    import networkPath from '../../tools/Network';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import store, { UserInfo } from '../../tools/Store';

    
    @Options({
        props:{
            id:String // 当前帖子的id,由路由传递过来
        }
    })
    export default class PostDetail extends Vue {
        id!:string   // 帖子id
        post:Post | null = null   // 帖子数据
        userId = store.state.id   // 当前登录的用户id，如果未登录，为NaN
        comments: Comment[] = []  // 评论列表的数据
        hasMoreComments = true    // 标记是否还有更多评论
        conmentPannelOpen = false  // 是否展示发布评论的窗口
        replyTo: UserInfo | null = null // 回复的用户，如果没有回复的用户，则为null
        commentText = ""        // 绑定到输入框的评论内容
        get canPublishComment(): boolean {  // 计算属性，标记发布评论对话框中的发布按钮是否可用
            return this.commentText.length <= 0
        }
        // 组件挂载时，请求帖子详情数据和评论数据
        mounted(): void {
            this.loadData();  // 请求帖子数据
            this.loadComment(); // 请求评论数据
        }
        // 加载帖子数据
        loadData() {
            this.axios.get(networkPath.detail + `?id=${this.id}`).then((response)=>{
                this.post = response.data.content;
            }).catch((error)=>{
                ElMessage.error(error.response.msg);
            });
        }
       
        // 删除帖子的方法
        deletePost() {
            // 弹出消息框，删除操作需要用户二次确认
            ElMessageBox.confirm(`确认删除当前帖子？删除后将不可恢复！`).then(() => {
                this.axios.delete(networkPath.deletePost,{
                    data: {
                        id: this.id
                    }
                }).then(()=>{
                    ElMessage.success('删除成功');
                    // 3秒后自动跳转到首页
                    setTimeout(()=>{
                    this.$router.push({name:"home"})
                    }, 3000);
                }).catch((error)=>{
                    ElMessage.error(error.response.msg);
                });
            }).catch(()=>{
                console.log("取消删除");
            });
        }
        // 加载评论数据
        loadComment() {
            this.axios.get(networkPath.comments + `?post_id=${this.id}&offset=${this.comments.length}&limit=5`).then((response)=>{
                // 赋值评论数据
                this.comments.push(...response.data.content);
                // 对应修改是否有更多评论数据的变量
                this.hasMoreComments = response.data.content.length == 5;
            }).catch((error)=>{
                ElMessage.error(error.response.msg);
            })
        }
        // 删除评论
        deleteComment(id:number) {
            // 弹出消息框，删除操作需要用户二次确认
            ElMessageBox.confirm(`确认删除当前评论？删除后将不可恢复！`).then(() => {
                this.axios.delete(networkPath.deleteComment,{
                    data: {
                        id: id
                    }
                }).then(()=>{
                    ElMessage.success('删除成功');
                    // 3秒后自动刷新评论区
                    setTimeout(()=>{
                        this.comments = [];
                        this.loadComment();
                    }, 3000);
                }).catch((error)=>{
                    ElMessage.error(error.response.msg);
                });
            }).catch(()=>{
                console.log("取消删除");
            });
        }
        // 发布评论
        publicComment() {
            this.replyTo = null;
            this.conmentPannelOpen = true;
        }
        // 发布回复
        publishReply(index: number) {
            this.replyTo = this.comments[index].author;
            this.conmentPannelOpen = true;
        }
        // 调用发布方法
        toPublishComment() {
            var params:any = {
                post_id: this.id,
                content: this.commentText,
                author_id: this.userId
            }
            if (this.replyTo) {
                params.reply_to = this.replyTo.id;
            }
            this.axios.post(networkPath.createComment, params).then(()=>{
                ElMessage.success('评论成功');
                setTimeout(()=>{
                    this.comments = [];
                    this.loadComment();
                    this.conmentPannelOpen = false;
                    this.commentText = "";
                }, 3000);
            }).catch((error)=>{
                ElMessage.error(error.response.msg);
            });
        }
    }
    </script>

<!-- 局部CSS样式，只在PostDetail组件内生效 -->
<style scoped>
#container {
    margin-left: 80px;
    margin-top: 10px;
    width: 950px;
    background-color: white;
    box-shadow: 5px 5px 10px #c1c1c1;
    border-radius: 5px;
    overflow:hidden;
    position: relative;
}
.category {
    color: #777777;
    margin-left: 80px;
}

.title {
    font-size: 40px;
    margin-left: 15px;
    margin-top: 15px;
    margin-right: 15px;
}

.tag {
    margin-left: 20px;
    color: #777777;
}

.delete {
    color: red;
}

.summary {
    background-color: #EEF1FE;
    border-radius: 10px;
    margin: 10px;
    margin-top: 40px;
    padding: 20px;
}

.summary_title {
    font-weight: bold;
}

.summary_content {
    margin-top: 20px;
    color:#333333;
}

.content {
    margin: 20px;
}

.comment_title {
    font-size: 20px;
    margin: 15px 15px;
}

.comment_icon {
    width: 50px;
    height: 50px;
    display: inline-block;
    background-color: #c1c1c1;
    border-radius: 5px;
    margin: 15px;
    text-align: center;
    font-size: 30px;
    line-height: 50px;
    font-weight: bold;
    vertical-align: top;
}

.reply {
    font-size: 14px;
    color: #777777;  
}

.comment_container {
    display: inline-block;
    margin-right: 20px;
    margin-top: 15px;
    vertical-align: top;
}

.comment_content {
    font-size: 18px;
}

.comment_tags {
    margin-top: 5px;
    font-size: 14px;
    color: #c1c1c1;
}

.comment_more {
    text-align: center;
    font-size: 18px;
    margin: 10px;
    padding-top: 20px;
    border-top: #f1f1f1 1px solid;
    margin-bottom: 50px;
}
</style>

<!-- 全局CSS样式，用来渲染富文本样式 -->
<style>
.editor-content-view {
    padding: 0 10px;
    margin-top: 20px;
    overflow-x: auto;
}

.editor-content-view p,
.editor-content-view li {
    white-space: pre-wrap; /* 保留空格 */
}

.editor-content-view blockquote {
    border-left: 8px solid #d0e5f2;
    padding: 10px 10px;
    margin: 10px 0;
    background-color: #f1f1f1;
}

.editor-content-view code {
    font-family: monospace;
    background-color: #eee;
    padding: 3px;
    border-radius: 3px;
}
.editor-content-view pre>code {
    display: block;
    padding: 10px;
}

.editor-content-view table {
    border-collapse: collapse;
}
.editor-content-view td,
.editor-content-view th {
    border: 1px solid #ccc;
    min-width: 50px;
    height: 20px;
}
.editor-content-view th {
    background-color: #f1f1f1;
}

.editor-content-view ul,
.editor-content-view ol {
    padding-left: 20px;
}

.editor-content-view input[type="checkbox"] {
    margin-right: 5px;
}
</style>