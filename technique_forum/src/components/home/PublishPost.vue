<template>
    <!-- 标题输入模块 -->
  <div id="container">
    <input placeholder="请输入帖子标题"  class="title" v-model="title"/>
  </div>
  <!-- 摘要输入模块 -->
  <div id="container">
    <textarea placeholder="请输入摘要"  class="summary" v-model="summary" />
  </div>
  <!-- 内容输入模块 -->
  <div id="container">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc;width: 800px;"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; width: 800px; overflow-y: hidden"
        @onCreated="handleCreated"
      />
  </div>
  <!-- 发布按钮 -->
  <div id="container">
    <div class="button" v-on:click="publish">发布帖子</div>
  </div>
</template>

<script lang="ts">
    import '@wangeditor/editor/dist/css/style.css';
    import { onBeforeUnmount, ref, shallowRef, getCurrentInstance } from 'vue';
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
    import { IDomEditor } from '@wangeditor/editor'
    import store from '../../tools/Store'

    import networkPath from '../../tools/Network';
    import { ElMessage } from 'element-plus';
    import { useRouter } from 'vue-router';

    export default {
        components: { Editor, Toolbar },
        props: {
            category_id: String
        },
        setup(props:any) {
            const instance = getCurrentInstance(); // 当前实例
            const router = useRouter();      // 路由实例
            const editorRef = shallowRef();  // 编辑器实例
            const valueHtml = ref('');       // 内容HTML文本
            const title = ref('');           // 标题文本
            const summary = ref('');         // 摘要文本
            // 过滤编辑器不需要的功能
            const toolbarConfig = {
                excludeKeys: [
                    'group-video',
                    'group-image',
                    'fullScreen'
                ]
            };
            const editorConfig = { placeholder: '请输入内容...'};
            // 组件销毁时，也及时销毁编辑器
            onBeforeUnmount(()=>{
                const editor = editorRef.value;
                if (editor == null) return;
                editor.destroy();
            });
            // 编辑器回调函数
            const handleCreated = (editor: IDomEditor) => {
                console.log('create', editor)
                editorRef.value = editor; // 记录 editor 实例
            };
            const publish = () => {
                // 整体创建帖子所需要的参数
                let content = valueHtml.value;
                let t = title.value;
                let s = summary.value;
                let author_id = store.state.id;
                let category_id = props.category_id;
                // 进行参数是否为空检查
                if (!content) {
                    ElMessage({
                        message: '请先编写帖子内容',
                        type: 'error',
                    });
                    return;
                }
                if (!t) {
                    ElMessage({
                        message: '必须设置帖子标题',
                        type: 'error',
                    });
                    return;
                }
                if (!s) {
                    ElMessage({
                        message: '必须设置帖子摘要内容',
                        type: 'error',
                    });
                    return;
                }
                if (!author_id) {
                    ElMessage({
                        message: '请先登录在发布帖子',
                        type: 'error',
                    });
                    return;
                }
                if (!category_id) {
                    ElMessage({
                        message: '发布帖子必须选择分类模块',
                        type: 'error',
                    });
                    return;
                }
                // 进行帖子发布
                instance?.appContext.app.axios.post(networkPath.createPost, {
                    title: t,
                    summary: s,
                    category_id: category_id,
                    content: content,
                    author_id: author_id
                }).then(()=>{
                    ElMessage({
                        message: '发布成功，即将跳转到首页~',
                        type: 'success',
                    });
                    // 2秒后自动跳转到首页
                    setTimeout(()=>{
                        router.push({name:"home"})
                    }, 2000);
                }).catch((error:any)=>{
                    ElMessage.error(error.response.data.msg)
                })
                
            };
            // 组合式API
            return {
                editorRef,
                mode: 'default',
                title,
                summary,
                valueHtml,
                toolbarConfig,
                editorConfig,
                handleCreated,
                publish
            }
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
        overflow:hidden;
        position: relative;
        margin-bottom: 20px;
    }
    
    .title {
      border: transparent;
      width: 80%;
      height: 50px;
      font-size: 30px;
      max-lines: 1;
      margin: 20px;
      outline: none;
    }
    
    .summary {
      border: transparent;
      width: 100%;
      height: 50px;
      font-size: 18px;
      max-lines: 1;
      margin: 20px;
      outline: none;
    }
    
    .button {
      width: 100%;
      height: 60px;
      font-size: 25px;
      line-height: 60px;
      text-align: center;
      background-color: cornflowerblue;
      color: white;
    }
    
    </style>