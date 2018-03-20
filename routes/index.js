var express = require('express');
var router = express.Router();
var functions = require('../models/functions');
const addon = require('../build/Release/addon');
var matrix=[
	[0,0,0],
	[0,0,0],
	[0,0,0],
	[0,0,0],
]
flag2=false,flag3=false,flag4=true;
start = true;
var data={}
var dataset=matrix[0].length;
dataset=Math.pow(2,dataset+1)-1;
var string =[];
var exp=[];
for (var i = 0; i <= dataset; i++) {
	string.push(0);
}


setInterval(function(){
		if(!flag2)running();
},300)

var objects = Object.keys(data);
objects.sort(function(a,b){
	return a-b;
})
var secondlayer={},secondlayerobjects=[];

router.get('/', function(req, res){
	res.json({length:Object.keys(data).length,matrix:matrix,flag:flag2});
 objects = Object.keys(data);
	// objects.sort(function(a,b){
	// 	return b.split("0").join("").length-a.split("0").join("").length;
	// })
	// exceptions()

});
router.get('/nlayer', function(req, res){
	if(flag4){
		secondlayer=functions.secondlayer(objects);
		for (var i = 0; i < matrix[0].length-2; i++) {
			secondlayer=functions.nlayer(objects,secondlayer);
		}
		secondlayerobjects=Object.keys(secondlayer);
		flag4=false;
	}
res.json({length:Object.keys(secondlayer).length});
});
router.get('/searchlayer', function(req, res){
	var param= req.query;
	query=RegExp(param.q,"g");
		var result=secondlayerobjects.find(function(a){
		return a.search(query)>=0
	})
	res.json({result:secondlayer[result]})
});
router.get("/data",(req,res)=>{
	res.json(secondlayer)
})
router.get("/matrix",(req,res)=>{
	res.json({matrix:data[req.query.d]})
})
router.get("/search",(req,res)=>{
	var query=req.query.d.split("1").join(".")
	query=RegExp(query,"g");
		var result=objects.filter(function(a){
		return a.search(query)>=0
	})
	res.json({matrix:result})
})

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
  for(var i = 0; i < 1000000; i++) {
    data[check(dataset)] = JSON.stringify(matrix);
    updatematrix();
  }
}

function exceptions() {
  for(var j = 0; j < 100000; j++) {
    for(var i = 0; i < string.length; i++) {
      string[i] += 1;
      if(string[i] == 2) {
        string[i] = 0
      }
      else if(string.reduce((a, b) => a + b, 0) == dataset + 1) flag3 = true;
      else {
        break;
      }
    }
    if(objects.indexOf(string.join("")) < 0 && !flag3) exp.push(string.join(""))
  }
}


module.exports = router;
