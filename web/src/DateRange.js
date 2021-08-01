import React, { Component, Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import moment from 'moment'
import 'moment/locale/ru'
import _ from 'lodash'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

const monthSelectLimit = 12
const dateFormat = 'yyyy-MM-DD'

class DateRange extends Component {
  state = { showDatePickers: false }

  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={this.state.showDatePickers ? 4 : 12}>
            {this.renderMonthsSelect()}
          </Grid>
          {this.state.showDatePickers && (
            <Fragment>
              <Grid item xs={12} sm={4}>
                <KeyboardDatePicker
                  style={{ width: '100%' }}
                  value={this.props.dateFrom}
                  onChange={(date) => this.props.onDateFromChange(date.toDate())}
                  format={dateFormat}
                  variant="inline"
                  inputVariant="outlined"
                  label="От"
                  autoOk
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <KeyboardDatePicker
                  style={{ width: '100%' }}
                  value={this.props.dateTo}
                  onChange={(date) => this.props.onDateToChange(date.toDate())}
                  format={dateFormat}
                  variant="inline"
                  inputVariant="outlined"
                  label="До"
                  autoOk
                />
              </Grid>
            </Fragment>
          )}
        </Grid>
      </MuiPickersUtilsProvider>
    )
  }

  renderMonthsSelect() {
    return (
      <FormControl style={{ width: '100%' }} variant="outlined">
        <InputLabel variant="outlined" style={{ backgroundColor: 'white', paddingLeft: 6, paddingRight: 6, left: -6 }}>
          Месяц
        </InputLabel>
        <Select value={this.currentMonthDelta()} onChange={(value) => this.setMonth(value.target.value)}>
          <MenuItem value="custom_period">выбрать даты...</MenuItem>
          {_.times(monthSelectLimit, (monthsAgo) => {
            return (
              <MenuItem key={monthsAgo} value={monthsAgo}>
                {moment().subtract(monthsAgo, 'months').locale('ru').format('MMMM')}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    )
  }

  currentMonthDelta() {
    for (let monthsAgo = 0; monthsAgo < monthSelectLimit; monthsAgo++) {
      const monthsAgoRange = this.monthAgoRange(monthsAgo)
      if (
        moment(monthsAgoRange['dateFrom']).format(dateFormat) === moment(this.props.dateFrom).format(dateFormat) &&
        moment(monthsAgoRange['dateTo']).format(dateFormat) === moment(this.props.dateTo).format(dateFormat)
      ) {
        return monthsAgo
      }
    }
    return 'custom_period'
  }

  setMonth(monthsAgo) {
    const range = this.monthPeriods()[monthsAgo]
    if (range) {
      this.setState({ showDatePickers: false })
    } else {
      this.setState({ showDatePickers: true })
      return
    }
    this.props.onDateFromChange(range['dateFrom'])
    this.props.onDateToChange(range['dateTo'])
  }

  monthPeriods() {
    const result = {}
    _.times(monthSelectLimit, (monthsAgo) => {
      result[monthsAgo] = this.monthAgoRange(monthsAgo)
    })
    return result
  }

  monthAgoRange(monthsAgo) {
    return {
      dateFrom: moment().subtract(monthsAgo, 'months').startOf('month').toDate(),
      dateTo: moment().subtract(monthsAgo, 'months').endOf('month').toDate()
    }
  }
}

export default DateRange
