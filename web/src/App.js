import React, { Component } from 'react'
import TransactionCard from './TransactionCard'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

class App extends Component {
  state = { sampleRecord: null, authIsOpen: false }

  render() {
    return (
      <Container maxWidth="sm">
        <Box sx={{ p: 2 }}>
          <TransactionCard data={this.state.sampleRecord} />
        </Box>

        <Box sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => this.loadSampleRecord()}>
            Случайная транзакция
          </Button>
        </Box>
      </Container>
    )
  }

  loadSampleRecord() {
    axios.get('/sample_record', { headers: { 'X-Auth-Token': authToken() } }).then((response) => {
      this.setState({ sampleRecord: response.data.data })
    })
  }
}

function authToken() {
  return window.location.toString().split('token=')[1]
}

export default App
