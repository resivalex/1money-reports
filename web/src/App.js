import React, { Component } from 'react'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import moment from 'moment'
import DateRange from './DateRange'
import CircularProgress from '@material-ui/core/CircularProgress'
import ExpenseCategorySummary from './ExpenseCategorySummary'

class App extends Component {
  state = {
    sampleRecord: null,
    authIsOpen: false,
    summary: null,
    dateFrom: moment().startOf('month').toDate(),
    dateTo: moment().endOf('month').toDate()
  }

  componentDidMount() {
    this.loadSummary()
  }

  render() {
    return (
      <Container maxWidth="sm">
        <Box sx={{ p: 2 }}>
          <DateRange
            dateFrom={this.state.dateFrom}
            dateTo={this.state.dateTo}
            onDateFromChange={(date) => this.onDateFromChange(date)}
            onDateToChange={(date) => this.onDateToChange(date)}
          />
        </Box>
        {this.renderLastMonthSummary()}
      </Container>
    )
  }

  onDateFromChange(date) {
    this.setState({ dateFrom: date }, () => this.loadSummary())
  }

  onDateToChange(date) {
    this.setState({ dateTo: date }, () => this.loadSummary())
  }

  renderLastMonthSummary() {
    return (
      <div>
        {this.state.summary ? <ExpenseCategorySummary summary={this.state.summary} /> : <CircularProgress />}
      </div>
    )
  }

  loadSummary() {
    this.setState({ summary: null })
    axios
      .get('/period_summary', {
        headers: { 'X-Auth-Token': authToken() },
        params: {
          date_from: moment(this.state.dateFrom).format('YYYY-MM-DD'),
          date_to: moment(this.state.dateTo).format('YYYY-MM-DD')
        }
      })
      .then((response) => {
        this.setState({ summary: response.data.data })
      })
  }
}

function authToken() {
  return window.location.toString().split('token=')[1]
}

export default App
