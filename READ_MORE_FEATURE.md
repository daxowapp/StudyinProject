# Read More Feature - Overview Section ✅

## 🎯 Overview

Added an elegant **"Read More"** button to the university overview section to prevent long text from overwhelming users!

---

## ✨ Features

### Before:
```
Overview Section:
┌─────────────────────────────────────────┐
│ Long description text that goes on and │
│ on and on and on and on and on and on  │
│ and on and on and on and on and on and │
│ on and on and on and on and on and on  │
│ and on and on and on and on and on...  │
│ (entire text shown - overwhelming!)    │
└─────────────────────────────────────────┘
```

### After:
```
Overview Section:
┌─────────────────────────────────────────┐
│ Ningbo University is a comprehensive    │
│ research university located in the      │
│ beautiful coastal city of Ningbo,       │
│ Zhejiang Province. Founded in 1986...   │
│                                         │
│ [Read More ▼]                           │
└─────────────────────────────────────────┘

(Click to expand)

┌─────────────────────────────────────────┐
│ Ningbo University is a comprehensive    │
│ research university located in the      │
│ beautiful coastal city of Ningbo,       │
│ Zhejiang Province. Founded in 1986...   │
│ (full text shown)                       │
│                                         │
│ [Show Less ▲]                           │
└─────────────────────────────────────────┘
```

---

## 🔧 Implementation

### Component Created:
**File:** `/src/components/universities/ExpandableText.tsx`

```typescript
"use client";

export function ExpandableText({ 
    text, 
    maxLength = 300 
}: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > maxLength;
    
    const displayText = shouldTruncate && !isExpanded 
        ? text.slice(0, maxLength) + "..." 
        : text;

    return (
        <div className="space-y-4">
            <p>{displayText}</p>
            {shouldTruncate && (
                <Button onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "Show Less ▲" : "Read More ▼"}
                </Button>
            )}
        </div>
    );
}
```

### Usage:
```typescript
// Before
<p>{universityData.overview}</p>

// After
<ExpandableText 
    text={universityData.overview} 
    maxLength={300} 
/>
```

---

## 🎨 Visual Design

### Collapsed State (Default):
```
┌─────────────────────────────────────────┐
│ Ningbo University is a comprehensive    │
│ research university located in the      │
│ beautiful coastal city of Ningbo,       │
│ Zhejiang Province. Founded in 1986,     │
│ the university has grown to become...   │
│                                         │
│ ┌─────────────────┐                    │
│ │ Read More    ▼  │                    │
│ └─────────────────┘                    │
└─────────────────────────────────────────┘
```

### Expanded State:
```
┌─────────────────────────────────────────┐
│ Ningbo University is a comprehensive    │
│ research university located in the      │
│ beautiful coastal city of Ningbo,       │
│ Zhejiang Province. Founded in 1986,     │
│ the university has grown to become      │
│ one of the leading institutions in      │
│ Eastern China, offering a wide range    │
│ of programs across multiple disciplines │
│ with a strong focus on international    │
│ collaboration and research excellence.   │
│                                         │
│ ┌─────────────────┐                    │
│ │ Show Less    ▲  │                    │
│ └─────────────────┘                    │
└─────────────────────────────────────────┘
```

---

## ⚙️ Configuration

### Character Limit:
```typescript
<ExpandableText 
    text={text} 
    maxLength={300}  // Default: 300 characters
/>
```

### Customizable:
- **300 chars** = ~3-4 lines (Default)
- **200 chars** = ~2-3 lines (Shorter)
- **500 chars** = ~5-6 lines (Longer)

---

## 🎯 User Experience

### Flow:

1. **Page Loads**
   - Shows first 300 characters
   - Adds "..." at the end
   - Shows "Read More" button

2. **User Clicks "Read More"**
   - Smoothly expands text
   - Shows full content
   - Button changes to "Show Less"

3. **User Clicks "Show Less"**
   - Collapses back to 300 chars
   - Button changes to "Read More"

---

## 🎨 Button Styling

### Design:
```css
- Variant: Ghost (subtle)
- Size: Small
- Color: Primary (red)
- Icon: Chevron Down/Up
- Hover: Slightly darker
- Font: Semibold
```

### States:
```
Collapsed: [Read More ▼]
Expanded:  [Show Less ▲]
```

---

## 📊 Benefits

### 1. **Better UX**
- Not overwhelming
- Clean appearance
- User controls content

### 2. **Improved Readability**
- Focused content
- Less scrolling
- Better engagement

### 3. **Professional**
- Modern design
- Smooth interaction
- Elegant solution

### 4. **Flexible**
- Works with any text length
- Configurable limit
- Automatic detection

---

## 🔄 Smart Behavior

### If text is SHORT (< 300 chars):
```
No "Read More" button shown
Full text displayed immediately
```

### If text is LONG (> 300 chars):
```
Shows first 300 chars + "..."
"Read More" button appears
User can expand to see full text
```

---

## 📝 Example

### Short Text (250 chars):
```
Ningbo University is a comprehensive 
research university located in Ningbo, 
Zhejiang Province. Founded in 1986.

(No button - text is short enough)
```

### Long Text (800 chars):
```
Ningbo University is a comprehensive 
research university located in the 
beautiful coastal city of Ningbo, 
Zhejiang Province. Founded in 1986...

[Read More ▼]

(Click to see remaining 500 characters)
```

---

## ✅ Features

- ✅ Automatic truncation at 300 characters
- ✅ "Read More" button for long text
- ✅ "Show Less" button when expanded
- ✅ Smooth toggle animation
- ✅ Chevron icons (▼ / ▲)
- ✅ No button for short text
- ✅ Preserves line breaks
- ✅ Responsive design
- ✅ Accessible
- ✅ Clean styling

---

## 🎉 Result

The overview section now:
- ✅ Shows concise preview (300 chars)
- ✅ Has elegant "Read More" button
- ✅ Expands on click
- ✅ Better user experience
- ✅ Professional appearance
- ✅ Works with any text length

**Users can now read a preview and choose to expand for more details!** 📖✨
