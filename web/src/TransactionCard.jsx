import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

export default function TransactionCard(props) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>{content(props.data)}</CardContent>
    </Card>
  )
}

function content(data) {
  if (!data) {
    return 'Нет данных'
  }
  return <div>
    <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
      {data['ДАТА']}
    </Typography>
    <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
      {data['СО СЧЁТА']} > {data['НА СЧЁТ / НА КАТЕГОРИЮ']}
    </Typography>
    <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
      {data['СУММА']} {data['ВАЛЮТА']}
    </Typography>
  </div>
}
