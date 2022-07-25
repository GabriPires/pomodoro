import { Route, Routes } from 'react-router-dom';

import { Home } from './page/Home';
import { History } from './page/History';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}
