# How to Upload University Images 📸

## 🎯 Problem

Background image and logo not showing on university page because they haven't been uploaded in the admin yet.

---

## ✅ Solution: Upload Images in Admin

### Step 1: Go to Admin Edit Page
```
1. Login to admin panel
2. Go to Universities
3. Click on the university you want to edit
4. You'll see the edit page with tabs
```

### Step 2: Upload Logo
```
┌─────────────────────────────────┐
│ University Logo                 │
├─────────────────────────────────┤
│ [Current Logo Preview]          │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   📤 Upload                 │ │
│ │   Click to upload logo      │ │
│ │   PNG, JPG, GIF (5MB)       │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Instructions:**
1. Click the upload area
2. Select your university logo (PNG, JPG, GIF)
3. Max size: 5MB
4. Logo will preview immediately
5. Click Save

### Step 3: Upload Gallery Images
```
┌─────────────────────────────────┐
│ University Gallery              │
├─────────────────────────────────┤
│ [IMG1] [IMG2] [IMG3] [IMG4]    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   🖼️ Upload Gallery Images  │ │
│ │   Multiple images (max 10)  │ │
│ │   PNG, JPG, GIF (5MB each)  │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Instructions:**
1. Click the upload area
2. Select multiple images (up to 10)
3. Max size per image: 5MB
4. Images will preview in grid
5. First image = Banner background
6. Click Save

---

## 📊 What Happens After Upload

### Logo:
```
Admin Upload → Database (logo_url) → Public Page
```
- Displays in header card
- Shows in stats section
- Fallback: University initials

### Gallery:
```
Admin Upload → Database (gallery_images array) → Public Page
```
- First image = Hero banner background
- Rest = Gallery section
- Fallback: Gradient background

---

## 🎨 Image Recommendations

### Logo:
- **Format**: PNG (transparent background)
- **Size**: 500x500px minimum
- **Aspect**: Square (1:1)
- **File Size**: Under 1MB
- **Background**: Transparent or white

### Gallery Images:
- **Format**: JPG or PNG
- **Size**: 1920x1080px minimum
- **Aspect**: 16:9 (landscape)
- **File Size**: Under 2MB each
- **Quality**: High resolution
- **Content**: 
  - Campus buildings
  - Classrooms
  - Library
  - Student activities
  - Facilities
  - Events

---

## 🔍 Debugging

### Check Console Logs:
```javascript
console.log("Logo URL:", university?.logo_url);
console.log("Gallery Images:", university?.gallery_images);
```

### If NULL or undefined:
- Images not uploaded yet
- Upload in admin panel
- Save the university

### If showing but not displaying:
- Check image URL is valid
- Check image file exists
- Check CORS settings
- Check file permissions

---

## 📝 Current Behavior

### Without Images:
```
Logo: Shows university initials (e.g., "NU")
Banner: Shows red gradient background
Gallery: Section hidden
```

### With Images:
```
Logo: Shows uploaded logo
Banner: Shows first gallery image
Gallery: Shows all uploaded images
```

---

## 🚀 Quick Start

1. **Login to Admin**: `/admin`
2. **Go to Universities**: Click "Universities" in sidebar
3. **Edit University**: Click on university name
4. **Scroll to Images Section**
5. **Upload Logo**: Click upload, select file
6. **Upload Gallery**: Click upload, select multiple files
7. **Save**: Click "Save Changes" button
8. **View Public Page**: Go to `/universities/[slug]`

---

## ✅ Checklist

Before images will show:

- [ ] Run database migration (`DATABASE_MIGRATION_UNIVERSITIES.sql`)
- [ ] Columns `logo_url` and `gallery_images` exist
- [ ] Admin edit page has upload sections
- [ ] Upload logo image
- [ ] Upload gallery images (at least 1 for banner)
- [ ] Click Save
- [ ] Refresh public university page

---

## 🎯 Expected Result

After uploading:

**Header:**
- ✅ Banner shows first gallery image
- ✅ Logo shows in stats card
- ✅ Professional appearance

**Gallery Section:**
- ✅ Shows all uploaded images
- ✅ Hover zoom effects
- ✅ Grid layout

---

## 📊 Database Check

### Verify images are saved:
```sql
SELECT 
    name,
    logo_url,
    array_length(gallery_images, 1) as gallery_count
FROM universities
WHERE slug = 'ningbo-university';
```

### Expected output:
```
name              | logo_url           | gallery_count
Ningbo University | https://...        | 5
```

---

## 🎉 Result

Once images are uploaded in admin:
- ✅ Logo displays in header
- ✅ Banner shows gallery image
- ✅ Gallery section appears
- ✅ Professional university page

**Upload images in the admin panel to see them on the public page!** 📸✨
