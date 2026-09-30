# ✈️ AI Trip Planner

An AI-powered travel planning web application that generates personalized trip itineraries based on your destination, trip duration, budget, and travel group.

Built with **React, Firebase, OpenRouter, and Tailwind CSS**.

---

## 🌍 Overview

AI Trip Planner helps users create customized travel itineraries in seconds.

Users can:

- 🔐 Sign in securely with Google
- 📍 Search and select travel destinations
- 📅 Choose trip duration
- 💰 Select a travel budget
- 👥 Choose their travel group
- 🤖 Generate AI-powered travel itineraries
- 🏨 Get hotel recommendations
- 📍 Get places-to-visit recommendations
- 🗓️ View day-by-day travel plans
- 💾 Save trips to Firebase Firestore
- 📋 View previously generated trips
- 🗑️ Delete saved trips

The application uses **OpenRouter's free AI routing** for itinerary generation and Firebase for authentication and persistent trip storage.

---

## ✨ Features

### 🤖 AI Trip Generation

Generates personalized travel plans based on:

- Destination
- Number of days
- Budget
- Traveler type

The AI generates structured itinerary data containing:

- Trip information
- Recommended hotels
- Places to visit
- Daily activities
- Estimated costs
- Travel details

AI responses are validated and normalized before being stored in Firestore.

---

### 🔐 Google Authentication

Users can sign in using their Google account through:

**Firebase Authentication**

Authenticated users can create and access their own saved trips.

---

### 📍 Destination Search

Destination search uses the **Open-Meteo Geocoding API** to find cities and locations without requiring a paid Google Places API.

Users can search for destinations such as:

```text
Paris
Tokyo
New York
Bali
Dubai
Hyderabad