import React, { Component } from "react";
import "./App.css";
import user_data from "./data";
import "antd/dist/antd.css";
import { Layout, Menu, Input, Row, Col } from "antd";
import ViewDonutChart from "./views/ViewDonutChart";
import ViewLineChart from "./views/ViewLineChart";
import ViewBarChart from "./views/ViewBarChart";
const { Header, Content, Footer, Sider } = Layout;
// const { Search } = Input;

export default class Dashboard extends Component {
  // const [count, setCount] = useState(0);
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      selectedUserId: null,
      users: null,
      filteredUsers: null,
      loading: true,
    };
  }
  async componentDidMount() {
    const url = "http://localhost:8000/Users/";
    const response = await fetch(url);
    const users = await response.json();
    this.setState({ users, filteredUsers: users });

    if (users) {
      const url = `http://localhost:8000/UserData/${users[0].id}`;
      const response = await fetch(url);
      const selectedUser = await response.json();
      this.setState({ selectedUser });
    }
  }
  selectUser = (userId) => {
    this.setState({ selectedUserId: userId });
  };

  async fetchData(id) {
    const url = `http://localhost:8000/UserData/${id}`;
    const response = await fetch(url);
    const selectedUser = await response.json();
    this.setState({ selectedUser });
  }

  handleSearchChange = (username) => {
    if (username == "") {
      this.setState({ filteredUsers: this.state.users });
      return;
    }
    username = username.toUpperCase();
    let filteredUsers = this.state.users.filter(
      (user) => user.name.toUpperCase().indexOf(username) > -1
    );
    this.setState({ filteredUsers });
  };

  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    if (this.state.selectedUserId !== prevState.selectedUserId) {
      this.fetchData(this.state.selectedUserId);
    }
  }
  render() {
    if (this.state.selectedUser) {
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
              <Input
                style={{ width: 180, margin: 10 }}
                placeholder="Enter name"
                onChange={({ target: { value } }) => {
                  this.handleSearchChange(value);
                }}
                // enterButton
              />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]}>
                {this.state.filteredUsers.map((user) => (
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
                    <ViewDonutChart data={this.state.selectedUser.risk_score} />
                  </Col>
                  <Col span={15}>
                    <ViewLineChart data={this.state.selectedUser.risk_time} />
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
