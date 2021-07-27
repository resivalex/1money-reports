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
    <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
      {data['type']}
    </Typography>
    <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
      {data['date']}
    </Typography>
    <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
      {data['source']} > {data['target']}
    </Typography>
    <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
      {data['amount']} {data['currency']}
    </Typography>
    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
      {data['notes']}
    </Typography>
  </div>
}
