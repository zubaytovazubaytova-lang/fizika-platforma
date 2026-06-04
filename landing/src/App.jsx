import Navbar     from './components/Navbar'
import HeroSlider from './components/HeroSlider'

const PLATFORM = 'http://localhost:3000'

export default function App() {
  const goLogin    = () => { window.location.href = `${PLATFORM}/login` }
  const goRegister = () => { window.location.href = `${PLATFORM}/register` }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navbar onLogin={goLogin} onRegister={goRegister} />
        <HeroSlider onLogin={goLogin} onRegister={goRegister} />
      </div>
    </div>
  )
}
