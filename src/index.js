/** @jsx h */
import { mount, h, Component } from './vdom'

class User extends Component {
  constructor () {
    super()
    this.increment = this.increment.bind(this)
    this.decrement = this.decrement.bind(this)
    this.state.age = 0
  }

  increment () {
    this.setState({age: this.state.age + 1})
  }

  decrement () {
    this.setState({age: this.state.age - 1})
  }
  render () {
    return (
      <div>
        <p>Age: {this.state.age}</p>
        <button onClick={this.increment}>Increment age</button>
        <button onClick={this.decrement}>Decrement age</button>
      </div>
    )
  }
}

const App = ({name}) =>
  <div>
    <h1>User information</h1>
    <User name={name} />
  </div>

mount(<App />, document.getElementById('root'))
