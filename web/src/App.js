import React, { Component } from 'react'
import TransactionCard from './TransactionCard'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

class App extends Component {
  state = { sampleRecord: null, authIsOpen: false, lastMonthSummary: [] }

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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Категория</TableCell>
                  <TableCell align="right">Сумма</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.lastMonthSummary.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.category}
                    </TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
