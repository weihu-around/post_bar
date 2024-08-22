const host = "http://localhost:3000/"  // 接口host
const networkPath = {
    signUp: host + "users/create",     // 注册接口路径
    login: host + "users/login",       // 登录接口路径
    categories: host + "post/categories",  // 获取类别接口
    posts: host + 'post/posts',        // 获取帖子列表数据
    createPost: host + 'post/create',  // 创建帖子
    detail: host + 'post/detail',      // 获取帖子详情
    deletePost: host + 'post/delete',       // 删除帖子
    createComment: host + 'comment/create', // 发布评论
    comments: host + 'comment/comments',    // 获取某个帖子下的评论数据
    deleteComment: host + 'comment/delete',  // 删除评论
    searchPosts: host + 'post/search'             // 根据关键字搜索帖子
}
export default networkPath;