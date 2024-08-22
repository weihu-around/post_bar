import { UserInfo } from './Store'
// 子模块模型接口
interface CategoryModel {
    id: number
    label: string
    position: number
}

// 帖子模型接口
interface Post {
    author: UserInfo
    category: CategoryModel
    id: number
    title: string
    summary: string
    content: string
    publish_time: string
}

// 评论模型接口
interface Comment {
    author: UserInfo,
    reply?: UserInfo,
    id: number,
    content: string,
    publish_time: string
}

// 导出模型接口
export {
    CategoryModel,
    Post,
    Comment
}