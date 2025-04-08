# Hoagie App (Frontend - React Native)

## Setup Instructions

> Prerequisites:
>
> - Node.js >= 16
> - Expo CLI installed (`npm install -g expo-cli`)
> - Android Studio / Xcode / Expo Go for testing

### Install dependencies:

```bash
npm install
```

### Run Application:

```bash
expo start
```

## Features

- **Paginated Hoagie List** — Infinite scrolling through 5-by-5 hoagies.
- **Create & Edit Hoagies** — Name it, choose ingredients, and add an image.
- **Comment System** — See total comment count, Instagram-style "view all" toggle, post replies.
- **Collaborator Support** — View who helped build the sandwich.
- **Polished UI** — Smooth animations, gestures, and mobile-friendly styling.
- **Auth Support** — Basic login/logout with user-based actions.
- **Recoil + Redux** — Global state management for auth, UI, and data refresh triggers.

### Tech Stack

| Tech                | Purpose                              |
| ------------------- | ------------------------------------ |
| React Native        | Cross-platform mobile frontend       |
| TypeScript          | Type safety                          |
| Redux Toolkit       | Auth state management                |
| Recoil              | Refresh triggers + hoagie form state |
| Axios               | API communication                    |
| React Navigation    | Navigation & route parameters        |
| Expo                | Image picker & native tools          |
| Animated Reanimated | Smooth transitions & gestures        |
