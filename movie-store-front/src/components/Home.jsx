import { useContext } from 'react';
import '../styles/css/Home.css';
import { AuthContext } from '../context/AuthContext';
import AdminView from './AdminView';
import UserView from './UserView';
import Chat from './Chat';
import { Navigate } from 'react-router-dom';

export default function Home() {

    const { user } = useContext(AuthContext);

    return (
        <div className='section-full home'>
            {user && <div className="home__user"><img alt="profilePic" src={user.avatar} /><h2>Bienvenido/a {user.name}!</h2></div>}

            {
                user ?
                    <div>
                        {user.role === "admin" ? <AdminView /> : <UserView />}
                        <Chat />
                    </div> :
                    <Navigate to="/login" />
            }
        </div >
    )
}
