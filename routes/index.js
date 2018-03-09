var express = require('express');
var router = express.Router();
var User = require('../models/datas');
var matrix=[
	[0,0],
	[0,0],
	[0,0],
	[0,0],
]
flag2=false;
start = true;
var data={}
var dataset=matrix[0].length;
dataset=Math.pow(2,dataset+1)-1;
setInterval(function(){
	if(!flag2)
{	for (var i = 0; i < 10000; i++) {
		data[check(dataset)]=JSON.stringify(matrix);
			updatematrix();
	}
	}
},3)
router.get('/', function(req, res){
	res.json({length:Object.keys(data).length,matrix:matrix,flag:flag2});

});
router.get('/test', function(req, res){
	res.render('index')
});
router.get('/data', function(req, res){
	res.json(data);
});
router.get("/matrix",(req,res)=>{
	res.json({matrix:data[req.query.d]})
})

function updatematrix() {
	var flag=false;
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			matrix[i][j]+=1;
			if(matrix[i][j]==2)
			{matrix[i][j]=0}
			else if((i+1==matrix.length)&&(j+1==matrix[0].length))
			flag2=true
			else {
				flag=true
				break;
			}
		}
		if(flag)
		break;
	}
	return matrix
}
function check(number) {
	var string=""
	for (var k = 0; k <= number; k++) {
		value=k;
		sum=matrix[value&3][0]
	for (var i = 0; i < matrix[0].length; i++) {
		sum=sum*matrix[value&3][i];
		value=value>>1
		}
	string+=sum;
	}
return string
}

module.exports = router;
