import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Card from './components/Card'

function App() {
  const [count, setCount] = useState(0)
  let nomeApp = "Beatles"

  return (
      //renderizzo più cose insieme
    <>
        <h1>{nomeApp}</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, vero?</p>

        <div className="card-container">
            <Card
                isConosciuto={false}
                nome="George Harrison"
                imgURL="https://imgs.search.brave.com/ybx5Mi7gpWqDwBOppWUvIb46oQ_106vAbKp9sJnCiTc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy80/LzRlL0dlb3JnZV9I/YXJyaXNvbl8xOTc0/X2NvbG9yaXplZC5q/cGc"
                strumento="chitarra"
            >
                <p><strong>Il preferito del prof</strong></p>
            </Card>
            <Card
                isConosciuto={false}
                nome="John Lennon"
                imgURL="https://imgs.search.brave.com/PUh3cW2n9L1TdvLCbf-oWIVEJi5Nit2KMIpSGmGx-7g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wYWQu/bXltb3ZpZXMuaXQv/ZmlsbWNsdWIvYXR0/b3JpLzE3NjQuanBn"
                strumento="voce, chitarra"
            >
                <p><strong>Il paroliere della band</strong></p>
            </Card>
            <Card
                isConosciuto={false}
                nome="Paul McCartney"
                imgURL="https://imgs.search.brave.com/SOAYsGtpT0PymMKYwz7JQF6d4SzVx7l8G97UGXB9luo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLnlp/bWcuY29tL255L2Fw/aS9yZXMvMS4yL1NP/RG9ObnVyQ19JRUtz/U2RSNkVaZHctLS9Z/WEJ3YVdROWFHbG5h/R3hoYm1SbGNqdDNQ/VGsyTUR0b1BUWTFP/US0tL2h0dHBzOi8v/bWVkaWEuemVuZnMu/Y29tL2VuL2hlYXJz/dF9tZW5zX2hlYWx0/aF8xNzEvOGRlNmI0/N2E0MzdlNDAzNmQ5/NjYxY2NjNWQyMjU3/YzU"
                strumento="voce, basso"
            >
                <p><strong>Il Beatle più simpy</strong></p>
            </Card>
            <Card
                isConosciuto={false}
                nome="Ringo Starr"
                imgURL="https://imgs.search.brave.com/CgxzGetvc42L1RExsC0MfD3gt-WQUscXxEJdO4RsH-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9oaXBz/LmhlYXJzdGFwcHMu/Y29tL2htZy1wcm9k/L2ltYWdlcy9yaW5n/b19zdGFycl8yMDE1/X1Bob3RvLWJ5LVBh/dWwtQXJjaHVsZXRh/OkZpbG1NYWdpY19H/ZXR0eV9JbWFnZXNf/NDc5ODM3NTU4Lmpw/Zz9yZXNpemU9OTgw/Oio"
                strumento="batteria"
            >
                <p><strong>Il batterista</strong></p>
            </Card>
        </div>
    </>
  )
}

export default App
