var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var mongoose = require('mongoose')
var mongo = require('mongodb').MongoClient;
var mongoConnection = 'mongodb://AhmedMDeal:Tic15071991@ds141950.mlab.com:41950/mdeal';

// Image Upload Configuration
var bodyParser = require('body-parser'),
  cors = require('cors'),
  config = require('./config/settings'),
  db = require('./db/db');
// end Image

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

//Image Configuration items
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(bodyParser.json());
app.use(cors());

require('./route/route')(express, app);
//end Image Items


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.get('/cool', function (request, response) {
  response.send("", cool());
});
app.get('/mongoDB', function (request, response) {

  response.send("mongoDB")
})


function arrayBufferToString(buffer) {
  var arr = new Uint8Array(buffer);
  var str = String.fromCharCode.apply(String, arr);
  if (/[\u0080-\uffff]/.test(str)) {
    throw new Error("this string seems to contain (still encoded) multibytes");
  }
  return str;
}
app.post('/login', function (request, response) {
  console.log("this is login POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "Mongodb Client Connextion Error In login"
          }
        }
        response.send(mjson);
      } else {
        console.log("connect  done 'to COOLDEARY'");
        db.collection("User", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Mongodb Collection Connextion Error In login"
              }
            }
            response.send(mjson);
          } else {
            jsonreturn(buffers, function (json) {
              collection.find({
                "$and": [{
                  LoginWith: json.LoginWith
                }, {
                  Email: json.Email
                }]
              }).toArray(function (error, data) {

                if (error) {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find items Error In login"
                    }
                  }
                  response.send(mjson);
                } else if (data) {
                  if (data.length != 0) {
                    //console.log("the data is ", data);
                    response.setHeader('Content-Type', 'application/json');
                    var mjson = {
                      "status": "done",
                      "data": {},
                      "_id": data[0]._id
                    }
                    response.send(mjson)
                  } else {
                    response.setHeader('Content-Type', 'application/json');
                    var mjson = {
                      'status': 'error',
                      'data': {
                        message: "No find  Collection items Error In login"
                      }
                    }
                    response.send(mjson);
                  }

                } else {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find items Error In login"
                    }
                  }
                  response.send(mjson);
                }
              });
            });
          }
        });
      }
    });
  });
});

app.post('/addUser', function (request, response) {
  console.log("this is  addUser POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "MongoDB connection Error"
          }
        }
        response.send(mjson);
      } else {
        db.collection("User", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Collection creation Error"
              }
            }
            response.send(mjson);
          } else {
            // get ip address for configuration
            // var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
            //end ip
            jsonreturn(buffers, function (json) {
              collection.save(json, {
                w: 1
              }, function (error, result) {
                if (error) {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection Save Error"
                    }
                  }
                  response.send(mjson);
                } else {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'done',
                    'data': {},
                    '_id': result.ops[0]._id
                  }
                  response.send(mjson);
                }
              });
            });
          }
        });
      }
    });
  });
});


app.post('/addAllMeals', function (request, response) {
  console.log("this is  addMeal POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "MongoDB Connection Error In addMeal"
          }
        }
        response.send(mjson);
      } else {
        db.collection("Meals", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Collection creation Error In addMeal"
              }
            }
            response.send(mjson);
          } else {
            // get ip address for configuration
            // var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
            // end ip
            jsonreturn(buffers, function (json) {
              console.log("the json on serv side");
              console.log(JSON.stringify(json));
              json._idUser = mongoose.Types.ObjectId(json._idUser);
              console.log("buffers")
              var myDate = new Date();
              var date = new Date(myDate.toISOString());
              json.meal["mealDate"] = new Date(date);
              collection.save(json).then((value) => {

                response.setHeader('Content-Type', 'application/json');
                var mjson = {
                  'status': 'done',
                  'data': {}
                }
                response.send(mjson);
              }).catch(reason => {
                console.log("the value is ");
                console.log(reason);
                response.setHeader('Content-Type', 'application/json');
                var mjson = {
                  'status': 'error',
                  'data': {
                    message: "Collection cannot add Items creation Error In addMeal "
                  }

                }
                response.send(mjson);

              });

            });
          }
        });
      }
    });
  });
});


app.post('/updateMeal', function (request, response) {
  console.log("this is  addMeal POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "MongoDB Connection Error In addMeal"
          }
        }
        response.send(mjson);
      } else {
        db.collection("Meals", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Collection creation Error In updateMeal"

              }
            }
            response.send(mjson);
          } else {
            // get ip address for configuration
            // var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
            // end ip
            jsonreturn(buffers, function (json) {
              json._id = mongoose.Types.ObjectId(json._id);
              console.log("buffers")
              var find = collection.findOne({
                _id: json._idUser
              }, function (error, rep) {
                if (error) {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find User Error In updateMeal"

                    }
                  }
                  response.send(mjson);
                } else if (rep) {
                  var index = 0;
                  var verif = false;

                  for (item of rep.MealList) {
                    if (item.meal.id == json.meal.id) {
                      verif = true;
                      rep.MealList[index] = json;
                      collection.findOneAndUpdate({
                        _id: json._id
                      }, rep, function (error, data) {
                        if (error) {
                          response.setHeader('Content-Type', 'application/json');
                          var mjson = {
                            'status': 'error',
                            'data': {
                              message: "Collection find One Updata Error In updateMeal"

                            }
                          }
                          response.send(mjson);
                        } else if (data) {
                          console.log("the data");
                          console.log(data);
                          response.setHeader('Content-Type', 'application/json');
                          var mjson = {
                            'status': 'done',
                            'data': {}
                          }
                          response.send(mjson);
                        } else {
                          response.setHeader('Content-Type', 'application/json');
                          var mjson = {
                            'status': 'error',
                            'data': {
                              message: "Collection find One Updata Error In updateMeal"

                            }
                          }
                          response.send(mjson);
                        }
                      });
                    } else {
                      index++;
                    }
                    if (index == rep.MealList.length && verif == false) {
                      response.setHeader('Content-Type', 'application/json');
                      var mjson = {
                        'status': 'error',
                        'data': {
                          message: "Collection find User But Error to find the meal selected  In updateMeal"

                        }
                      }
                      response.send(mjson);
                    }
                  }
                }
              });
            });
          }
        });
      }
    });
  });
});

app.post('/reportUser', function (request, response) {
  console.log("this is  addMeal POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "MongoDB Connection Error In reportUser"
          }
        }
        response.send(mjson);
      } else {
        db.collection("User", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Collection creation Error In reportUser"
              }
            }
            response.send(mjson);
          } else {
            // get ip address for configuration
            // var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
            // end ip
            jsonreturn(buffers, function (json) {
              json.report_in = mongoose.Types.ObjectId(json.report_in);
              json.report_out = mongoose.Types.ObjectId(json.report_out);
              var find = collection.findOne({
                _id: json.report_in
              }, function (error, rep) {
                if (error) {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find User Error In reportUser"
                    }
                  }
                  response.send(mjson);
                } else if (rep) {
                  if (Array.isArray(rep.Report)) {
                    rep.Report.push(json);
                  } else {
                    rep.Report = [];
                    rep.Report.push(json);
                  }
                  collection.findOneAndUpdate({
                    _id: json.report_in
                  }, rep, function (error, data) {
                    if (error) {
                      response.setHeader('Content-Type', 'application/json');
                      var mjson = {
                        'status': 'error',
                        'data': {
                          message: "Collection find One Updata Error In reportUser"
                        }
                      }
                      response.send(mjson);
                    } else if (data) {
                      response.setHeader('Content-Type', 'application/json');
                      var mjson = {
                        'status': 'done',
                        'data': {}
                      }
                      response.send(mjson);
                    } else {
                      response.setHeader('Content-Type', 'application/json');
                      var mjson = {
                        'status': 'error',
                        'data': {
                          message: "Collection find One Updata Error In reportUser"
                        }
                      }
                      response.send(mjson);
                    }
                  });
                }
              });
            });
          }
        });
      }
    });
  });
});

app.post('/bookingMeal', function (request, response) {
  console.log("this is  addMeal POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "MongoDB Connection Error In bookingMeal"
          }
        }
        response.send(mjson);
      } else {
        db.collection("User", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Collection creation Error In bookingMeal"
              }
            }
            response.send(mjson);
          } else {
            // get ip address for configuration
            // var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
            // end ip
            jsonreturn(buffers, function (json) {
              json.book_in = mongoose.Types.ObjectId(json.book_in);
              json.book_out = mongoose.Types.ObjectId(json.book_out);
              var find = collection.findOne({
                _id: json.book_in
              }, function (error, rep) {
                if (error) {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find User Error In bookingMeal"
                    }
                  }
                  response.send(mjson);
                } else if (rep) {
                  var index = 0;
                  var verif = false;
                  for (item of rep.MealList) {
                    if (item.meal.id == json.mealId) {
                      verif = true;
                      if (Array.isArray(rep.MealList[index].numberBooking)) {
                        rep.MealList[index].numberBooking.push(json);
                      } else {
                        rep.MealList[index].numberBooking = [];
                        rep.MealList[index].numberBooking.push(json);
                      }
                      collection.findOneAndUpdate({
                        _id: json.book_in
                      }, rep, function (error, data) {
                        if (error) {
                          response.setHeader('Content-Type', 'application/json');
                          var mjson = {
                            'status': 'error',
                            'data': {
                              message: "Collection find One Updata Error In BookingMeal"
                            }
                          }
                          response.send(mjson);
                        } else if (data) {
                          response.setHeader('Content-Type', 'application/json');
                          var mjson = {
                            'status': 'done',
                            'data': {}
                          }
                          response.send(mjson);
                        } else {
                          response.setHeader('Content-Type', 'application/json');
                          var mjson = {
                            'status': 'error',
                            'data': {
                              message: "Collection find One Updata Error In reportUser"
                            }
                          }
                          response.send(mjson);
                        }
                      });
                    } else {
                      index++;
                    }
                  }
                }
              });
            });
          }
        });
      }
    });
  });
});

app.post('/CommendMeal', function (request, response) {
  console.log("this is  addMeal POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "MongoDB Connection Error In CommendMeal"
          }
        }
        response.send(mjson);
      } else {
        db.collection("User", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Collection creation Error In CommendMeal"
              }
            }
            response.send(mjson);
          } else {
            // get ip address for configuration
            // var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
            // end ip
            jsonreturn(buffers, function (json) {
              json._id = mongoose.Types.ObjectId(json._id);
              json.mealid = mongoose.Types.ObjectId(json.mealid);
              collection.findOne({
                _id: json._id
              }, function (error, rep) {
                if (error) {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find One Updata Error In BookingMeal"
                    }
                  }
                  response.send(mjson);
                } else if (rep) {
                  if (rep.MealCommend) {
                    rep.MealCommend.push(json)
                  } else {
                    rep['MealCommend'] = [];
                    rep.MealCommend.push(json)
                  }
                  collection.findOneAndUpdate({
                    _id: json._id
                  }, rep, function (error, data) {
                    if (error) {
                      response.setHeader('Content-Type', 'application/json');
                      var mjson = {
                        'status': 'error',
                        'data': {
                          message: "Collection find One Updata Error In BookingMeal"
                        }
                      }
                      response.send(mjson);
                    } else if (data) {
                      response.setHeader('Content-Type', 'application/json');
                      var mjson = {
                        'status': 'done',
                        'data': {}
                      }
                      response.send(mjson);
                    } else {
                      response.setHeader('Content-Type', 'application/json');
                      var mjson = {
                        'status': 'error',
                        'data': {
                          message: "Collection find One Updata Error In BookingMeal"
                        }
                      }
                      response.send(mjson);
                    }
                  });
                }
              })
            });
          }
        });
      }
    });
  });
});


app.post('/getPersonnalMeal', function (request, response) {
  console.log("this is login POST");
  var buffers = [];
  request.on('data', function (chunk) {
    buffers.push(chunk);
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader("Content-Type", 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: 'MongoDB CLient Connextion Error In getPersonnal Meals'
          }
        }
        response.send(mjson);
      } else {
        console.log("Connect to 'CoolDeary'");
        db.collection('Meals', function (error, collection) {
          if (error) {
            response.setHeader("Content-Type", 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: 'Collection CLient Connextion Error In getPersonnal Meals'
              }
            }
            response.send(mjson);
          } else {
            jsonreturn(buffers, function (json) {
              if (json) {
                json._idUser = mongoose.Types.ObjectId(json._idUser);
                console.log("the JSON send by the user");
                console.log(json);
                collection.find({
                  _idUser: json._idUser

                },{},json.skip, 5,100).toArray(function (error, data) {
                  if (error) {
                    response.setHeader("Content-Type", 'application/json');
                    var mjson = {
                      'status': 'error',
                      'data': {
                        message: 'Collection CLient Not Find  Meals'
                      }
                    }
                    response.send(mjson);
                  } else if (data) {
                    console.log("the data of personnal item is ");
                    console.log(data);
                    console.log(data.length);

                    if (data.length == 0) {
                      response.setHeader("Content-Type", 'application/json');
                      var mjson = {
                        'status': 'empty',
                        'data': {
                          message: 'Collection CLient is empty'
                        }
                      }
                      response.send(mjson);
                    } else {
                      response.setHeader('Content-Type', 'application/json');
                      var mjson = {
                        "status": "done",
                        "data": data
                      }
                      response.send(mjson)
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  });
});

app.post('/getAllMeals', function (request, response) {
  console.log("this is login POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "Mongodb Client Connextion Error In getAllMeals"
          }
        }
        response.send(mjson);
      } else {
        console.log("Connect  'CoolDeary Done'");
        db.collection("Meals", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Mongodb Collection Connextion Error In getAllMeals"
              }
            }
            response.send(mjson);
          } else {
            jsonreturn(buffers, function (json) {
              console.log(JSON.stringify(json));
              var myDate = new Date();
              var myTomorrow = new Date();
              myTomorrow.setDate(myTomorrow.getDate() + 1);

              var jour = myDate.getUTCDate();
              if (myDate.getUTCDate() < 10) {
                jour = '0' + myDate.getUTCDate()
              }
              var demain = myTomorrow.getUTCDate();
              if (myTomorrow.getUTCDate() < 10) {
                demain = '0' + myTomorrow.getUTCDate()
              }

              var day = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + jour + "T00:00:00.000Z"

              var tomorrow = myTomorrow.getFullYear() + '-' + (myTomorrow.getMonth() + 1) + '-' + demain + "T00:00:00.000Z"
              day = new Date(day);
              tomorrow = new Date(tomorrow);
              /*console.log(day);
              console.log(tomorrow);
              console.log(myDate, '   ', myTomorrow);
              console.log("the json is");
              console.log(JSON.stringify(json));*/
              collection.find({
                "$and": [{
                  "$or": [{
                      'meal.mealLocation.locality': json.locality

                    }, {
                      'meal.mealLocation.administrativeArea': json.administrativeArea

                    },
                    {
                      'meal.mealLocation.subAdministrativeArea': json.subAdministrativeArea

                    }
                  ]
                }, {
                  "meal.mealDate": {
                    $gte: day,
                    $lt: tomorrow
                  }
                }]
              }).toArray(function (error, data) {
                if (error) {
                  console.log("error");
                  console.log(error);
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find items Error In getAllMeals"
                    }
                  }
                  response.send(mjson);
                } else if (data.length != 0) {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': data
                  }

                  response.send(mjson);
                } else {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find items Error In getAllMeals"
                    }
                  }
                  response.send(mjson);
                }
              });
            });
          }
        });
      }
    });
  });
});


app.post('/login', function (request, response) {
  console.log("this is login POST");
  var buffers = []
  request.on('data', function (chunk) {
    buffers.push(chunk)
  }).on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        response.setHeader('Content-Type', 'application/json');
        var mjson = {
          'status': 'error',
          'data': {
            message: "Mongodb Client Connextion Error In login"
          }
        }
        response.send(mjson);
      } else {
        console.log("connect  done 'to COOLDEARY'");
        db.collection("User", function (error, collection) {
          if (error) {
            response.setHeader('Content-Type', 'application/json');
            var mjson = {
              'status': 'error',
              'data': {
                message: "Mongodb Collection Connextion Error In login"
              }
            }
            response.send(mjson);
          } else {
            jsonreturn(buffers, function (json) {
              collection.find({
                "$and": [{
                  LoginWith: json.LoginWith
                }, {
                  Email: json.Email
                }]
              }).toArray(function (error, data) {

                if (error) {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find items Error In login"
                    }
                  }
                  response.send(mjson);
                } else if (data) {
                  if (data.length != 0) {
                    console.log("the data is ", data);
                    response.setHeader('Content-Type', 'application/json');
                    var mjson = {
                      "status": "done",
                      "data": {},
                      "_id": data[0]._id
                    }
                    response.send(mjson)
                  } else {
                    response.setHeader('Content-Type', 'application/json');
                    var mjson = {
                      'status': 'error',
                      'data': {
                        message: "No find  Collection items Error In login"
                      }
                    }
                    response.send(mjson);

                  }

                } else {
                  response.setHeader('Content-Type', 'application/json');
                  var mjson = {
                    'status': 'error',
                    'data': {
                      message: "Collection find items Error In login"
                    }
                  }
                  response.send(mjson);
                }
              });
            });
          }
        });
      }
    });
  });
});







/*app.post('/deleteMeal', function (request, response) {
  console.log("this is deleteMeal POST");
  var body = '';
  request.on('data', function (data) {
    body = data;
  });
  request.on("end", function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        console.log('Error on database connection "updateUser"');
        response.send("error");
      } else {
        console.log("connect  done 'updateUser'");
        db.collection("User", function (error, collection) {
          if (error) {
            console.log("Error to find collection 'updateUser'", error);
            response.send("error");
          } else {
            var j = JSON.parse(body);
            j._id = mongoose.Types.ObjectId(j._id);
            collection.findOne({
              _id: j._id
            }, function (error, data) {
              if (error) {
                console.log('Error to find user "updateUser');
                response.send("error");
              } else if (data) {
                //console.log("the data is ", data);
                var verif
                for (var item in data.MealList) {
                  if (data.MealList[item].id == j.meal.id) {
                    data.MealList.splice(item, 1);
                    console.log("deleteMeal", data.MealList);
                    collection.update({
                      _id: j._id
                    }, data, {
                      upsert: true
                    });
                    response.send("done");
                  }
                }

              } else {
                console.log('Error to find user "updateUser');
                response.send("error");
              }
            });
          }
        });
      }
    });
  });
});


app.post('/stopMeal', function (request, response) {
  var body = '';
  request.on('data', function (data) {
    body = data;
  });
  request.on("end", function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        console.log('Error on database connection "stopMeal"');
        response.send("error");
      } else {
        console.log("connect  done 'stopMeal'");
        db.collection("User", function (error, collection) {
          if (error) {
            console.log("Error to find collection 'stopMeal'", error);
            response.send("error");
          } else {
            var j = JSON.parse(body);
            j._id = mongoose.Types.ObjectId(j._id);
            collection.findOne({
              _id: j._id
            }, function (error, data) {
              if (error) {
                console.log('Error to find user "stopMeal');
                response.send("error");
              } else if (data) {
                //console.log("the data is ", data);
                var verif
                for (var item in data.MealList) {
                  if (data.MealList[item].id == j.meal.id) {
                    data.MealList[item].mealPublish = !data.MealList[item].mealPublish; //false;
                    console.log("stopMeal", data.MealList);
                    collection.update({
                      _id: j._id
                    }, data, {
                      upsert: true
                    });
                    response.send("done");
                  }
                }

              } else {
                console.log('Error to find user "stopMeal');
                response.send("error");
              }
            });
          }
        });
      }
    });
  });

});
app.post('/reportUser', function (request, response) {
  var body = '';
  request.on('data', function (data) {
    body = data;
  });
  request.on('end', function () {
    mongo.connect(mongoConnection, function (error, db) {
      if (error) {
        console.log("error on database connection 'reportUser'");
        response.send('error');
      } else {
        db.collection('User', function (error, collection) {
          if (error) {
            console.log("error on collection find 'reportUser'");
            response.send("error");
          } else {
            var j = JSON.parse(body);
            j._id = mongoose.Types.ObjectId(j._id);
            collection.findOne({
              _id: j._id
            }, function (error, data) {
              if (error) {
                console.log("error on findOne 'reportUser'");
                response.send("error");
              } else if (data) {
                var num = Number(data.Report);
                var num = num + 1;
                data.Report = num;
                if (num >= 10) {
                  console.log("the data is ", data.Banne);
                  data.Banne = true;
                  collection.update({
                    _id: j._id
                  }, data, {
                    upsert: true
                  });
                  response.send("done");
                } else {
                  console.log("the data : ", num);
                  collection.update({
                    _id: j._id
                  }, data, {
                    upsert: true
                  });
                  response.send("done");
                }
              } else {
                console.log("error on findOne 'reportUser'");
                response.send("error");
              }
            });
          }
        });
      }
    });
  });
});*/

function jsonreturn(buffers, callback) {
  var json = JSON.parse(Buffer.concat(buffers).toString());
  //console.log(json);
  return callback(json);

}


//cronJob

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
