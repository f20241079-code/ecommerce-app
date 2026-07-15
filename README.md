# E-Commerce Mobile App 🛍️

A full-featured e-commerce mobile application built with React Native and Expo, featuring authentication, product catalog, shopping cart, wishlist, order management, and more.

## 📱 Features

### User Management
- **Authentication**: Sign up and login functionality with secure credential storage
- **Password Reset**: Forgot password feature with email recovery
- **Profile Management**: Edit user profile information
- **Address Management**: Add, edit, and manage multiple delivery addresses

### Shopping Experience
- **Product Catalog**: Browse products with detailed information
- **Search**: Full-text search functionality for finding products
- **Categories**: Browse products by category
- **Product Details**: Comprehensive product information with images and specifications
- **Wishlist**: Save favorite products for later

### Shopping Cart & Checkout
- **Shopping Cart**: Add/remove items, adjust quantities
- **Cart Persistence**: Cart data persists across app sessions
- **Checkout Process**: Multi-step checkout with address selection
- **Order Management**: View order history and track orders

### Additional Features
- **Theme Support**: Light and dark theme options with persistent preferences
- **Push Notifications**: Real-time notifications for order updates and promotions
- **Responsive Design**: Works on Android, iOS, and web platforms

## 🏗️ Project Structure

```
ecommerce-app/
├── app/                          # App routing and screens (Expo Router)
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (stack)/                 # Stack navigation screens
│   │   ├── addresses.tsx
│   │   ├── category.tsx
│   │   ├── checkout.tsx
│   │   ├── product-detail.tsx
│   │   ├── search.tsx
│   │   ├── order-history.tsx
│   │   ├── edit-profile.tsx
│   │   └── settings.tsx
│   ├── (tabs)/                  # Tab navigation screens
│   │   ├── home.tsx
│   │   ├── cart.tsx
│   │   ├── wishlist.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Home screen
│   └── onboarding.tsx           # Onboarding flow
├── context/                      # React Context providers
│   ├── CartContext.tsx          # Shopping cart state management
│   ├── ThemeContext.tsx         # Theme preferences management
│   └── WishlistContext.tsx      # Wishlist state management
├── lib/                         # Utility functions and services
│   ├── supabase.ts             # Supabase client configuration
│   ├── supabaseHelpers.ts      # Supabase helper functions
│   └── notifications.ts         # Push notification setup
├── constants/                   # App constants
│   ├── colors.ts               # Color palette
│   └── theme.ts                # Theme configuration
├── __tests__/                  # Test files
├── __mocks__/                  # Mock files for testing
├── assets/                     # Static assets
│   ├── images/                # App images and icons
│   └── expo.icon/             # Expo icon configuration
├── scripts/                    # Utility scripts
└── package.json               # Project dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Xcode (for native builds)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-app.git
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory with your Supabase credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Running on Different Platforms

**iOS Simulator**
```bash
npm run ios
```

**Android Emulator**
```bash
npm run android
```

**Web Browser**
```bash
npm run web
```

**Expo Go (Development)**
- Press `i` for iOS or `a` for Android in the Expo CLI
- Scan the QR code with Expo Go app (available on App Store and Google Play)

## 📦 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **State Management**: React Context API
- **Backend**: Supabase (PostgreSQL database with built-in auth)
- **Storage**: AsyncStorage (local persistence)
- **Secure Storage**: Expo Secure Store (sensitive data)
- **Image Handling**: Expo Image
- **Notifications**: Expo Notifications
- **Testing**: Jest with React Native Testing Library

## 🧪 Testing

Run tests with:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Tests are configured to work with Jest and include mocks for:
- AsyncStorage
- Supabase client

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint for code quality |
| `npm run reset-project` | Reset project to starter template |

## 📱 App Architecture

### Navigation Structure
```
Root Layout
├── Onboarding (first-time users)
├── Auth Stack
│   ├── Login
│   ├── Signup
│   └── Forgot Password
├── Main App
│   ├── Tab Navigation
│   │   ├── Home
│   │   ├── Cart
│   │   ├── Wishlist
│   │   └── Profile
│   └── Stack Navigation (overlays)
│       ├── Product Detail
│       ├── Search
│       ├── Category
│       ├── Checkout
│       ├── Order History
│       ├── Addresses
│       ├── Edit Profile
│       └── Settings
```

### State Management
- **CartContext**: Manages shopping cart state
- **WishlistContext**: Manages wishlist items
- **ThemeContext**: Manages app theme preferences

## 🔐 Security Features

- Secure credential storage using Expo Secure Store
- Supabase authentication with JWT tokens
- Secure API communication with HTTPS
- Platform-specific storage (SecureStore for native, localStorage for web)

## 🎨 Styling

- Custom theme system with light and dark modes
- Color constants defined in `constants/colors.ts`
- Theme configuration in `constants/theme.ts`
- Consistent UI components throughout the app

## 📞 API Integration

The app integrates with Supabase for:
- User authentication and management
- Product catalog management
- Order processing
- User data and preferences

Supabase configuration is in `lib/supabase.ts` with helper functions in `lib/supabaseHelpers.ts`.

## 🔔 Notifications

Push notifications are configured in `lib/notifications.ts` using Expo Notifications API. Features include:
- Order status updates
- Promotional notifications
- Personalized alerts

## 🚀 Building for Production

### Build for iOS
```bash
eas build --platform ios
```

### Build for Android
```bash
eas build --platform android
```

### Deploy to Stores
Use Expo Application Services (EAS) for building and submitting to App Store and Google Play.

## 📝 Code Quality

- **TypeScript**: Full type safety across the codebase
- **ESLint**: Code style consistency
- **Jest**: Unit and component testing
- **File-based Routing**: Clean, organized navigation structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --clear
```

### Dependency Issues
```bash
npm install
npx expo doctor
```

### Build Issues
```bash
npm run reset-project
```

## 📧 Support

For support, email support@example.com or open an issue on GitHub.

---

**Happy shopping! 🎉**
