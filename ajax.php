<?php

class test{
}
$obj = new test();
$obj->total_num = 15;
$obj->page_size = 5;
$obj->page_total_num = 3;
$obj->list = [
    ['title'=>'第一篇'],
    ['title'=>'第二篇'],
    ['title'=>'第三篇'],
    ['title'=>'第四篇'],
    ['title'=>'第五篇'],
    ['title'=>'第六篇'],
    ['title'=>'第七篇'],
    ['title'=>'第八篇'],
    ['title'=>'第九篇'],
    ['title'=>'第十篇'],
    ['title'=>'第十一篇'],
    ['title'=>'第十二篇'],
    ['title'=>'第十三篇'],
    ['title'=>'第十四篇'],
    ['title'=>'第十五篇'],
];
echo json_encode($obj);
?>