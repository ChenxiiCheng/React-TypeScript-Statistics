import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import request from '../../request';
import moment from 'moment';
import './style.css';

interface State {
  isLogin: boolean;
  data: responseResult.DataStructure;
}

class Home extends Component {
  state: State = {
    isLogin: true,
    data: {}
  };

  componentWillMount() {
    request.get('/api/isLogin').then(res => {
      const data: responseResult.isLogin = res.data;
      if (!data) {
        this.setState({
          isLogin: false
        });
      }
    });

    request.get('/api/showData').then(res => {
      const data: responseResult.DataStructure = res.data;
      if (data) {
        this.setState({ data: data });
      }
    });
  }

  handleLogout = () => {
    request
      .get('/api/logout')
      .then(res => {
        const data: responseResult.logout = res.data;
        if (data) {
          this.setState({
            isLogin: false
          });
        } else {
          message.error('Logout Fail...');
        }
      })
      .catch(() => {
        message.error('Logout Fail...');
      });
  };

  // 爬取
  handleCrowller = () => {
    request
      .get('/api/getData')
      .then(res => {
        const data: responseResult.getData = res.data;
        if (data) {
          message.success('Get Data Success');
        } else {
          message.error('Logout Fail...');
        }
      })
      .catch(() => {
        message.error('Logout Fail...');
      });
  };

  // echarts options
  getOption: () => echarts.EChartOption = () => {
    const { data } = this.state;
    const courseNames: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for (let i in data) {
      const item = data[i];
      times.push(moment(Number(i)).format('MM-DD HH:mm'));
      item.forEach(innerItem => {
        const { title, count } = innerItem;
        if (courseNames.indexOf(title) === -1) {
          courseNames.push(title);
        }
        tempData[title]
          ? tempData[title].push(count)
          : (tempData[title] = [count]);
      });
    }
    const result: echarts.EChartOption.Series[] = [];
    for (let i in tempData) {
      result.push({
        name: i,
        type: 'line',
        data: tempData[i]
      });
    }
    return {
      title: {
        text: '在线学习人数'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: courseNames
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times
      },
      yAxis: {
        type: 'value'
      },
      series: result
    };
  };

  render() {
    const { isLogin } = this.state;
    if (isLogin) {
      return (
        <div className="home-page">
          <div className="buttons">
            <Button
              type="primary"
              onClick={this.handleCrowller}
              style={{ marginLeft: '10px' }}
            >
              爬取
            </Button>
            <Button type="ghost">展示</Button>
            <Button type="danger" className="exit" onClick={this.handleLogout}>
              退出
            </Button>
          </div>
          <ReactEcharts option={this.getOption()} />
        </div>
      );
    }
    return <Redirect to="/login" />;
  }
}

export default Home;
