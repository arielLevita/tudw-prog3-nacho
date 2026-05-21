import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext/UserContext';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';

const Actors = () => {

    const { userData } = useContext(UserContext);

    const [actors, setActors] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/api/v1/actors?limit=15", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.token}`,
            },
        }).then(res => res.json().then(data => {
            setActors(data);
        }))
            .catch((err) => console.log(err));
    }, [])

    return (
        <>
            <Header />
            <main>
                <ul>
                    <li><Link to="/restricted/dashboard">Dashboard</Link></li>
                </ul>
                {
                    actors?.length &&
                    <table style={{ margin: '1rem' }}>
                        <thead><tr><th>Id</th><th>Nombre</th><th>Apellido</th></tr></thead>
                        <tbody>
                            {actors.map((value, index) => {
                                return <tr key={index}>
                                    <td>{value.actorId}</td>
                                    <td>{value.firstName}</td>
                                    <td>{value.lastName}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                }
                <ul>
                    <li><Link to="/restricted/dashboard">Dashboard</Link></li>
                </ul>
            </main>
        </>);
};

export { Actors };