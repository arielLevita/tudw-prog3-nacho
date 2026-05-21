import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext/UserContext';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';

const Films = () => {

    const { userData } = useContext(UserContext);

    const [films, setFilms] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/api/v1/Films?limit=15", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.token}`,
            },
        }).then(res => res.json().then(res => {
            setFilms(res);
        })).catch((err) => console.log(err));
    }, [userData.token])

    return (
        <>
            <Header />
            <main>
                <ul>
                    <li><Link to="/restricted/dashboard">Dashboard</Link></li>
                </ul>
                {(films?.length > 0) &&
                    <table>
                        <thead><tr><th>Id</th><th>Title</th></tr></thead>
                        <tbody>
                            {films.map((value, index) => {
                                return <tr key={index}>
                                    <td>{value.filmId}</td>
                                    <td>{value.title}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>}
                <ul>
                    <li><Link to="/restricted/dashboard">Dashboard</Link></li>
                </ul>
            </main>
        </>);
};

export { Films };