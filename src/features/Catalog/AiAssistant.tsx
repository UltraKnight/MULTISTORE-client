import axios from 'axios';
import { useMemo, useState } from 'react';
import type { JSX, SubmitEvent } from 'react';
import type { Product } from 'src/types/product';
import { testSeparatorTableRow } from 'src/utils/regex';
import { askAIChat } from '../../api';

const AI_MODEL = 'openai/gpt-oss-20b:free';

interface AiAssistantProps {
  products: Product[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

// Helper to render simple markdown-like content in the chat bubble.
// The AI sometimes returns tables, lists and bold text, so this function
// converts that into plain React elements.
function MarkdownContent({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  const tableBuffer: string[] = [];

  const flushTable = (index: number) => {
    if (tableBuffer.length === 0) return;

    const rows = tableBuffer.filter((line) => line.trim() && !line.includes('---'));

    elements.push(
      <div key={`table-${index}`} className='ai-table-container'>
        <table className='ai-table'>
          <tbody>
            {rows.map((row, rowIndex) => {
              const cells = row
                .split('|')
                .map((cell) => cell.trim())
                .filter((cell) => cell.length > 0);

              return (
                <tr key={`${index}-${rowIndex}`}>
                  {cells.map((cell, cellIndex) => (
                    <td key={`${index}-${rowIndex}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>,
    );
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const looksLikeTableRow = trimmed.includes('|') && trimmed.split('|').length >= 2;
    const isSeparatorRow = testSeparatorTableRow(trimmed);
    const nextLine = lines[index + 1]?.trim() ?? '';
    const nextLineIsSeparator = testSeparatorTableRow(nextLine);

    // A markdown table starts when we see a header row followed by a separator,
    // or when we are already collecting a table block.
    const isTableLine = looksLikeTableRow && (isSeparatorRow || nextLineIsSeparator || tableBuffer.length > 0);

    if (isTableLine) {
      tableBuffer.push(trimmed);
      return;
    }

    // If we were collecting a table and now the line is not part of it,
    // render the table block before continuing with the rest of the content.
    if (tableBuffer.length > 0) {
      flushTable(index);
      tableBuffer.length = 0;
    }

    if (!line.trim()) return;

    const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    if (line.startsWith('###')) {
      elements.push(
        <h6 key={`h6-${index}`} className='mb-2 mt-2'>
          {line.replace(/^#+\s/, '')}
        </h6>,
      );
    } else if (line.startsWith('##')) {
      elements.push(
        <h5 key={`h5-${index}`} className='mb-2 mt-2'>
          {line.replace(/^#+\s/, '')}
        </h5>,
      );
    } else if (line.startsWith('- ')) {
      elements.push(<li key={`li-${index}`}>{line.replace(/^- /, '')}</li>);
    } else {
      elements.push(<p key={`p-${index}`} className='mb-2' dangerouslySetInnerHTML={{ __html: boldProcessed }} />);
    }
  });

  // If the response ends with a table, render it once more.
  if (tableBuffer.length > 0) {
    flushTable(lines.length);
  }

  return <div>{elements}</div>;
}

export default function AiAssistant({ products }: AiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const catalogSummary = useMemo(() => {
    if (!products.length) return 'No products available in the catalog right now.';

    const topItems = products.slice(0, 15);
    return topItems
      .map((product) => `• ${product.name}: €${product.price?.toFixed(2) ?? 'n/a'} — ${product.quantity} in stock`)
      .join('\n');
  }, [products]);

  async function askAssistant(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const userQuestion = query.trim();
    if (!userQuestion) return;

    setError('');
    setLoading(true);
    setMessages((current) => [...current, { role: 'user', text: userQuestion }]);
    setQuery('');

    try {
      const prompt = [
        {
          role: 'system',
          content:
            'You are a shopping assistant that helps customers find products and answer questions about catalog, prices, availability, and purchase suggestions. Keep responses concise and helpful. Format important information with markdown (tables, lists, bold text).',
        },
        {
          role: 'user',
          content: `This is the current product catalog:\n${catalogSummary}\n\nProvide relevant suggestions using only the catalog details above when possible. Format your response nicely with markdown. If you can't find suitable products, provide general shopping advice.`,
        },
        {
          role: 'user',
          content: `Customer question: ${userQuestion}`,
        },
      ];

      const response = await askAIChat({
        model: AI_MODEL,
        messages: prompt,
        temperature: 0.7,
        max_tokens: 350,
      });

      const answer = response.data?.answer?.trim();
      if (answer) {
        setMessages((current) => [...current, { role: 'assistant', text: answer }]);
      } else {
        setError('Could not receive AI response.');
      }
    } catch (caughtError) {
      console.error(caughtError);
      const status = axios.isAxiosError(caughtError) ? caughtError.response?.status : undefined;
      const backendMessage = axios.isAxiosError(caughtError) ? caughtError.response?.data?.message : undefined;

      if (status === 401) {
        setError('Please log in to use the assistant.');
      } else if (status === 429) {
        setError(backendMessage || 'You have reached the assistant limit for now. Please wait a moment and try again.');
      } else {
        setError('Error connecting to AI service. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='ai-assistant-container'>
      <button
        type='button'
        className='btn btn-primary ai-assistant-toggle'
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Fechar assistente de compras' : 'Abrir assistente de compras'}
      >
        <span className='ai-assistant-toggle-icon'>{open ? 'X' : '💬'}</span>
        <span className='ai-assistant-toggle-text'>{open ? 'Close AI Assistant' : 'AI Shopping Assistant'}</span>
      </button>

      {open ? (
        <div className='card ai-assistant-card'>
          <div className='card-body'>
            <h5 className='card-title'>Shopping Assistant</h5>
            <p className='card-text small mb-2'>Ask something like:</p>
            <ul className='list-unstyled small mb-3'>
              <li>• What's the best laptop under €800?</li>
              <li>• Show me gaming options</li>
              <li>• Best headphones for office work?</li>
            </ul>

            <form onSubmit={askAssistant} className='mb-3'>
              <div className='input-group'>
                <input
                  className='form-control'
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder='Ask the assistant...'
                  aria-label='Ask the shopping assistant'
                />
                <button className='btn btn-success' type='submit' disabled={loading}>
                  {loading ? 'Thinking...' : 'Send'}
                </button>
              </div>
            </form>

            {error ? <div className='alert alert-warning mb-3 small'>{error}</div> : null}
            <div className='ai-messages mb-2'>
              {messages.length === 0 ? (
                <small className='text-muted'>Ask your first question to get personalized recommendations.</small>
              ) : (
                messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`ai-message ai-message-${message.role}`}>
                    <strong className='small'>{message.role === 'assistant' ? 'Assistant:' : 'You:'}</strong>
                    {message.role === 'assistant' ? (
                      <MarkdownContent text={message.text} />
                    ) : (
                      <p className='mb-0 small'>{message.text}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .ai-assistant-container {
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          z-index: 1050;
          width: min(360px, calc(100vw - 1.5rem));
          max-width: 360px;
          text-align: right;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .ai-assistant-toggle {
          width: auto;
          max-width: 100%;
          box-shadow: 0 0 18px rgba(0, 0, 0, 0.18);
          font-size: 0.9rem;
          padding: 0.55rem 0.75rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .ai-assistant-toggle-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
        }

        .ai-assistant-toggle-text {
          white-space: nowrap;
        }

        @media (max-width: 576px) {
          .ai-assistant-toggle {
            padding: 0.35rem 0.45rem;
            margin-bottom: 1.2rem;
            min-width: 2.4rem;
          }

          .ai-assistant-toggle-text {
            display: none;
          }
        }

        .ai-assistant-card {
          margin-top: 0.75rem;
          box-shadow: 0 0 26px rgba(0, 0, 0, 0.2);
          border: none;
          max-height: min(72vh, 480px);
          overflow: hidden;
        }

        .ai-assistant-card .card-body {
          padding: 1rem;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          max-height: 100%;
        }

        .ai-messages {
          max-height: min(40vh, 280px);
          overflow-y: auto;
          border: 1px solid #e0e0e0;
          border-radius: 0.4rem;
          padding: 0.75rem;
          background: #fafafa;
          flex: 1 1 auto;
        }

        .ai-message {
          border-radius: 0.5rem;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          word-wrap: break-word;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .ai-message-user {
          background: #e3f2fd;
          text-align: right;
          margin-left: 1.5rem;
        }

        .ai-message-assistant {
          background: #f5f5f5;
          margin-right: 0.5rem;
          border-left: 3px solid #2196f3;
        }

        .ai-message strong {
          display: block;
          margin-bottom: 0.25rem;
          color: #333;
        }

        .ai-table-container {
          overflow-x: auto;
          margin: 0.5rem 0;
        }

        .ai-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .ai-table td {
          border: 1px solid #ddd;
          padding: 0.4rem;
          text-align: left;
        }

        .ai-table td:first-child {
          font-weight: 600;
        }

        .ai-message h5,
        .ai-message h6 {
          font-size: 0.9rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.25rem !important;
          font-weight: 600 !important;
        }

        .ai-message p {
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }

        .ai-message li {
          margin-left: 1rem;
          margin-bottom: 0.2rem;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
