# DND Game - Unity Group Project

Our project aims to provide a visual illustration for the DND game using unity and a react app.

The application serves as the main control panen for the plane. This is where users can join groups, select the characters they want to be with and perform certain actions during the game.

## How it works?

Each user needs to download the application and create a profile. In the application users can configure their characters and join or create a group. When users join the group, the game starts. Everyone needs to show the picture of their character to the "Main Screen" which is used to display the game. As the users scan their characters, the characters appear on the main screen. Following the basic idea of DND the storiteller guides the storyline however they wish, but actions can be displayed on the main screen to elevate the experience. The applications can be also used to roll the dice, by showing the appropriate picture to the screen. This action will be also displayed. The Main Screen is also equiped with a health bar for every player as well as the enemy, so that the effect of actions are easier to track.

## APPLICATION

### Screens

The application consists of 10 screens in total:

1. Welcome
2. Login
3. Signup
4. Verify your email
5. Join a group
6. Create a group
7. Design your character
8. Play view
9. Dice view
10. Action view

### Data collection

There is no need to collect any personal information from the user, only email address for authentication purposes and user name to display during the game. Authentication is performed by a magic link.

### Detailed description of each page:

1. Welcome

2. Login
   - logo in the middle
   - simple input field under to enter email

3. Signup
   - logo in the middle
   - user name
   - email

4. Verify your email
   - logo in the middle
   - Verify your email address
   - text field to enter 6 digit code
   - Verify button
   - Resend code button

5. Join a group
   - plus sign in top right corner to create a new game
   - Join a game header
   - input field to enter 6 digit group code

6. Create a group
   - input field for the name of the group
   - generate code button that displayes a randomly generated 6 digit code that can be used as the identifier of the group (primary key in database!)

7. Design your character
   - Display current character
     (-- tentative --)
   - selector: race
   - selector: class
   - selector: gender

8. Play view
   - health bar
   - character
   - two buttons in one row at the bottom: act and roll

9. Dice view (popup from bottom)
   - 6 possible dice

10. Action view (popup from bottom)
    - fight button
    - hide button
    - heal button

## Tech stack:

- React Native (Expo)
- Supabase (auth and group logic handling, shared database with Unity)
- Unity

## Database

### User:

    - username (unique)
    - email (primary)
    - character
    - current group (user can only be in one group at a time)

### Group:

    - group code (primary)
    - group name
    - created by <-> user
    - status (lobby/playing/ended)

### Characters

    - Class
    - Race
    - User
    - Skin

### Class:

    - name
    - description
    - actions
    - base health ?

### Race:

    - name
    - description
    - image

### Skins:

    - name
    - race
    - image

### Game events

    - group
    - user
    - event type (action/dice)
    - event effect
