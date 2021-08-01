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
import Brightness1OutlinedIcon from '@material-ui/icons/Brightness1Outlined'
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined'
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined'
import LocalHospitalOutlinedIcon from '@material-ui/icons/LocalHospitalOutlined'
import LocalCafeOutlinedIcon from '@material-ui/icons/LocalCafeOutlined'
import BrushOutlinedIcon from '@material-ui/icons/BrushOutlined'
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined'
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined'
import OndemandVideoOutlinedIcon from '@material-ui/icons/OndemandVideoOutlined'
import LocalGroceryStoreOutlinedIcon from '@material-ui/icons/LocalGroceryStoreOutlined'
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined'
import DirectionsBusOutlinedIcon from '@material-ui/icons/DirectionsBusOutlined'
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'
import LocalFloristOutlinedIcon from '@material-ui/icons/LocalFloristOutlined'
import PoolOutlinedIcon from '@material-ui/icons/PoolOutlined'
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined'

const DefaultIcon = Brightness1OutlinedIcon
const categoryMetas = [
  { name: 'Продукты', icon: LocalGroceryStoreOutlinedIcon },
  { name: 'Саморазвитие', icon: TimelineOutlinedIcon },
  { name: 'Здоровье', icon: LocalHospitalOutlinedIcon },
  { name: 'Кафе', icon: LocalCafeOutlinedIcon },
  { name: 'Красота', icon: BrushOutlinedIcon },
  { name: 'Досуг', icon: WbSunnyOutlinedIcon },
  { name: 'Одежда', icon: LocalOfferOutlinedIcon },
  { name: 'Сервисы', icon: OndemandVideoOutlinedIcon },
  { name: 'Покупки', icon: LocalMallOutlinedIcon },
  { name: 'Семья', icon: FaceOutlinedIcon },
  { name: 'Транспорт', icon: DirectionsBusOutlinedIcon },
  { name: 'Накопления', icon: AccountBalanceOutlinedIcon },
  { name: 'Подарки', icon: LocalFloristOutlinedIcon },
  { name: 'Спорт', icon: PoolOutlinedIcon },
  { name: 'Крупные', icon: EventNoteOutlinedIcon }
]

const MoneyAmount = styled(Grid)`
  text-align: right;
`
const TextAlignRightTypography = styled(Typography)`
  text-align: right;
`

function categoryMeta(name) {
  for (let i = 0; i < categoryMetas.length; i++) {
    if (categoryMetas[i].name === name) {
      return categoryMetas[i]
    }
  }
  return {
    name: 'Default',
    icon: DefaultIcon
  }
}

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
    margin: '12px 0 !important',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    boxShadow: 'none',
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: '12px 0 !important'
    }
  }
})(Accordion)
const StyledAccordionSummary = withStyles({
  root: {
    '&$expanded': {
      minHeight: 'initial !important'
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0 !important'
    }
  }
})(AccordionSummary)
const StyledAccordionDetails = withStyles({
  root: {
    padding: 0,
    display: 'block'
  }
})(AccordionDetails)

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
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              {this.renderPriceLine(category)}
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <List>
                {category.subcategories.map((subcategory) => {
                  const percentage = (numeral(subcategory.amount).value() / numeral(category.amount).value()) * 100
                  return (
                    <ListItem key={subcategory.name} button>
                      <Grid container>
                        <Grid item xs={12}>
                          {this.renderSubcategoryPriceLine(subcategory)}
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
        />
      </Fragment>
    )
  }

  renderTotal() {
    const total = _.sum(_.map(this.props.summary.categories, (category) => numeral(category.amount).value()))
    return <Typography style={{ fontSize: 24, textAlign: 'center' }}>{this.formatMoney(total)} ₽</Typography>
  }

  renderPriceLine(data) {
    const Icon = categoryMeta(data.name)['icon']
    return (
      <Grid container>
        <Grid xs={1}>
          <Icon fontSize="small" />
        </Grid>
        <Grid item xs>
          <Typography>{data.name}</Typography>
        </Grid>
        <MoneyAmount item xs>
          <Typography>{this.formatMoney(data.amount)} ₽</Typography>
        </MoneyAmount>
      </Grid>
    )
  }

  renderSubcategoryPriceLine(data) {
    return (
      <Grid container>
        <Grid item xs>
          <Typography>{data.name}</Typography>
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
