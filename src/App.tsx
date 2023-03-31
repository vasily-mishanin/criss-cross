import { Component, ReactNode } from 'react';
import './App.css';

interface MyProps {}

interface MyState {}

class App extends Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
  }

  state: MyState = {
    count: 0,
  };

  render(): ReactNode {
    return (
      <div className='app'>
        <h1> Criss-Cross Game</h1>
      </div>
    );
  }
}

export default App;
