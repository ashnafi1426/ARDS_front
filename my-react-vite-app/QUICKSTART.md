# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd ARDS_front/my-react-vite-app
npm install
```

### Step 2: Configure Environment
The `.env` file is already created with default values. Update if needed:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## What's New

✅ **Complete Routing System** - All pages properly routed
✅ **Authentication** - JWT-based login/logout
✅ **Role-Based Access** - Student, Advisor, Admin roles
✅ **API Integration** - Centralized API client
✅ **Modern Stack** - React 18 + Vite + Tailwind CSS
✅ **Responsive Design** - Mobile-friendly UI

## Key Routes

### Public
- `/` - Landing page
- `/login` - Login
- `/register` - Sign up

### Student (Protected)
- `/student/dashboard` - Dashboard
- `/student/profile` - Profile
- `/student/self-check` - Weekly assessment

### Advisor (Protected)
- `/advisor/dashboard` - Dashboard
- `/advisor/students` - Student list
- `/advisor/interventions` - Interventions

### Admin (Protected)
- `/admin/dashboard` - Dashboard
- `/admin/panel` - Control panel

## Testing the App

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Visit landing page:**
   Open `http://localhost:3000`

3. **Try login:**
   Click "Login to Dashboard" button

4. **Check routing:**
   Try accessing `/student/dashboard` (should redirect to login)

## Build for Production

```bash
npm run build
npm run preview
```

## Troubleshooting

### Port 3000 Already in Use
Edit `vite.config.js` and change the port:
```javascript
server: {
  port: 3001,
}
```

### API Connection Error
Ensure:
1. Backend API is running
2. `VITE_API_URL` in `.env` is correct
3. CORS is enabled on backend

### Module Not Found
Run `npm install` again to ensure all dependencies are installed.

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── hooks/         # Custom hooks (useAuth)
├── utils/         # API client
├── constants/     # App constants
├── styles/        # CSS files
├── App.jsx        # Main app with routing
└── main.jsx       # Entry point
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Start dev server
3. ⏭️ Test authentication flow
4. ⏭️ Implement missing page components
5. ⏭️ Add more features
6. ⏭️ Deploy to production

## Documentation

- `SETUP.md` - Detailed setup guide
- `FRONTEND_UPDATES.md` - Complete update summary
- `README.md` - Project overview

## Support

For issues:
1. Check the documentation files
2. Verify backend API is running
3. Check browser console for errors
4. Review network tab in DevTools

Happy coding! 🚀
