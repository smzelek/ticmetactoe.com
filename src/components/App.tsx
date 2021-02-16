import React, { Component } from 'react';
import './App.scss';
// import AppService from './Service';

// TODO:
// Search page: 
// Enter realm name
// Enter guild name... GO!

// Guild Vault Page
// title: Guild + Realm
// render row per player.
// load data on page load
export const App = (props: any) => (
  <h1>
    Hi {props.userName} from React! Welcome to {props.lang}!
  </h1>
);

// export class App extends Component {
//   private appService: AppService;

//   constructor(props: any) {
//     super(props);
//     this.state = {
//       data: null
//     };
//     this.appService = new AppService();
//   }

//   async componentDidMount() {
//     const data = await this.appService.loadData('bleeding-hollow', 'full-clear');
//     this.setState({
//       data
//     });
//   }

//   componentWillUnmount() {
//   }

//   render() {

//     return (
//       <div id="container">
//         works
//       </div>
//     );
//   }
// }
