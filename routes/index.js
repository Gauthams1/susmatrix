var express = require('express');
var router = express.Router();
var functions = require('../models/functions');
var user = require('../models/user');
// const addon = require('../build/Release/addon');

const order=[
	"00",
	"11",
	"01",
	"10"
],
order2=[
	"00",
	"11",
	"10",
	"01"
];
router.get('/search/:data', function(req, res){
var data=req.params.data;
user.find({data:data},function(err,user){
	res.json(user);
})
});
router.get('/:data', function(req, res){
var data=req.params.data;
var returndata=manuplate(data);
console.log(data);
res.json(returndata);
});
function returnresultjson(data,left,right) {
	var revisedstring=propergenerator(data,left,right);
	var revisedstring2=matrixgenerator(data,revisedstring);
	console.log(`revisedstring : ${revisedstring}`);
	return {
		left:left,
		right:right,
    data: data,
		revised: revisedstring2.revisedstring,
		revisedlength2:revisedstring2.revisedstring.split("0").join("").length,
};
}
function lowestvalue(data) {
	var lowestleft="00",lowestright="00",currentstringleft,currentstringright;
	for (var i = 0; i < data.length; i+=4) {
	currentstringleft=data.substr(i,2);
	currentstringright=data.substr(i+2,2);
	lowestleft=order.indexOf(currentstringleft)>order.indexOf(lowestleft)?currentstringleft:lowestleft;
	lowestright=order.indexOf(currentstringright)>order.indexOf(lowestright)?currentstringright:lowestright;
	}
	var matrix=[parseInt(lowestleft[0]),parseInt(lowestleft[1]),parseInt(lowestright[0]),parseInt(lowestright[1])];
	console.log(matrix);
	return {lowestleft:lowestleft,lowestright:lowestright,matrix:matrix};
}
function manuplate(data){
	var datastring=data,matrixresult=[
		[],
		[],
		[],
		[]
	];
	var datapoints=lowestvalue(datastring);
	var lowestleft=datapoints.lowestleft,lowestright=datapoints.lowestright;
	for (var i = data.length; i >=4; i=i) {
		datapoints=lowestvalue(datastring);
		lowestleft=datapoints.lowestleft,lowestright=datapoints.lowestright;
		var datajsondetail=returnresultjson(datastring,lowestleft,lowestright);
		datastring=datajsondetail.revised;
		matrixresult[0].push(datapoints.matrix[0]);
		matrixresult[1].push(datapoints.matrix[1]);
		matrixresult[2].push(datapoints.matrix[2]);
		matrixresult[3].push(datapoints.matrix[3]);
		i=datastring.length;
	}
	var dataset=Math.pow(2,matrixresult[0].length+1)-1;
	datapoints=lowestvalue(data);
	lowestleft=datapoints.lowestleft,lowestright=datapoints.lowestright;
	console.log(matrixresult);
	return {json:returnresultjson(data,lowestleft,lowestright),matrix:matrixresult,result:check(dataset,matrixresult),reminder:subtract(data,check(dataset,matrixresult))}
}

function propergenerator(original,left,right){
var newstring="",revisedstring="";
	for (var i = 0; i < original.length; i=i) {
	newstring+=left+right;
	i=newstring.length;
	}
return newstring;
}
function matrixgenerator(original,synthetic,j=2){
	var revisedstring="";
	for (var i = 0; i < synthetic.length-j; i+=2*j) {
		revisedstring+=weight2(original.substr(i,j),synthetic.substr(i,j))+weight2(original.substr(i+j,j),synthetic.substr(i+j,j))
}
return {matrix:"matrix",revisedstring:revisedstring};
}
function weight(dataoriginal,datasynthetic){
	var weight=1,wstring="";
	for (var i = 0; i < dataoriginal.length; i++) {
		weight*=1*!(dataoriginal[i]=="0"&&datasynthetic[i]=="1")
	}
	for (var i = 0; i < dataoriginal.length; i++) {
		wstring+=(weight==0)?0:datasynthetic[i]
	}
	return wstring;
}
function weight2(dataoriginal,datasynthetic){
	var weight=1,wstring="";
	for (var i = 0; i < dataoriginal.length; i++) {
		weight*=1*!(dataoriginal[i]=="0"&&datasynthetic[i]=="1")
	}
	return weight+"";
}

function subtract(dataoriginal,datasynthetic){
	var returnobj=""
	for (var i = 0; i < dataoriginal.length; i++) {
		returnobj+=1*(dataoriginal[i]=="1"&&datasynthetic[i]=="0")
	}
return returnobj
}
function reminder(dataoriginal,datasynthetic){
var returnobj=""
for (var i = 0; i < dataoriginal.length; i++) {
	returnobj+=1*(dataoriginal[i]=="1"&&datasynthetic[i]=="1")
}
return returnobj
}
function check(number,matrix) {
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


module.exports = router;
