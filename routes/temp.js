var express = require('express');
var router = express.Router();
var functions = require('../models/functions');
var user = require('../models/user');

var matrix=[
	[ 0, 0, 0, 0],
	[ 0, 0, 0, 0],
	[ 0, 0, 0, 0],
	[ 0, 0, 0, 0]
]
flag2=false,flag3=false,flag4=true;
start = true;
var data={}
var dataset=matrix[0].length;
dataset=Math.pow(2,dataset+1)-1;
var string =[];
var exp=[];
var result=[];
for (var i = 0; i <= dataset; i++) {
	string.push(0);
}

var objects = Object.keys(data);
objects.sort(function(a,b){
	return a-b;
})
var secondlayer={},secondlayerobjects=[];
setInterval(function(){
		if(!flag2&&!flag3)running();
    //
		// var bulk=user.collection.bulkWrite(Object.values(data),{ ordered : false }).then( bulkWriteOpResult => {
		// 	data={};
		// })
		// .catch( err => {
		// 	console.log('BULK update error');
		// 	console.log({length:Object.keys(data).length,matrix:matrix,flag:flag2,flag3:err.result.nInserted});
		// 	data={};
		// });
},500)
// router.get('/search',function(req,res){
// var params=req.query;
// var query=params.data.split("1").join(".");
// console.log(query.length);
// res.json(result);
// var agg=user.aggregate([{$match:{data:{ $regex: query, $options: 'si' }}},{$group:{_id:"$number",files:{$push: {data:"$data",matrix:"$matrix"} } } },{$sort:{_id:-1}},{$limit:5}]);
// var qu=user.find({data:{ $regex: query, $options: 'si' }})
// agg.options = { allowDiskUse: true };
// agg.exec(function(err,data){
// 	console.log(err);
// result=data;
// console.log(data.length);
// });
// })
// router.get('/nlayer', function(req, res){
// 	if(flag4){
// 		functions.nlayer(objects,matrix[0].length-2).then((data)=>{
// 			secondlayer=data;
// 			});
// 		flag4=false;
// 	}
// 	secondlayerobjects=Object.keys(secondlayer);
// 	res.json({length:Object.keys(secondlayer).length});
// });
// router.get('/searchlayer', function(req, res){
// 	var param= req.query;
// 	query=RegExp(param.q,"g");
// 		var result=secondlayerobjects.find(function(a){
// 		return a.search(query)>=0
// 	})
// 	res.json({result:secondlayer[result]})
// });
// router.get("/data",(req,res)=>{
// 	res.json(secondlayer)
// })
// router.get("/matrix",(req,res)=>{
// 	res.json({matrix:data[req.query.d]})
// })
router.get("/data2",(req,res)=>{
	res.json(data)
})
router.get("/search",(req,res)=>{
	var query=req.query.d.split("1").join(".")
	query=RegExp(query,"g");
		var result=objects.filter(function(a){
		return a.search(query)>=0
	})
	res.json({matrix:result})
})
// =============================================================
//
//
// =============================================================

function updatematrix() {
  var flag = false;
  for(var i = 0; i < matrix.length; i++) {
    for(var j = 0; j < matrix[i].length; j++) {
      matrix[i][j] += 1;
      if(matrix[i][j] == 2) {
        matrix[i][j] = 0
      }
      else if((i + 1 == matrix.length) && (j + 1 == matrix[0].length)) flag2 = true
      else {
        flag = true
        break;
      }
    }
    if(flag) break;
  }
  return matrix
}

function check(number) {
  var string = ""
  for(var k = 0; k <= number; k++) {
    value = k;
    sum = matrix[value & 3][0]
    for(var i = 0; i < matrix[0].length; i++) {
      sum = sum * matrix[value & 3][i];
      value = value >> 1
    }
    string += sum;
  }
  return string
}

function running() {
	var value=0;
	flag3=true;
  for(var i = 0; i < 2000000; i++) {
		value=check(dataset)
    data[value] = { insertOne : { "document" : {matrix:JSON.stringify(matrix),data:value,number:value.split("0").join("").length} } };
    updatematrix();
  }
	flag3=false;
}

module.exports = router;
