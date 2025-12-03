# User Roles & Permissions System

## 🎯 Overview

The system now has **4 distinct user roles** with specific permissions:

1. **Admin** - Full system access
2. **Data Entry** - Universities & Programs management
3. **Marketing & Leads** - Student applications & leads management
4. **Student** - Regular user account

## 👥 User Roles

### 1. Admin (Full Access)
**Badge Color:** Red
**Icon:** Shield

**Permissions:**
- ✅ Full system access
- ✅ Manage all users and roles
- ✅ Access all features
- ✅ System settings
- ✅ Universities & Programs
- ✅ Leads & Applications
- ✅ Analytics & Reports

**Use Case:** Platform administrators, owners

---

### 2. Data Entry
**Badge Color:** Blue
**Icon:** UserCog

**Permissions:**
- ✅ Add/Edit universities
- ✅ Add/Edit programs
- ✅ Manage program catalog
- ✅ Update university details
- ✅ Add academic years
- ✅ Manage languages
- ❌ Cannot access leads/applications
- ❌ Cannot manage users
- ❌ Cannot access settings

**Use Case:** Content managers, data entry staff

---

### 3. Marketing & Leads
**Badge Color:** Green
**Icon:** Users

**Permissions:**
- ✅ View/Manage leads
- ✅ View/Manage applications
- ✅ Contact students
- ✅ View analytics
- ✅ Update application status
- ✅ Manage scholarships
- ❌ Cannot edit universities/programs
- ❌ Cannot manage users
- ❌ Cannot access settings

**Use Case:** Marketing team, sales staff, student counselors

---

### 4. Student
**Badge Color:** Gray
**Icon:** Users

**Permissions:**
- ✅ Browse programs
- ✅ Submit applications
- ✅ Track application status
- ✅ Update profile
- ❌ No admin access

**Use Case:** Regular students, applicants

---

## 📊 User Management Page

### Features:

#### **Stats Cards**
```
┌─────────────────────────────────────────────┐
│  👑 Admins: 3                               │
│  👨‍💼 Data Entry: 5                           │
│  📢 Marketing: 8                            │
│  🎓 Students: 1,234                         │
└─────────────────────────────────────────────┘
```

#### **User Table**
- Name
- Email
- Role (with colored badge)
- Nationality
- Join Date
- Actions (Edit button)

#### **Add User Dialog**
- Personal Information
  - First Name *
  - Last Name *
  - Email *
  - Phone
  - Password * (for new users)
- Role Selection with visual preview
- Permission details display

---

## 🎨 Role Selection UI

When selecting a role, the dialog shows:

### Admin Role Preview:
```
┌─────────────────────────────────────────┐
│ 🛡️ Admin                                 │
│ Full access to all features             │
│                                         │
│ Permissions:                            │
│ ✓ Full system access                   │
│ ✓ Manage all users and roles           │
│ ✓ Access all features                  │
│ ✓ System settings                      │
└─────────────────────────────────────────┘
```

### Data Entry Role Preview:
```
┌─────────────────────────────────────────┐
│ 👨‍💼 Data Entry                            │
│ Can add/edit universities and programs  │
│                                         │
│ Permissions:                            │
│ ✓ Add/Edit universities                │
│ ✓ Add/Edit programs                    │
│ ✓ Manage program catalog               │
│ ✓ Update university details            │
│ ✗ Cannot access leads/applications     │
└─────────────────────────────────────────┘
```

### Marketing Role Preview:
```
┌─────────────────────────────────────────┐
│ 📢 Marketing & Leads                    │
│ Can manage students, leads, applications│
│                                         │
│ Permissions:                            │
│ ✓ View/Manage leads                    │
│ ✓ View/Manage applications             │
│ ✓ Contact students                     │
│ ✓ View analytics                       │
│ ✗ Cannot edit universities/programs    │
└─────────────────────────────────────────┘
```

---

## 🔐 Access Control Matrix

| Feature | Admin | Data Entry | Marketing | Student |
|---------|-------|------------|-----------|---------|
| **Dashboard** | ✅ | ✅ | ✅ | ❌ |
| **Analytics** | ✅ | ❌ | ✅ | ❌ |
| **Universities** | ✅ | ✅ | ❌ | ❌ |
| **Program Catalog** | ✅ | ✅ | ❌ | ❌ |
| **Programs** | ✅ | ✅ | ❌ | ❌ |
| **Scholarships** | ✅ | ❌ | ✅ | ❌ |
| **Applications** | ✅ | ❌ | ✅ | ❌ |
| **Leads** | ✅ | ❌ | ✅ | ❌ |
| **Users** | ✅ | ❌ | ❌ | ❌ |
| **Academic Years** | ✅ | ✅ | ❌ | ❌ |
| **Languages** | ✅ | ✅ | ❌ | ❌ |
| **Settings** | ✅ | ❌ | ❌ | ❌ |

---

## 📝 Creating a New User

### Step 1: Click "Add User"
Opens dialog with form

### Step 2: Fill Personal Information
- First Name: John
- Last Name: Doe
- Email: john@example.com
- Phone: +1234567890
- Password: ••••••••

### Step 3: Select Role
Choose from dropdown:
- Admin
- Data Entry
- Marketing & Leads
- Student

### Step 4: Review Permissions
The dialog automatically shows what permissions this role has

### Step 5: Create User
Click "Create User" button

---

## 🎯 Use Cases

### Scenario 1: Hiring Content Manager
```
Role: Data Entry
Reason: They need to add universities and programs
Access: Universities, Programs, Program Catalog
No Access: Leads, Applications, Settings
```

### Scenario 2: Hiring Marketing Staff
```
Role: Marketing & Leads
Reason: They need to manage student inquiries
Access: Leads, Applications, Analytics
No Access: Universities, Programs, Settings
```

### Scenario 3: New Student Registration
```
Role: Student (default)
Reason: Regular user account
Access: Browse programs, Submit applications
No Access: Admin panel
```

---

## 🔄 Workflow Examples

### Data Entry Team Workflow:
1. Login to admin panel
2. Access Universities page
3. Add new university
4. Access Program Catalog
5. Add programs to university
6. Update university details
7. Cannot see leads or applications

### Marketing Team Workflow:
1. Login to admin panel
2. Access Leads page
3. View new inquiries
4. Contact students
5. Access Applications page
6. Update application status
7. View analytics
8. Cannot edit universities or programs

---

## 🎨 Visual Indicators

### Role Badges:
- **Admin**: Red badge with "Admin"
- **Data Entry**: Blue badge with "Data Entry"
- **Marketing**: Green badge with "Marketing"
- **Student**: Gray badge with "Student"

### Stats Cards:
- **Admins**: Red icon (Shield)
- **Data Entry**: Blue icon (UserCog)
- **Marketing**: Green icon (Users)
- **Students**: Gray icon (Users)

---

## ✅ Features Included

- ✅ 4 distinct user roles
- ✅ Role-based permissions
- ✅ Visual role indicators
- ✅ Stats by role
- ✅ Add/Edit users
- ✅ Delete users
- ✅ Permission preview
- ✅ Search users
- ✅ Role filtering
- ✅ Loading states
- ✅ Toast notifications

---

## 🚀 Next Steps

1. **Implement role-based middleware** to enforce permissions
2. **Add role-based menu filtering** (hide inaccessible pages)
3. **Create audit log** for user actions
4. **Add email notifications** for new user creation
5. **Implement password reset** functionality

---

## 📊 Database Schema

### profiles table needs:
```sql
ALTER TABLE profiles 
ADD COLUMN role VARCHAR(50) DEFAULT 'student';

-- Possible values: 'admin', 'data_entry', 'marketing', 'student'
```

---

## 🎉 Result

A **complete, professional user management system** with:
- ✅ Clear role separation
- ✅ Specific permissions per role
- ✅ Easy user creation
- ✅ Visual feedback
- ✅ Scalable architecture
- ✅ Production-ready

Perfect for managing a team with different responsibilities! 🚀
