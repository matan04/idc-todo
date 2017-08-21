const express = require('express');
const _ = require('lodash');
const uuid = require('uuid/v4');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const MY_COOKIE = 'ex4Cookie';

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 1000,
  httpOnly: false,
  secure: false
};

const app = express();

let usersList = [];
let todoLists = [];


console.log('backend start');
app.use(cookieParser(MY_COOKIE));
app.use(bodyParser.text());

//use to allow cross domain requests
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.sendStatus(200);
  }
  else {
    //move on
    next();
  }
};
app.use(allowCrossDomain);

/*
 add user/password to the user-list
 Returns 200 if the user does not exist
 Returns 500 otherwise
 */
app.post('/register/:username/:password', (req, res) => {
  let username = req.params.username;
  let password = req.params.password;
  let checkExists = _.filter(usersList, (user) => {
    return user.username === username;
  });

  if (checkExists.length === 0) {
    let uid = uuid();
    usersList.push({
      username,
      password,
      uid
    });
    console.log('registered');
    res.send('');
  }
  else {
    res.status(500).send('');
  }
});

/*
 POST: /login/:username/:password - should log in
 Returns 200 if the user/password exists
 Returns cookie with UID that expires after 60 minutes.
 Otherwise Returns status 500
 */
app.post('/login/:username/:password', (req, res) => {
  let username = req.params.username;
  let password = req.params.password;

  //check if user exists
  let checkExists = _.filter(usersList, (user) => {
    return user.username === username && user.password === password;
  });

  if (checkExists.length > 0) {
    let user = checkExists[0];
    //return response + cookie for 60 minutes
    res
    .cookie(MY_COOKIE, user.uid, COOKIE_OPTIONS)
    .send('');
  }
  else {
    res.status(500).send('');
  }
});

//check that user has a cookie on the item API
app.use(/\/list.*/, (req, res, next) => {

  //get the cookie from the browser
  let cookie = req.cookies && req.cookies[MY_COOKIE];

  if (cookie) {
    //check if user exists (by uid)
    let checkExists = _.filter(usersList, (user) => {
      return user.uid === cookie;
    });
    if (checkExists.length > 0) {
      next();
      return;
    }
  }
  res.sendStatus(401);
});

/*
 POST: /list/  (list from type json in the HTTP body)
 Should add the json list to the toDo-list
 List must have unique id property
 */
app.post('/list', (req, res) => {
  let list = JSON.parse(req.body);
  let itemId = uuid();
  let tasks = [];
  let userID = req.cookies[MY_COOKIE];

  todoLists.push(Object.assign(list, { id: itemId }, { tasks }, { userID }));

  //extend the cookie for another hour
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], COOKIE_OPTIONS).send(list);
});

//GET: /lists returns all the lists as an array
app.get('/lists', (req, res) => {

  //extend the cookie to new hour
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], COOKIE_OPTIONS);
  //return lists of only specific user
  let userItems = todoLists.filter(function (item) {
    return req.cookies[MY_COOKIE] === item.userID;
  });
  let sharedItems = todoLists.filter(function (item) {
    return req.cookies[MY_COOKIE] === (item.shareWith && item.shareWith.uid);
  });
  res.type('json').send(JSON.stringify({ userItems, sharedItems }));
});

//GET: /list/:listid returns the list with the right id or 404 if no such an item
app.get('/list/:listid', (req, res) => {
  let listid = req.params.listid;

  //extend the cookie to new hour
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], COOKIE_OPTIONS);

  //check if item exists
  let list = _.filter(todoLists, (item) => {
    return item.id == listid;
  });
  if (list.length > 0) {
    const isShare = req.cookies[MY_COOKIE] !== list[0].userID;
    res.type('json').send(JSON.stringify(Object.assign(list[0], { isShareView: isShare })));
  }
  else {
    res.status(404).send('List does not exists');
  }
});

//DELETE: /list/:listid delete the item with the right id or 404 if no such an item
app.delete('/list/:listid', (req, res) => {
  //extend the cookie to new hour
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], COOKIE_OPTIONS);

  if (deleteList(req.params.listid)) {
    res.send('');
  }
  else {
    res.status(404).send('list does not exists');
  }
});

function deleteList(listId) {
  //check if list exists
  let list = _.filter(todoLists, (item) => {
    return item.id == listId;
  });
  if (list.length > 0) {
    _.remove(todoLists, (item) => {
      return item.id == listId;
    });
    return true;
  }
  else {
    return false;
  }
}

//POST: /list/:listid/item/:name add the task to the specific list
app.post('/list/:listid/item/:name', (req, res) => {
  let task = {
    title: req.params.name,
    taskId: uuid(),
    done: false
  };

  const userID = req.cookies[MY_COOKIE];
  const listid = req.params.listid;

  const currentList = _.filter(todoLists, function (list) {
    return list.id == listid;
  });

  if (currentList.length == 0) {
    res.status(404).send('List does not exist');
    return;
  }

  _.remove(todoLists, (item) => {
    return item && item.id == currentList[0].id;
  });

  currentList[0].tasks.push(task);
  todoLists.push(currentList[0]);
  //extend the cookie for another hour
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], COOKIE_OPTIONS).send(task);
});

//DELETE: /list/:listid/:itemid - ​delete item on specific list
app.delete('/list/:listid/:itemid', (req, res) => {
  //extend the cookie to new hour
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], COOKIE_OPTIONS);

  let list = undefined;
  //check if list exists
  todoLists = _.filter(todoLists, function (item) {
    if (item.id == req.params.listid) {
      list = item;
    }
    return item.id != req.params.listid;
  });

  if (!list) {
    res.status(404).send('List does not exist');
    return;
  }

  list.tasks = _.filter(list.tasks, (item) => {
    return item.taskId != req.params.itemid;
  });

  todoLists.push(list);

  res.send('');
});

//GET  /list/:listid/:prefix - ​returns user’s item that start with the prefix  from specific list 
app.get('/list/:listid/item/:prefix?', (req, res) => {
  //extend the cookie to new hour
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], COOKIE_OPTIONS);
  // find list to search in
  let specificList = todoLists.filter(function (item) {
    return req.params.listid === item.id
  });


  if (!req.params.prefix) {
    res.type('json').send(JSON.stringify(specificList[0].tasks));
    return;
  }
  else {
    let matchingTasks = specificList[0].tasks.filter(function (task) {
      return task.title.toLowerCase().indexOf(req.params.prefix.toLowerCase()) === 0;
    });

    res.type('json').send(JSON.stringify(matchingTasks))
  }

});

//PUT: /list/:listid/share/:username - ​share the list with desire user 
app.put('/list/:listid/share/:username', (req, res) => {
  //extend the cookie to new hour
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], COOKIE_OPTIONS);

  let listId = req.params.listid;
  //check if the list exists
  let list = _.filter(todoLists, (item) => {
    return item.id === listId;
  });

  if (list.length > 0) {
    list = list[0];

    //find our user
    const newUser = _.filter(usersList, (user) => {
      return req.params.username == user.username;
    });

    if (newUser.length > 0) {

      //remove the list to modify it
      _.remove(todoLists, (item) => {
        return item && item.id == listId;
      });

      //add the user to shareWith
      list.shareWith = newUser[0];

      //push the list back
      todoLists.push(list);

      res.send(JSON.stringify(list));
    }
    else {
      res.status(404).send('User does not exist');
    }
  }
  else {
    res.status(404).send('Item not exists');
  }
});

// DELETE: user ​delete user, his lists and logout
app.delete('/user', (req, res) => {

  const userId = req.cookies[MY_COOKIE];

  const myUser = usersList.filter((user) => {
    return user.uid == userId;
  });

  // check that user exists
  if (myUser.length == 0) {
    res.status(404).send('user does not exists');
  }
  else {

    //remove all lists
    _.remove(todoLists, (list) => {
      return list.uid == userId;
    });

    //remove user
    _.remove(usersList, (user) => {
      return user.uid == userId;
    });

    //remove cookie
    res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], { maxAge: -1, });
    res.send('');
  }

});

// GET:/logout - ​logout
app.get('/logout', (req, res) => {
  res.cookie(MY_COOKIE, req.cookies[MY_COOKIE], { maxAge: -1, }).send('');
});

// start app on port 3000
app.listen(3000, () => {
  console.log('App listening on port 3000!')
});
