export default function VotantesList({ votantes }) {
  return (
    <ul>
      {votantes.map(v => (
        <li key={v.credencial}>
          {v.nombre} {v.apellido} — CI: {v.ci} — Credencial: {v.credencial}
        </li>
      ))}
    </ul>
  );
}
