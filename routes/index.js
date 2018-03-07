var express = require('express');
var router = express.Router();

var matrix=[
	[0,0,0],
	[0,0,0],
	[0,0,0],
	[1,1,1]
]
flag2=false;
data={}
// Get Homepage
setInterval(function(){
	if(!flag2)
{	for (var i = 0; i < 1000000; i++) {
		updatematrix();
		data[check()]=matrix;
	}
	console.log(Object.keys(data).length);}
},3000)
router.get('/', ensureAuthenticated, function(req, res){
	res.json({length:Object.keys(data).length,matrix:matrix,flag:flag2});
});
router.get('/test', ensureAuthenticated, function(req, res){
	res.render('index')
});
router.get('/data', ensureAuthenticated, function(req, res){
	res.json(data);
});
router.get("/matrix",(req,res)=>{
	res.json({matrix:data[req.query.d]})
})

function ensureAuthenticated(req, res, next){
next();
}
function updatematrix() {
	var flag=false;
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			matrix[i][j]+=1;
			if(matrix[i][j]==8)
			{matrix[i][j]=0}
			else {
				flag=true
				break;
			}
		}
		if(flag)
		break;
		if((i+1==matrix.length)&&(j==matrix[0].length))
		flag2=true
		}
	return matrix
}
function check() {
	var string=""
	for (var k = 0; k < 16; k++) {
		value=k&15;
		sum=matrix[value&3][0]
	for (var i = 0; i < matrix[0].length; i++) {
		sum=sum&matrix[value&3][i];
		value=parseInt(value/2)
	}
	string+=sum==0?0:1;
	}
return string
}

module.exports = router;
