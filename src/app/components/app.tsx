import * as React from 'react'
import * as io from 'socket.io-client'
import { Container, ContainerListItem } from './containerListItem'
import { ContainerList } from './containerList'

let socket = io.connect()

class AppState {
  containers?: Container[]
  stoppedContainers?: Container[]
}

export class AppComponent extends React.Component<{}, AppState> {

  constructor() {
    super()

    this.state = {
      containers: [],
      stoppedContainers: []
    }

    socket.on('containers.list', (containers: any) => {
      this.setState({
        containers: containers.filter((c: any) => c.State === 'running').map(this.mapContainer),
        stoppedContainers: containers.filter((c: any) => c.State !== 'running').map(this.mapContainer)
      })
    })
  }

  componentDidMount() {
    socket.emit('containers.list')
  }

  mapContainer(container: any): Container {
    return {
      id: container.Id,
      name: container.Names.map((n: string) => n.substr(1)).join(', '),
      state: container.State,
      status: `${container.State} (${container.Status})`,
      image: container.Image
    }
  }

  render() {
    return (
      <div className="container">
        <h1 className="page-header">Docker Dashboard</h1>
        <ContainerList title="Running" containers={this.state.containers} />
        <ContainerList title="Stopped containers" containers={this.state.stoppedContainers} />
      </div>
    )
  }
}