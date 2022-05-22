import { useEffect, useRef, useState } from 'react';
import Terminal, {
  TerminalEventType,
  TerminalLog
} from '../controllers/terminal';

export default function TerminalComponent() {
  let initialized = useRef(false);

  const [logs, setLogs] = useState<TerminalLog[]>([]);

  function onTerminalLog() {
    setLogs([...Terminal.logs]);
  }

  useEffect(() => {
    const input: HTMLInputElement = document.querySelector('.terminal-input')!;
    input.focus();
    setLogs([...Terminal.logs]);

    if (initialized.current) return;

    Terminal.instance.on(TerminalEventType.LOG, onTerminalLog);
    return () => {
      Terminal.instance.off(TerminalEventType.LOG, onTerminalLog);
    };
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    scrollToBottom();
  }, [logs]);

  function scrollToBottom() {
    const terminalList = document.querySelector('.terminal-list')!;
    terminalList.scrollTo(0, terminalList.scrollHeight);
  }

  function applyCommand() {
    const input: HTMLInputElement = document.querySelector('.terminal-input')!;
    const cmd = input.value;
    input.focus();
    if (!cmd || cmd.length === 0) return;
    input.value = '';
    Terminal.command(cmd);
  }

  return (
    <div className="terminal">
      <ul className="terminal-list">
        {logs.map((log: TerminalLog, index: number) => (
          <li className={`${log.cmd ? 'log-cmd' : ''}`} key={index}>
            <pre>{log.message}</pre>
          </li>
        ))}
      </ul>
      <div className="terminal-controls">
        <div className="h-group spread center">
          <button className="btn-link" onClick={Terminal.clear}>
            <span>Clear</span>
            <i className="fas fa-eraser"></i>
          </button>
          <button
            className="btn-link"
            onClick={() => {
              Terminal.command('help');
            }}
          >
            <span>Help</span>
            <i className="fas fa-question-circle" />
          </button>
          <input
            className="terminal-input"
            type="text"
            placeholder="Enter a command"
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyCommand();
            }}
          />
          <button className="btn-link" onClick={applyCommand}>
            <span>Send</span>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
