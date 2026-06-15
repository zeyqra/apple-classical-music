import { NavLink } from 'react-router-dom'

const Menubar = () => {
  return (
    <div className="flex flex-col gap-1 p-2">
      <h1>Music React</h1>
      <nav>
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/library/albums">Album</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Menubar
