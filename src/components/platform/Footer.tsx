import { useEffect } from 'react';
import Connection from '../../controllers/connection';

export default function Footer() {
  useEffect(() => {
    // Connection.instance.
  }, []);

  return (
    <footer className="taskbar">
      <div className="taskbar-group">
        {/* <button className="btn-taskbar">Foo</button> */}
        {/* <button className="btn-taskbar">Bar</button> */}
      </div>
    </footer>
  );
}
