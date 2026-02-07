'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Strike } from '@tiptap/extension-strike';
import { Code } from '@tiptap/extension-code';
import { Heading } from '@tiptap/extension-heading';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { ListItem } from '@tiptap/extension-list-item';
import { Blockquote } from '@tiptap/extension-blockquote';
import { History } from '@tiptap/extension-history';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { 
  FaBold, FaItalic, FaStrikethrough, FaCode,
  FaListUl, FaListOl, FaQuoteRight, FaUndo, FaRedo,
  FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, 
  FaAlignJustify, FaLink, FaUnlink, FaParagraph
} from 'react-icons/fa';
import './RichTextEditor.scss';

/**
 * Toolbar Component
 */
const EditorToolbar = ({ editor }) => {
  const [fontSizeInput, setFontSizeInput] = React.useState('');

  // Update local state when editor selection changes
  React.useEffect(() => {
    if (!editor) return;

    const updateFontSize = () => {
      const { fontSize } = editor.getAttributes('textStyle');
      const size = fontSize ? parseInt(fontSize, 10) : '';
      setFontSizeInput(String(size));
    };

    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);

    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor]);

  if (!editor) return null;

  const setLink = () => {
    const url = globalThis.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleFontSizeChange = (e) => {
    setFontSizeInput(e.target.value);
  };

  const applyFontSize = () => {
    const size = parseInt(fontSizeInput, 10);
    if (size && size >= 8 && size <= 200) {
      editor.chain().focus().setFontSize(`${size}px`).run();
    }
  };

  const clearFontSize = () => {
    editor.chain().focus().unsetFontSize().run();
    setFontSizeInput('');
  };

  const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  return (
    <div className="editor-toolbar">
      {/* Font Size */}
      <div className="toolbar-group font-size-group">
        <select
          value={fontSizeOptions.includes(parseInt(fontSizeInput, 10)) ? fontSizeInput : ''}
          onChange={(e) => {
            const size = e.target.value;
            setFontSizeInput(size);
            editor.chain().focus().setFontSize(`${size}px`).run();
          }}
          className="font-size-select"
          title="Select Font Size"
        >
          <option value="" disabled>Size</option>
          {fontSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={fontSizeInput}
          onChange={handleFontSizeChange}
          onBlur={applyFontSize}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyFontSize();
            }
          }}
          className="font-size-input"
          title="Custom Font Size (8-200px)"
          min="8"
          max="200"
          step="1"
          placeholder="–"
        />
        <span className="font-size-unit">px</span>
        <button
          type="button"
          onClick={clearFontSize}
          className="font-size-clear"
          title="Clear font size (use default)"
          disabled={!fontSizeInput}
        >
          ×
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Text Formatting */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold (Ctrl+B)"
        >
          <FaBold />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic (Ctrl+I)"
        >
          <FaItalic />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline (Ctrl+U)"
        >
          <FaUnderline />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
          title="Code"
        >
          <FaCode />
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Headings & Paragraph */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
          title="Paragraph"
        >
          <FaParagraph />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Text Alignment */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          title="Align Left"
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          title="Align Center"
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          title="Align Right"
        >
          <FaAlignRight />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
          title="Justify"
        >
          <FaAlignJustify />
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Lists & Blockquote */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          <FaListUl />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          <FaListOl />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Blockquote"
        >
          <FaQuoteRight />
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Link */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={setLink}
          className={editor.isActive('link') ? 'is-active' : ''}
          title="Insert Link"
        >
          <FaLink />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          title="Remove Link"
        >
          <FaUnlink />
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Undo/Redo */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <FaUndo />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
};

/**
 * RichTextEditor Component
 * A WYSIWYG editor built with Tiptap
 * 
 * @param {Object} props
 * @param {string} props.value - Initial HTML content
 * @param {Function} props.onChange - Callback function when content changes
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.editable - Whether the editor is editable
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showToolbar - Show the toolbar (default: true)
 */
const RichTextEditor = ({
  value = '',
  onChange = () => {},
  placeholder = 'Start writing...',
  editable = true,
  className = '',
  showToolbar = true
}) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      TextStyle,
      FontSize,
      Bold,
      Italic,
      Strike,
      Code,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      History,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <div className={`rich-text-editor ${className}`}>
      {showToolbar && editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className="novel-editor" />
    </div>
  );
};

export default RichTextEditor;
