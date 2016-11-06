/** @jsx h */
import {patch, h} from './vdom'
import Component from './component'

const Summary = ({name}) => <div>Hello {name}. Changed only via props</div>

class Another extends Component {
  constructor () {
    super()
    const list = []
    console.log('parent vdom becomes out of sync with children... does it matter? - yes, partially')
    console.log('because the subtree is then re-diffed and applied to the DOM instead of being seen')
    console.log('as the same(no change)')
    for (let i = 0; i < 1000; i++) {
      list.push(i)
    }
    this.state = {text: 'World!', list}
    this.ch = this.ch.bind(this)
  }
  ch () {
    const list = this.state.list.reverse()
    this.setState({text: 'Oscar!', list})
  }
  render () {
    return (
      <span onClick={this.ch}>
        <div>Text: {this.state.text}</div>
        <ul>
          {this.state.list.map(n => <li>{n}</li>)}
        </ul>
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
patch($root, vtree)
