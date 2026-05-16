import { useState, useEffect } from "react";
import "./ActorsList.module.css";

const ActorsList = () => {
    const [actors, setActors] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatearFecha = (dateStr) => {
        // Crear un objeto Date a partir de la cadena
        const date = new Date(dateStr);

        // Opciones de formato personalizadas
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        // Formatear la fecha
        return new Intl.DateTimeFormat('es-AR', options).format(date);
    }

    const findAll = async ({ limit, offset }) => {
        try {
            setLoading(true);
            setError(null);

            const url = new URL("http://localhost:3000/api/actors");
            url.searchParams.set("order", "lastName");
            url.searchParams.set("asc", "true");
            url.searchParams.set("limit", String(limit));
            url.searchParams.set("offset", String(offset));

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }
            const result = await res.json();
            setActors(result);
            setHasNextPage(Array.isArray(result) && result.length === limit);
        } catch (exc) {
            console.log(exc.toString());
            setError(exc?.message || exc.toString());
            setActors([]);
            setHasNextPage(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const limit = pageSize;
        const offset = (page - 1) * pageSize;
        const findAllWrapper = async () => { await findAll({ limit, offset }); }
        findAllWrapper();
    }, [page, pageSize]);

    return <div>
        {error ? <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div> : null}
        {loading ? <div style={{ marginBottom: 12 }}>Cargando...</div> : null}

        <table>
            <thead>
                <tr><th>Id</th><th>First Name</th><th>Last Name</th><th>Last Update</th></tr>
            </thead>
            <tbody>
                {actors.map(a =>
                    <tr key={a.actorId}>
                        <td>{a.actorId}</td>
                        <td>{a.firstName}</td>
                        <td>{a.lastName}</td>
                        <td>{formatearFecha(a.lastUpdate)}</td></tr>
                )}
            </tbody>
        </table>
        <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "10px 0", width: "500px" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={loading || page === 1}>
                Anterior
            </button>
            <span>Página {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={loading || !hasNextPage}>
                Siguiente
            </button>

            <label style={{ marginLeft: "auto" }}>
                Tamaño
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPage(1);
                        setPageSize(Number(e.target.value));
                    }}
                    disabled={loading}
                    style={{ marginLeft: 8 }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </label>
        </div>
    </div>
};

export default ActorsList;

