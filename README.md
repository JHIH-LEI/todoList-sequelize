# todoList-sequelize

# 專案畫面
![](https://i.imgur.com/D5HGAUR.png)
![](https://i.imgur.com/64us2Qz.png)
![](https://i.imgur.com/yKH8U4y.png)

# 測試帳號
root@example.com

12345678

# function
user can CRUD own todos

user can login their account

user can logout their account

user can register account

user can use facebook login

# 安裝

1.請先clone此專案到本地
```
git clone https://github.com/JHIH-LEI/todoList-sequelize
```

2.在終端機輸入以下指令，進入到專案資料夾
```
cd todoList-sequelize
```

3.安裝npm套件
```
npm i
```

4.引入環境變數

將.env.example檔案改成.env

5.打開 MySQL workbench，輸入下列指令建立資料庫
```
drop database if exists todo_sequelize;
create database todo_sequelize;
use todo_sequelize;
```
＊資料庫名稱預設為todo_sequlize，如果需要更改，則記得至專案中的config.json修改database value。
![](https://i.imgur.com/oHG2bON.png)

6.於FB developer註冊FB login應用程式，並將您的APP_ID與APP_SECRET替換上去
![](https://i.imgur.com/tTTA6zB.png)

7.產生種子資料
```
npx sequelize db:seed:all
```

8.執行應用程式
```
npm run start
```
看到express is running on http://localhost:3000，就代表成功。

9.進入到http://localhost:3000 玩玩看吧！

預設帳密如下：
```
root@example.com
```
```
12345678
```
