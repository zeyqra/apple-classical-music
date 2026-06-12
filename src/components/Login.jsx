import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog'
import { useQueryClient } from '@tanstack/react-query'
import { captchaSent, loginCellphone, useLoginStatus } from '../hooks/useAuth'
import { loginQrCheck, loginQrCreate, loginQrKey } from '../hooks/useAuth'
import QRCode from 'react-qr-code'
import useUserStore from '../stores/user'

const Comp = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [cellphone, setCellphone] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [key, setKey] = useState('')
  const [qrImg, setQrImg] = useState('')
  const [status, setStatus] = useState('')
  const { data: loginStatusData } = useLoginStatus()
  const setCookie = useUserStore(state => state.setCookie)
  const [isQrCodeLogin, setIsQrCodeLogin] = useState(true)

  const handleLoginClick = () => setIsLoginOpen(true)

  const initQr = async () => {
    const { data: keyData } = await loginQrKey()
    const key = keyData.unikey
    setKey(key)

    const { data: qrData } = await loginQrCreate({ key, qrimg: true })
    setQrImg(qrData.qrimg)
  }

  useEffect(() => {
    if (isLoginOpen && isQrCodeLogin) {
      initQr()
    }
    if (isLoginOpen && !isQrCodeLogin) {
      setKey('')
      setQrImg('')
    }
  }, [isLoginOpen, isQrCodeLogin])

  const timerRef = useRef(null)
  useEffect(() => {
    if (!key) return

    timerRef.current = setInterval(async () => {
      const { code, message, cookie } = await loginQrCheck({ key })

      setStatus(message)
      if (code === 800) {
        // setStatus('qrcode expired')
        clearInterval(timerRef.current)
      }

      // if (code === 801) {
      //   setStatus('waiting for scan')
      // }

      // if (code === 802) {
      //   setStatus('waiting for confirmation')
      // }

      if (code === 803) {
        console.log(cookie)

        setCookie(cookie)
        setIsLoginOpen(false)

        clearInterval(timerRef.current)
      }
    }, 2000)

    return () => clearInterval(timerRef.current)
  }, [key])

  const handleGetCaptcha = async () => {
    if (!cellphone) return
    const isSent = await captchaSent({ phone: cellphone })
    if (!isSent) {
      alert('验证码发送失败')
      return
    }
    setCountdown(60)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }
  const handleLogin = async e => {
    if (!cellphone || !captcha) return
    e.preventDefault()
    const res = await loginCellphone({ phone: cellphone, captcha })
    console.log('console: res', res)
    if (res.code !== 200) {
      alert(res.message || '登录失败')
      return
    }
    alert(res.message || '登录成功' + JSON.stringify(res))
    // todo setcookie
  }

  return (
    <div>
      <button onClick={handleLoginClick}>Login</button>
      <Dialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <div>
          <h2>Login</h2>
          {!isQrCodeLogin ? (
            <form action="">
              <div>
                <input
                  type="text"
                  placeholder="Cellphone"
                  value={cellphone}
                  onChange={e => setCellphone(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Captcha"
                  value={captcha}
                  onChange={e => setCaptcha(e.target.value)}
                />
                <button onClick={handleGetCaptcha} disabled={countdown > 0}>
                  {countdown > 0 ? `${countdown}s` : 'Get Captcha'}
                </button>
              </div>
              <button onClick={handleLogin}>Submit</button>
            </form>
          ) : (
            <div>
              {/* {qrUrl && <QRCode value={qrUrl} size={220} />} */}
              {qrImg && <img src={qrImg} alt="二维码" width={220} height={220} />}

              <div>{status}</div>
              {/* <div>{JSON.stringify(loginStatusData)}</div> */}
            </div>
          )}
          {isQrCodeLogin ? (
            <button onClick={() => setIsQrCodeLogin(false)}>Cellphone Login</button>
          ) : (
            <button onClick={() => setIsQrCodeLogin(true)}>QR Code Login</button>
          )}
        </div>
      </Dialog>
    </div>
  )
}

export default Comp
