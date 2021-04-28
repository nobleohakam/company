const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://noble_oaja:asdUYT23@project1.jit3l.mongodb.net/stockticker?retryWrites=true&w=majority";
var fs = require('fs');
var qs = require('querystring');
var http = require('http');


    http.createServer(function (req, res) {

            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
              if(err) { console.log("Connection err: " + err); return; }

              var dbo = db.db("stockticker");
              var coll = dbo.collection('companies');
              var f_data = "";

              req.on('data', data => {
                f_data += data.toString();
              });

              req.on('end', () => {
                  console.log("f_data: " + f_data);
                  var ticker = f_data.slice(7,f_data.indexOf("&c_name="));
                  console.log("ticker: " + ticker);

                  var name = f_data.slice(f_data.indexOf("c_name=")+ 7,f_data.length);
                  name = name.replace("+", " ").replace("+", " ");
                  // if (name == "Abercrombie+%26+Fitch+Co."){
                  //     name = name.replace("%26", "&");
                  // }
                  console.log("name: " + name);

                  if (ticker == "&" && name !="") {
                      query = "{Company: " + name + "}";
                  }else {
                      query = "{Ticker: " + ticker + "}";
                  }

                console.log("query: " + query);
                  coll.find(query).toArray(function(err, items) {
              	  if (err) {
              		console.log("Error: " + err);
              	  }
              	  else
              	  {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write  ("<html><head><style>html{background-color:#80FFB3;}</style></head>");
                    res.write("<body>Result<br />");
              		for (i=0; i<items.length; i++)
                        if (items[i].Company == name || items[i].Ticker == ticker){
                            res.write("Company Name: "+ items[i].Company + " Ticker: " + items[i].Ticker + "<br />");
                        }

              	  }
                  res.end("</body></html>");
                  db.close();
                  });
              	  console.log("after close");
              });
      		});

    }).listen(8080);
