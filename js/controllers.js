//1.创建登录的模块，并且创建登录的控制器
var loginApp = angular.module('loginApp',[]);
loginApp.controller('loginController',function($scope,$http){
    //数据
    $scope.formData = {};
    //发送的方法
    $scope.postForm = function(){
        //1.formData添加一个属性,action代表的就是请求的行为
        $scope.formData.action = 'login';
        $http({
            method:"POST",
            url:'get.php',
            data: $.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(function(data){
            //console.log(data);
            if(!data.success){
                //当前登录失败
                if(!data.errors){
                    //用户名密码错误
                    $scope.message = data.message;
                }else{
                    //用户名，密码为空的错误
                    $scope.errorUsername = data.errors.username;
                    $scope.errorPassword = data.errors.password;
                }
            }else{
                //当前登录成功
                window.location.href='#/list/0';
            }
        })
    }
})
//列表页面的模块
var pageList = angular.module('pageList',[]);
//获取所有的分类
pageList.controller('ListTypeCtrl',function($scope,$http){
    $http({
        method:'GET',
        url:'get.php?action=get_arctype&where=reid=0'
    }).success(function(data){
        //console.log(data);
        $scope.lists = data;
    }).error(function(err){
        console.log(err);
    })
})
//文章列表的控制器
totals = 0;
pageList.controller('arcListCtrl',function($scope,$http,$location){
    $scope.typeid = $location.path().replace('/list/','');
    if($scope.typeid == 0){
        //获取所有文章的数量
        var get_total_url = 'get.php?action=get_total';
    }else{
        //获取某一个分类的文章的数量.
         get_total_url = 'get.php?action=get_total&where=typeid='
            + $scope.typeid;
    }
    //获取所有的对应分类的文章数量.
    $http({
        method:'GET',
        url:get_total_url
    }).success(function(data){
        //当前文章的总数量.
        $scope.paginationConf.totalItems = data.total;
    }).error(function(err){
        console.log(err);
    })
    //设置分页的对象
    $scope.paginationConf = {
        //当前的页数
        currentPage:1,
        //每页多少条
        itemsPerpage:5,
        //totalItems 是文章总数量.
        pagesLength:5,
        //可以自动更换的每页多少条
        perPageOptions:[10, 20, 30, 40, 50],
        rememberPerPage:'perPageItems',
        onChange:function(){
            //先判断一下当前页数是否是第一页，获取到查询的起始位置
            if($scope.paginationConf.currentPage == 1){
                //当前是第一页
                $scope.limit = 0;
            }else{
                // (当前页数 - 1) * 每页多少条
                $scope.limit = $scope.paginationConf.currentPage * $scope.paginationConf.itemsPerpage
                - $scope.paginationConf.itemsPerpage;
            }
            //根据 typeid 和当前的页数 currentPage 整理好请求的URL
            if($scope.typeid == 0){
                $geturl = 'get.php?action=get_list&offset=' + $scope.limit + '&rows=' + $scope.paginationConf.itemsPerPage +
                '&orderField=id&orderBy=DESC';
            }else{
                $geturl='get.php?action=get_list&offset='+$scope.limit+
                '&rows='+$scope.paginationConf.itemsPerPage+'&where=typeid='+$scope.typeid+'&orderField=id&orderBy=DESC';
            }
            //最后发送请求
            //offset 当前的查询的偏移量
            //rows 当前查询多少条
            //typeid 查询哪个分类
            //orderField 根据哪个字段进行排序
            //orderBy 排序规则
            $http({
                method:'GET',
                url:$geturl
            }).success(function(data){
                $scope.lists = data;
                //console.log($scope.lists);
            }).error(function(err){
                console.log(err);
            })


        }


    }
    //删除开始
    $scope.del = function (index,id) {
        $http({
            metdod:'GET',
            url:'get.php?action=delete_article&index='+ index + '&id=' + id,
        }).success(function (data) {
            if (data.code==101) {
                //删除成功
                //console.log('删除成功');
                $scope.meg_success="删除成功!";
                $scope.meg_error="";
//                setTimeout(function(){location.href='#/list/0'}, 1000);
                //重新发送ajax请求 页面
                $http({
                    method: 'GET',
                    url: $geturl,
                }).success(function (data) {
                    $scope.lists = data;
                }).error(function (err) {
                })
                $http({
                    method: 'GET',
                    url: get_total_url
                }).success(function (data) {
                    $scope.paginationConf.totalItems = data.total;
                }).error(function (err) {
                    console.log(err);
                })

            } else {
                //添加失败
                //console.log('删除失败');
                $scope.meg_error="删除失败";
            }
        })
    }

})
var addCont = angular.module('addCont',[]);
addCont.controller('addContCtrl',function($scope,$http){
    //select里面需要用到的分类
    $http({
        method:'GET',
        url:'get.php?action=get_arctype&where=reid=0'
    }).success(function(data){
        $scope.lists = data;
    }).error(function(err){
        console.log(err);
    })
    //执行写入的操作
    $scope.formData = {};
    $scope.formData.action = 'add_article';
    $scope.postForm = function(){
        $http({
            method:'POST',
            url:'get.php',
            data: $.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(function(data){
            $scope.errorBye = function(){
                $('#errorbox').fadeOut();
            }
            $scope.errorShow = function(){
                $('#errorbox').fadeIn();
            }
            if(!data.errors){
                //成功
                $scope.meg_success = '插入成功,正在返回列表页面..';
                $scope.meg_error = '';
                setTimeout(function(){location.href='#/list/0'},1000)
            }else{
                //失败
                $scope.meg_success = '';
                var get_error = '';
                if(data.errors.hasOwnProperty('title')){
                    get_error = data.errors.title;
                }
                if(data.errors.hasOwnProperty('content')){
                    get_error = get_error + (get_error?'&':'') +
                        data.errors.content;
                }
                if(data.errors.hasOwnProperty('typeid')){
                    get_error = get_error + (get_error?'&':'') +
                        data.errors.typeid;
                }
                $scope.meg_error = get_error;
            }
        })
    }
})
//修改模块
var modifyCont = angular.module('modifyCont',[]);
modifyCont.controller('modifyContCtrl',
    function($scope,$http,$stateParams){
        //1.获取所有的分类
        $http({
            method:'GET',
            url:'get.php?action=get_arctype&where=reid=0'
        }).success(function(data){
            $scope.types = data;
        }).error(function(err){
            console.log(err);
        })
        //2.读取一条数据
        //当前路由中的参数Id
        //console.log($stateParams);
        $http({
            method:'GET',
            url:'get.php?action=get_article&id=' + $stateParams.Id
        }).success(function(data){
            console.log(data);
            $scope.lists = data;
        }).error(function(err){
            console.log(err);
        })
        //3.postForm操作
        $scope.formData = {};
        $scope.postForm = function(){
            $scope.formData.action = 'update_article';
            $scope.formData.id = $stateParams.Id;
            $scope.formData.title = form.title.value;
            $scope.formData.content = form.content.value;
            $scope.formData.typeid = $('#typeid option:selected').val();
            $http({
                method:'POST',
                url:'get.php',
                data: $.param($scope.formData),
                headers:{'Content-type':'application/x-www-form-urlencoded'}
            }).success(function(data){
                if(data.code == 101){
                    //添加成功
                    $scope.meg_success = '修改成功,正在返回列表页..';
                    $scope.meg_error = '';
                    setTimeout(function(){location.href='#/list/0'},1000)
                }else{
                    //添加失败
                    var get_error = '';
                    $scope.meg_success = '';
                    $scope.errorBye = function(){
                        $('#errorbox').fadeOut();
                    };
                    $scope.errorShow = function(){
                        $('#errorbox').fadeIn();
                        $scope.meg_error = '';
                    }
                    if(data.errors){
                        if(data.errors.hasOwnProperty('title')){
                            get_error = data.errors.title;
                        }
                        if(data.errors.hasOwnProperty('content')){
                            get_error = get_error + (get_error ? '&' : '') + data.errors.content;
                        }
                        $scope.meg_error = get_error;
                    }else{
                        $scope.meg_error = '修改失败，无改动..';
                    }
                }
            }).error(function(err){
                console.log(err);
            })
        }

})
//详情模块
var showCont = angular.module('showCont',[]);
showCont.controller('showContCtrl',function($scope,$http,$stateParams){
    $http({
        method:'GET',
        url:'get.php?action=get_article&id=' + $stateParams.Id
    }).success(function(data){
        $scope.lists = data;
    }).error(function(err){
        console.log(err);
    })
})




