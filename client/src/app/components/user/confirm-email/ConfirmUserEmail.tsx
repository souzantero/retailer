import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isEmail } from '../../../../domain/utils'
import { useConfirmUserEmail } from '../../../hooks/useConfirmUserEmail'
import { useRefreshUserEmailConfirmationCode } from '../../../hooks/useRefreshUserEmailConfirmationCode'
import { CentralizedBox } from '../../layout/CentralizedBox'

export function ConfirmUserEmail() {
  const { isConfirming, confirm } = useConfirmUserEmail()
  const { isRefreshing, refresh } = useRefreshUserEmailConfirmationCode()

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userEmail = useMemo(
    () => searchParams.get('email') || '',
    [searchParams]
  )

  const [confirmationCode, setConfirmationCode] = useState<string>('')

  const isValid = isEmail(userEmail)
  const subtitle = useMemo(() => {
    if (userEmail && isValid) return userEmail
    else if (userEmail && !isValid) return 'E-mail inválido'
    else return 'E-mail não informado'
  }, [userEmail, isValid])

  const handleChangeConfirmationCode = (event: ChangeEvent<HTMLInputElement>) =>
    setConfirmationCode(event.target.value)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const params = { email: userEmail, confirmationCode }
    const confirmed = await confirm(params)
    if (confirmed) {
      setConfirmationCode('')
      navigate('/')
    }
  }

  const handleClickRequestNewConfirmationCode = async () => {
    await refresh(userEmail)
  }

  return (
    <CentralizedBox title="Confirmar e-mail" subtitle={subtitle}>
      <Stack as={'form'} spacing={4} onSubmit={handleSubmit}>
        <FormControl
          id="email"
          isRequired
          isDisabled={!isValid || isConfirming || isRefreshing}
        >
          <FormLabel>Código de confirmação</FormLabel>
          <Input
            type="text"
            autoComplete="confirmation-code"
            value={confirmationCode}
            onChange={handleChangeConfirmationCode}
          />
        </FormControl>
        <Stack spacing={4}>
          <Button
            type="submit"
            bg={'blue'}
            color={'white'}
            isDisabled={!isValid || isConfirming || isRefreshing}
            isLoading={isConfirming}
          >
            Confirmar
          </Button>

          <Button
            color={'blue'}
            borderColor={'blue'}
            variant={'outline'}
            isDisabled={!isValid || isConfirming || isRefreshing}
            isLoading={isRefreshing}
            onClick={handleClickRequestNewConfirmationCode}
          >
            Solicitar um código novo
          </Button>
        </Stack>
      </Stack>
    </CentralizedBox>
  )
}