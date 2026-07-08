export default function CodeViewer({ code, selectedLine, corrected, correctLine, hasError, onSelectLine }) {
  return (
    <div className="code-viewer" role="group" aria-label="Código con líneas numeradas">
      {code.map((line, index) => {
        const lineNumber = index + 1;
        const isSelected = selectedLine === lineNumber;
        const isCorrectLine = corrected && hasError && correctLine === lineNumber;
        const isWrongSelected = corrected && hasError && isSelected && selectedLine !== correctLine;
        const isSelectedButShouldBeFine = corrected && !hasError && isSelected;

        const classes = [
          'code-line',
          isSelected && !corrected ? 'selected' : '',
          isCorrectLine ? 'correct-line' : '',
          isWrongSelected || isSelectedButShouldBeFine ? 'wrong-line' : ''
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={`${line}-${lineNumber}`}
            type="button"
            className={classes}
            onClick={() => onSelectLine(lineNumber)}
            disabled={corrected}
            aria-pressed={isSelected}
            aria-label={`Seleccionar línea ${lineNumber}`}
          >
            <span className="line-number" aria-hidden="true">
              {lineNumber}
            </span>
            <code>{line || ' '}</code>
          </button>
        );
      })}
    </div>
  );
}
