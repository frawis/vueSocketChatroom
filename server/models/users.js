/*
 * 内部数据结构：用户列表
 *  [{username, sessionId, socket} ...]
 * */
let users = [];

function findInUsers(sessionId) { // 通过sessionId查找
  let index = -1;
  for (let j = 0, len = users.length; j < len; j += 1) {
    if (users[j].sessionId === sessionId) {
      index = j;
    }
  }
  console.log(index);
  return index;
}
function addUser(username, sessionId) { // 添加用户
  let index = findInUsers(sessionId);
  if (index === -1) {
    users.push({
      username,
      sessionId,
      socket: null,
    });
  } else if (users[index].username !== username) {
    users[index].username = username;
  }
}
function setUserSocket(sessionId, socket) { // 更新用户socket
  let index = findInUsers(sessionId);
  if (index !== -1) {
    users[index].socket = socket;
  }
}
function findUser(sessionId) { // 查找
  let index = findInUsers(sessionId);
  return index > -1 ? users[index] : null;
}
function otherUsers(sessionId) { // 其他人
  let results = [];
  for (let j = 0, len = users.length; j < len; j += 1) {
    if (users[j].sessionId !== sessionId) {
      results.push({
        sessionId: users[j].sessionId,
        username: users[j].username,
      });
    }
  }
  return results;
}

function allUsers() {
  return users;
}

function getUsername(sessionId) {
  console.log(users.length);
  for (let i = 0; i < users.length; i += 1) {
    if (users[i].sessionid === sessionId) {
      return users[i].username;
    }
  }
  return '404NotFound';
}

module.exports = {
  findUser,
  otherUsers,
  allUsers,
  getUsername,
  addUser,
  setUserSocket,
};
