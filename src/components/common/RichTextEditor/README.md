# RichTextEditor Component

A Notion-style WYSIWYG rich text editor built with Novel (Tiptap) for Next.js applications.

## Features

- ✨ Notion-style editing experience
- 📝 Markdown shortcuts support
- 🎨 Slash commands menu
- 💡 Bubble menu for text formatting
- 🖼️ Image upload support
- 📋 Code blocks with syntax highlighting
- 📊 Tables support
- 🔗 Link handling
- 📱 Fully responsive
- 🌙 Dark mode support

## Installation

The required dependencies are already installed:
- `novel` - The Novel editor
- `@tiptap/react` - Tiptap React components
- `@tiptap/starter-kit` - Essential Tiptap extensions

## Usage

### Basic Example

```jsx
import RichTextEditor from '@/components/common/RichTextEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start writing something amazing..."
    />
  );
}
```

### With Form

```jsx
import { useState } from 'react';
import RichTextEditor from '@/components/common/RichTextEditor';

function ProductForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleDescriptionChange = (html) => {
    setFormData(prev => ({
      ...prev,
      description: html
    }));
  };

  return (
    <form>
      <input 
        type="text"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
      />
      
      <RichTextEditor
        value={formData.description}
        onChange={handleDescriptionChange}
        placeholder="Enter product description..."
      />
      
      <button type="submit">Save</button>
    </form>
  );
}
```

### Read-Only Mode

```jsx
<RichTextEditor
  value={savedContent}
  editable={false}
/>
```

### With Custom Styling

```jsx
<RichTextEditor
  value={content}
  onChange={setContent}
  className="custom-editor dark-mode"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Initial HTML content |
| `onChange` | `function` | `() => {}` | Callback when content changes, receives HTML string |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text when editor is empty |
| `editable` | `boolean` | `true` | Whether the editor is editable |
| `className` | `string` | `''` | Additional CSS classes |

## Keyboard Shortcuts

### Text Formatting
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline
- `Ctrl/Cmd + Shift + S` - Strikethrough
- `Ctrl/Cmd + E` - Code

### Headings
- `Ctrl/Cmd + Alt + 1` - Heading 1
- `Ctrl/Cmd + Alt + 2` - Heading 2
- `Ctrl/Cmd + Alt + 3` - Heading 3

### Lists
- `Ctrl/Cmd + Shift + 7` - Ordered list
- `Ctrl/Cmd + Shift + 8` - Bullet list

### Other
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + K` - Add link

## Markdown Shortcuts

Novel supports Markdown-style shortcuts:

- `# ` - Heading 1
- `## ` - Heading 2
- `### ` - Heading 3
- `- ` or `* ` - Bullet list
- `1. ` - Ordered list
- `> ` - Blockquote
- `` `code` `` - Inline code
- ` ``` ` - Code block
- `---` - Horizontal rule
- `**bold**` - Bold text
- `*italic*` - Italic text
- `~~strike~~` - Strikethrough

## Slash Commands

Type `/` to open the slash command menu:

- `/heading1` - Heading 1
- `/heading2` - Heading 2
- `/heading3` - Heading 3
- `/bullet` - Bullet list
- `/numbered` - Numbered list
- `/quote` - Blockquote
- `/code` - Code block
- `/image` - Insert image
- `/table` - Insert table

## Styling

The component includes comprehensive SCSS styling that can be customized. The main class is `.rich-text-editor`.

To customize, you can:
1. Override styles in your own CSS
2. Use the `className` prop to add custom classes
3. Modify `RichTextEditor.scss` directly

## Dark Mode

Add the `dark-mode` class to enable dark mode:

```jsx
<RichTextEditor
  value={content}
  onChange={setContent}
  className="dark-mode"
/>
```

## Storing Content

The editor outputs HTML content. You can store this in your database and render it later:

```jsx
// Saving
const handleSave = async () => {
  await saveToDatabase({
    content: editorContent // HTML string
  });
};

// Displaying
<RichTextEditor
  value={savedContent}
  editable={false}
/>
```

## Examples in Project

Use this component in:
- Product descriptions (`src/app/admin/products/new/page.js`)
- Category descriptions (`src/app/admin/categories/new/page.js`)
- Blog posts
- User profiles
- Any content that needs rich formatting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### Styles not loading
Make sure you're importing the component from the correct path and that SCSS is configured in your Next.js app.

### Content not saving
Check that your `onChange` callback is properly updating state and that you're handling the HTML string correctly.

### Editor not rendering
Ensure the component is used in a client component (`'use client'` directive).
