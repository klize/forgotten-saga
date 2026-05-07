// 아주 작은 마크다운 파서 — patch notes 전용
// 지원: ## h2, ### h3, > blockquote, - list, GFM table, **bold**, *em*, `code`
function FsagaMarkdown({ source }) {
  const blocks = React.useMemo(() => parseMarkdown(source || ''), [source]);
  return (
    <div className="fsaga-md">
      {blocks.map((b, i) => renderBlock(b, i))}
    </div>
  );
}

function parseMarkdown(src) {
  const lines = src.split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // headings
    let m;
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      blocks.push({ type: 'h' + m[1].length, text: m[2] });
      i++; continue;
    }

    // blockquote (multi-line)
    if (line.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', text: buf.join(' ') });
      continue;
    }

    // list (- or *)
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // GFM table: header line + |---|---| separator
    const isTblLine = (l) => /^\s*\|.*\|\s*$/.test(l);
    const isTblSep  = (l) => /^\s*\|[\s|:\-]+\|\s*$/.test(l) && /-/.test(l);
    if (isTblLine(line) && i + 1 < lines.length && isTblSep(lines[i + 1])) {
      const split = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      const headers = split(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTblLine(lines[i]) && !isTblSep(lines[i])) {
        rows.push(split(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // paragraph (gather until blank)
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(\s*#{1,3}\s|>|[-*]\s|\s*\|)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'p', text: buf.join(' ') });
  }
  return blocks;
}

function renderInline(text) {
  // process in order: code, bold, em
  const parts = [];
  let rest = text;
  let key = 0;
  const push = (node) => parts.push(<React.Fragment key={key++}>{node}</React.Fragment>);

  // simple tokenizer
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(rest)) !== null) {
    if (m.index > last) push(rest.slice(last, m.index));
    if (m[1]) push(<code style={inlineCode}>{m[1].slice(1, -1)}</code>);
    else if (m[2]) push(<strong style={{ color: '#f4ecd3', fontWeight: 500 }}>{m[2].slice(2, -2)}</strong>);
    else if (m[3]) push(<em style={{ color: 'rgba(131,155,203,0.95)', fontStyle: 'italic' }}>{m[3].slice(1, -1)}</em>);
    last = m.index + m[0].length;
  }
  if (last < rest.length) push(rest.slice(last));
  return parts;
}

const inlineCode = {
  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
  fontSize: '0.88em',
  background: 'rgba(255,195,50,0.08)',
  border: '1px solid rgba(255,195,50,0.18)',
  padding: '1px 6px',
  borderRadius: 2,
  color: '#ffc332',
};

function renderBlock(b, i) {
  switch (b.type) {
    case 'h1':
    case 'h2':
      return <h3 key={i} style={{
        margin: '36px 0 16px',
        fontSize: 22, fontWeight: 400, letterSpacing: '-0.01em',
        color: '#f4ecd3',
        paddingBottom: 10,
        borderBottom: '1px solid rgba(255,235,190,0.14)',
      }}>{renderInline(b.text)}</h3>;
    case 'h3':
      return <h4 key={i} style={{
        margin: '24px 0 10px',
        fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
        color: '#ffc332',
        textTransform: 'none',
      }}>{renderInline(b.text)}</h4>;
    case 'quote':
      return <blockquote key={i} style={{
        margin: '20px 0',
        padding: '16px 20px',
        borderLeft: '2px solid rgba(255,195,50,0.55)',
        background: 'rgba(255,195,50,0.04)',
        fontSize: 13.5, lineHeight: 1.75,
        color: 'rgba(230,225,212,0.78)',
        fontStyle: 'italic',
        textWrap: 'pretty',
      }}>{renderInline(b.text)}</blockquote>;
    case 'ul':
      return <ul key={i} style={{ listStyle: 'none', padding: 0, margin: '8px 0 14px' }}>
        {b.items.map((it, k) => (
          <li key={k} style={{
            position: 'relative',
            padding: '4px 0 4px 22px',
            fontSize: 13.5, lineHeight: 1.75,
            color: 'rgba(230,225,212,0.78)',
            textWrap: 'pretty',
          }}>
            <span style={{
              position: 'absolute', left: 4, top: 4,
              color: 'rgba(255,195,50,0.55)',
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 12,
            }}>—</span>
            {renderInline(it)}
          </li>
        ))}
      </ul>;
    case 'table':
      return <div key={i} style={{ overflowX: 'auto', margin: '14px 0' }}>
        <table style={{
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(230,225,212,0.82)',
        }}>
          <thead>
            <tr>{b.headers.map((h, k) => (
              <th key={k} style={{
                padding: '8px 12px',
                textAlign: 'left',
                fontWeight: 500,
                color: '#ffc332',
                background: 'rgba(255,195,50,0.04)',
                borderBottom: '1px solid rgba(255,195,50,0.32)',
                whiteSpace: 'nowrap',
              }}>{renderInline(h)}</th>
            ))}</tr>
          </thead>
          <tbody>
            {b.rows.map((row, r) => (
              <tr key={r}>
                {row.map((c, k) => (
                  <td key={k} style={{
                    padding: '7px 12px',
                    borderBottom: '1px solid rgba(255,235,190,0.08)',
                    verticalAlign: 'top',
                  }}>{renderInline(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>;
    case 'p':
    default:
      return <p key={i} style={{
        margin: '10px 0',
        fontSize: 13.5, lineHeight: 1.85,
        color: 'rgba(230,225,212,0.75)',
        textWrap: 'pretty',
      }}>{renderInline(b.text)}</p>;
  }
}

window.FsagaMarkdown = FsagaMarkdown;
