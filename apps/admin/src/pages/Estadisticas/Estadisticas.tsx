import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../../shared/components';

import CursosCover from './views/Cursos/Cover';
import CursosTable from './views/Cursos/Table';
import RankingTable from './views/Ranking/Table';
import HabilidadesTable from './views/Habilidades/Table';

import './Estadisticas.scss';

const Estadisticas = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Ranking de alumnos',
          onClick: location.pathname.startsWith('/estadisticas/ranking')
            ? () => navigate('/estadisticas/empresas')
            : location.pathname.startsWith('/estadisticas/cursos')
            ? () => navigate('/estadisticas/cursos')
            : () => navigate('/estadisticas/habilidades'),
        }}
      />

      <div className="page-body">
        <Routes>
          <Route path="ranking">
            <Route index element={<RankingTable />} />
          </Route>

          <Route path="cursos">
            <Route index element={<CursosTable />} />
            <Route path=":cursoId" element={<CursosCover />} />
          </Route>

          <Route path="habilidades">
            <Route index element={<HabilidadesTable />} />
          </Route>

          <Route path="*" element={<Navigate to="/estadisticas/ranking" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Estadisticas;
