export function PlayCursors() {
  const cursorStyle = {
    border: '1px dashed gray',
    width: '200px',
    padding: '0.5rem',
    margin: '0.5rem',
  };
  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {[
          'alias',
          'all-scroll',
          'cell',
          'col-resize',
          'context-menu',
          'copy',
          'crosshair',
          'default',
          'e-resize',
          'ew-resize',
          'grab',
          'grabbing',
          'help',
          'move',
          'n-resize',
          'ne-resize',
          'nesw-resize',
          'no-drop',
          'none',
          'not-allowed',
          'ns-resize',
          'nw-resize',
          'nwse-resize',
          'pointer',
          'progress',
          'row-resize',
          's-resize',
          'se-resize',
          'sw-resize',
          'text',
          'vertical-text',
          'w-resize',
          'wait',
          'zoom-in',
          'zoom-out',
        ].map((c, i) => (
          <div key={i} style={{ ...cursorStyle, cursor: c }}>
            {c}
          </div>
        ))}
      </div>
    </>
  );
}
