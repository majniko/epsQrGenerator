import React, { useCallback, useState } from 'react'
import { TextField } from '@mui/material'
import QRCode from 'react-qr-code'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import './epsQrGenerator.css'

interface CustomProps {
  onChange: (event: { target: { value: string } }) => void
  name: string
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        })
      }}
      thousandsGroupStyle="thousand"
      thousandSeparator=" "
      valueIsNumericString
      suffix={' Kč'}
    />
  )
})

export const EpsQrGenerator = () => {
  const [vSymbol, setVSymbol] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [recipientMsg, setRecipientMsg] = useState<string>('')

  const onAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(Number(e.target.value))
    },
    [setAmount]
  )

  const onVSymbolChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > 10) return
      if (!Number.isInteger(Number(e.target.value))) return
      setVSymbol(Number(e.target.value))
    },
    [setVSymbol]
  )

  const onRecipientMsgChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRecipientMsg(e.target.value)
      console.log(qrCode)
    },
    [setRecipientMsg]
  )

  const qrCode = `SPD*1.0*ACC:CZ6020100000002502141363*AM:${amount}*CC:CZK*PT:IP*MSG:${recipientMsg}*X-VS:${vSymbol}*`

  return (
    <div className={'epsQrGenerator'}>
      <div className={'header'}>
        <img src={'/EPSlogo.png'} alt={'logo'} className={'logo'} />
        <h1 className={'title'}>'Zaplať mi' QR generátor</h1>
      </div>
      <div className={'generator'}>
        <div className={'input'}>
          <div className={'textField'}>
            <TextField
              label={'Částka vč. DPH'}
              size={'small'}
              variant={'outlined'}
              value={amount === 0 ? '' : amount}
              onChange={onAmountChange}
              InputProps={{
                inputComponent: NumericFormatCustom as any,
              }}
            />
          </div>
          <div className={'textField'}>
            <TextField
              label={'Variabilní symbol'}
              size={'small'}
              variant={'outlined'}
              value={vSymbol === 0 ? '' : vSymbol}
              onChange={onVSymbolChange}
            />
          </div>
          <div className={'textField'}>
            <TextField
              label={'Zpráva pro příjemce'}
              size={'small'}
              variant={'outlined'}
              value={recipientMsg}
              onChange={onRecipientMsgChange}
            />
          </div>
        </div>
        <div className={'qrCode'}>
          <QRCode value={qrCode} />
        </div>
      </div>
    </div>
  )
}
