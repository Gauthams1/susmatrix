var express = require('express');
var router = express.Router();
var functions = require('../models/functions');
var user = require('../models/user');
// const addon = require('../build/Release/addon');

const order={
	0:["00","01","10","11"],
	1:["01","10","11","00"],
	2:["10","11","00","01"],
	3:["11","00","01","10"],
	4:["01","00","10","11"],
	5:["00","10","11","01"],
	6:["10","11","01","00"],
	7:["11","01","00","10"],
	8:["00","10","01","11"],
	9:["10","01","11","00"],
	10:["01","11","00","10"],
	11:["11","00","10","01"],
	12:["00","01","11","10"],
	13:["01","11","10","00"],
	14:["11","10","00","01"],
	15:["10","00","01","11"],
	16:["00","11","10","01"],
	17:["11","10","01","00"],
	18:["10","01","00","11"],
	19:["01","00","11","10"],
	20:["11","01","10","00"],
	21:["01","10","00","11"],
	22:["10","01","11","01"],
	23:["00","11","01","10"]
};
router.get('/search/:data', function(req, res){
var data=req.params.data;
user.find({data:data},function(err,user){
	res.json(user);
})
});
router.get('/:data', function(req, res){
var data=req.params.data;
var datastring=data//.split("").join("0");
var result,itneeded=0;
var iteration=Math.log(data.length)/Math.log(2);
console.log(`starting getting iteration for now ${iteration-1}`);
var start = new Date().getTime();

for (var i = 0; i < iteration+1; i++) {
	console.log(`iteration number ${i+1}`);
	result=manuplate(datastring)
	datastring=result.reminder//.split("").join("0");
	itneeded=i;
	if(datastring.split("0").join('')=="")
	break;
	console.log(`compression ${(data.length-result.left)/((i+1)*(i+1))} accurate : ${(data.length-result.left)/(data.length)}`);
}
res.json({result:result,compression:(data.length-result.left)/(4*(iteration-1)*(itneeded)),iterate:itneeded,accurate:(data.length-result.left)/(data.length)});
console.log("end of result for now");

var end = new Date().getTime();
console.log((data.length-result.left)*1000/(4*(iteration-1)*(itneeded)*(end-start)));

});
function returnresultjson(data,left,right) {
	var revisedstring=propergenerator(data,left,right);
	var revisedstring2=matrixgenerator(data,revisedstring);
	return {
		left:left,
		right:right,
    data: data,
		revised: revisedstring2.revisedstring,
		revisedlength2:revisedstring2.revisedstring.split("0").join("").length,
};
}
function lowestvalue(data) {
	var lowestleft="00",lowestright="00",currentstringleft,total,currentstringright,max=-1,maxlowestleft,maxlowestright;
	for (var ind = 0; ind < 24; ind++) {
		for (var i = 0; i < data.length; i+=4) {
		currentstringleft=data.substr(i,2);
		currentstringright=data.substr(i+2,2);
		lowestleft=order[ind].indexOf(currentstringleft)>order[ind].indexOf(lowestleft)?currentstringleft:lowestleft;
		lowestright=order[ind].indexOf(currentstringright)>order[ind].indexOf(lowestright)?currentstringright:lowestright;
		}
		total=lowestleft.split("0").join('').length*data.substr(0,data.length/2).split('0').join('').length+lowestright.split("0").join('').length*data.substr(data.length/2,data.length/2).split('0').join('').length;
		maxlowestleft=total>max?lowestleft:maxlowestleft;
		maxlowestright=total>max?lowestright:maxlowestright;
		max=total>max?total:max;
		console.log(`total ${total}`);

	}
	console.log(max);

	var matrix=[parseInt(maxlowestleft[0]),parseInt(maxlowestleft[1]),parseInt(maxlowestright[0]),parseInt(maxlowestright[1])];
	return {lowestleft:maxlowestleft,lowestright:maxlowestright,matrix:matrix};
}
function manuplate(data){
	var datastring,finalmatrix=[],max=0,dataset,finaldatapoint;
		datastring=data;
		var matrixresult=[[],[],[],[]];
		var datapoints='';
		var lowestleft='',lowestright='';
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
		dataset=Math.pow(2,matrixresult[0].length+1)-1;
		var reminderone=check(dataset,matrixresult).split("0").join('').length;
		finalmatrix=reminderone>max?matrixresult:finalmatrix;
		finaldatapoint=reminderone>max?datapoints:finaldatapoint;
		finalmatrix=finalmatrix.length<4?matrixresult:finalmatrix;
		max=reminderone>max?reminderone:max;
console.log(`max ${max} matrix ${finalmatrix}`);
	datapoints=finaldatapoint;
	lowestleft=datapoints.lowestleft,lowestright=datapoints.lowestright;
	return {json:returnresultjson(data,lowestleft,lowestright),matrix:finalmatrix,result:check(dataset,finalmatrix),reminder:subtract(data,check(dataset,finalmatrix)),left:subtract(data,check(dataset,finalmatrix)).split("0").join('').length}
}
// ==========================================
//
// ==========================================

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
