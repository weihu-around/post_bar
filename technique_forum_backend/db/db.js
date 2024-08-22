const sqlite3 = require('sqlite3').verbose();
const dbName = './db/forum.db';

// 查询库中所有用户信息
function queryAllUserInfoFromDB(callback) {
    const db = new sqlite3.Database(dbName);
    // 定义SQL语句
    const sql = 'SELECT * FROM user';
    // 查询所有数据
    db.all(sql, [], (err, rows)=>{
        callback(err, rows)
    });
    // 关闭数据库
    db.close();
}

// 判断账户是否已存在
function accountIfExist(account, callback){
    const db = new sqlite3.Database(dbName);
    // 定义SQL语句
    const sql = `SELECT account FROM user where account = '${account}';`;
    // 查询所有数据
    db.all(sql, [], (err, rows)=>{
        if(rows.length > 0){
            callback(true)
        } else {
            callback(false)
        }
    });
    // 关闭数据库
    db.close();
}

// 新建一个账户
function createAccount(nickname, account, password, callback){
    const db = new sqlite3.Database(dbName);
    const sql = `INSERT INTO user (nickname, account, password) VALUES ('${nickname}','${account}','${password}')`;
    db.run(sql,(res, err)=>{
        if (err) {
            callback(err, null)
        } else {
            db.get(`SELECT * FROM user WHERE account = '${account}';`, (err, row)=>{
                console.log(err);
                callback(null, row);
            })
        }
    });
    db.close();
}

// 根据账户查询用户信息
function queryUser(account, callback) {
    const db = new sqlite3.Database(dbName);
    const sql = `SELECT * FROM user WHERE account = '${account}';`;
    // 查询所有数据
    db.get(sql, [], (err, user)=>{
        callback(err, user)
    });
    // 关闭数据库
    db.close();
}

// 获取所有类别数据
function queryAllCatagories(callback){
    const db = new sqlite3.Database(dbName);
    const sql = `SELECT * FROM category order by 'position';`;
    db.all(sql, [], (err, rows) => {
        if (!err) {
            callback(rows)
        } else {
            callback(undefined)
        }
    });
    // 关闭数据库
    db.close();
}

// 查询帖子列表数据
function queryPosts(category, offset, limit, callback) {
    // 打开数据库
    const db = new sqlite3.Database(dbName);
    const sql = `SELECT id, category_id, title, summary, author_id, publish_time FROM post 
                 where category_id='${category}' 
                 order by publish_time DESC
                 limit ${limit} offset ${offset};`;
    db.all(sql, [], (err, posts) => {
        if (!err) {
            // 如果没有任何帖子，直接返回
            if(posts.length == 0) {
                callback(posts)
                return
            } 
            // 定义变量，标记需要二次查询数据的次数
            var queryCount = posts.length * 2
            // 当前已经查询的次数
            var currentQueryCount = 0;
            for(var i=0; i<posts.length; i++) {
                let post = posts[i];
                // 查询坐着信息，并拼接到文章对象中
                const sqll = `SELECT * FROM user where id = ${post.author_id};`;
                db.get(sqll, (err, row)=>{
                    post.author = row
                    currentQueryCount += 1
                    if (currentQueryCount == queryCount) {
                       callback(posts)
                       db.close();
                    }
                });
                // 查询类别信息，并拼接到文章对象中
                const sql2 = `SELECT * FROM category where id = ${post.category_id};`;
                db.get(sql2, (err, row)=>{
                    post.category = row
                    currentQueryCount += 1
                    if (currentQueryCount == queryCount) {
                        callback(posts)
                        db.close();
                    }
                })
            }
        } else {
            callback();
            db.close();
        }
    })
}

// 创建帖子
function createPost(category_id, title, summary, content, author_id, callback) {
    // 打开数据库
    const db = new sqlite3.Database(dbName);
    // 定义插入帖子数据的SQL语句
    const sql = `INSERT INTO post (category_id, title, summary, content, author_id) 
    VALUES (${category_id}, '${title}', '${summary}', '${content}', ${author_id})`;
    db.run(sql, (res, err)=>{
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
    // 关闭数据库
    db.close();
}

// 获取某个帖子的详情信息
function queryPostDetail(id, callback) {
    // 打开数据库
    const db = new sqlite3.Database(dbName);
    // 定义SQL语句，这里查询出帖子数据的所有字段
    const sql = `SELECT * FROM post where id = ${id};`;
    // 查询数据
    db.get(sql, [], (err, post)=>{
        if (!err) {
            // 如果没有查询到帖子，直接返回
            if (!post) {
                callback()
                return
            }
            // 查询作者信息，拼接到文章对象里
            const sql1 = `SELECT * FROM user where id = ${post.author_id};`;
            db.get(sql1, (err, row)=>{
                post.author = row
                // 查询类别信息，拼接到文章对象里
                const sql2 = `SELECT * FROM category where id = ${post.category_id};`;
                db.get(sql2, (err, row)=>{            
                    post.category = row
                    callback(post)
                    db.close();
                });
            });
        } else {
            callback()
            db.close();
        }
    });
}

// 删除帖子
function deletePost(id, callback) {
    // 打开数据库
    const db = new sqlite3.Database(dbName);
    // 定义删除数据的SQL语句
    const sql = `DELETE FROM post WHERE id=${id};`;
    db.run(sql, (res, err)=>{
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
    // 关闭数据库
    db.close();
}

// 创建评论
function createComment(postId, author_id, reply_to, content, callback) {
    // 打开数据库
    const db = new sqlite3.Database(dbName);
    // 定义插入评论数据的SQL语句
    var sql = ""
    if (reply_to) {
        sql = `INSERT INTO comment (post_id, author_id, reply_to, content)
        VALUES (${postId}, ${author_id}, ${reply_to}, '${content}')`;
    } else {
        sql = `INSERT INTO comment (post_id, author_id, content)
        VALUES (${postId}, ${author_id}, '${content}')`; 
    }
    db.run(sql, (res, err)=>{
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
    // 关闭数据库
    db.close();
}

// 删除评论
function deleteComment(id, callback) {
        // 打开数据库
        const db = new sqlite3.Database(dbName);
        // 定义删除数据的SQL语句
        const sql = `DELETE FROM comment WHERE id=${id};`;
        db.run(sql, (res, err)=>{
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
        // 关闭数据库
        db.close();
}

// 查询评论列表数据
function queryComments(postId, offset, limit, callback) {
    // 打开数据库
    const db = new sqlite3.Database(dbName);
    // 定义SQL语句，这里插叙所有类别数据并按照position进行排序
    const sql = `SELECT * FROM comment where post_id = '${postId}' order by publish_time DESC limit ${limit} offset ${offset};`;
    // 查询所有数据
    db.all(sql, [], (err, comments)=>{
        if (!err) {
            // 如果没有任何评论，直接返回
            if (comments.length == 0) {
                callback(comments)
                return
            }
            // 定义变量标记需要二次查询数据的次数，查询作者和回复者
            var queryCount = comments.length * 2
            // 当前已经查询的次数
            var currentQueryCount = 0
            for (var i = 0; i < comments.length; i++) {
                let comment = comments[i];
                // 查询作者信息，拼接到评论对象里
                const sql1 = `SELECT * FROM user where id = ${comment.author_id};`;
                db.get(sql1, (err, row)=>{
                    comment.author = row
                    currentQueryCount += 1
                    if (currentQueryCount == queryCount) {
                        callback(comments)
                        db.close();
                    }
                });
                if (!comment.reply_to) {
                    currentQueryCount += 1
                } else {
                    // 查询回复信息，拼接到评论对象里
                    const sql2 = `SELECT * FROM user where id = ${comment.reply_to};`;
                    db.get(sql2, (err, row)=>{            
                    comment.reply = row
                    currentQueryCount += 1
                    if (currentQueryCount == queryCount) {
                        callback(comments)
                        db.close();
                    }
                    });
                }  
            }
        } else {
            callback()
            db.close();
        }
    });
}

// 搜索帖子列表数据
function searchPosts(keyword, offset, limit, callback) {
    // 打开数据库
    const db = new sqlite3.Database(dbName);
    // 定义SQL语句，这里查询所有标题中包含关键字的帖子数据并按照发布时间进行排序
    const sql = `SELECT id,category_id,title,summary,author_id,publish_time FROM post where title LIKE '%${keyword}%' order by publish_time DESC limit ${limit} offset ${offset};`;
    // 查询所有数据
    db.all(sql, [], (err, posts)=>{
        if (!err) {
            // 如果没有任何帖子，直接返回
            if (posts.length == 0) {
                callback(posts)
                return
            }
            // 定义变量标记需要二次查询数据的次数
            var queryCount = posts.length * 2
            // 当前已经查询的次数
            var currentQueryCount = 0
            for (var i = 0; i < posts.length; i++) {
                let post = posts[i];
                // 查询作者信息，拼接到文章对象里
                const sql1 = `SELECT * FROM user where id = ${post.author_id};`;
                db.get(sql1, (err, row)=>{
                    post.author = row
                    currentQueryCount += 1
                    if (currentQueryCount == queryCount) {
                        callback(posts)
                        db.close();
                    }
                });
                 // 查询类别信息，拼接到文章对象里
                 const sql2 = `SELECT * FROM category where id = ${post.category_id};`;
                 db.get(sql2, (err, row)=>{            
                    post.category = row
                    currentQueryCount += 1
                    if (currentQueryCount == queryCount) {
                        callback(posts)
                        db.close();
                    }
                });
            }
        } else {
            callback()
            db.close();
        }
    });
}

module.exports = {
    queryAllUserInfoFromDB,
    accountIfExist,
    createAccount,
    queryUser,
    queryAllCatagories,
    queryPosts,
    createPost,
    queryPostDetail,
    deletePost,
    createComment,
    deleteComment,
    queryComments,
    searchPosts
}