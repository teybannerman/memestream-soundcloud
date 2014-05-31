/**  
  * @desc basic static express server to host our app
  * @author Tey Bannerman teybannerman@gmail.com 
*/  

var express = require('express'); 
var app = express();

// compress content
//app.use(express.compress());

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);