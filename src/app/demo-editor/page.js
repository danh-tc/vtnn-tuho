'use client';

import { useState } from 'react';
import RichTextEditor from '@/components/common/RichTextEditor';
import './demo.scss';

export default function RichTextEditorDemo() {
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    setSavedContent(content);
    alert('Content saved!');
  };

  const handleClear = () => {
    setContent('');
    setSavedContent('');
  };

  return (
    <div className="demo-page">
      <div className="demo-container">
        <h1>Rich Text Editor Demo</h1>
        <p className="demo-description">
          This is a demo of the Novel (Tiptap) rich text editor. Try out the features below!
        </p>

        <div className="demo-features">
          <h2>Features:</h2>
          <ul>
            <li>📝 Type <code>/</code> for slash commands</li>
            <li>✨ Use markdown shortcuts (e.g., <code>**bold**</code>, <code># heading</code>)</li>
            <li>🎨 Select text to see formatting options</li>
            <li>⌨️ Keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic, etc.)</li>
          </ul>
        </div>

        <div className="demo-section">
          <div className="section-header">
            <h2>Editor</h2>
            <div className="actions">
              <button onClick={handleSave} className="btn-primary">
                Save Content
              </button>
              <button onClick={handleClear} className="btn-secondary">
                Clear All
              </button>
              <button 
                onClick={() => setShowPreview(!showPreview)} 
                className="btn-secondary"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>
          </div>

          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing something amazing... Try typing '/' for commands or '**' for bold text!"
          />
        </div>

        {showPreview && (
          <div className="demo-section">
            <h2>Live Preview</h2>
            <div className="preview-box">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        )}

        {savedContent && (
          <div className="demo-section">
            <h2>Saved Content (Read-Only)</h2>
            <div className="saved-content-box">
              <RichTextEditor
                value={savedContent}
                editable={false}
              />
            </div>
          </div>
        )}

        <div className="demo-section">
          <h2>HTML Output</h2>
          <div className="html-output">
            <pre>
              <code>{content || 'No content yet...'}</code>
            </pre>
          </div>
        </div>

        <div className="demo-section">
          <h2>Usage Example</h2>
          <div className="code-example">
            <pre><code>{`import RichTextEditor from '@/components/common/RichTextEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start writing..."
    />
  );
}`}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
