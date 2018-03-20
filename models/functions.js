module.exports={
	secondlayer:function(objects) {
		var secondlayer={};
		for (var i = 0; i < objects.length; i++) {
			for (var j = i; j < objects.length; j++) {
				secondlayer[this.comparematrix(objects[i],objects[j])]=objects[i]+"#"+objects[j];
			}
		}
		return secondlayer;
	},
	nlayer:function(objects,secondlayer) {
		var seclayer=Object.keys(secondlayer)
			var result={};
		for (var i = 0; i < objects.length; i++) {
			for (var j = 0; j < seclayer.length; j++) {
				result[this.comparematrix(objects[i],seclayer[j])]=secondlayer[seclayer[j]]+"#"+objects[i];
			}
		}
		return result;
	},
	comparematrix:function(matrix1,matrix2){
		var string="";
		for (var i = 0; i < matrix1.length; i++) {
			string +=(matrix1[i]=="1"||matrix2[i]=="1")?1:0
		}
		return string;
	},
	sumfun:function (matrix) {
	  var sum = 0;
	  matrix.forEach(function(vector) {
	    sum += vector.reduce((a, b) => a + b, 0)
	  });
	  return sum;
	}

}
