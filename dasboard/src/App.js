// import React from "react";
import React, { Component } from "react";
import "./App.css";
import user_data from "./data";
import "antd/dist/antd.css";
import { Layout, Menu, Input, Row, Col } from "antd";
import ViewDonutChart from "./views/ViewDonutChart";
import ViewLineChart from "./views/ViewLineChart";
import ViewBarChart from "./views/ViewBarChart";
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

export default class Dashboard extends Component {
  // const [count, setCount] = useState(0);
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      selectedUserId: null,
      users: null,
      loading: true,
    };
  }
  async componentDidMount() {
    const url = "http://127.0.0.1:8000/Users/";
    const response = await fetch(url);
    const users = await response.json();
    this.setState({ users });
    console.log("in did mount", users);
    if (users) {
      const url = `http://127.0.0.1:8000/UserData/${users[1].id}`;
      const response = await fetch(url);
      const selectedUser = await response.json();
      console.log("in did mount", selectedUser);
      this.setState({ selectedUser });
    }
  }
  selectUser = (userId) => {
    this.setState({ selectedUserId: userId });
  };
  async fetchData(id) {
    const url = `http://127.0.0.1:8000/UserData/${id}`;
    const response = await fetch(url);
    const selectedUser = await response.json();
    this.setState({ selectedUser });
  }
  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    console.log(
      "In update",
      this.state.selectedUserId,
      prevState.selectedUserId
    );
    if (this.state.selectedUserId !== prevState.selectedUserId) {
      this.fetchData(this.state.selectedUserId);
    }
  }
  render() {
    console.log("render");
    if (this.state.selectedUser) {
      console.log("In render", this.state.users);
      console.log("In render", this.state.selectedUser);
      return (
        // <div>
        //   <p style={{ color: "white", fontWeight: "bold", fontSize: 25 }}>
        //     RISK ANALYTICS
        //   </p>
        <Layout
          style={{
            margin: "7px 7px 7px 7px",
            height: "96vh",
            borderRadius: "8px",
          }}
        >
          <Layout
            className="site-layout"
            style={{ marginLeft: 200, borderRadius: "8px" }}
          >
            <Sider
              style={{
                // background: "#31337D",
                overflow: "auto",
                // width: "100vw",
                height: "93vh",
                position: "fixed",
                top: 28,
                left: 30,
                borderRadius: "8px",
              }}
            >
              {/* <div className="logo" /> */}
              <Search
                style={{ padding: 14 }}
                placeholder="Enter name"
                onSearch={(value) => console.log(value)}
                enterButton
              />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]}>
                {this.state.users.map((user) => (
                  <Menu.Item
                    key={user.id}
                    onClick={() => this.selectUser(user.id)}
                  >
                    {user.name}
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>
            <Content
              style={{
                margin: "10px 16x 0",
                overflow: "auto",
                borderRadius: "8px",
              }}
            >
              <Header className="site-layout-background" style={{ padding: 0 }}>
                <center>
                  <h1 style={{ fontWeight: "bold" }}>
                    Risk Score: {this.state.selectedUser.risk_score}
                  </h1>
                </center>
              </Header>
              <div
                className="site-layout-background"
                style={{
                  paddingLeft: 34,
                  paddingRight: 24,
                  paddingBottom: 15,
                  textAlign: "center",
                }}
              >
                <Row gutter={[20, 20]}>
                  <Col span={9}>
                    <ViewDonutChart
                      data={this.state.selectedUser.risk_score * 10}
                    />
                  </Col>
                  <Col span={15}>
                    <ViewLineChart data={this.state.selectedUser.risk_run} />
                  </Col>
                </Row>
                <Content>
                  <ViewBarChart data={this.state.selectedUser.category_avg} />
                </Content>
              </div>
            </Content>
          </Layout>
          {/* <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer> */}
        </Layout>
        // </div>
      );
    } else {
      return <div></div>;
    }
  }
}

// export default App;
