import {
  Divider,
  Actionsheet,
  XHeader,
  TransferDom,
  Popup,
  Tab,
  TabItem,
  Tabbar,
  TabbarItem,
  XButton,
  XInput,
  Grid,
  GridItem,
  Group } from 'vux';
import {
  mapActions,
  mapGetters } from 'vuex';
import moment from 'moment';

import GroupChat from '../GroupChat';
import PrivateChat from '../PrivateChat';
import { logout } from '../../api/api';
// const socket = null;

export default {
  name: 'Chat',
  directives: {
    TransferDom,
  },
  components: {
    Divider,
    Actionsheet,
    XHeader,
    Popup,
    Tab,
    TabItem,
    Tabbar,
    TabbarItem,
    XButton,
    XInput,
    Grid,
    GridItem,
    Group,
    GroupChat,
    PrivateChat,
  },
  data() {
    return {
      showMenus: false,
      message: '',
    };
  },
  mounted() {
    const socket = window.io('http://localhost:8080');
    const that = this;
    // 告诉socket server该用户登录的动作
    let time = moment().format('YYYY/MM/DD HH:mm:ss');
    socket.emit('login', {
      time,
    });
    // 监听socket server其他用户登录的消息
    socket.on('someOneLogin', ({ user, msg }) => {
      that.addPeople({
        label: user.username,
        value: user.sessionId,
      });
      that.addRecord({
        username: '',
        sessionId: '',
        enter: true,
        msg,
        time,
      });
      console.log(msg);
    });
    // 监听socket server 其他用户退出的消息
    socket.on('quit', (data) => {
      console.log(data);
    });
    // 监听socket server 的广播
    socket.on('broadcast', (data) => {
      console.log(data);
    });
    // 监听私聊信息
    socket.on('private', (data) => {
      console.log(data);
    });
    // 聊天室成员
    this.getOthers();
    this.getRecords();
    this.getUser();
  },
  computed: {
    ...mapGetters([
      'people',
      'talkingTo',
      'talkToPeople',
      'records',
      'user',
    ]),
  },
  methods: {
    ...mapActions([
      'getOthers',
      'setTalkingTo',
      'addTalkToPeople',
      'addPeople',
      'addRecord',
      'getRecords',
      'getUser',
    ]),
    sendMsg() {
      const socket = window.io('http://localhost:8080');
      const that = this;
      if (this.message.trim() !== '') {
        // 非群聊
        if (this.talkingTo !== -1) {
          let sessionId = this.people[this.talkingTo].value;
          let time = moment().format('YYYY/MM/DD HH:mm:ss');
          // 发送私聊消息
          socket.emit('private', {
            msg: this.message,
            toSessionId: sessionId,
            time,
          });
          // 清除输入框
          this.message = '';

        // 群聊
        } else {
          // 发送群聊消息
          let time = moment().format('YYYY/MM/DD HH:mm:ss');
          socket.emit('broadcast', {
            msg: this.message,
            time,
          });
          this.addRecord({
            username: that.user.username,
            sessionId: that.user.sessionId,
            msg: this.message,
            time,
          });
          // 清除输入框
          this.message = '';
        }
      } else {
        this.$vux.alert.show({
          title: '发送消息不能为空！',
        });
      }
    },
    talkToThis(index) {
      this.setTalkingTo(index);
    },
    choosePerson(value) {
      for (let i = 0; i < this.people.length; i += 1) {
        if (this.people[i].value === value) {
          if (this.talkToPeople.includes(i)) {
            this.setTalkingTo(i);
          } else {
            this.addTalkToPeople(i);
            this.setTalkingTo(i);
          }
          break;
        }
      }
    },
    logout() {
      const that = this;
      this.$vux.confirm.show({
        title: '确定要退出聊天室吗？',
        onConfirm() {
          logout(that);
        },
      });
    },
  },
};
