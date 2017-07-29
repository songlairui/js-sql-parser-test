# SQL-PARSER (WORKING)

>  工作项目打包上线时，要手工整理SQL，并保证 INSERT 语句没有主键冲突。 
>  做一个自动分析工具。其中需要解析 SQL 语句中的内容。  

遇到需要手动撰写方法的地方，将关键代码收集在这里，并写好单元测试测试。  

这是一个方法测试的repo，非功能repo（npmjs上已有的sql-parser应该能够满足要求）。

## 目录  

``` 

├── src                       // src
│   └── partical              // 分步骤分析 SQL
│       └── parseVALUES.js    // 解析 INSERT 语句中的 VALUES
└── test
    ├── VALUES.spec.js        // mocha 对 parseVALUES 的测试
    └── insert.spec.js
```

## 运行方法  

```
npm i
npm run test
```
查看mocha运行结果


## detail 

parseVALUES 中解析方法，没能够使用正则实现。采用逐个字符判断的方法解析。  
尝试正则过程中，用已有的正则技能完不成。