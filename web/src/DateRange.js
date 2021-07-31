import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import moment from 'moment'

const monthDeltas = [0, 1, 2, 3, 4, 5]

class DateRange extends Component {
  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container justifyContent="space-around">
          <KeyboardDatePicker
            value={this.props.dateFrom}
            onChange={(date) => this.props.onDateFromChange(date.toDate())}
            format="yyyy-MM-DD"
            variant="inline"
            autoOk
          />
          <KeyboardDatePicker
            value={this.props.dateTo}
            onChange={(date) => this.props.onDateToChange(date.toDate())}
            format="yyyy-MM-DD"
            variant="inline"
            autoOk
          />
          {/*{this.renderMonthsSelect()}*/}
        </Grid>
      </MuiPickersUtilsProvider>
    )
  }

  renderMonthsSelect() {
    return (
      <Select value={this.currentMonthDelta()} onChange={(value) => this.setMonth(value)}>
        <MenuItem value="">-</MenuItem>
        {monthDeltas.map((monthsAgo) => {
          return (
            <MenuItem key={monthsAgo} value={monthsAgo}>
              {monthsAgo}
            </MenuItem>
          )
        })}
      </Select>
    )
  }

  currentMonthDelta() {
    for (let i = 0; i < monthDeltas.length; i++) {
      const monthsAgo = monthDeltas[i]
      const monthsAgoRange = this.monthAgoRange(monthsAgo)
      if (monthsAgoRange[0] === this.props.dateFrom && monthsAgoRange[1] === this.props.dateTo) {
        return monthsAgo
      }
    }
    return ''
  }

  setMonth(monthsAgo) {
    const range = this.monthPeriods()[monthsAgo]
    this.props.onDateToChange(range[0])
    this.props.onDateToChange(range[1])
  }

  monthPeriods() {
    return monthDeltas.map((monthsAgo) => {
      return this.monthAgoRange(monthsAgo)
    })
  }

  monthAgoRange(delta) {
    return {
      dateFrom: moment().subtract(delta, 'months').startOf('month').toDate(),
      dateTo: moment().subtract(delta, 'months').endOf('month').toDate()
    }
  }
}

export default DateRange
