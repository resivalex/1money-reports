import React, { Component } from 'react'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import TransactionCard from './TransactionCard'
import ExpenseCategorySummary from './ExpenseCategorySummary'

class App extends Component {
  state = { sampleRecord: null, authIsOpen: false, lastMonthSummary: null }

  render() {
    return <Container maxWidth="sm">{this.renderLastMonthSummary()}</Container>
  }

  renderLastMonthSummary() {
    return (
      <div>
        <div>
          <Box sx={{ p: 2 }}>
            <Button variant="contained" onClick={() => this.loadLastMonth()}>
              Сводка за последний месяц
            </Button>
          </Box>
          {this.state.lastMonthSummary && <ExpenseCategorySummary summary={this.state.lastMonthSummary} />}
        </div>
      </div>
    )
  }

  renderRandomTransactionBox() {
    return (
      <div>
        <Box sx={{ p: 2 }}>
          <TransactionCard data={this.state.sampleRecord} />
        </Box>

        <Box sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => this.loadSampleRecord()}>
            Случайная транзакция
          </Button>
        </Box>
      </div>
    )
  }

  loadSampleRecord() {
    axios.get('/sample_record', { headers: { 'X-Auth-Token': authToken() } }).then((response) => {
      this.setState({ sampleRecord: response.data.data })
    })
  }

  loadLastMonth() {
    axios.get('/last_month_summary', { headers: { 'X-Auth-Token': authToken() } }).then((response) => {
      this.setState({ lastMonthSummary: response.data.data })
    })
  }
}

function authToken() {
  return window.location.toString().split('token=')[1]
}

export default App
