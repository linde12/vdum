/** @jsx h */
import {render, h} from './renderer'
import Component from './component'

const Summary = ({name}) => <div>Hello {name}</div>

class Another extends Component {
  constructor () {
    super()
    this.state = {text: 'World!'}
    this.ch = this.ch.bind(this)
  }
  ch () {
    this.setState({text: 'Oscar!'})
  }
  render () {
    let another;
    return (
      <span onClick={this.ch}>
        <div>{this.state.text}</div>
      </span>
    )
  }
}

class UserForm extends Component {
  constructor () {
    super()
    this.state = {
      first: 'Oscar',
      last: 'Linde'
    }
    this.changes = this.changes.bind(this)
  }

  changes (key) {
    return (evt) => this.setState({[key]: evt.target.value})
  }

  render () {
    const {first, last} = this.state
    return (
      <div>
        <div>
          <label for="first">Firstname</label>
          <input id="first" onChange={this.changes('first')} type="text" value={first} />
        </div>
        <div>
          <label for="last">Lastname</label>
          <input id="last" onChange={this.changes('last')} type="text" value={last} />
        </div>
        <Summary name={[first, last].join(' ')} />
        <Another />
      </div>
    )
  }
}

const $root = document.getElementById('root')
const vtree = <UserForm />
console.log(vtree)
render(vtree, $root)
