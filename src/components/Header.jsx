import headerLogo from '@/assets/image/logo.png'
import '@/App.css'

function Header() {
    return (
        <>
            <header className='header'>
                <div className='header__logo'>
                    <img src={headerLogo} alt="" />
                </div>
            </header>
        </>
    )
}

export default Header