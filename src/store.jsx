import { createContext, useContext, useState } from 'react';
import { STATE_RATE } from './data.js';
// Shared reference data and workflow state. Each piece maps to a backend resource later.
const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
export function StoreProvider({ children }) {
  const [rate, setRate] = useState(STATE_RATE);   // fixed state rate per night (client-supplied reference data)
  const [extensions, setExt] = useState([]);       // training stay extension requests
  return <Ctx.Provider value={{ rate, setRate, extensions, setExt }}>{children}</Ctx.Provider>;
}
