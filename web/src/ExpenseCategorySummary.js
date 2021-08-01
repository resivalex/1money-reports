import React, { Component, Fragment } from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import styled from '@emotion/styled'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Grid from '@material-ui/core/Grid'
import numeral from 'numeral'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
import _ from 'lodash'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withStyles } from '@material-ui/core/styles'

const StyledAccordionDetails = styled(AccordionDetails)`
  display: block;
`
const MoneyAmount = styled(Grid)`
  text-align: right;
`
const TextAlignRightTypography = styled(Typography)`
  text-align: right;
`

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <TextAlignRightTypography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</TextAlignRightTypography>
      </Box>
    </Box>
  )
}

const StyledAccordion = withStyles({
  root: {
    margin: '10px auto',
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: '10px auto'
    }
  },
  expanded: {}
})(Accordion)

class ExpenseCategorySummary extends Component {
  state = { showCopecks: false }

  render() {
    return (
      <Fragment>
        {this.props.summary.categories.length === 0 && (
          <Typography style={{ textAlign: 'center' }}>Нет трат по выбранным критериям</Typography>
        )}
        {this.props.summary.categories.length > 0 && this.renderTotal()}
        {this.props.summary.categories.map((category) => (
          <StyledAccordion key={category.name}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{this.renderPriceLine(category)}</AccordionSummary>
            <StyledAccordionDetails>
              <List>
                {category.subcategories.map((subcategory) => {
                  const percentage = (numeral(subcategory.amount).value() / numeral(category.amount).value()) * 100
                  return (
                    <ListItem key={subcategory.name} button>
                      <Grid container>
                        <Grid item xs={12}>
                          {this.renderPriceLine(subcategory)}
                        </Grid>
                        <Grid item xs={12}>
                          <LinearProgressWithLabel value={percentage} />
                        </Grid>
                      </Grid>
                    </ListItem>
                  )
                })}
              </List>
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
        <FormControlLabel
          label="Показывать копейки"
          control={
            <Switch
              checked={this.state.showCopecks}
              onChange={(e) => this.setState({ showCopecks: e.target.checked })}
              color="primary"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          }
        ></FormControlLabel>
      </Fragment>
    )
  }

  renderTotal() {
    const total = _.sum(_.map(this.props.summary.categories, (category) => numeral(category.amount).value()))
    return <Typography style={{ fontSize: 24, textAlign: 'center' }}>{this.formatMoney(total)} ₽</Typography>
  }

  renderPriceLine(data) {
    return (
      <Grid container>
        <Grid item xs>
          {data.name}
        </Grid>
        <MoneyAmount item xs>
          <Typography>{this.formatMoney(data.amount)} ₽</Typography>
        </MoneyAmount>
      </Grid>
    )
  }

  formatMoney(value) {
    const moneyFormat = this.state.showCopecks ? '0,0.00' : '0,0'

    return numeral(value).format(moneyFormat).replace(',', ' ').replace('.', ',')
  }
}

export default ExpenseCategorySummary
