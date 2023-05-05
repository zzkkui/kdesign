import React, { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import request, { tempAddress } from '../service/request'
import './login.less'

const Login = () => {
  const [avatar, setAvatar] = useState<string>()
  const avatarRef = useRef<HTMLDivElement>(null)

  const delInfo = () => {
    sessionStorage.removeItem('downloadIconInfo')
    sessionStorage.removeItem('staticIconResources')
    sessionStorage.removeItem('iconPageState')
    sessionStorage.removeItem('downloadIlluInfo')
    sessionStorage.removeItem('staticIlluResources')
    sessionStorage.removeItem('illuPageState')
    Cookies.remove('token')
    setAvatar('')
  }

  const loginMethods = async (token?: string) => {
    const res = await request.get('/currentUser', {
      headers: { Authorization: 'Bearer ' + token },
    })
    const { data } = res

    if (data.data && Object.keys(data.data).length > 0) {
      setAvatar(data.data.avatar)
    } else {
      Cookies.remove('token')
    }
  }
  const logoutMethods = () => {
    request.get('/loginOut')
    delInfo()
  }
  const handleLoginClick = async () => {
    if (!Cookies.get('token')) {
      delInfo()
      location.href = tempAddress + `/login?state=${window.location.href}`
    } else {
      loginMethods(Cookies.get('token'))
    }
  }
  const handleLogoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    logoutMethods()
  }

  document.addEventListener('click', () => {
    sessionStorage.getItem('iconPageState') && sessionStorage.removeItem('iconPageState')
    sessionStorage.getItem('illuPageState') && sessionStorage.removeItem('illuPageState')
  })

  useEffect(() => {
    // 登录验证
    const searchArr = window.location.hash.replace(/\S*\?/, '').split('&')
    const code = searchArr.find((item: string | string[]) => {
      return item.indexOf('code') === 0
    })
    const state = searchArr.find((item: string | string[]) => {
      return item.indexOf('state') === 0
    })
    if (Cookies.get('token')) {
      loginMethods(Cookies.get('token'))
    } else {
      if (code) {
        const params = new URLSearchParams()
        params.append('code', code.split('=')[1])
        request
          .post('/authCode', params)
          .then((res) => {
            const { token } = res.data.data
            // 设置cookie时效
            Cookies.set('token', token, { expires: 7, domain: '.kingdee.design' })
            loginMethods(token)
            if (state) {
              window.location = decodeURIComponent(state.split('=')[1]) as any
            }
          })
          .catch(() => {
            delInfo()
          })
      }
    }
  }, [])

  return (
    <div className="loginButton" onClick={handleLoginClick} ref={avatarRef}>
      {avatar ? (
        <div className="logout">
          <div className="logout-panel">
            <div className="transparent"></div>
            <div className="logout-panel-button" onClick={handleLogoutClick}>
              退出登录
            </div>
          </div>
          <img src={avatar} alt="avatar" />
        </div>
      ) : (
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5309"
          width="20"
          height="20"
        >
          <path
            d="M960.853333 903.816533a463.633067 463.633067 0 0 0-11.264-39.185066c-1.536-4.539733-3.413333-8.942933-5.051733-13.448534a484.078933 484.078933 0 0 0-9.557333-24.4736c-2.2528-5.188267-4.881067-10.274133-7.338667-15.394133-3.413333-7.099733-6.8608-14.165333-10.6496-21.0944-2.901333-5.3248-6.075733-10.513067-9.181867-15.701333-2.423467-4.061867-4.573867-8.226133-7.133866-12.219734-1.604267-2.4576-3.413333-4.778667-5.0176-7.202133-1.501867-2.218667-2.730667-4.608-4.266667-6.792533-0.4096-0.6144-1.058133-0.887467-1.501867-1.4336a461.482667 461.482667 0 0 0-90.385066-96.768c-13.5168-10.786133-27.7504-20.48-42.257067-29.5936-0.477867-0.341333-0.7168-0.8192-1.194667-1.1264-3.6864-2.286933-7.509333-4.3008-11.264-6.485334-4.266667-2.491733-8.4992-5.051733-12.868266-7.441066-6.826667-3.6864-13.789867-7.099733-20.753067-10.478934-3.618133-1.7408-7.202133-3.618133-10.8544-5.290666a449.194667 449.194667 0 0 0-31.607467-12.731734c-0.7168-0.273067-1.365333-0.6144-2.082133-0.8192-3.140267-1.1264-6.417067-1.911467-9.557333-2.935466-4.164267-1.399467-8.328533-2.833067-12.561067-4.096a259.9936 259.9936 0 0 0 129.194667-225.450667 260.061867 260.061867 0 0 0-76.629334-185.002667 259.9936 259.9936 0 0 0-185.002666-76.629333H512h-0.034133a259.857067 259.857067 0 0 0-185.002667 76.629333 259.925333 259.925333 0 0 0-76.629333 185.002667 259.584 259.584 0 0 0 76.629333 185.002667c15.906133 15.940267 33.655467 29.2864 52.565333 40.448-4.266667 1.262933-8.430933 2.730667-12.663466 4.096-3.140267 1.058133-6.3488 1.8432-9.489067 2.935466-0.7168 0.238933-1.365333 0.580267-2.048 0.8192-10.683733 3.822933-21.265067 8.0896-31.675733 12.765867-3.584 1.604267-7.0656 3.4816-10.615467 5.154133-7.099733 3.413333-14.165333 6.826667-21.0944 10.615467-4.266667 2.321067-8.3968 4.8128-12.561067 7.2704-3.822933 2.218667-7.748267 4.266667-11.502933 6.621867-0.512 0.3072-0.750933 0.8192-1.2288 1.160533-14.506667 9.147733-28.706133 18.807467-42.222933 29.559467a459.6736 459.6736 0 0 0-90.385067 96.768c-0.443733 0.546133-1.092267 0.8192-1.501867 1.4336-1.536 2.184533-2.7648 4.573867-4.266666 6.792533-1.604267 2.423467-3.447467 4.744533-5.0176 7.202133-2.56 3.9936-4.7104 8.157867-7.133867 12.219734-3.106133 5.188267-6.280533 10.376533-9.181867 15.701333-3.7888 6.929067-7.202133 13.994667-10.6496 21.0944-2.4576 5.12-5.051733 10.205867-7.338666 15.394133-3.515733 8.021333-6.519467 16.247467-9.557334 24.4736-1.672533 4.5056-3.549867 8.9088-5.051733 13.448534-4.3008 12.868267-8.0896 25.941333-11.264 39.185066-3.072 12.970667 2.594133 25.770667 13.073067 32.802134a31.3344 31.3344 0 0 0 9.966933 4.608 30.9248 30.9248 0 0 0 34.030933-15.2576 30.446933 30.446933 0 0 0 3.345067-7.7824c2.833067-11.844267 6.178133-23.483733 10.0352-34.9184 0.6144-1.8432 1.399467-3.549867 2.013867-5.358934 3.447467-9.762133 7.133867-19.456 11.332266-28.945066 0.512-1.160533 1.1264-2.2528 1.6384-3.447467 4.7104-10.308267 9.728-20.48 15.291734-30.344533l0.068266-0.1024a402.773333 402.773333 0 0 1 19.694934-31.4368l0.136533-0.375467a397.4144 397.4144 0 0 1 116.599467-111.2064c0.136533-0.1024 0.3072-0.068267 0.443733-0.170667a397.824 397.824 0 0 1 94.993067-42.973866c2.7648-0.8192 5.495467-1.7408 8.2944-2.491734 5.7344-1.604267 11.5712-3.003733 17.373866-4.334933a367.8208 367.8208 0 0 1 47.342934-7.953067c3.8912-0.443733 7.7824-0.9216 11.6736-1.2288 10.410667-0.785067 20.8896-1.3312 31.505066-1.3312s21.060267 0.546133 31.505067 1.3312c3.8912 0.3072 7.816533 0.785067 11.707733 1.2288a361.3696 361.3696 0 0 1 47.240534 7.953067c5.870933 1.3312 11.707733 2.730667 17.5104 4.334933 2.696533 0.750933 5.358933 1.6384 8.021333 2.4576 33.348267 10.103467 65.365333 24.405333 95.197867 43.008 0.136533 0.1024 0.3072 0.068267 0.443733 0.170667a396.151467 396.151467 0 0 1 116.599467 111.2064c0.1024 0.136533 0.1024 0.273067 0.170666 0.375467 13.687467 19.7632 25.3952 40.5504 35.191467 62.1568l1.467733 3.037866c4.3008 9.659733 8.055467 19.592533 11.605334 29.5936 0.546133 1.604267 1.2288 3.106133 1.774933 4.7104 3.822933 11.4688 7.236267 23.176533 10.0352 35.0208a31.061333 31.061333 0 0 0 60.450133-14.336z m-249.275733-560.2304A199.850667 199.850667 0 0 1 512 543.197867a199.850667 199.850667 0 0 1-199.5776-199.611734A199.816533 199.816533 0 0 1 512 144.008533a199.816533 199.816533 0 0 1 199.5776 199.5776z"
            fill="#333"
            p-id="5310"
          ></path>
        </svg>
      )}
    </div>
  )
}

export default Login
