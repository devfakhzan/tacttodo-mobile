# TactTodo Mobile

Expo React Native app for TactTodo. Same GraphQL API as the web client.

## Requirements

- Node.js 20+
- Expo Go on a phone, or Android/iOS simulator

## Setup

```bash
cp .env.example .env
npm install
```

Set `EXPO_PUBLIC_GRAPHQL_URL` in `.env`.

Local backend:

```
EXPO_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

Deployed API (works on simulator and physical device):

```
EXPO_PUBLIC_GRAPHQL_URL=https://64uimxwwkg.execute-api.ap-southeast-1.amazonaws.com/graphql
```

On a physical device with a local backend, use your computer LAN IP instead of `localhost`.

## Run

```bash
npm start
```

Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

## Features

- Email/password login and signup
- List, create, edit, toggle, and delete todos
- Apollo cache and auth token persisted in AsyncStorage
- Refetch queries when the device comes back online

## Architecture

- **Stack:** Expo SDK 54, TypeScript, React Navigation (native stack)
- **Screens:** Login (auth) and Todos (main). Stack switches based on stored token.
- **Data:** Apollo Client with auth link, same GraphQL operations as web. API backed by DynamoDB on AWS Lambda.
- **Offline:** `apollo3-cache-persist` saves the cache to AsyncStorage. Token stored separately. `useOnlineRefetch` refetches todos when NetInfo reports the device is back online.

## Time

About 2 hours.

## Stack

- Expo SDK 54, TypeScript
- React Navigation (native stack)
- Apollo Client, GraphQL
